const fs = require("fs");
const Jimp = require("jimp");
const path = require("path");

const operationAvatar = async (file, filename) => {
    const tempPath = path.join(__dirname,  `../tmp/${filename}`);
    const avatarPath = path.join(__dirname, `../public/avatars/${filename}`);

    try {
        await Jimp.read(file.path);
        const avatar = await Jimp.read(file.path);
        avatar.resize(250, 250).quality(60);
        await avatar.writeAsync(tempPath);
  
        await fs.promises.rename(tempPath, avatarPath);
        await fs.promises.unlink(file.path);
        return avatarPath;
      } catch (error) {
        await fs.promises.unlink(file.path);
        throw error;
      }
}

module.exports = operationAvatar;