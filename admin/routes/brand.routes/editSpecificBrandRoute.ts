import express from "express";
import editBrand from "../../controllers/brand/editSpecificBrandController";


const editBrandRouter = express.Router();

editBrandRouter.route("/edit-brand/:brandId").patch(editBrand);

export default editBrandRouter;