import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
import authRoutes from "./src/modules/auth/routes/auth.routes.js";
import userRoutes from "./src/modules/users/user.routes.js";
import uploadsRoutes from "./src/modules/uploads/routes/uploads.routes.js";
import filesRoutes from "./src/modules/files/routes/files.routes.js";
import personasRoutes from "./src/modules/personas/routes/personas.routes.js";
import ubigeoRoutes from "./src/modules/ubigeo/routes/ubigeo.routes.js";
import cuentasBancariasRoutes from "./src/modules/cuentas-bancarias/routes/cuentas-bancarias.routes.js";
import tasasCambioRoutes from "./src/modules/tasas-cambio/routes/tasas-cambio.routes.js";
import operacionesRoutes from "./src/modules/operaciones/routes/operaciones.routes.js";
import reclamosRoutes from "./src/modules/operaciones/routes/reclamos.routes.js";
import contactRoutes from "./src/modules/operaciones/routes/contact.route.js";
import comentariosRoutes from './src/modules/comentarios/router/comentarios.routes.js';
import configTasasRoutes from './src/modules/config-tasas/router/config-tasas.routes.js';
import dniRoutes from './src/modules/DNI/dni.routes.js';
import rucRoutes from './src/modules/RUC/ruc.routes.js';
import cuentasInternasRoutes from './src/modules/cuentas-internas/router/cuentas-internas.routes.js';
import empresasAliadasRoutes from './src/modules/empresas-aliadas/router/empresas-aliadas.routes.js';
import noticiasRoutes from './src/modules/noticias/router/noticias.routes.js';
import redesSocialesRoutes from './src/modules/redes-sociales/router/redes-sociales.routes.js';
import bancosRoutes from './src/modules/bancos/router/bancos.routes.js';

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
      "https://www.dollariza.pe",
      "https://dollariza.pe",
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

// Servir archivos estáticos (uploads de imágenes)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// === Prefijo global /api ===
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/uploads", uploadsRoutes);
app.use("/api/files", filesRoutes);
app.use("/api/personas", personasRoutes);
app.use("/api/ubigeo", ubigeoRoutes);
app.use("/api/cuentas-bancarias", cuentasBancariasRoutes);
app.use("/api/operaciones", operacionesRoutes);
app.use("/api/reclamos", reclamosRoutes);
app.use("/api/contact-us", contactRoutes);
app.use("/api/tasas-cambio", tasasCambioRoutes);
app.use('/api/comentarios', comentariosRoutes);
app.use('/api/config-tasas', configTasasRoutes);
app.use('/api/dni', dniRoutes);
app.use('/api/ruc', rucRoutes);
app.use('/api/cuentas-internas', cuentasInternasRoutes);
app.use('/api/empresas-aliadas', empresasAliadasRoutes);
app.use('/api/noticias', noticiasRoutes);
app.use('/api/redes-sociales', redesSocialesRoutes);
app.use('/api/bancos', bancosRoutes);

// === Error handler global ===
app.use(errorHandler);

// === Levantar servidor ===
const PORT = process.env.PORT || 5050;

initJobs();

app.listen(PORT, () => {
  console.log("🚀 Servidor corriendo en puerto", PORT);
});