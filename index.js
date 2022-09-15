/* Configuration */
const SOURCE_SIZE = 512;
const SIZES = [256, 128, 64, 32];

/* Script */
const fs = require('fs');
const im = require('imagemagick');
const path = require("path");
const webp = require('webp-converter');

const iconsDirectory = path.join(__dirname, "icons");
const icons = fs.readdirSync(iconsDirectory);

function log(icon, size, format) {
    console.log("[Tech Icons] (" + format + ") " + icon + ": Saved " + size + "x" + size + " icon");
}

function resizer(icon) {
    const dir = path.join(iconsDirectory, icon);
    const source = path.join(dir, SOURCE_SIZE + ".png");
    
    return new Promise((resolve) => {
        if (fs.existsSync(source)) {
            let i = 0;
            for (const size of SIZES) {
                const target = path.join(dir, size + ".png");
    
                im.convert([
                    source,
                    "-resize",
                    size + "x" + size,
                    target
                ], (err, _result) => {
                    if (err) throw err;
                    log(icon, size, "png");
                    i++;

                    if (i == SIZES.length) {
                        resolve();
                    } 
                });
            }
        }
    });
}

function convertWebP(icon) {
    const dir = path.join(iconsDirectory, icon);
    const files = fs.readdirSync(dir);

    return new Promise((resolve) => {
        for (const file of files) {
            if (file.endsWith(".png")) {
                const sourceIcon = path.join(dir, file);
                const targetIcon = path.join(dir, file.replace(".png", ".webp"));
                webp.cwebp(sourceIcon, targetIcon, "-q 80", logging="-v").then(() => {
                    log(icon, file.split(".")[0], "webp");
                        resolve()
                });
            }
        }
    })
}

async function start() {
    for (const icon of icons) {
        await resizer(icon);
        await convertWebP(icon);
    }
}

start();