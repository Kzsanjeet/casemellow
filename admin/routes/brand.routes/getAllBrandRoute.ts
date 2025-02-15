import express from "express";
import getAllBrands from "../../controllers/brand/getAllBrandController";
import getEntireBrands from "../../controllers/brand/getBrandDropdownController";


const getAllBrandRouter = express.Router();

getAllBrandRouter.route("/get-all-brands").get(getAllBrands)
getAllBrandRouter.route("/brands/get").get(getEntireBrands)

export default getAllBrandRouter