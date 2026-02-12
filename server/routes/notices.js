const express = require('express');
const Notice = require('../models/notice');
const { requireAnyAdmin } = require('../middleware/adminAuth');

const router = express.Router();

function toPublicNotice(notice) {
  return {
    id: String(notice._id),
    text: notice.text,
    noticeDate: notice.noticeDate,
    createdAt: notice.createdAt
  };
}

router.get('/', async (req, res) => {
  try {
    const notices = await Notice.find().sort({ noticeDate: -1, createdAt: -1 });
    return res.json({ notices: notices.map(toPublicNotice) });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post('/', requireAnyAdmin, async (req, res) => {
  try {
    const text = String(req.body.text || '').trim();
    if (!text) {
      return res.status(400).json({ error: 'Notice text is required' });
    }
    if (text.length > 500) {
      return res.status(400).json({ error: 'Notice text must be 500 characters or fewer' });
    }

    let noticeDate = new Date();
    if (req.body.noticeDate) {
      const parsedDate = new Date(req.body.noticeDate);
      if (Number.isNaN(parsedDate.getTime())) {
        return res.status(400).json({ error: 'Invalid notice date' });
      }
      noticeDate = parsedDate;
    }

    const notice = await Notice.create({
      text,
      noticeDate,
      createdBy: req.adminUser && req.adminUser.id ? req.adminUser.id : null
    });

    return res.status(201).json({ notice: toPublicNotice(notice) });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', requireAnyAdmin, async (req, res) => {
  try {
    const deletedNotice = await Notice.findByIdAndDelete(req.params.id);
    if (!deletedNotice) {
      return res.status(404).json({ error: 'Notice not found' });
    }
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
