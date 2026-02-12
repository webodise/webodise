const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Moment = require('../models/moment');
const { requireAnyAdmin } = require('../middleware/adminAuth');

// ensure uploads directory exists in public/uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'public', 'uploads'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = Date.now() + '-' + Math.random().toString(36).slice(2,8) + ext;
    cb(null, name);
  }
});

const upload = multer({ storage });

router.use(requireAnyAdmin);

// list moments
router.get('/moments', async (req, res) => {
  try {
    const moments = await Moment.find().sort({ createdAt: -1 });
    res.json(moments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// create moment (with image)
router.post('/moments', upload.single('image'), async (req, res) => {
  try {
    const { title, description } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : undefined;
    const m = new Moment({ title, description, imagePath });
    await m.save();
    res.json(m);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// get moment
router.get('/moments/:id', async (req, res) => {
  try {
    const m = await Moment.findById(req.params.id);
    if (!m) return res.status(404).json({ error: 'Not found' });
    res.json(m);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// update moment (optional new image)
router.put('/moments/:id', upload.single('image'), async (req, res) => {
  try {
    const { title, description, isTop } = req.body;
    const update = { title, description };
    if (typeof isTop !== 'undefined') update.isTop = isTop === 'true' || isTop === true;
    if (req.file) update.imagePath = `/uploads/${req.file.filename}`;

    const m = await Moment.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!m) return res.status(404).json({ error: 'Not found' });
    res.json(m);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// delete moment
router.delete('/moments/:id', async (req, res) => {
  try {
    const m = await Moment.findByIdAndDelete(req.params.id);
    if (!m) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// set top photo (by id) - ensures only one isTop
router.post('/topphoto/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await Moment.updateMany({}, { isTop: false });
    const m = await Moment.findByIdAndUpdate(id, { isTop: true }, { new: true });
    if (!m) return res.status(404).json({ error: 'Not found' });
    res.json(m);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
