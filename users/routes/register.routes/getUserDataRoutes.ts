import express from "express";
import getUserData from "../../controllers/register/userDataController";
import authenticate from "../../../middleware/tokenAuth";

const clientDataRouter = express.Router();

clientDataRouter.route("/client/data").get(authenticate, getUserData)

export default clientDataRouter