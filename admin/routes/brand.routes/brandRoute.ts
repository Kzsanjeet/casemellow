import express from "express";
import addBrand from "../../controllers/brand/brandController";
import authenticate from "../../../middleware/tokenAuth";


const brandRouter = express.Router();

brandRouter.route("/add-brand").post(addBrand,authenticate)

export default brandRouter