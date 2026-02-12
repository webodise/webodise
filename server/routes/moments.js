const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const Moment = require('../models/moment');
const { requireAnyAdmin } = require('../middleware/adminAuth');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Use memory storage for multer (not disk)
const upload = multer({ storage: multer.memoryStorage() });

// GET / - list moments with optional filters
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.subcategory) filter.subcategory = req.query.subcategory;
    if (req.query.year) {
      const year = parseInt(req.query.year);
      filter.eventDate = {
        $gte: new Date(year, 0, 1),
        $lt: new Date(year + 1, 0, 1)
      };
    }
    const moments = await Moment.find(filter).sort({ eventDate: -1, createdAt: -1 });
    res.json(moments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST / - upload image to Cloudinary + save metadata
router.post('/', requireAnyAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Image file is required (field `image`)' });
    
    const { title, description, isTop, category, subcategory, eventDate } = req.body;

    // Upload to Cloudinary from memory buffer
    const uploadPromise = new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'jps-moments',
          resource_type: 'auto',
          eager: { width: 800, crop: 'scale', quality: 'auto' }
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    const uploadResult = await uploadPromise;
    const imagePath = uploadResult.secure_url; // Cloudinary URL

    const m = new Moment({
      title: title || '',
      description: description || '',
      imagePath,
      category: category || 'Events',
      subcategory: subcategory || '',
      eventDate: eventDate ? new Date(eventDate) : new Date(),
      isTop: isTop === 'true'
    });
    await m.save();
    res.json(m);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /:id - delete moment metadata from database
router.delete('/:id', requireAnyAdmin, async (req, res) => {
  try {
    const deleted = await Moment.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Moment not found' });
    }
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
