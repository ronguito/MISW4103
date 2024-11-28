const fs = require('fs');
const path = require('path');
const config = require('./properties.json');

module.exports = {
    e2e: {
        screenshotsFolder: `./${config.Results}/cypress`,
        setupNodeEvents(on, config) {
            on('task', {
                clearScreenshots(datos) {
                    const folder = datos[0];
                    const pattern = datos[1];
                    if (fs.existsSync(folder)) {
                        const files = fs.readdirSync(folder);
                        var del = 0;
                        files.forEach((file) => {
                            if(file.indexOf(pattern) !== -1){
                                const filePath = path.join(folder, file);
                                fs.unlinkSync(filePath);
                                del++;
                            }
                        });
                        return `Deleted ${del} files de ${pattern}.`;
                    }
                    return `Screenshots folder "${folder} "does not exist.`;
                },
            });
        },
    },
    env: {
        config,
    },
};
