const { merge } = require("webpack-merge");
const webpack = require('webpack');
const commonConfig = require("./webpack.common");

const productionConfig = {
  mode: "production",
  plugins: [
    new webpack.EnvironmentPlugin({
        NODE_ENV: 'production',
        REACT_APP_BASKET_SERVICE_ENDPOINT: 'http://basket-service:8004',
        REACT_APP_CHECKOUT_SERVICE_ENDPOINT: 'http://checkout-service:8001'
    })
  ]
};

module.exports = merge(commonConfig, productionConfig);
