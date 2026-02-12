const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const EnrollmentForm = require('../models/enrollmentForm');
const { requireAnyAdmin } = require('../middleware/adminAuth');

const router = express.Router();
const uploadsDir = path.join(__dirname, '..', 'public', 'uploads', 'admission-forms');

const allowedMimeTypes = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]);

function sanitizeFileName(fileName) {
  return String(fileName || '')
    .replace(/[^\w.\-() ]+/g, '')
    .trim()
    .slice(0, 120);
}

const storage = multer.diskStorage({
  destination: function setDestination(req, file, cb) {
    try {
      fs.mkdirSync(uploadsDir, { recursive: true });
      cb(null, uploadsDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: function setFilename(req, file, cb) {
    const extension = path.extname(file.originalname || '').toLowerCase();
    const baseName = sanitizeFileName(path.basename(file.originalname || 'admission-form', extension)) || 'admission-form';
    cb(null, `${Date.now()}-${baseName}${extension}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15 MB
  fileFilter: function checkFileType(req, file, cb) {
    if (!allowedMimeTypes.has(file.mimetype)) {
      return cb(new Error('Only PDF, DOC, and DOCX files are allowed'));
    }
    return cb(null, true);
  }
});

function toPublicData(form) {
  return {
    id: String(form._id),
    fileName: form.fileName,
    filePath: form.filePath,
    mimeType: form.mimeType,
    size: form.size,
    createdAt: form.createdAt
  };
}

function resolveStoredFilePath(publicFilePath) {
  const normalizedPath = String(publicFilePath || '').replace(/\\/g, '/');
  if (!normalizedPath.startsWith('/uploads/admission-forms/')) {
    return null;
  }

  const fileName = path.basename(normalizedPath);
  if (!fileName) {
    return null;
  }

  return path.join(uploadsDir, fileName);
}

async function deleteStoredFile(publicFilePath) {
  const absolutePath = resolveStoredFilePath(publicFilePath);
  if (!absolutePath) return;

  try {
    await fs.promises.unlink(absolutePath);
  } catch (error) {
    if (error && error.code !== 'ENOENT') {
      throw error;
    }
  }
}

router.get('/', async (req, res) => {
  try {
    const latest = await EnrollmentForm.findOne().sort({ createdAt: -1 });
    if (!latest) {
      return res.json({ form: null });
    }

    return res.json({ form: toPublicData(latest) });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post('/', requireAnyAdmin, upload.single('formFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Form file is required (field `formFile`)' });
    }

    const form = await EnrollmentForm.create({
      fileName: req.file.originalname,
      filePath: `/uploads/admission-forms/${req.file.filename}`,
      mimeType: req.file.mimetype,
      size: req.file.size,
      uploadedBy: req.adminUser && req.adminUser.id ? req.adminUser.id : null
    });

    return res.status(201).json({ form: toPublicData(form) });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', requireAnyAdmin, async (req, res) => {
  try {
    const form = await EnrollmentForm.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ error: 'Admission form not found' });
    }

    await deleteStoredFile(form.filePath);
    await form.deleteOne();

    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.use((error, req, res, next) => {
  if (!error) return next();

  if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'File size must be 15 MB or smaller' });
  }

  if (error.message && error.message.includes('Only PDF, DOC, and DOCX')) {
    return res.status(400).json({ error: error.message });
  }

  return res.status(500).json({ error: error.message || 'Upload failed' });
});

module.exports = router;
