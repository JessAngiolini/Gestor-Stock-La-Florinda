import { Router } from "express";
import { body } from "express-validator";
import { getProducts, getProductById, addProduct, updateProduct, deleteProduct } from "../controllers/productController.js";

const router = Router();

const validateProduct = [
  body("name")
  .trim() // Elimina espacios en blanco al inicio y final
  .notEmpty()
  .withMessage("El nombre es obligatorio"),

  body('quantity').isInt({ min : 0}).withMessage("La cantidad debe ser un numero entero positivo"),
];

router.get("/products", getProducts);
router.get("/products/:id", getProductById);
router.post("/products", validateProduct, addProduct);
router.put("/products/:id", validateProduct, updateProduct);
router.delete("/products/:id", deleteProduct);




export default router;
