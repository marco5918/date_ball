import pxtorem from 'postcss-pxtorem';
const path = require( 'path' );

export default{
	"entry":"src/index.js",
	"disableCSSModules": false,
	"proxy":{
		"/api":{
			"target":"http://192.168.1.103:3002/api/",
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