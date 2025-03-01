import express from "express";
import getAllProduct from "../../controllers/product/getAllProductController";

const getAllProductRouterForClient = express.Router();

getAllProductRouterForClient.route("/products/get").get(getAllProduct)

export default getAllProductRouterForClient