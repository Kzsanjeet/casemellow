import express from "express";
import addPhoneModel from "../../controllers/phoneModel.controllers/phoneModelController";

const phoneModelRouter = express.Router()

phoneModelRouter.route("/add-models").post(addPhoneModel)

export default phoneModelRouter