import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // Use HTTPS
});

/**
 * Uploads a base64 image string to Cloudinary.
 * @param base64Image The base64 encoded image data (e.g., "data:image/png;base64,...").
 * @param folder Optional folder in Cloudinary to upload to.
 * @returns The URL of the uploaded image, or null if upload fails.
 */
export async function uploadImageToCloudinary(base64Image: string, folder: string = 'trip_planner_images'): Promise<string | null> {
  try {
    // Cloudinary expects the base64 string to start with 'data:image/jpeg;base64,' etc.
    // Ensure the input base64Image already has this prefix.
    const uploadResult = await cloudinary.uploader.upload(`data:image/png;base64,${base64Image}`, {
      folder: folder,
      // You can add more options here, e.g., transformations, public_id
    });
    console.log('Cloudinary upload successful:', uploadResult.secure_url);
    return uploadResult.secure_url;
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    return null;
  }
}