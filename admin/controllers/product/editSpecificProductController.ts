import { Request, Response } from "express";
import { uploadFile } from "../../../utility/cloudinary";
import Product from "../../models/product.models/productModels";

interface MulterRequest extends Request{
    file: Express.Multer.File;
}

const editSpecificProduct = async(req:Request,res:Response):Promise<void> =>{
    const MulterReq = req as MulterRequest
    try {
        const productId = req.params.productId;
        const {
            productName,
            brands, // Expecting the brand ID
            phoneModel,
            coverType,
            productDescription,
            productPrice,
            productCategory,
          } = MulterReq.body;

          if (!productName || !brands || !productDescription || !productPrice || !productCategory || !phoneModel) {
            res.status(400).json({ success: false, message: "Please fill all the fields" });
            return;
          }
          let parsedCoverType;
          parsedCoverType = JSON.parse(coverType);
          if(!Array.isArray(parsedCoverType)){
            res.status(404).json({success:false, message: "covertype must be an array"})
          }

        const productImage = MulterReq.file;
        if (!productImage) {
        res.status(400).json({ success: false, message: "Please upload a product image" });
        return;
        }
        const uploadedImage = await uploadFile(productImage.path, "products");
        if (!uploadedImage?.secure_url) {
        res.status(500).json({ success: false, message: "Image upload failed" });
        return;
        }

        const checkPorduct = await Product.findById(productId);
            if(!checkPorduct){
                res.status(404).json({ success: false, message: "Product not found" });
                return;
            }

        const updateProduct = await Product.findByIdAndUpdate(
            productId,
            {$set:{
                productName,
                brands,
                phoneModel,
                coverType : parsedCoverType,
                productDescription,
                productPrice,
                productCategory,
                productImage: uploadedImage.secure_url,
            }},
            {
            new: true
            }
        );
      
          if (!updateProduct) {
            res.status(500).json({ success: false, message: "Product not updated" });
            return;
          }
          
          res.status(201).json({ success: true, message: "Product updated successfully", updateProduct });
        } catch (error) {
          console.error("Error adding product:", error);
          res.status(500).json({ success: false, message: "Internal server error", error });
        }

    }

    export default editSpecificProduct