const fs = require('fs');
const path = require('path');

const UploadFile = (base64Data, storePath, FileName) => {
  try {
    const base64 = base64Data.replace(/^data:image\/\w+;base64,/, "");
    const folderPath = path.join(__dirname, `../Content/${storePath}`);

    // ensure folder exists
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    const photoPath = path.join(folderPath, FileName);
    const buffer = Buffer.from(base64, 'base64');
    fs.writeFileSync(photoPath, buffer);

    console.log("✅ Image saved:", photoPath);
    return photoPath;
  } catch (err) {
    console.error("❌ UploadFile error:", err);
    return null;
  }
};

module.exports = { UploadFile };
