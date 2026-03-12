const express = require('path');
const { getSettings, saveSettings } = require('../utils/settingsManager');
const expressRouter = require('express');

const router = expressRouter.Router();

// Get current settings
router.get('/', (req, res) => {
    res.json(getSettings());
});

// Save settings (e.g. Salla Token)
router.post('/', (req, res) => {
    const { sallaToken } = req.body;
    
    // allow empty token string to clear it
    if (sallaToken !== undefined) {
        saveSettings({ sallaToken });
        res.json({ success: true, message: 'Settings saved successfully' });
    } else {
        res.status(400).json({ success: false, message: 'Invalid payload' });
    }
});

module.exports = router;
