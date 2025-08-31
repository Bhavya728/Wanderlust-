

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");


// // to attach backend with cloudinary account we are config it with .env credintials
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME || 'demo',
    api_key: process.env.CLOUD_API_KEY || '123456789012345',
    api_secret: process.env.CLOUD_API_SECRET || 'dummy_secret',
});

// // this is from npm cloudinary, only provide the folder name
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "wanderlust_DEV",
      allowedFormats: ["png", "jpg", "jpeg"],
    },
});

module.exports = {
    cloudinary,
    storage,
};  // we are using this in routes listing