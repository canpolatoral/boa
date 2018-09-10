module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1060);


/***/ }),

/***/ 3:
/***/ (function(module, exports) {

	module.exports = function() { throw new Error("define cannot be used indirect"); };


/***/ }),

/***/ 989:
/***/ (function(module, exports) {

	module.exports = require("./kendo.drawing");

/***/ }),

/***/ 1000:
/***/ (function(module, exports) {

	module.exports = require("./kendo.data");

/***/ }),

/***/ 1008:
/***/ (function(module, exports) {

	module.exports = require("./kendo.mobile.scroller");

/***/ }),

/***/ 1019:
/***/ (function(module, exports) {

	module.exports = require("./kendo.userevents");

/***/ }),

/***/ 1040:
/***/ (function(module, exports) {

	module.exports = require("./kendo.draganddrop");

/***/ }),

/***/ 1060:
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function(f, define){
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	        __webpack_require__(1000), __webpack_require__(1040), __webpack_require__(1019), __webpack_require__(1008),
	        __webpack_require__(989),

	       __webpack_require__(1061),
	       __webpack_require__(1062),
	       __webpack_require__(1063),
	       __webpack_require__(1064),
	       __webpack_require__(1065),
	       __webpack_require__(1066)
	    ], __WEBPACK_AMD_DEFINE_FACTORY__ = (f), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	})(function(){

	    var __meta__ = { // jshint ignore:line
	        id: "dataviz.diagram",
	        name: "Diagram",
	        category: "dataviz",
	        description: "The Kendo DataViz Diagram ",
	        depends: [ "data", "userevents", "mobile.scroller", "draganddrop", "drawing", "dataviz.core", "dataviz.themes", "toolbar" ],
	        features: [{
	            id: "dataviz.diagram-pdf-export",
	            name: "PDF export",
	            description: "Export Diagram as PDF",
	            depends: [ "pdf" ]
	        },{
	            id: "dataviz.diagram-editing",
	            name: "Editing",
	            description: "Support for model editing",
	            depends: [ "editable", "window", "dropdownlist" ]
	        }]
	    };

	    return window.kendo;

	}, __webpack_require__(3));


/***/ }),

/***/ 1061:
/***/ (function(module, exports) {

	module.exports = require("./dataviz/diagram/utils");

/***/ }),

/***/ 1062:
/***/ (function(module, exports) {

	module.exports = require("./dataviz/diagram/math");

/***/ }),

/***/ 1063:
/***/ (function(module, exports) {

	module.exports = require("./dataviz/diagram/svg");

/***/ }),

/***/ 1064:
/***/ (function(module, exports) {

	module.exports = require("./dataviz/diagram/services");

/***/ }),

/***/ 1065:
/***/ (function(module, exports) {

	module.exports = require("./dataviz/diagram/layout");

/***/ }),

/***/ 1066:
/***/ (function(module, exports) {

	module.exports = require("./dataviz/diagram/dom");

/***/ })

/******/ });