import express from "express";
import getPhoneModelsByBrand from "../../controllers/product/getPhoneModelsByBrandsController";

const getPhoneModelByBrandRouter = express.Router();

getPhoneModelByBrandRouter.route("/products/get-brands-phonemodel").get(getPhoneModelsByBrand)

export default getPhoneModelByBrandRouter;