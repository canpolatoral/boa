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

	__webpack_require__(1426);
	module.exports = __webpack_require__(1426);


/***/ }),

/***/ 3:
/***/ (function(module, exports) {

	module.exports = function() { throw new Error("define cannot be used indirect"); };


/***/ }),

/***/ 920:
/***/ (function(module, exports) {

	module.exports = require("../kendo.core");

/***/ }),

/***/ 1426:
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function(f, define){
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__(920) ], __WEBPACK_AMD_DEFINE_FACTORY__ = (f), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	})(function(){

	(function(kendo) {
	    'use strict';

	    if (kendo.support.browser.msie && kendo.support.browser.version < 9) {
	        return;
	    }

	    var $ = kendo.jQuery;
	    var alphaNumRegExp = /:alphanum$/;

	    var ACTIONS = {
	       "up": "up",
	       "down": "down",
	       "left": "left",
	       "right": "right",
	       "home": "first-col",
	       "ctrl+left": "first-col",
	       "end": "last-col",
	       "ctrl+right": "last-col",
	       "ctrl+up": "first-row",
	       "ctrl+down": "last-row",
	       "ctrl+home": "first",
	       "ctrl+end": "last",
	       "pageup": "prev-page",
	       "pagedown": "next-page"
	    };

	    var ENTRY_ACTIONS = {
	        "tab": "next",
	        "shift+tab": "previous",
	        "enter": "lower",
	        "shift+enter": "upper",
	        "delete": "clearContents",
	        "backspace": "clearContents",
	        "shift+:alphanum": "edit",
	        ":alphanum": "edit",
	        "ctrl+:alphanum": "ctrl",
	        "alt+ctrl+:alphanum": "edit",
	        ":edit": "edit"
	    };

	    var CONTAINER_EVENTS = {
	        "wheel": "onWheel",
	        "*+mousedown": "onMouseDown",
	        "contextmenu": "onContextMenu",
	        "*+mousedrag": "onMouseDrag",
	        "*+mouseup": "onMouseUp",
	        "*+dblclick": "onDblClick",
	        "mousemove": "onMouseMove"
	    };

	    var CLIPBOARD_EVENTS = {
	        "pageup": "onPageUp",
	        "pagedown": "onPageDown",
	        "mouseup": "onMouseUp",
	        "*+cut": "onCut",
	        "*+paste": "onPaste",
	        "*+copy": "onCopy"
	    };

	    var EDITOR_EVENTS = {
	        "esc": "onEditorEsc",
	        "enter": "onEditorBlur",
	        "alt+enter": "insertNewline",
	        "shift+enter": "onEditorBlur",
	        "tab": "onEditorBlur",
	        "shift+tab": "onEditorBlur"
	    };

	    var FORMULABAR_EVENTS = $.extend({ focus: "onEditorBarFocus" }, EDITOR_EVENTS);
	    var FORMULAINPUT_EVENTS = $.extend({ focus: "onEditorCellFocus" }, EDITOR_EVENTS);

	    var SELECTION_MODES = {
	       cell: "range",
	       rowheader: "row",
	       columnheader: "column",
	       topcorner: "sheet",
	       autofill: "autofill"
	    };

	    function toActionSelector(selectors) {
	        return selectors.map(function(action) {
	            return '[data-action="' + action + '"]';
	        }).join(",");
	    }

	    var COMPOSITE_UNAVAILABLE_ACTION_SELECTORS = toActionSelector([ 'cut', 'copy', 'paste', 'insert-left', 'insert-right', 'insert-above', 'insert-below' ]);
	    var UNHIDE_ACTION_SELECTORS = toActionSelector([ 'unhide-row', 'unhide-column' ]);

	    var ACTION_KEYS = [];
	    var SHIFT_ACTION_KEYS = [];
	    var ENTRY_ACTION_KEYS = [];

	    for (var key in ACTIONS) {
	        ACTION_KEYS.push(key);
	        SHIFT_ACTION_KEYS.push("shift+" + key);
	    }

	    for (key in ENTRY_ACTIONS) {
	        ENTRY_ACTION_KEYS.push(key);
	    }

	    CLIPBOARD_EVENTS[ACTION_KEYS] = "onAction";
	    CLIPBOARD_EVENTS[SHIFT_ACTION_KEYS] = "onShiftAction";
	    CLIPBOARD_EVENTS[ENTRY_ACTION_KEYS] = "onEntryAction";

	    FORMULAINPUT_EVENTS[ACTION_KEYS] = "onEditorAction";
	    FORMULAINPUT_EVENTS[SHIFT_ACTION_KEYS] = "onEditorShiftAction";

	    var Controller = kendo.Class.extend({
	        init: function(view, workbook) {
	            this.view = view;
	            this.workbook(workbook);
	            this.container = $(view.container);
	            this.clipboardElement = $(view.clipboard);
	            this.cellContextMenu = view.cellContextMenu;
	            this.rowHeaderContextMenu = view.rowHeaderContextMenu;
	            this.colHeaderContextMenu = view.colHeaderContextMenu;
	            this.scroller = view.scroller;
	            this.tabstrip = view.tabstrip;
	            this.sheetsbar = view.sheetsbar;

	            view.nameEditor.bind("enter", this.onNameEditorEnter.bind(this));
	            view.nameEditor.bind("cancel", this.onNameEditorCancel.bind(this));
	            view.nameEditor.bind("select", this.onNameEditorSelect.bind(this));
	            view.nameEditor.bind("delete", this.onNameEditorDelete.bind(this));

	            this.editor = view.editor;
	            this.editor.bind("change", this.onEditorChange.bind(this));
	            this.editor.bind("activate", this.onEditorActivate.bind(this));
	            this.editor.bind("deactivate", this.onEditorDeactivate.bind(this));
	            this.editor.bind("update", this.onEditorUpdate.bind(this));

	            $(view.scroller).on("scroll", this.onScroll.bind(this));
	            this.listener = new kendo.spreadsheet.EventListener(this.container, this, CONTAINER_EVENTS);

	            this._enableEditorEvents();

	            if (this.sheetsbar) {
	                this.sheetsbar.bind("select", this.onSheetBarSelect.bind(this));
	                this.sheetsbar.bind("reorder", this.onSheetBarReorder.bind(this));
	                this.sheetsbar.bind("rename", this.onSheetBarRename.bind(this));
	                this.sheetsbar.bind("remove", this.onSheetBarRemove.bind(this));
	            }

	            this.cellContextMenu.bind("select", this.onContextMenuSelect.bind(this));
	            this.rowHeaderContextMenu.bind("select", this.onContextMenuSelect.bind(this));
	            this.colHeaderContextMenu.bind("select", this.onContextMenuSelect.bind(this));

	            // this is necessary for Windows to catch prevent context menu correctly
	            this.cellContextMenu.element.add(this.rowHeaderContextMenu.element).add(this.colHeaderContextMenu.element).on("contextmenu", false);

	            if (this.tabstrip) {
	                this.tabstrip.bind("action", this.onCommandRequest.bind(this));
	                this.tabstrip.bind("dialog", this.onDialogRequest.bind(this));
	            }
	        },

	        _enableEditorEvents: function (enable) {
	            if (enable === undefined || enable) {
	                this.keyListener = new kendo.spreadsheet.EventListener(this.clipboardElement, this, CLIPBOARD_EVENTS);
	                this.barKeyListener = new kendo.spreadsheet.EventListener(this.editor.barElement(), this, FORMULABAR_EVENTS);
	                this.inputKeyListener = new kendo.spreadsheet.EventListener(this.editor.cellElement(), this, FORMULAINPUT_EVENTS);
	            } else {
	                this.keyListener.destroy();
	                this.barKeyListener.destroy();
	                this.inputKeyListener.destroy();
	            }
	        },

	        _execute: function(options) {
	            var result = this._workbook.execute(options);

	            if (options.command === "EditCommand" && !result) {
	                this._workbook.trigger("change", { editorClose: true });
	            }

	            if (result) {
	                this._preventNavigation = true;
	                if (result.reason === "error") {
	                    this.view.showError(result, function(){
	                        // we only get here in case of a validation error when the user decided to retry.
	                        this.activateEditor();
	                        // reset to last input from user
	                        this.editor.value(this._lastEditorValue);
	                        // however, set _value manually such that it'll detect change properly.  ugly :-\
	                        this.editor._value = this._workbook._inputForRef(this._workbook.activeSheet()._viewActiveCell());
	                        // seems like a nice UX to have the whole input selected
	                        this.editor.select();
	                    }.bind(this));
	                } else {
	                    this.view.openDialog(result.reason);
	                }
	            }

	            return result;
	        },

	        _activeTooltip: function() {
	            return this._workbook.activeSheet().activeCell().simplify().toString();
	        },

	        onContextMenuSelect: function(e) {
	                var action = $(e.item).data("action");
	                var command;
	                switch(action) {
	                    case "cut":
	                        command = { command: "ToolbarCutCommand", options: { workbook: this._workbook } };
	                        break;
	                    case "copy":
	                        command = { command: "ToolbarCopyCommand", options: { workbook: this._workbook } };
	                        break;
	                    case "paste":
	                        command = { command: "ToolbarPasteCommand", options: { workbook: this._workbook } };
	                        break;
	                    case "unmerge":
	                        command = { command: "MergeCellCommand", options: { value: "unmerge" } };
	                        break;
	                    case "merge":
	                        this.view.openDialog("merge");
	                        break;
	                    case "hide-row":
	                        command = { command: "HideLineCommand", options: { axis: "row" } };
	                        break;
	                    case "hide-column":
	                        command = { command: "HideLineCommand", options: { axis: "column" } };
	                        break;
	                    case "unhide-row":
	                        command = { command: "UnHideLineCommand", options: { axis: "row" } };
	                        break;
	                    case "unhide-column":
	                        command = { command: "UnHideLineCommand", options: { axis: "column" } };
	                        break;
	                    case "delete-row":
	                        command = { command: "DeleteRowCommand" };
	                        break;
	                    case "delete-column":
	                        command = { command: "DeleteColumnCommand" };
	                        break;
	                }

	                if (command) {
	                    this._execute(command);
	                }
	        },

	        onSheetBarRemove: function(e) {
	            var sheet = this._workbook.sheetByName(e.name);

	            //TODO: move to model!
	            if (!sheet) {
	                return;
	            }

	            this._workbook.removeSheet(sheet);
	        },

	        destroy: function() {
	            this.listener.destroy();
	            this._enableEditorEvents(false);
	            this.keyListener.destroy();
	            this.inputKeyListener.destroy();
	        },

	        onSheetBarSelect: function(e) {
	            var sheet;
	            var workbook = this._workbook;

	            if (e.isAddButton) {
	                if (this._workbook.trigger("insertSheet")) {
	                    return;
	                }

	                sheet = workbook.insertSheet();
	            } else {
	                sheet = workbook.sheetByName(e.name);
	            }

	            //TODO: move to model
	            if (workbook.activeSheet().name() !== sheet.name()) {
	                if (this._workbook.trigger("selectSheet", { sheet: sheet })) {
	                    return;
	                }

	                workbook.activeSheet(sheet);
	            }
	        },

	        onSheetBarReorder: function(e) {
	            var sheet = this._workbook.sheetByIndex(e.oldIndex);

	            this._workbook.moveSheetToIndex(sheet, e.newIndex);

	            this._workbook.activeSheet(sheet);
	        },

	        onSheetBarRename: function(e) {
	            var sheet = this._workbook.sheetByIndex(e.sheetIndex);

	            if (this._workbook.sheetByName(e.name)) {
	                this.view.showError({ reason: "error", type: "duplicateSheetName" });
	                return;
	            }

	            this._workbook.renameSheet(sheet, e.name);

	            this.clipboardElement.focus();
	        },

	        sheet: function(sheet) {
	            this.navigator = sheet.navigator();
	            this.axisManager = sheet.axisManager();
	        },

	        workbook: function(workbook) {
	            this._workbook = workbook;
	            this.clipboard = workbook.clipboard();
	            workbook.bind("commandRequest", this.onCommandRequest.bind(this));
	        },

	        refresh: function() {
	            var editor = this.editor;
	            var workbook = this._workbook;
	            var sheet = workbook.activeSheet();

	            this._viewPortHeight = this.view.scroller.clientHeight;
	            this.navigator.height(this._viewPortHeight);

	            if (!editor.isActive() && !this.isEditorDisabled) {
	                editor.enable(sheet.selection().enable() !== false);
	                editor.value(workbook._inputForRef(sheet.activeCell()));
	            }

	            var ref = sheet.selection()._ref.simplify();
	            var def = this._workbook.nameForRef(ref, sheet.name());
	            this.view.nameEditor.value(def.name);
	        },

	        onScroll: function() {
	            this.view.render();
	        },

	        onWheel: function(event) {
	            var deltaX = event.originalEvent.deltaX;
	            var deltaY = event.originalEvent.deltaY;

	            if (event.originalEvent.deltaMode === 1) {
	                deltaX *= 10;
	                deltaY *= 10;
	            }

	            this.scrollWith(deltaX, deltaY);

	            event.preventDefault();
	        },

	        onAction: function(event, action) {
	            this.navigator.moveActiveCell(ACTIONS[action]);
	            event.preventDefault();
	        },

	        onPageUp: function() {
	            this.scrollDown(-this._viewPortHeight);
	        },

	        onPageDown: function() {
	            this.scrollDown(this._viewPortHeight);
	        },

	        onEntryAction: function(event, action) {
	            if (event.mod) {
	                var shouldPrevent = true;
	                var key = String.fromCharCode(event.keyCode);

	                switch(key) {
	                    case "A":
	                        this.navigator.selectAll();
	                        break;
	                    case "Y":
	                        this._workbook.undoRedoStack.redo();
	                        break;
	                    case "Z":
	                        this._workbook.undoRedoStack.undo();
	                        break;
	                    default:
	                        shouldPrevent = false;
	                        break;
	                }
	                if (shouldPrevent) {
	                    event.preventDefault();
	                }
	            } else {
	                var disabled = this._workbook.activeSheet().selection().enable() === false;

	                if (action == "delete" || action == "backspace") {
	                    if (!disabled) {
	                        this._execute({ command: "ClearContentCommand" });
	                    }
	                    event.preventDefault();
	                } else if (alphaNumRegExp.test(action) || action === ":edit") {
	                    if (disabled) {
	                        event.preventDefault();
	                        return;
	                    }
	                    if (action !== ":edit") {
	                        this.editor.value("");
	                    }
	                    this.activateEditor();
	                } else {
	                    this.navigator.navigateInSelection(ENTRY_ACTIONS[action]);
	                    event.preventDefault();
	                }
	            }
	        },

	        onShiftAction: function(event, action) {
	            this.navigator.modifySelection(ACTIONS[action.replace("shift+", "")], this.appendSelection);
	            event.preventDefault();
	        },

	        onMouseMove: function(event) {
	            var sheet = this._workbook.activeSheet();

	            if (sheet.resizingInProgress() || sheet.selectionInProgress()) {
	                return;
	            }

	            var object = this.objectAt(event);
	            if (object.type === "columnresizehandle" || object.type === "rowresizehandle") {
	                sheet.positionResizeHandle(object.ref);
	            } else {
	                sheet.removeResizeHandle();
	            }
	        },

	        onMouseDown: function(event) {
	            var object = this.objectAt(event);

	            if (object.pane) {
	                this.originFrame = object.pane;
	            }

	            if (object.type === "editor") {
	                // XXX: canceling the edits, because they might not
	                // validate.  Not sure it's the Right Thing.
	                this.onEditorEsc();
	                this.openCustomEditor();
	                event.preventDefault();
	                return;
	            }

	            if (this.editor.canInsertRef(false) && object.ref) {
	                this._workbook.activeSheet()._setFormulaSelections(this.editor.highlightedRefs());
	                this.navigator.startSelection(object.ref, this._selectionMode, this.appendSelection, event.shiftKey);
	                event.preventDefault();
	                return;
	            } else {
	                this._preventNavigation = false;
	                this.editor.deactivate();
	                if (this._preventNavigation) {
	                    return;     // validation error
	                }
	            }

	            var sheet = this._workbook.activeSheet();
	            if (object.type === "columnresizehandle" || object.type === "rowresizehandle") {
	                sheet.startResizing({ x: object.x, y: object.y });
	                event.preventDefault();
	                return;
	            }

	            if (object.type === "filtericon") {
	                this.openFilterMenu(event);
	                event.preventDefault();
	                return;
	            }

	            this._selectionMode = SELECTION_MODES[object.type];
	            this.appendSelection = event.mod;
	            this.navigator.startSelection(object.ref, this._selectionMode, this.appendSelection, event.shiftKey);
	        },

	        onContextMenu: function(event) {
	            var sheet = this._workbook.activeSheet();

	            if (sheet.resizingInProgress()) {
	                return;
	            }

	            event.preventDefault();

	            this.cellContextMenu.close();
	            this.colHeaderContextMenu.close();
	            this.rowHeaderContextMenu.close();

	            var menu;

	            var object = this.objectAt(event);

	            if (object.type === "columnresizehandle" || object.type === "rowresizehandle") {
	                return;
	            }

	            this.navigator.selectForContextMenu(object.ref, SELECTION_MODES[object.type]);

	            var isComposite = this.navigator._sheet.select() instanceof kendo.spreadsheet.UnionRef;
	            var showUnhide = false;
	            var showUnmerge = false;

	            if (object.type == "columnheader") {
	                menu = this.colHeaderContextMenu;
	                showUnhide = !isComposite && this.axisManager.selectionIncludesHiddenColumns();
	            } else if (object.type == "rowheader") {
	                menu = this.rowHeaderContextMenu;
	                showUnhide = !isComposite && this.axisManager.selectionIncludesHiddenRows();
	            } else {
	                menu = this.cellContextMenu;
	                showUnmerge = this.navigator.selectionIncludesMergedCells();
	            }

	            menu.element.find(COMPOSITE_UNAVAILABLE_ACTION_SELECTORS).toggle(!isComposite);
	            menu.element.find(UNHIDE_ACTION_SELECTORS).toggle(showUnhide);
	            menu.element.find('[data-action=unmerge]').toggle(showUnmerge);

	            // avoid the immediate close
	            setTimeout(function() {
	                menu.open(event.pageX, event.pageY);
	            });
	        },

	        prevent: function(event) {
	            event.preventDefault();
	        },

	        constrainResize: function(type, ref) {
	            var sheet = this._workbook.activeSheet();
	            var resizeHandle = sheet.resizeHandlePosition();

	            return !resizeHandle || type === "outside" || type === "topcorner" || ref.col < resizeHandle.col || ref.row < resizeHandle.row;
	        },

	        onMouseDrag: function(event) {
	            if (this._selectionMode === "sheet") {
	                return;
	            }

	            var location = { clientX: event.clientX, clientY: event.clientY };
	            var object = this.objectAt(location);

	            var sheet = this._workbook.activeSheet();
	            if (sheet.resizingInProgress()) {

	                if (!this.constrainResize(object.type, object.ref)) {
	                    sheet.resizeHintPosition({ x: object.x, y: object.y });
	                }

	                return;
	            }

	            if (object.type === "outside") {
	                this.startAutoScroll(object);
	                return;
	            }

	            if (this.originFrame === object.pane) {
	                this.selectToLocation(location);
	            } else { // cross frame selection
	                var frame = this.originFrame._grid;

	                if (object.x > frame.right) {
	                    this.scrollLeft();
	                }

	                if (object.y > frame.bottom) {
	                    this.scrollTop();
	                }

	                if (object.y < frame.top || object.x < frame.left) {
	                    this.startAutoScroll(object, location);
	                } else {
	                    this.selectToLocation(location);
	                }
	            }

	            event.preventDefault();
	        },

	        onMouseUp: function(event) {
	            var sheet = this._workbook.activeSheet();
	            sheet.completeResizing();

	            this.navigator.completeSelection();
	            this.stopAutoScroll();

	            var editor = this.editor.activeEditor();
	            if (!editor) {
	                return;
	            }
	            var el = event.target;
	            while (el) {
	                if (el === editor.element[0]) {
	                    return;
	                }
	                el = el.parentNode;
	            }

	            var object = this.objectAt(event);
	            if (object && object.ref && editor.canInsertRef(false)) {
	                editor.refAtPoint(sheet);
	                sheet._setFormulaSelections(editor.highlightedRefs());
	            }
	        },

	        onDblClick: function(event) {
	            var object = this.objectAt(event);
	            var disabled = this._workbook.activeSheet().selection().enable() === false;

	            if (object.type !== "cell" || disabled) {
	                return;
	            }

	            this.editor
	                .activate({
	                    range: this._workbook.activeSheet().selection(),
	                    rect: this.view.activeCellRectangle(),
	                    tooltip: this._activeTooltip()
	                })
	                .focus();

	            this.onEditorUpdate();
	        },

	        onCut: function(e) {
	            if(e){
	                var table = this.clipboardElement.find("table.kendo-clipboard-"+ this.clipboard._uid).detach();
	                this.clipboardElement.append(table.clone(false));
	                setTimeout(function() {
	                    this.clipboardElement.empty().append(table);
	                }.bind(this));
	            }

	            this._execute({
	                command: "CutCommand",
	                options: { workbook: this.view._workbook, event: e.originalEvent || e }
	            });
	        },

	        clipBoardValue: function() {
	            return this.clipboardElement.html();
	        },

	        onPaste: function(e) {
	            var html = "";
	            var plain = "";
	            this.clipboard.menuInvoked = (e === undefined);
	            if(e) {
	                if (e.originalEvent.clipboardData && e.originalEvent.clipboardData.getData) {
	                    e.preventDefault();
	                    var hasHTML = false;
	                    var hasPlainText = false;
	                    //Firefox uses DOMStringList, needs special handling
	                    if(window.DOMStringList && e.originalEvent.clipboardData.types instanceof window.DOMStringList) {
	                        hasHTML = e.originalEvent.clipboardData.types.contains("text/html");
	                        hasPlainText = e.originalEvent.clipboardData.types.contains("text/plain");
	                    } else {
	                        hasHTML = (/text\/html/.test(e.originalEvent.clipboardData.types));
	                        hasPlainText = (/text\/plain/.test(e.originalEvent.clipboardData.types));
	                    }
	                    if (hasHTML) {
	                        html = e.originalEvent.clipboardData.getData('text/html');
	                    }
	                    if (hasPlainText) {
	                        plain = e.originalEvent.clipboardData.getData('text/plain').trim();
	                    }
	                } else {
	                    //workaround for IE's lack of access to the HTML clipboard data
	                    var table = this.clipboardElement.find("table.kendo-clipboard-"+ this.clipboard._uid).detach();
	                    this.clipboardElement.empty();
	                    setTimeout(function() {
	                        var html = this.clipboardElement.html();
	                        var plain = window.clipboardData.getData("Text").trim();
	                        if(!html && !plain) {
	                            return;
	                        }
	                        this.clipboard.external({html: html, plain: plain});
	                        this.clipboardElement.empty().append(table);
	                        this._execute({
	                            command: "PasteCommand",
	                            options: { workbook: this.view._workbook, event: e.originalEvent || e }
	                        });
	                        this.clipboard.menuInvoked = true;
	                    }.bind(this));
	                    return;
	                }
	            } else {
	                if(kendo.support.browser.msie) {
	                    this.clipboardElement.focus().select();
	                    document.execCommand('paste');
	                    return;
	                } else {
	                    this.clipboard.menuInvoked = true;
	                }
	            }

	            if(!html && !plain) {
	                return;
	            }
	            this.clipboard.external({html: html, plain:plain});
	            this._execute({
	                command: "PasteCommand",
	                options: { workbook: this.view._workbook, event: e.originalEvent || e }
	            });

	        },

	        onCopy: function(e) {
	            this.clipboard.menuInvoked = (e === undefined);
	            this._execute({
	                command: "CopyCommand",
	                options: { workbook: this.view._workbook, event: e.originalEvent || e }
	            });
	        },

	////////////////////////////////////////////////////////////////////

	        scrollTop: function() {
	            this.scroller.scrollTop = 0;
	        },

	        scrollLeft: function() {
	            this.scroller.scrollLeft = 0;
	        },

	        scrollDown: function(value) {
	            this.scroller.scrollTop += value;
	        },

	        scrollRight: function(value) {
	            this.scroller.scrollLeft += value;
	        },

	        scrollWith: function(right, down) {
	            this.scroller.scrollTop += down;
	            this.scroller.scrollLeft += right;
	        },

	        objectAt: function(location) {
	            if (!location) {
	                return;
	            }
	            var box = this.container[0].getBoundingClientRect();
	            return this.view.objectAt(location.clientX - box.left,
	                                      location.clientY - box.top);
	        },

	        selectToLocation: function(cellLocation) {
	            var object = this.objectAt(cellLocation);

	            if (object.pane) { // cell, rowheader or columnheader
	                this.extendSelection(object);
	                this.lastKnownCellLocation = cellLocation;
	                this.originFrame = object.pane;
	            }

	            this.stopAutoScroll();
	        },

	        extendSelection: function(object) {
	            this.navigator.extendSelection(object.ref, this._selectionMode, this.appendSelection);
	        },

	        autoScroll: function() {
	            var x = this._autoScrollTarget.x;
	            var y = this._autoScrollTarget.y;
	            var boundaries = this.originFrame._grid;
	            var scroller = this.view.scroller;
	            var scrollStep = 8;

	            var scrollLeft = scroller.scrollLeft;
	            var scrollTop = scroller.scrollTop;

	            if (x < boundaries.left) {
	                this.scrollRight(-scrollStep);
	            }
	            if (x > boundaries.right) {
	                this.scrollRight(scrollStep);
	            }
	            if (y < boundaries.top) {
	                this.scrollDown(-scrollStep);
	            }
	            if (y > boundaries.bottom) {
	                this.scrollDown(scrollStep);
	            }

	            if (scrollTop === scroller.scrollTop && scrollLeft === scroller.scrollLeft) {
	                this.selectToLocation(this.finalLocation);
	            } else {
	                this.extendSelection(this.objectAt(this.lastKnownCellLocation));
	            }
	        },

	        startAutoScroll: function(viewObject, location) {
	            if (!this._scrollInterval) {
	                this._scrollInterval = setInterval(this.autoScroll.bind(this), 50);
	            }

	            this.finalLocation = location || this.lastKnownCellLocation;

	            this._autoScrollTarget = viewObject;
	        },

	        stopAutoScroll: function() {
	            clearInterval(this._scrollInterval);
	            this._scrollInterval = null;
	        },

	        openCustomEditor: function() {
	            this.view.openCustomEditor();
	        },

	        openFilterMenu: function(event) {
	            var object = this.objectAt(event);
	            var sheet = this._workbook.activeSheet();
	            var column = sheet.filterColumn(object.ref);
	            var filterMenu = this.view.createFilterMenu(column);

	            filterMenu.bind("action", this.onCommandRequest.bind(this));
	            filterMenu.bind("action", filterMenu.close.bind(filterMenu));

	            filterMenu.openFor(event.target);
	        },

	////////////////////////////////////////////////////////////////////

	        onEditorChange: function(e) {
	            var sheet = e.range._sheet;
	            if (this._workbook.activeSheet() !== sheet) {
	                // remove highlighted refs (XXX: which are mostly wrong, BTW)
	                this._workbook.activeSheet()._setFormulaSelections();
	                // go back to the original sheet
	                this._workbook.activeSheet(sheet);
	            }
	            sheet.isInEditMode(false);
	            this._lastEditorValue = e.value;
	            this._execute({
	                command: "EditCommand",
	                options: {
	                    editActiveCell: true,
	                    value: e.value
	                }
	            });
	        },

	        onEditorActivate: function() {
	            var workbook = this._workbook;
	            var sheet = workbook.activeSheet();

	            sheet._setFormulaSelections(this.editor.highlightedRefs());
	            sheet.isInEditMode(true);
	        },

	        onEditorDeactivate: function() {
	            var sheet = this._workbook.activeSheet();

	            sheet.isInEditMode(false);
	            sheet._setFormulaSelections([]);
	        },

	        onEditorUpdate: function() {
	            this._workbook.activeSheet()._setFormulaSelections(this.editor.highlightedRefs());
	        },

	        onEditorBarFocus: function() {
	            var disabled = this._workbook.activeSheet().selection().enable() === false;
	            if (disabled) {
	                return;
	            }
	            this.editor
	                .activate({
	                    range: this._workbook.activeSheet().selection(),
	                    rect: this.view.activeCellRectangle(),
	                    tooltip: this._activeTooltip()
	                });
	        },

	        onEditorCellFocus: function() {
	            this.editor.scale();
	        },

	        onEditorEsc: function() {
	            this.resetEditorValue();
	            this.editor.deactivate();

	            this.clipboardElement.focus();
	        },

	        insertNewline: function(e) {
	            e.preventDefault();
	            this.editor.insertNewline();
	        },

	        onEditorBlur: function(_, action) {
	            if (this.editor.isFiltered()) {
	                return;
	            }

	            this._preventNavigation = false;
	            this.editor.deactivate();

	            if (!this._preventNavigation) {
	                this.clipboardElement.focus();
	                this.navigator.navigateInSelection(ENTRY_ACTIONS[action]);
	            }
	        },

	        onEditorAction: function(event, action) {
	            var editor = this.editor;
	            var sheet = this._workbook.activeSheet();

	            if (editor.canInsertRef(true)) {
	                this.navigator.moveActiveCell(ACTIONS[action]);

	                editor.activeEditor().refAtPoint(sheet);
	                sheet._setFormulaSelections(editor.highlightedRefs());

	                event.preventDefault();
	            }
	        },

	        onEditorShiftAction: function(event, action) {
	            var editor = this.editor;
	            var sheet = this._workbook.activeSheet();

	            if (editor.canInsertRef(true)) {
	                this.navigator.modifySelection(ACTIONS[action.replace("shift+", "")], this.appendSelection);

	                editor.activeEditor().refAtPoint(sheet);
	                sheet._setFormulaSelections(editor.highlightedRefs());

	                event.preventDefault();
	            }
	        },

	////////////////////////////////////////////////////////////////////
	        resetEditorValue: function() {
	            this.editor.value(this._workbook._inputForRef(this._workbook.activeSheet()._viewActiveCell()));
	        },

	        activateEditor: function() {
	            this.editor.activate({
	                range: this._workbook.activeSheet().selection(),
	                rect: this.view.activeCellRectangle(),
	                tooltip: this._activeTooltip()
	            }).focus();
	        },

	        deactivateEditor: function() {
	            this.view.editor.deactivate();
	        },

	        onCommandRequest: function(e) {
	            if (e.command) {
	                this._execute(e);
	            } else {
	                this._workbook.undoRedoStack[e.action]();
	            }
	        },

	        onDialogRequest: function(e) {
	            var additionalOptions = {
	                pdfExport: this._workbook.options.pdf,
	                excelExport: this._workbook.options.excel
	            };

	            if (e.options) {
	                $.extend(true, e.options, additionalOptions);
	            } else {
	                e.options = additionalOptions;
	            }

	            this.view.openDialog(e.name, e.options);
	        },

	        onNameEditorEnter: function() {
	            var ref;
	            var workbook = this._workbook;
	            var sheet = workbook.activeSheet();
	            var name = this.view.nameEditor.value();

	            // 1. does it look like a reference, or already defined
	            // name?  If so, just select it (don't define/modify any
	            // names)
	            ref = kendo.spreadsheet.calc.parseReference(name, true) || workbook.nameValue(name);
	            if (ref instanceof kendo.spreadsheet.Ref) {
	                if (ref.sheet && ref.sheet.toLowerCase() != sheet.name().toLowerCase()) {
	                    // reference points to another sheet, select it if found
	                    var tmp = workbook.sheetByName(ref.sheet);
	                    if (tmp) {
	                        workbook.activeSheet(tmp);
	                        sheet = tmp;
	                    }
	                }
	                sheet.range(ref).select();
	                return;
	            }

	            ref = sheet.selection()._ref.clone().simplify().setSheet(sheet.name(), true);

	            // XXX: should we check if a name is already defined for this range, and update it instead?
	            // Excel just adds a new one, and provides a more complete Name Manager dialog.
	            //var def = workbook.nameForRef(ref, sheet.name());

	            // just define new name
	            this._execute({
	                command: "DefineNameCommand",
	                options: { name: name, value: ref }
	            });

	            this.clipboardElement.focus();
	        },
	        onNameEditorCancel: function() {
	            this.clipboardElement.focus();
	        },
	        onNameEditorSelect: function(ev) {
	            var name = ev.name;
	            var workbook = this._workbook;
	            var sheet = workbook.activeSheet();
	            var ref = workbook.nameValue(name);
	            if (ref instanceof kendo.spreadsheet.Ref) {
	                if (ref.sheet && ref.sheet.toLowerCase() != sheet.name().toLowerCase()) {
	                    // reference points to another sheet, select it if found
	                    var tmp = workbook.sheetByName(ref.sheet);
	                    if (tmp) {
	                        workbook.activeSheet(tmp);
	                        sheet = tmp;
	                    }
	                }
	                sheet.range(ref).select();
	                return;
	            }
	            this.clipboardElement.focus();
	        },
	        onNameEditorDelete: function(ev) {
	            this._execute({
	                command: "DeleteNameCommand",
	                options: { name: ev.name }
	            });
	            this.clipboardElement.focus();
	        }
	    });

	    kendo.spreadsheet.Controller = Controller;
	})(window.kendo);

	}, __webpack_require__(3));


/***/ })

/******/ });