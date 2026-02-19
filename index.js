import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./src/modules/auth/routes/auth.routes.js";
import userRoutes from "./src/modules/users/user.routes.js";
import uploadsRoutes from "./src/modules/uploads/routes/uploads.routes.js";
import filesRoutes from "./src/modules/files/routes/files.routes.js";
import personasRoutes from "./src/modules/personas/routes/personas.routes.js";
import ubigeoRoutes from "./src/modules/ubigeo/routes/ubigeo.routes.js";
import cuentasBancariasRoutes from "./src/modules/cuentas-bancarias/routes/cuentas-bancarias.routes.js";
import operacionesRoutes from "./src/modules/operaciones/routes/operaciones.routes.js";
import tasasCambioRoutes from "./src/modules/tasas-cambio/routes/tasas-cambio.routes.js";

import { errorHandler } from "./src/core/errors/error-handler.js";
import { initJobs } from "./src/jobs/index.js";

const app = express();

// === Middlewares globales ===
app.use(morgan("dev"));
app.use(
  cors({
    origin: [
      "http://localhost:4200",
      "http://localhost:4300",
      "https://www.hotelgeno.com",
      "https://hotelgeno.com",
      "https://panel.hotelgeno.com",
      "https://www.panel.hotelgeno.com",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
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
app.use("/api/personas", personasRoutes);
app.use("/api/ubigeo", ubigeoRoutes);
app.use("/api/cuentas-bancarias", cuentasBancariasRoutes);
app.use("/api/operaciones", operacionesRoutes);
app.use("/api/tasas-cambio", tasasCambioRoutes);
// === Error handler global ===
app.use(errorHandler);

// === Levantar servidor ===
const PORT = process.env.PORT || 5050;

initJobs();

app.listen(PORT, () => {
  console.log("🚀 Servidor corriendo en puerto", PORT);
});
