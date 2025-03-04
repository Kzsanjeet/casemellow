import express from "express";
import addOffer from "../../controllers/offer/offerController";


const router = express.Router();

router.post("/offer/add-offer", addOffer);

export default router;
