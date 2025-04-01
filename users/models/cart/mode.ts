// //@ts-nocheck
// "use client"
// import Cropper from 'react-easy-crop';
// import React, { useState, useCallback } from 'react';
// import { Trash2, Upload } from 'lucide-react';

// const Page = () => {
//   const [image, setImage] = useState(null);
//   const [crop, setCrop] = useState({ x: 0, y: 0 });
//   const [zoom, setZoom] = useState(1);
//   const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
//   const [croppedImage, setCroppedImage] = useState(null);

//   const onFileChange = (e) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const file = e.target.files[0];
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => {
//         setImage(reader.result);
//       };
//     }
//   };

//   const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
//     setCroppedAreaPixels(croppedAreaPixels);
//   }, []);

//   const createImage = (url, onLoad, onError) => {
//     const img = new Image();
//     img.onload = () => onLoad(img);
//     img.onerror = (error) => onError(error);
//     img.src = url;
//     };


//   const getCroppedImg = async () => {
//     if (!image || !croppedAreaPixels) return null;
    
//     try {
//       const sourceImage = await createImage(image);
//       const canvas = document.createElement('canvas');
//       const ctx = canvas.getContext('2d');
      
//       canvas.width = croppedAreaPixels.width;
//       canvas.height = croppedAreaPixels.height;
      
//       ctx.drawImage(
//         sourceImage,
//         croppedAreaPixels.x,
//         croppedAreaPixels.y,
//         croppedAreaPixels.width,
//         croppedAreaPixels.height,
//         0,
//         0,
//         croppedAreaPixels.width,
//         croppedAreaPixels.height
//       );
      
//       return canvas.toDataURL('image/jpeg');
//     } catch (e) {
//       console.error(e);
//       return null;
//     }
//   };

//   const showCroppedImage = useCallback(async () => {
//     try {
//       const result = await getCroppedImg();
//       if (result) {
//         setCroppedImage(result);
//       }
//     } catch (e) {
//       console.error(e);
//     }
//   }, [croppedAreaPixels, image]);

//   const removeImage = () => {
//     setImage(null);
//     setCroppedImage(null);
//   };

//   return (
//     <div className="max-w-md mx-auto p-4 bg-gray-100 rounded-lg shadow-md">
//       <div className="relative">
//         <div className="flex items-center justify-center bg-gray-300">
//           <div className="relative w-[180px] h-[400px] bg-gray-200 rounded-[40px] shadow-md border border-gray-400 flex flex-col items-center p-4">
//             {croppedImage && (
//               <div 
//                 className="absolute inset-0 z-0 overflow-hidden rounded-[36px]"
//               >
//                 <img 
//                   src={croppedImage} 
//                   alt="Customized Case" 
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//             )}
            
//             <div className="absolute top-5 left-5 flex flex-col gap-2.5 z-10">
//               <div className="w-5 h-5 bg-black rounded-full border-2 border-gray-600"></div>
//               <div className="w-5 h-5 bg-black rounded-full border-2 border-gray-600"></div>
//             </div>
            
//             <div className="absolute top-1/2 -translate-y-1/2 w-7 h-7 bg-black rounded-full z-10"></div>
//           </div>
//         </div>

//         <div className="mt-4 space-y-4">
//           {!image && (
//             <div className="flex items-center justify-center w-full">
//               <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
//                 <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                   <Upload className="w-10 h-10 text-gray-500 mb-2" />
//                   <p className="mb-2 text-sm text-gray-500">Click to upload image</p>
//                 </div>
//                 <input 
//                   type="file" 
//                   className="hidden" 
//                   accept="image/*" 
//                   onChange={onFileChange} 
//                 />
//               </label>
//             </div>
//           )}

//           {image && !croppedImage && (
//             <div className="space-y-4">
//               <div className="relative h-64 w-full">
//                 <Cropper
//                   image={image}
//                   crop={crop}
//                   zoom={zoom}
//                   aspect={9 / 20}
//                   onCropChange={setCrop}
//                   onCropComplete={onCropComplete}
//                   onZoomChange={setZoom}
//                 />
//               </div>
              
//               <div className="flex items-center space-x-4">
//                 <span>Zoom</span>
//                 <input
//                   type="range"
//                   value={zoom}
//                   min={1}
//                   max={3}
//                   step={0.1}
//                   aria-labelledby="Zoom"
//                   onChange={(e) => setZoom(Number(e.target.value))}
//                   className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
//                 />
//               </div>

//               <div className="flex justify-between">
//                 <button 
//                   onClick={removeImage}
//                   className="flex items-center px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
//                 >
//                   <Trash2 className="mr-2 w-5 h-5" /> Remove
//                 </button>
//                 <button 
//                   onClick={showCroppedImage}
//                   className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//                 >
//                   Apply Crop
//                 </button>
//               </div>
//             </div>
//           )}

//           {croppedImage && (
//             <div className="flex justify-between">
//               <button 
//                 onClick={removeImage}
//                 className="flex items-center px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
//               >
//                 <Trash2 className="mr-2 w-5 h-5" /> Remove
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Page;