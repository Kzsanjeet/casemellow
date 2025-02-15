import express from "express";
import getBrandById from "../../controllers/brand/getSpecificBrandController";


const getSpecificBrandRouter = express.Router();

getSpecificBrandRouter.route("/get-specific-brand/:brandId").get(getBrandById);

export default getSpecificBrandRouter;