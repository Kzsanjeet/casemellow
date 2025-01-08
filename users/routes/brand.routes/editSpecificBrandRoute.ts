import express from "express";
import editSpecificBrand from "../../controllers/brand/editSpecificBrandController";

const editBrandRouter = express.Router();

editBrandRouter.route("/edit-brand/:brandId").patch(editSpecificBrand);

export default editBrandRouter;