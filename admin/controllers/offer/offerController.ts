import { Request, Response } from "express";
import Offer from "../../models/offer.models/offer";


const addOffer = async (req: Request, res: Response): Promise<void> => {
  try {
      const { title, promoCode, discount, expiry } = req.body;

      if (!title || !promoCode || !discount || !expiry) {
          res.status(400).json({ success: false, message: "All fields are required" });
          return;
      }

      if (isNaN(Date.parse(expiry))) {
          res.status(400).json({ success: false, message: "Invalid expiry date format" });
          return;
      }

      const existingOffer = await Offer.findOne({ promoCode });
      if (existingOffer) {
          res.status(400).json({ success: false, message: "Promo code already exists" });
          return;
      }

      const formattedExpiry = new Date(expiry);

      const newOffer = await Offer.create({
          title,
          promoCode,
          discount,
          expiry: formattedExpiry 
      });

      res.status(201).json({ success: true, message: "Offer added successfully", data: newOffer });

  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export default addOffer;