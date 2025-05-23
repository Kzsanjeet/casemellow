import express from "express";
import getDashboard from "../../controllers/dashboard/dashboard.controller";
import { getRecentPendingCustomizeOrders, getRecentPendingOrders } from "../../controllers/dashboard/getRecentPendingOrders.controller";
import getTotalPending from "../../controllers/dashboard/getTotalPendings.controller";
import getTotalOrders from "../../controllers/dashboard/chart.controller";

const dashboardRouter = express.Router();

dashboardRouter.route("/dashboard").get(getDashboard);

dashboardRouter.route("/get-pending-orders").get(getRecentPendingOrders)
dashboardRouter.route("/get-pending-customize-orders").get(getRecentPendingCustomizeOrders)

//get pending count
dashboardRouter.route("/get-pending-count").get(getTotalPending);

//for chart
dashboardRouter.route("get-total-oders").get(getTotalOrders)

export default dashboardRouter