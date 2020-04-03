/*
#########################################################################
#
# Copyright (C) 2019 OSGeo
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program. If not, see <http://www.gnu.org/licenses/>.
#
#########################################################################
*/

const path = require('path');
const DefinePlugin = require('webpack/lib/DefinePlugin');

const DEV_SERVER_HOST = 'ENTER REMOTE GEONODE';

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';
    return {
        entry: {
            bundle: './src/index.js'
        },
        output: {
            path: path.join(__dirname, '../static/monitoring'),
            publicPath: '/static/monitoring/',
            filename: '[name].js'
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: [ 'babel-loader' ]
                },
                {
                    test: /\.scss$/,
                    use: [
                        { loader: 'style-loader' },
                        { loader: 'to-string-loader' },
                        { loader: 'css-loader' },
                        { loader: 'sass-loader' }
                    ]
                },
                {
                    test: /\.(png|jpg|gif|svg)$/,
                    use: [{
                        loader: 'url-loader',
                        options: {
                            name: '[path][name].[ext]',
                            limit: 8192
                        }
                    }]
                },
            ]
        },
        resolve: {
            extensions: ['*', '.js', '.jsx']
        },
        plugins: [
            new DefinePlugin({
                '__DEVELOPMENT__': !isProduction,
                '__TRANSLATION_PATH__': isProduction
                    ? "'/static/monitoring/translations/'"
                    : "'/translations/'",
                '__ASSETS_PATH__': isProduction
                    ? "'/static/monitoring/assets/'"
                    : "'/assets/'"
            })
        ],
        devServer: isProduction
            ? undefined
            : {
                https: true,
                port: 3000,
                contentBase: './',
                before: function(app) {
                    const hashRegex = /\.[a-zA-Z0-9]{1,}\.js/;
                    app.use(function(req, res, next) {
                        // remove hash from requests to use the local js
                        if (req.url.indexOf('/static/monitoring/bundle') !== -1) {
                            req.url = req.url.replace(hashRegex, '.js');
                            req.path = req.path.replace(hashRegex, '.js');
                            req.originalUrl = req.originalUrl.replace(hashRegex, '.js');
                        }
                        next();
                    });
                },
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
                proxy: [
                    {
                        context: [
                            '**',
                            '!**/static/monitoring/**',
                            '!**/assets/**',
                            '!**/translations/**'
                        ],
                        target: `https://${DEV_SERVER_HOST}/`,
                        headers: {
                            Host: DEV_SERVER_HOST,
                            Referer: `https://${DEV_SERVER_HOST}/`
                        }
                    }
                ]
            },
        devtool: isProduction ? undefined : 'eval'
    }
};
