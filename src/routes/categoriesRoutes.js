import { Router } from "express";
import {body} from "express-validator";
import { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory } from "../controllers/categoriesControllers.js";

const router = Router();

const validateCategory = [
    body("name")
    .trim() // Elimina espacios en blanco al inicio y final
    .notEmpty()
    .withMessage("El nombre es obligatorio"),
]  

router.get("/categories", getCategories);
router.get("/categories/:id",getCategoryById);
router.post("/categories", validateCategory, createCategory);
router.put("/categories/:id", validateCategory, updateCategory);
router.delete("/categories/:id", deleteCategory); 

 export default router;