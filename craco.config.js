const webpack = require("webpack");

module.exports = {
    style: {
        postOptions: {
            plugins: [
                require('tailwindcss'),
                require('autoprefixer'),
            ],
        },
    },
    webpack: {
        configure: {
            target: "electron-renderer",
            resolve: {
                fallback: {
                    path: require.resolve('path-browserify/'),
                    stream: require.resolve('stream-browserify'),
                    crypto: require.resolve("crypto-browserify"),
                    url: require.resolve("url"),
                    http: require.resolve("stream-http"),
                    process: require.resolve("process/browser"),
                    zlib: require.resolve("browserify-zlib"),
                    util: require.resolve("util"),
                    buffer: require.resolve("buffer"),
                    asset: require.resolve("assert")
                },
            },
            plugins: [
                new webpack.ProvidePlugin({
                Buffer: ["buffer", "Buffer"],
                process: "process/browser",
                }),
            ],
        },
    },
};