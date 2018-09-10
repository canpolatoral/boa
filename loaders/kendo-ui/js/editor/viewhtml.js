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

	__webpack_require__(978);
	module.exports = __webpack_require__(978);


/***/ }),

/***/ 3:
/***/ (function(module, exports) {

	module.exports = function() { throw new Error("define cannot be used indirect"); };


/***/ }),

/***/ 978:
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function(f, define){
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__(979) ], __WEBPACK_AMD_DEFINE_FACTORY__ = (f), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	})(function(){

	(function($, undefined) {

	var kendo = window.kendo,
	    extend = $.extend,
	    Editor = kendo.ui.editor,
	    EditorUtils = Editor.EditorUtils,
	    Command = Editor.Command,
	    Tool = Editor.Tool,
	    ToolTemplate = Editor.ToolTemplate;

	var ViewHtmlCommand = Command.extend({
	    init: function(options) {
	        var cmd = this;
	        cmd.options = options;
	        Command.fn.init.call(cmd, options);
	        cmd.attributes = null;
	        cmd.async = true;
	    },

	    exec: function() {
	        var that = this,
	            editor = that.editor,
	            options = editor.options,
	            messages = editor.options.messages,
	            dialog = $(kendo.template(ViewHtmlCommand.template)(messages)).appendTo(document.body),
	            textarea = ".k-editor-textarea",
	            content;

	        options.serialization.immutables = editor.immutables;
	        content = ViewHtmlCommand.indent(editor.value());
	        options.serialization.immutables = undefined;

	        function apply(e) {
	            options.deserialization.immutables = editor.immutables;
	            editor.value(dialog.find(textarea).val());
	            options.deserialization.immutables = undefined;

	            close(e);

	            if (that.change) {
	                that.change();
	            }

	            editor.trigger("change");
	        }

	        function close(e) {
	            e.preventDefault();

	            dialog.data("kendoWindow").destroy();

	            if (editor.immutables) {
	                editor.immutables.serializedImmutables = {};
	            }

	            editor.focus();
	        }

	        this.createDialog(dialog, {
	            title: messages.viewHtml,
	            close: close,
	            visible: false
	        })
	            .find(textarea).val(content).end()
	            .find(".k-dialog-update").click(apply).end()
	            .find(".k-dialog-close").click(close).end()
	            .data("kendoWindow").center().open();

	        dialog.find(textarea).focus();
	    }
	});

	extend(ViewHtmlCommand, {
	    template: "<div class='k-editor-dialog k-popup-edit-form k-viewhtml-dialog'>" +
	                "<div class='k-edit-form-container'></div>" +
	                    "<textarea class='k-editor-textarea k-input'></textarea>" +
	                    "<div class='k-edit-buttons k-state-default'>" +
	                        "<button class='k-dialog-update k-button k-primary'>#: dialogUpdate #</button>" +
	                        "<button class='k-dialog-close k-button'>#: dialogCancel #</button>" +
	                    "</div>" +
	                "</div>" +
	            "</div>",
	    indent: function(content) {
	        return content.replace(/<\/(p|li|ul|ol|h[1-6]|table|tr|td|th)>/ig, "</$1>\n")
	                      .replace(/<(ul|ol)([^>]*)><li/ig, "<$1$2>\n<li")
	                      .replace(/<br \/>/ig, "<br />\n")
	                      .replace(/\n$/, "");
	    }
	});

	kendo.ui.editor.ViewHtmlCommand = ViewHtmlCommand;

	Editor.EditorUtils.registerTool("viewHtml", new Tool({ command: ViewHtmlCommand, template: new ToolTemplate({template: EditorUtils.buttonTemplate, title: "View HTML"})}));

	})(window.kendo.jQuery);

	}, __webpack_require__(3));


/***/ }),

/***/ 979:
/***/ (function(module, exports) {

	module.exports = require("./indent");

/***/ })

/******/ });