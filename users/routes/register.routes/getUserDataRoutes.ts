import express from "express";
import {editUserData, getUserData} from "../../controllers/register/userDataController";
import authenticate from "../../../middleware/tokenAuth";

const clientDataRouter = express.Router();

clientDataRouter.route("/client/data").get(authenticate, getUserData)

//for edit
clientDataRouter.route("/client/edit").patch(authenticate, editUserData)


export default clientDataRouter