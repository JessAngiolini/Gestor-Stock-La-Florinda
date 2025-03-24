import { Router } from "express";
import { body } from "express-validator";
import { getProducts, getProductById, addProduct, deleteProduct, searchProduct, updateProduct, updatePrices, createSale } from "../controllers/productController.js";
import { purchaseWholesale } from "../controllers/purchaseController.js";


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
router.post("/products", addProduct);
router.put("/products/update-prices", updatePrices);
router.get("/products/search/:query", searchProduct);
router.put("/products/update-stock", createSale);
router.post("/purchase/wholesale", purchaseWholesale);
router.delete("/products/:id", deleteProduct);
router.put("/products/:id", updateProduct);
 
export default router;
