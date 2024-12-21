import express from "express";
import addBrand from "../../controllers/brand.controllers/brandController";

const brandRouter = express.Router();

brandRouter.route("/add-brand").post(addBrand)

export default brandRouter