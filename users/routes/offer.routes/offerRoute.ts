import express from "express";
import addOffer from "../../controllers/offer/offerController";

const offerRouter = express.Router();

offerRouter.route("/add-offer").post(addOffer)

export default offerRouter
