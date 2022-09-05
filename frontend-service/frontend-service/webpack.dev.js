const { merge } = require("webpack-merge");
const webpack = require('webpack');
const commonConfig = require("./webpack.common");

const developmentConfig = {
  mode: "development",
  plugins: [
    new webpack.EnvironmentPlugin({
        NODE_ENV: 'development',
        REACT_APP_BASKET_SERVICE_ENDPOINT: 'http://localhost:8004',
        REACT_APP_CHECKOUT_SERVICE_ENDPOINT: 'http://localhost:8001'
    })
  ]
};

module.exports = merge(commonConfig, developmentConfig);