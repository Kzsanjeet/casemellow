import express from "express";
import addCoverType from "../../controllers/coverType.controller/coverTypeController";

const coverTypeRouter = express.Router();

coverTypeRouter.route("/add-coverType").post(addCoverType)

export default coverTypeRouter