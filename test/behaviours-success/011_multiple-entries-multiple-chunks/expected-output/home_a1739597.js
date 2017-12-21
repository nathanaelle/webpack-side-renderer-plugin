(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(typeof self !== 'undefined' ? self : this, function() {
return webpackJsonp([0],[
/* 0 */,
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common__ = __webpack_require__(0);



/* harmony default export */ __webpack_exports__["default"] = ((options) => {
	const assets = Object.values(options.assets)
	const js = assets.filter(asset => asset.filename.match(/\.js$/)).map(asset => ('<script src="'+asset.filename+'"></script>')).join('')

	return	{
'/': `<html>
	<body>
		<h1>/ is home</h1>
		<p>${ Object(__WEBPACK_IMPORTED_MODULE_0__common__["a" /* hello */])(options.path) }</p>
	</body>
	${ js }
</html>
`,
'/info.html': `<html>
	<body>
		<h1>/info.html is home</h1>
		<p>${ Object(__WEBPACK_IMPORTED_MODULE_0__common__["a" /* hello */])('/info.html') }</p>
	</body>
	${ js }
</html>
`,
	}
});


/***/ })
],[1]);
});