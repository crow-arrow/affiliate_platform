import express from "express";
import { SaveClicksData } from "../controllers/saveClickData.js";

const router = express.Router();

// http://localhost:3002/api/analytic/
router.get("/clicks-data", SaveClicksData);

export default router;
