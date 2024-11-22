import { CourseCategory } from "../model/CourseCategory.js";

export const createCourseCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const createdBy = req.user.id; // `req.user` contains authenticated user info

    const newCategory = new CourseCategory({ name, description, createdBy });
    await newCategory.save();

    res.status(201).json({ success: true, data: newCategory });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllCategories = async (req, res) => {
    try {
      const categories = await CourseCategory.find().populate('courses', 'name duration fee');
      res.status(200).json({ success: true, data: categories });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
  export const updateCourseCategory = async (req, res) => {
    try {
      const { name, description } = req.body;
      const categoryId = req.params.id;
  
      const updatedCategory = await CourseCategory.findByIdAndUpdate(
        categoryId,
        { name, description },
        { new: true, runValidators: true }
      );
  
      if (!updatedCategory) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }
  
      res.status(200).json({ success: true, data: updatedCategory });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
  
  export const deleteCourseCategory = async (req, res) => {
    try {
      const categoryId = req.params.id;
  
      const deletedCategory = await CourseCategory.findByIdAndDelete(categoryId);
  
      if (!deletedCategory) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }
  
      res.status(200).json({ success: true, message: 'Category deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  