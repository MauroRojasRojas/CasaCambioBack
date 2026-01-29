import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./src/modules/auth/routes/auth.routes.js";
import userRoutes from "./src/modules/users/user.routes.js";
import uploadsRoutes from "./src/modules/uploads/routes/uploads.routes.js";
import filesRoutes from "./src/modules/files/routes/files.routes.js";

import { errorHandler } from "./src/core/errors/error-handler.js";
import { initJobs } from "./src/jobs/index.js";


const app = express();

// === Middlewares globales ===
app.use(morgan("dev"));
app.use(
  cors({
    origin: [
      'http://localhost:4200',
      'http://localhost:4300',
      'https://www.hotelgeno.com',
      'https://hotelgeno.com',
      'https://panel.hotelgeno.com',
      'https://www.panel.hotelgeno.com'
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);

app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ limit: "200mb", extended: true }));

// Responder preflight OPTIONS de manera explícita
app.options("*", cors());

// === Prefijo global /api ===
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/uploads", uploadsRoutes);
app.use("/api/files", filesRoutes);
// === Error handler global ===
app.use(errorHandler);

// === Levantar servidor ===
const PORT = process.env.PORT || 3000;

initJobs();

app.listen(PORT, () => {
  console.log("🚀 Servidor corriendo en puerto", PORT);
});