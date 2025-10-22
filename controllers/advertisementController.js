const Advertisement = require('../models/Advertisement');

// @desc    Get active advertisements
// @route   GET /api/v1/advertisements/active
// @access  Public
exports.getActiveAdvertisements = async (req, res, next) => {
  try {
    const now = new Date();
    const advertisements = await Advertisement.find({
      active: true,
      startDate: { $lte: now },
      endDate: { $gte: now }
    }).sort({ order: 1 });

    res.status(200).json({
      success: true,
      data: { advertisements }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all advertisements (Admin)
// @route   GET /api/v1/advertisements
// @access  Private/Admin
exports.getAllAdvertisements = async (req, res, next) => {
  try {
    const advertisements = await Advertisement.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { advertisements }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create advertisement
// @route   POST /api/v1/advertisements
// @access  Private/Admin
exports.createAdvertisement = async (req, res, next) => {
  try {
    const advertisement = await Advertisement.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Advertisement created successfully',
      data: { advertisement }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update advertisement
// @route   PUT /api/v1/advertisements/:adId
// @access  Private/Admin
exports.updateAdvertisement = async (req, res, next) => {
  try {
    let advertisement = await Advertisement.findById(req.params.adId);

    if (!advertisement) {
      return res.status(404).json({
        success: false,
        message: 'Advertisement not found'
      });
    }

    advertisement = await Advertisement.findByIdAndUpdate(req.params.adId, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Advertisement updated successfully',
      data: { advertisement }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete advertisement
// @route   DELETE /api/v1/advertisements/:adId
// @access  Private/Admin
exports.deleteAdvertisement = async (req, res, next) => {
  try {
    const advertisement = await Advertisement.findById(req.params.adId);

    if (!advertisement) {
      return res.status(404).json({
        success: false,
        message: 'Advertisement not found'
      });
    }

    await advertisement.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Advertisement deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Track advertisement click
// @route   POST /api/v1/advertisements/:adId/click
// @access  Public
exports.trackClick = async (req, res, next) => {
  try {
    const advertisement = await Advertisement.findById(req.params.adId);

    if (!advertisement) {
      return res.status(404).json({
        success: false,
        message: 'Advertisement not found'
      });
    }

    advertisement.clicks += 1;
    await advertisement.save();

    res.status(200).json({
      success: true,
      message: 'Click tracked'
    });
  } catch (error) {
    next(error);
  }
};




