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

	module.exports = __webpack_require__(960);


/***/ }),

/***/ 3:
/***/ (function(module, exports) {

	module.exports = function() { throw new Error("define cannot be used indirect"); };


/***/ }),

/***/ 956:
/***/ (function(module, exports) {

	module.exports = require("../main");

/***/ }),

/***/ 957:
/***/ (function(module, exports) {

	module.exports = require("./resizing-utils");

/***/ }),

/***/ 958:
/***/ (function(module, exports) {

	module.exports = require("./table-element-resizing");

/***/ }),

/***/ 960:
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function(f, define) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(956), __webpack_require__(957), __webpack_require__(958)], __WEBPACK_AMD_DEFINE_FACTORY__ = (f), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	})(function() {

	(function(kendo, undefined) {
	    var math = window.Math;
	    var abs = math.abs;

	    var $ = kendo.jQuery;
	    var extend = $.extend;

	    var Editor = kendo.ui.editor;
	    var TableElementResizing = Editor.TableElementResizing;
	    var ResizingUtils = Editor.ResizingUtils;
	    var getScrollBarWidth = ResizingUtils.getScrollBarWidth;
	    var constrain = ResizingUtils.constrain;
	    var calculatePercentageRatio = ResizingUtils.calculatePercentageRatio;
	    var inPercentages = ResizingUtils.inPercentages;
	    var toPercentages = ResizingUtils.toPercentages;
	    var toPixels = ResizingUtils.toPixels;
	    var outerHeight = kendo._outerHeight;

	    var NS = ".kendoEditorRowResizing";
	    var RESIZE_HANDLE_CLASS = "k-row-resize-handle";
	    var RESIZE_HANDLE_MARKER_WRAPPER_CLASS = "k-row-resize-marker-wrapper";
	    var RESIZE_MARKER_CLASS = "k-row-resize-marker";

	    var BODY = "body";
	    var TR = "tr";
	    var TBODY = "tbody";

	    var HEIGHT = "height";

	    var RowResizing = TableElementResizing.extend({
	        options: {
	            tags: [TR],
	            min: 20,
	            rootElement: null,
	            eventNamespace: NS,
	            rtl: false,
	            handle: {
	                dataAttribute: "row",
	                width: 0,
	                height: 10,
	                classNames: {
	                    handle: RESIZE_HANDLE_CLASS,
	                    marker: RESIZE_MARKER_CLASS
	                },
	                template:
	                    '<div class="k-row-resize-handle-wrapper" unselectable="on" contenteditable="false">' +
	                        '<div class="' + RESIZE_HANDLE_CLASS + '">' +
	                            '<div class="' + RESIZE_HANDLE_MARKER_WRAPPER_CLASS + '">' +
	                                '<div class="' + RESIZE_MARKER_CLASS + '"></div>' +
	                            '</div>'+
	                        '</div>' +
	                    '</div>'
	            }
	        },

	        elementBorderHovered: function(tableElement, e) {
	            var that = this;
	            var handleHeight = that.options.handle[HEIGHT];
	            var borderOffset = tableElement.offset().top + outerHeight(tableElement);
	            var mousePosition = e.clientY + $(tableElement[0].ownerDocument).scrollTop();

	            if ((mousePosition > (borderOffset - handleHeight)) && (mousePosition < (borderOffset + handleHeight))) {
	                return true;
	            }
	            else {
	                return false;
	            }
	        },

	        setResizeHandlePosition: function(row) {
	            var that = this;
	            var options = that.options;
	            var handleHeight = options.handle[HEIGHT];
	            var rowPosition = row.position();
	            var rootElement = $(options.rootElement);
	            var scrollTopOffset = rootElement.is(BODY) ? 0 : rootElement.scrollTop();
	            var scrollLeftOffset = rootElement.is(BODY) ? 0 : rootElement.scrollLeft();
	            var scrollBarWidth = options.rtl ? getScrollBarWidth(rootElement[0]) : 0;

	            that.resizeHandle.css({
	                top: rowPosition.top + outerHeight(row) + scrollTopOffset - (handleHeight / 2),
	                left: rowPosition.left + (scrollLeftOffset - scrollBarWidth),
	                position: "absolute"
	            });
	        },

	        setResizeHandleDimensions: function() {
	            var that = this;

	            that.resizeHandle.css({
	                width: $(that.element).children(TBODY).width(),
	                height: that.options.handle[HEIGHT]
	            });
	        },

	        setResizeHandleDragPosition: function(e) {
	            var that = this;
	            var options = that.options;
	            var min = options.min;
	            var tableBody =  $(that.element).children(TBODY);
	            var tableBodyTopOffset = tableBody.position().top;
	            var resizeHandle = $(that.resizeHandle);
	            var row = $(e.currentTarget).data(options.handle.dataAttribute);
	            var rootElement = $(options.rootElement);
	            var scrollTopOffset = rootElement.is(BODY) ? 0 : rootElement.scrollTop();

	            var handleOffset = constrain({
	                value: resizeHandle.position().top + scrollTopOffset + e.y.delta,
	                min: $(row).position().top + scrollTopOffset + min,
	                max: tableBodyTopOffset + outerHeight(tableBody) + scrollTopOffset - options.handle[HEIGHT] - min
	            });

	            resizeHandle.css({ top: handleOffset });
	        },

	        resize: function(e) {
	            var that = this;
	            var options = that.options;
	            var row = $(e.currentTarget).data(options.handle.dataAttribute);
	            var currentRowHeight = outerHeight($(row));
	            var element = $(that.element);
	            var initialTableHeight = outerHeight(element);
	            var tableBody = element.children(TBODY);
	            var tableBodyHeight = tableBody.height();
	            var initialStyleHeight = row.style[HEIGHT];
	            var newRowHeight = constrain({
	                value: currentRowHeight + e.y.initialDelta,
	                min: options.min,
	                max: abs(tableBodyHeight - options.min)
	            });

	            that._setRowsHeightInPixels();
	            row.style[HEIGHT] = toPixels(newRowHeight);
	            that._setTableHeight(initialTableHeight + (newRowHeight - currentRowHeight));

	            if (inPercentages(initialStyleHeight)) {
	                //resize rows in percentages as late as possible to prevent incorrect precision calculations
	                that._setRowsHeightInPercentages();
	            }
	        },

	        _setRowsHeightInPixels: function() {
	            var that = this;
	            var rows = $(that.element).children(TBODY).children(TR);
	            var length = rows.length;
	            var currentRowsHeights = rows.map(function() {
	                return outerHeight($(this));
	            });
	            var i;

	            for (i = 0; i < length; i++) {
	                rows[i].style[HEIGHT] = toPixels(currentRowsHeights[i]);
	            }
	        },

	        _setRowsHeightInPercentages: function() {
	            var that = this;
	            var tableBody = $(that.element).children(TBODY);
	            var tableBodyHeight = tableBody.height();
	            var rows = tableBody.children(TR);
	            var length = rows.length;
	            var currentRowsHeights = rows.map(function() {
	                return outerHeight($(this));
	            });
	            var i;

	            for (i = 0; i < length; i++) {
	                rows[i].style[HEIGHT] = toPercentages(calculatePercentageRatio(currentRowsHeights[i], tableBodyHeight));
	            }
	        },

	        _setTableHeight: function(newHeight) {
	            var element = this.element;

	            if (inPercentages(element.style[HEIGHT])) {
	                element.style[HEIGHT] = toPercentages(calculatePercentageRatio(newHeight, $(element).parent().height()));
	            }
	            else {
	                element.style[HEIGHT] = toPixels(newHeight);
	            }
	        }
	    });

	    RowResizing.create = function(editor) {
	        TableElementResizing.create(editor, {
	            name: "rowResizing",
	            type: RowResizing,
	            eventNamespace: NS
	        });
	    };

	    RowResizing.dispose = function(editor) {
	        TableElementResizing.dispose(editor, {
	            eventNamespace: NS
	        });
	    };

	    extend(Editor, {
	        RowResizing: RowResizing
	    });

	})(window.kendo);

	}, __webpack_require__(3));


/***/ })

/******/ });