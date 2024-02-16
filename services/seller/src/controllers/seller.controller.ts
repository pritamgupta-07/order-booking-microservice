import { NextFunction, Request, Response } from "express";
import { SellerModel } from "../models/seller.schema.js";
import { sellerValidation } from "../helpers/validators/seller.validator.js";

async function getSeller (req: Request, res: Response, next: NextFunction) {
    try {
        if(req.params.uid) {
            res.status(400).send({message: "please provide seller Id"});

            throw new Error("please provide seller Id");
        }
        const seller = await SellerModel.findById({_id: req.params.id});
        console.log(seller) 
    } catch (error) {
        next(error)
        
    }
}

async function createSeller (req: Request, res: Response, next: NextFunction) {
    try {
        if(!req.body) {
            res.status(400).send({message: "body cannot be empty"});

            throw new Error("body cannot be empty.");
        }
        
        const data = await sellerValidation(req.body);
        
        const newSeller = new SellerModel({...data, ownerId: req.params.uid});
        await newSeller.save()

        res.status(200).send({message: "seller is created!"});
        
    } catch (error) {
        next(error)
    }
}


export { getSeller, createSeller };