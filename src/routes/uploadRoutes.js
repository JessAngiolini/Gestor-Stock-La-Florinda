import { Router } from 'express';
import multer from 'multer';
import { updatePrices ,uploadExcel, updatePricesByKeyword } from "../controllers/uploadControllers.js";

const router = Router();
const upload = multer({ dest: 'uploads/' });

/* router.post("/update-prices", updatePrices);
router.post("/upload-excel", upload.fields([{ name: 'file', maxCount: 1 }]), uploadExcel); */
router.post("/update-prices-keyword", updatePricesByKeyword);

export default router;


