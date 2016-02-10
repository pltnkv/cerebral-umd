var path = require('path');

var config = {
	entry: {
		cerebral: path.resolve(__dirname, 'cerebral.js'),
		cerebralDevtools: path.resolve(__dirname, 'cerebral-devtools.js'),
		cerebralBaobab: path.resolve(__dirname, 'cerebral-baobab.js')
	},
	output: {
		path: path.resolve('build'),
		libraryTarget: 'umd',
		library: '[name]',
		filename: '[name].js',
		umdNamedDefine: true
	},
	module: {
		loaders: [{
			test: /\.js$/,
			loader: 'babel?optional=es7.decorators'
		}]
	}
};

module.exports = config;
