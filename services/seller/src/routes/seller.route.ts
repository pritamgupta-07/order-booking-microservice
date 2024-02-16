import express, { Router } from "express";
import { createSeller, getSeller } from "../controllers/index.js";

const sellerRouter: Router = express.Router();

sellerRouter.get("/:id", getSeller);
sellerRouter.post("/:uid", createSeller);
// restaurantRouter.put('/:uid', updateSeller)

export default sellerRouter;
