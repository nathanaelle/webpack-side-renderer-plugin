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
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["pathExtractor"] = pathExtractor;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common__ = __webpack_require__(1);


function pathforUrl(p) {
	if( p.split('/').length < 3) {
		return	['1', '2', '3'].map((x) => (p+x+'/'))
	}
	if (p.match(/\d\.html$/)) {
		return []
	}
	return	['1', '2', '3'].map((x) => (p+x+'.html'))
}

function pathExtractor(assets) {
	let ret = []
	let stack = pathforUrl('/')

	while(stack.length > 0) {
		const p = stack.shift()
		ret.push(p)
		stack = stack.concat(pathforUrl(p))
	}
	return	ret
}

/* harmony default export */ __webpack_exports__["default"] = ((options) => {
	const assets = Object.values(options.assets)
	const js = assets.filter(asset => asset.filename.match(/\.js$/)).map(asset => ('<script src="'+asset.filename+'"></script>')).join('');

	const suburls = pathforUrl(options.path)

	if (suburls.length > 0 ) {
		const links = suburls.map((l) => `<li><a href="${ l }">${ l }</a></li>` ).join('')

		return	Promise.resolve(
			`<html>
				<body>
					<h1>/ is home</h1>
					<p>${ Object(__WEBPACK_IMPORTED_MODULE_0__common__["a" /* hello */])(options.path) }</p>
					<ul>
					${ links }
					</ul>
				</body>
				${ js }
			</html>`.replace(/[\r\n\t]+/g, ''))
	}

	return	Promise.resolve(
		`<html>
			<body>
				<h1>/ is home</h1>
				<p>final ${ Object(__WEBPACK_IMPORTED_MODULE_0__common__["a" /* hello */])(options.path) }</p>
			</body>
			${ js }
		</html>`.replace(/[\r\n\t]+/g, ''))
});


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const hello = (world) => {
	return `hello ${ world}`
}
/* harmony export (immutable) */ __webpack_exports__["a"] = hello;



/***/ })
/******/ ]);
});