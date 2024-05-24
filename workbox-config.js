module.exports = {
    globDirectory: 'dist/',
    globPatterns: [
        '**/*.{css,ico,woff2,ttf,woff,svg,png,html,js}'
    ],
    swDest: 'dist/sw.js',
    ignoreURLParametersMatching: [
        /^utm_/,
        /^fbclid$/
    ],
    runtimeCaching: [{
        urlPattern: /\.(?:png|jpg|jpeg|svg|json)$/,
        handler: 'StaleWhileRevalidate'
    }]
};