import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { adminLogin, adminVerifyToken } from "./routes/admin-auth";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./routes/admin-products";
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "./routes/admin-categories";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Basic API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Admin Authentication Routes
  app.post("/api/admin/login", adminLogin);
  app.get("/api/admin/verify", adminVerifyToken);

  // Admin Products Routes
  app.get("/api/admin/products", getProducts);
  app.get("/api/admin/products/:id", getProduct);
  app.post("/api/admin/products", createProduct);
  app.put("/api/admin/products/:id", updateProduct);
  app.delete("/api/admin/products/:id", deleteProduct);

  // Admin Categories Routes
  app.get("/api/admin/categories", getCategories);
  app.get("/api/admin/categories/:id", getCategory);
  app.post("/api/admin/categories", createCategory);
  app.put("/api/admin/categories/:id", updateCategory);
  app.delete("/api/admin/categories/:id", deleteCategory);

  return app;
}
