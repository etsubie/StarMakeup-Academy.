import path from "path";
import fs from "fs";
import { Course } from "../model/Course.js";
import { CourseCategory } from "../model/CourseCategory.js";

// Utility to handle file uploads
const handleFileUpload = (file, folder) => {
  const uploadPath = path.join("uploads", folder);

  // Ensure upload directory exists
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  const fileName = `${Date.now()}-${file.name}`;
  const filePath = path.join(uploadPath, fileName);

  file.mv(filePath); // Move file to the specified directory
  return `/uploads/${folder}/${fileName}`; // Return relative path for storing in DB
};

//create course
export const createCourse = async (req, res) => {
  try {
    const { name, description, duration, fee, categoryId } = req.body;

    // if (!req.files || !req.files.image) {
    //   return res.status(400).json({ message: "Course image is required" });
    // }

    // const image = handleFileUpload(req.files.image, "courses");

    // Find category by ID
    const category = await CourseCategory.findById(categoryId);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    const newCourse = new Course({
      // image,
      name,
      description,
      duration,
      fee,
    });

    // Save the new course
    await newCourse.save();

    // Add the new course to the category's course list
    category.courses.push(newCourse._id);
    await category.save();

    res.status(201).json({ success: true, data: newCourse });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Courses
// export const getCourses = async (req, res) => {
//   try {
//     const { page = 1, limit = 10 } = req.query; // Default page is 1, limit is 10

//     // Convert page and limit to numbers
//     const pageNumber = parseInt(page);
//     const limitNumber = parseInt(limit);

//     // Calculate the number of documents to skip
//     const skip = (pageNumber - 1) * limitNumber;

//     // Fetch courses with pagination, sort by latest first, and populate category
//     const courses = await Course.find()
//       .sort({ createdAt: -1 }) // Sort by latest first
//       .skip(skip)
//       .limit(limitNumber)
//       .populate("category"); // Populate the category field with CourseCategory data

//     // Total number of courses (for pagination metadata)
//     const totalCourses = await Course.countDocuments();

//     // Construct the response
//     res.status(200).json({
//       success: true,
//       data: courses,
//       pagination: {
//         currentPage: pageNumber,
//         totalPages: Math.ceil(totalCourses / limitNumber),
//         totalCourses,
//         limitNumber,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// Get All Courses
export const getCourses = async (req, res) => {
  try {
    
    const { page = 1, limit = 10 } = req.query; // Default page is 1, limit is 10

    // Convert page and limit to numbers
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    // Calculate the number of documents to skip
    const skip = (pageNumber - 1) * limitNumber;

    // Fetch courses with pagination and sort by the latest first (descending order)
    const courses = await Course.find()
      .sort({ createdAt: -1 }) // Sort by latest first
      .skip(skip)
      .limit(limitNumber);

    // Total number of courses (for pagination metadata)
    const totalCourses = await Course.countDocuments();

    // Construct the response
    res.status(200).json({
      success: true,
      data: courses,
      pagination: {
        currentPage: pageNumber,
        totalPages: Math.ceil(totalCourses / limitNumber),
        totalCourses,
        limitNumber,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Course by ID
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Course
export const updateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { image, name, description, duration, fee, categoryId } = req.body;

    // Find the course to update
    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    // Find the new category if provided
    if (categoryId) {
      const category = await CourseCategory.findById(categoryId);
      if (!category) {
        return res
          .status(404)
          .json({ success: false, message: "Category not found" });
      }

      // Remove course from old category
      const oldCategory = await CourseCategory.findOne({ courses: courseId });
      if (oldCategory) {
        oldCategory.courses.pull(courseId);
        await oldCategory.save();
      }

      // Add course to the new category
      category.courses.push(courseId);
      await category.save();
    }

    // Update the course details
    if (req.files && req.files.image) {
      const newImage = handleFileUpload(req.files.image, "courses");
      // Delete the old image
      if (course.image) fs.unlinkSync(course.image);
      course.image = newImage;
    }
    course.name = name || course.name;
    course.description = description || course.description;
    course.duration = duration || course.duration;
    course.fee = fee || course.fee;

    await course.save();

    res.status(200).json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Course
export const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Find and delete the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }
    // Delete the course image
    if (course.image) fs.unlinkSync(course.image);

    await course.remove();

    // Remove the course from all course categories
    const categories = await CourseCategory.find({ courses: courseId });
    for (const category of categories) {
      category.courses.pull(courseId);
      await category.save();
    }

    res
      .status(200)
      .json({ success: true, message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
