import express from "express";
import getAllBrands from "../../controllers/brand/getAllBrandController";

const getAllBrandRouter = express.Router();

getAllBrandRouter.route("/get-all-brands").get(getAllBrands)

export default getAllBrandRouter