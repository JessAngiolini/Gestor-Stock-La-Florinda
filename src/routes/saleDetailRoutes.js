import express from "express";
import {  getSalesByDateRange } from "../controllers/saleDetailController.js";


const router = express.Router();

/* router.get("/sales", getAllSales);          // Obtener todas las ventas */

router.get("/sales/filter", getSalesByDateRange); // Filtrar por fecha


export default router;