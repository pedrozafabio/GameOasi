const path = require('path');
const dotenv = require('dotenv');
const webpack = require('webpack');

dotenv.config();
console.log(process.env);

module.exports = {
    // Use env.<YOUR VARIABLE> here:
    entry : './src/main.js',
    output:{
        path: path.resolve('./'),
        filename : 'entry.js'
    },
    optimization : {
        minimize : false
    },
    plugins : [
        new webpack.DefinePlugin({
            "NODE_ENV" : JSON.stringify(process.env)
        })
    ]
}