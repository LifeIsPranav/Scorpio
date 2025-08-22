import { RequestHandler } from "express";

// Demo admin credentials - in production, use a proper authentication system
const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "admin123",
};

export const adminLogin: RequestHandler = (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    // In production, use proper password hashing and verification
    if (
      username === ADMIN_CREDENTIALS.username &&
      password === ADMIN_CREDENTIALS.password
    ) {
      // In production, generate a proper JWT token
      const token = "admin-token-" + Date.now();

      res.json({
        success: true,
        message: "Login successful",
        token,
        user: {
          username: "admin",
          role: "administrator",
        },
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const adminVerifyToken: RequestHandler = (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token || !token.startsWith("admin-token-")) {
      return res.status(401).json({
        success: false,
        message: "Invalid or missing token",
      });
    }

    // In production, verify the JWT token properly
    res.json({
      success: true,
      user: {
        username: "admin",
        role: "administrator",
      },
    });
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
