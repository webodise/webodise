const express = require('express');
const SiteSetting = require('../models/siteSetting');
const { requireAnyAdmin } = require('../middleware/adminAuth');

const router = express.Router();

const ADMISSIONS_BADGE_KEY = 'home.admissionsBadgeText';
const DEFAULT_ADMISSIONS_BADGE_TEXT = 'Admissions Open 2026-27';
const MAX_BADGE_TEXT_LENGTH = 120;

function normalizeBadgeText(value) {
  return String(value || '').trim();
}

router.get('/admissions-badge', async (req, res) => {
  try {
    const setting = await SiteSetting.findOne({ key: ADMISSIONS_BADGE_KEY });
    return res.json({
      text: setting && setting.value ? setting.value : DEFAULT_ADMISSIONS_BADGE_TEXT
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.put('/admissions-badge', requireAnyAdmin, async (req, res) => {
  try {
    const text = normalizeBadgeText(req.body.text);
    if (!text) {
      return res.status(400).json({ error: 'Badge text is required' });
    }
    if (text.length > MAX_BADGE_TEXT_LENGTH) {
      return res.status(400).json({ error: `Badge text must be ${MAX_BADGE_TEXT_LENGTH} characters or fewer` });
    }

    const updatedSetting = await SiteSetting.findOneAndUpdate(
      { key: ADMISSIONS_BADGE_KEY },
      {
        key: ADMISSIONS_BADGE_KEY,
        value: text,
        updatedBy: req.adminUser && req.adminUser.id ? req.adminUser.id : null,
        updatedAt: new Date()
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.json({ text: updatedSetting.value });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
