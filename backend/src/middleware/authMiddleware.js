import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  // Token will be checked in the cookies 
  const token = req.cookies.token; // Access token from the cookies
  console.log("Token from Cookies:", token);

  if (!token) {
    return res.status(401).json({ message: "Authentication token missing!" });
  }

  try {
    // Verify the token using the JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);
    
    // Attach the decoded token data to the request object (so it's available in the route handler)
    req.user = decoded;
    
    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(403).json({ message: "Invalid or expired token!" });
  }
};

export default verifyToken;
