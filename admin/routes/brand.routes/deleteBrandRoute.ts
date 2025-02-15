import express from "express";
import deleteSpecificBrand from "../../controllers/brand/deleteSpecificBrandController";

const deleteBrandRouter = express.Router();

deleteBrandRouter.route("/brands/delete-brand/:brandId").delete(deleteSpecificBrand);

export default deleteBrandRouter;