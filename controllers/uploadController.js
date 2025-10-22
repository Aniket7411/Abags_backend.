const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');
const fs = require('fs');

// @desc    Upload product images
// @route   POST /api/v1/upload/product-images
// @access  Private/Admin
exports.uploadProductImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please upload at least one image'
      });
    }

    const uploadPromises = req.files.map(file => 
      uploadToCloudinary(file, 'kanbags/products')
    );

    const results = await Promise.all(uploadPromises);

    // Delete local files after upload
    req.files.forEach(file => {
      fs.unlinkSync(file.path);
    });

    const images = results.map(result => ({
      url: result.url,
      publicId: result.publicId
    }));

    res.status(200).json({
      success: true,
      message: 'Images uploaded successfully',
      data: { images }
    });
  } catch (error) {
    // Clean up local files on error
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }
    next(error);
  }
};

// @desc    Upload advertisement images
// @route   POST /api/v1/upload/ad-images
// @access  Private/Admin
exports.uploadAdImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please upload at least one image'
      });
    }

    const uploadPromises = req.files.map(file => 
      uploadToCloudinary(file, 'kanbags/advertisements')
    );

    const results = await Promise.all(uploadPromises);

    // Delete local files after upload
    req.files.forEach(file => {
      fs.unlinkSync(file.path);
    });

    const images = results.map(result => ({
      url: result.url,
      publicId: result.publicId
    }));

    res.status(200).json({
      success: true,
      message: 'Images uploaded successfully',
      data: { images }
    });
  } catch (error) {
    // Clean up local files on error
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }
    next(error);
  }
};

// @desc    Upload custom request images
// @route   POST /api/v1/upload/custom-request-images
// @access  Public
exports.uploadCustomRequestImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please upload at least one image'
      });
    }

    const uploadPromises = req.files.map(file => 
      uploadToCloudinary(file, 'kanbags/custom-requests')
    );

    const results = await Promise.all(uploadPromises);

    // Delete local files after upload
    req.files.forEach(file => {
      fs.unlinkSync(file.path);
    });

    const images = results.map(result => ({
      url: result.url,
      publicId: result.publicId
    }));

    res.status(200).json({
      success: true,
      message: 'Images uploaded successfully',
      data: { images }
    });
  } catch (error) {
    // Clean up local files on error
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }
    next(error);
  }
};

// @desc    Delete image from Cloudinary
// @route   DELETE /api/v1/upload/:publicId
// @access  Private/Admin
exports.deleteImage = async (req, res, next) => {
  try {
    const { publicId } = req.params;

    await deleteFromCloudinary(publicId);

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};




