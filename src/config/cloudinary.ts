import { v2 as cloudinary } from 'cloudinary';
// Configuration
const cloud = process.env.CLOUD_NAME_CLOUDINARY;
const apiKey = process.env.API_KEY_CLOUDINARY;
const apiSecret = process.env.API_SECRET_CLOUDINARY;

console.log("Cloudinary config", {
    cloud,
    apiKey,
    apiSecret
});

cloudinary.config({ 
    cloud_name: cloud,
    api_key: apiKey, // Click 'View API Keys' above to copy your API key 
    api_secret: apiSecret // Click 'View API Keys' above to copy your API secret
});

console.log("Cloudinary config", {
    cloud: cloudinary.config().cloud_name,
    apiKey: cloudinary.config().api_key,
    apiSecret: cloudinary.config().api_secret
});

export default cloudinary;