import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import productRoutes from "./src/routes/productRoutes.js";
import categoriesRoutes from "./src/routes/categoriesRoutes.js";
import uploadRoutes from "./src/routes/uploadRoutes.js";
import saleDetailRoutes from './src/routes/saleDetailRoutes.js' 


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use("/api", categoriesRoutes);
app.use("/api", productRoutes);
app.use("/api", uploadRoutes);
app.use("/api", saleDetailRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

export default app;