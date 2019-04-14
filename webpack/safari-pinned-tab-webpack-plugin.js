const fs = require('fs');

const CODE = `<link rel="mask-icon" href="safari-pinned-tab.svg" color="{{COLOR}}">`;

class SafariPinnedTabPlugin {
    constructor ({ color }) {
        this.color = color;
    }
    apply (compiler) {
        compiler.hooks.compilation.tap('spt', compilation => {
            compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tap('spt', ({ html }) => {
                fs.copyFile('./src/icon.svg', './pub/safari-pinned-tab.svg', (err) => {
                    if (err) throw err;
                    console.log('./src/icon.svg was copied to ./pub/safari-pinned-tab.svg');
                });
                return {
                    html: html.replace('</head>', CODE.replace(/{{COLOR}}/g, this.color) + '</head>')
                }
            });
        });
    }
}

module.exports = SafariPinnedTabPlugin;
