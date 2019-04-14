const CODE = `<script async src="https://www.googletagmanager.com/gtag/js?id={{ID}}"></script><script>window.dataLayer = window.dataLayer || []; function gtag(){ dataLayer.push(arguments); }; gtag('js', new Date()); gtag('config', '{{ID}}');</script>`;

class GoogleAnalyticsPlugin {
    constructor ({ id }) {
        this.id = id;
    }
    apply (compiler) {
        compiler.hooks.compilation.tap('ga', compilation => {
            compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tap('ga', ({ html }) => ({
                html: html.replace('</head>', CODE.replace(/{{ID}}/g, this.id) + '</head>')
            }));
        });
    }
}

module.exports = GoogleAnalyticsPlugin;
