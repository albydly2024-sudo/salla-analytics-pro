const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

const settingsFile = path.join(dataDir, 'settings.json');

// Initialize with a skeleton if it doesn't exist
if (!fs.existsSync(settingsFile)) {
    fs.writeFileSync(settingsFile, JSON.stringify({ sallaToken: '' }, null, 2));
}

module.exports = {
    getSettings: () => {
        try {
            const data = fs.readFileSync(settingsFile, 'utf8');
            return JSON.parse(data);
        } catch (e) {
            return { sallaToken: '' };
        }
    },
    saveSettings: (newSettings) => {
        const current = module.exports.getSettings();
        const updated = { ...current, ...newSettings };
        fs.writeFileSync(settingsFile, JSON.stringify(updated, null, 2));
        return updated;
    }
};
