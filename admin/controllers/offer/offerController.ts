import { Request, Response } from "express";
import mongoose from "mongoose";
import { uploadFile } from "../../../utility/cloudinary";
import Offer from "../../models/offer.models/offer";


const addOffer = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      productName,
      productDescription,
      productPrice,
      productCategory,
      discountPercentage,
      brands,
    } = req.body;

    if (
      !productCategory ||
      !productName ||
      !productDescription ||
      !productPrice ||
      !discountPercentage ||
      !brands
    ) {
      res.status(404).json({ success: false, message: "Please fill all fields" });
      return;
    }

    const brandId = new mongoose.Types.ObjectId(brands); // Convert the string to ObjectId

    // Validate and calculate `priceAfterDiscount`
    const price = parseFloat(productPrice);
    const discount = parseFloat(discountPercentage);
    if (isNaN(price) || isNaN(discount)) {
      res.status(400).json({
        success: false,
        message: "Invalid product price or discount percentage",
      });
      return;
    }
    const priceAfterDiscount = price - (discount / 100) * price;

    const productImage = req.file;
    if (!productImage) {
      res.status(404).json({ success: false, message: "Please upload an image" });
      return;
    }
    const uploadedImage = await uploadFile(productImage.path, "offers");
    if (!uploadedImage) {
      res.status(404).json({ success: false, message: "Failed to upload image" });
      return;
    }

    // Create the offer
    const createOffer = await Offer.create({
      productName,
      productDescription,
      productPrice: price,
      discountPercentage: discount,
      priceAfterDiscount,
      productImage: uploadedImage.url,
      productCategory,
      brands: brandId,
    });

    res.status(200).json({
      success: true,
      message: "Offer created successfully",
      createOffer,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: "Internal server error", error });
  }
};

export default addOffer;
