// backend/src/router/propertyRoute.js

import express from "express";
import { getProperties, getPropertyById } from "../controller/propertyController.js";

const propertyRoute = express.Router();

// GET /api/properties        — public listing with filters
// GET /api/properties/:id    — public single property
propertyRoute.get("/",    getProperties);
propertyRoute.get("/:id", getPropertyById);

export default propertyRoute;