import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import productRoutes from "./src/routes/productRoutes.js";
import categoriesRoutes from "./src/routes/categoriesRoutes.js";
import uploadRoutes from "./src/routes/uploadRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use("/api", categoriesRoutes);
app.use("/api", productRoutes);
app.use("/api", uploadRoutes);

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack); // Imprimir el error en la consola para depuración

  // Responder con un mensaje de error genérico
  res.status(500).json({
    error: {
      message: "Algo salió mal. Por favor, inténtalo de nuevo más tarde.",
      details: err.message, // Opcional: enviar detalles del error si es necesario
    },
  });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

export default app;