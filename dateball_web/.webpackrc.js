import pxtorem from 'postcss-pxtorem';
const path = require( 'path' );
import config from './config';

export default{
	"entry":"src/index.js",
	"disableCSSModules": false,
	"proxy":{
		"/api":{
			"target":config.api+"/api/",
			"changeOrigin":true,
			"pathRewrite":{"^/api":""}
		}
	},
	extraPostCSSPlugins : [
	    pxtorem( {
	      rootValue : 18 ,
	      propWhiteList : [] ,
	    } ) ,
	  ],
	"extraBabelPlugins":[
		["import",{"libraryName":"antd-mobile","libraryDirectory":"lib","style":true}]
	],
	"env":{
		"development":{
			"extraBabelPlugins":[
				"dva-hmr"
			]
		}
	}
};