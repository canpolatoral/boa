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

	__webpack_require__(968);
	module.exports = __webpack_require__(968);


/***/ }),

/***/ 3:
/***/ (function(module, exports) {

	module.exports = function() { throw new Error("define cannot be used indirect"); };


/***/ }),

/***/ 968:
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function(f, define){
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__(969) ], __WEBPACK_AMD_DEFINE_FACTORY__ = (f), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	})(function(){

	(function($) {

	    // Imports ================================================================
	    var kendo = window.kendo,
	        Class = kendo.Class,
	        editorNS = kendo.ui.editor,
	        EditorUtils = editorNS.EditorUtils,
	        RangeUtils = editorNS.RangeUtils,
	        registerTool = EditorUtils.registerTool,
	        dom = editorNS.Dom,
	        Tool = editorNS.Tool,
	        ToolTemplate = editorNS.ToolTemplate,
	        RestorePoint = editorNS.RestorePoint,
	        Marker = editorNS.Marker,
	        browser = kendo.support.browser,
	        br = '<br class="k-br">',
	        extend = $.extend;
	    var nodeTypes = dom.nodeTypes;
	    var PREVIOUS_SIBLING = "previousSibling";

	function finishUpdate(editor, startRestorePoint) {
	    var endRestorePoint = editor.selectionRestorePoint = new RestorePoint(editor.getRange(), editor.body);
	    var command = new GenericCommand(startRestorePoint, endRestorePoint);
	    command.editor = editor;

	    editor.undoRedoStack.push(command);

	    return endRestorePoint;
	}

	function selected(node, range) {
	    return range.startContainer === node && range.endContainer === node &&
	        range.startOffset === 0 && range.endOffset == node.childNodes.length;
	}

	function getSibling(node, direction, condition) {
	    var sibling = node ? node[direction] : null;

	    while (sibling && !condition(sibling)) {
	        sibling = sibling[direction];
	    }

	    return sibling;
	}

	var Command = Class.extend({
	    init: function(options) {
	        this.options = options;
	        this.restorePoint = new RestorePoint(options.range, options.body, {immutables: options.immutables});
	        this.marker = new Marker();
	        this.formatter = options.formatter;
	    },

	    getRange: function () {
	        return this.restorePoint.toRange();
	    },

	    lockRange: function (expand) {
	        return this.marker.add(this.getRange(), expand);
	    },

	    releaseRange: function (range) {
	        this.marker.remove(range);
	        this.editor.selectRange(range);
	    },

	    undo: function () {
	        var point = this.restorePoint;
	        point.restoreHtml();
	        this.editor.selectRange(point.toRange());
	    },

	    redo: function () {
	        this.exec();
	    },

	    createDialog: function (content, options) {
	        var editor = this.editor;

	        return $(content).appendTo(document.body)
	            .kendoWindow(extend({}, editor.options.dialogOptions, options))
	            .closest(".k-window").toggleClass("k-rtl", kendo.support.isRtl(editor.wrapper)).end();
	    },

	    exec: function () {
	        var range = this.lockRange(true);
	        this.formatter.editor = this.editor;
	        this.formatter.toggle(range);
	        this.releaseRange(range);
	    },

	    immutables: function(){
	        return this.editor && this.editor.options.immutables;
	    },

	    expandImmutablesIn: function(range) {
	        if (this.immutables()) {
	            kendo.ui.editor.Immutables.expandImmutablesIn(range);
	            this.restorePoint = new RestorePoint(range, this.editor.body);
	        }
	    }
	});

	var GenericCommand = Class.extend({
	    init: function(startRestorePoint, endRestorePoint) {
	        this.body = startRestorePoint.body;
	        this.startRestorePoint = startRestorePoint;
	        this.endRestorePoint = endRestorePoint;
	    },

	    redo: function () {
	        dom.removeChildren(this.body);

	        this.body.innerHTML = this.endRestorePoint.html;
	        this.editor.selectRange(this.endRestorePoint.toRange());
	    },

	    undo: function () {
	        dom.removeChildren(this.body);

	        this.body.innerHTML = this.startRestorePoint.html;
	        this.editor.selectRange(this.startRestorePoint.toRange());
	    }
	});

	var InsertHtmlCommand = Command.extend({
	    init: function(options) {
	        Command.fn.init.call(this, options);

	        this.managesUndoRedo = true;
	    },

	    exec: function() {
	        var editor = this.editor;
	        var options = this.options;
	        var range = options.range;
	        var body = editor.body;
	        var startRestorePoint = new RestorePoint(range, body);
	        var html = options.html || options.value || '';

	        editor.selectRange(range);

	        editor.clipboard.paste(html, options);

	        if (options.postProcess) {
	            options.postProcess(editor, editor.getRange());
	        }

	        var genericCommand = new GenericCommand(startRestorePoint, new RestorePoint(editor.getRange(), body));
	        genericCommand.editor = editor;
	        editor.undoRedoStack.push(genericCommand);

	        editor.focus();
	    }
	});

	var InsertHtmlTool = Tool.extend({
	    initialize: function(ui, initOptions) {
	        var editor = initOptions.editor,
	            options = this.options,
	            dataSource = options.items ? options.items : editor.options.insertHtml;

	        this._selectBox = new editorNS.SelectBox(ui, {
	            dataSource: dataSource,
	            dataTextField: "text",
	            dataValueField: "value",
	            change: function () {
	                Tool.exec(editor, 'insertHtml', this.value());
	            },
	            title: editor.options.messages.insertHtml,
	            highlightFirst: false
	        });
	    },

	    command: function (commandArguments) {
	        return new InsertHtmlCommand(commandArguments);
	    },

	    update: function(ui) {
	        var selectbox = ui.data("kendoSelectBox") || ui.find("select").data("kendoSelectBox");
	        selectbox.close();
	        selectbox.value(selectbox.options.title);
	    }
	});

	var tableCells = "td,th,caption";
	var tableCellsWrappers = "table,tbody,thead,tfoot,tr";
	var tableElements = tableCellsWrappers + "," + tableCells;
	var inTable = function (range) { return !range.collapsed && $(range.commonAncestorContainer).is(tableCellsWrappers); };
	var RemoveTableContent = Class.extend({
	    remove: function(range) {
	        var that = this;
	        var marker = new Marker();
	        marker.add(range, false);

	        var nodes = RangeUtils.getAll(range, function (node) { return $(node).is(tableElements); });
	        var doc = RangeUtils.documentFromRange(range);
	        var start = marker.start;
	        var end = marker.end;
	        var cellsTypes = tableCells.split(",");
	        var startCell = dom.parentOfType(start, cellsTypes);
	        var endCell = dom.parentOfType(end, cellsTypes);
	        that._removeContent(start, startCell, true);
	        that._removeContent(end, endCell, false);
	        $(nodes).each(function(i, node) {
	            node = $(node);
	            (node.is(tableCells) ? node : node.find(tableCells)).each(function(j, cell) {
	                cell.innerHTML = "&#65279;";
	            });
	        });
	        if (startCell && !start.previousSibling) {
	            dom.insertBefore(doc.createTextNode("\ufeff"), start);
	        }
	        if (endCell && !end.nextSibling) {
	            dom.insertAfter(doc.createTextNode("\ufeff"), end);
	        }
	        if (startCell) {
	            range.setStartBefore(start);
	        } else if (nodes[0]) {
	            startCell = $(nodes[0]);
	            startCell = startCell.is(tableCells) ? startCell : startCell.find(tableCells).first();
	            if (startCell.length) {
	                range.setStart(startCell.get(0), 0);
	            }
	        }

	        range.collapse(true);

	        dom.remove(start);
	        dom.remove(end);
	    },
	    _removeContent: function (start, top, forwards) {
	        if (top) {
	            var sibling = forwards ? "nextSibling" : "previousSibling",
	                next,
	                getNext = function (node) {
	                    while (node && !node[sibling]) {
	                        node = node.parentNode;
	                    }
	                    return node && $.contains(top, node) ? node[sibling] : null;
	                };
	            start = getNext(start);
	            while (start) {
	                next = getNext(start);
	                dom.remove(start);
	                start = next;
	            }
	        }
	    }
	});

	var TypingHandler = Class.extend({
	    init: function(editor) {
	        this.editor = editor;
	    },

	    keydown: function (e) {
	        var that = this,
	            editor = that.editor,
	            keyboard = editor.keyboard,
	            isTypingKey = keyboard.isTypingKey(e),
	            evt = extend($.Event(), e);

	        that.editor.trigger("keydown", evt);

	        if (evt.isDefaultPrevented()) {
	            e.preventDefault();
	            return true;
	        }

	        if (!evt.isDefaultPrevented() && isTypingKey && !keyboard.isTypingInProgress()) {
	            var range = editor.getRange();
	            var body = editor.body;
	            that.startRestorePoint = new RestorePoint(range, body);

	            if (inTable(range)) {
	                var removeTableContent = new RemoveTableContent(editor);
	                removeTableContent.remove(range);
	                editor.selectRange(range);
	            }

	            if (browser.webkit && !range.collapsed && selected(body, range)) {
	                body.innerHTML = "";
	            }

	            if (editor.immutables && editorNS.Immutables.immutablesContext(range)) {
	                var backspaceHandler = new editorNS.BackspaceHandler(editor);
	                backspaceHandler.deleteSelection(range);
	            }

	            keyboard.startTyping(function () {
	                that.endRestorePoint = finishUpdate(editor, that.startRestorePoint);
	            });

	            return true;
	        }

	        return false;
	    },

	    keyup: function (e) {
	        var keyboard = this.editor.keyboard;

	        this.editor.trigger("keyup", e);

	        if (keyboard.isTypingInProgress()) {
	            keyboard.endTyping();
	            return true;
	        }

	        return false;
	    }
	});

	var BackspaceHandler = Class.extend({
	    init: function(editor) {
	        this.editor = editor;
	    },
	    _addCaret: function(container) {
	        var caret = dom.create(this.editor.document, "a");
	        dom.insertAt(container, caret, 0);
	        dom.stripBomNode(caret.previousSibling);
	        dom.stripBomNode(caret.nextSibling);
	        return caret;
	    },
	    _restoreCaret: function(caret) {
	        var range = this.editor.createRange();

	        if (!caret.nextSibling && dom.isDataNode(caret.previousSibling)) {
	            range.setStart(caret.previousSibling, caret.previousSibling.length);
	        } else {
	            range.setStartAfter(caret);
	        }

	        range.collapse(true);
	        this.editor.selectRange(range);
	        dom.remove(caret);
	    },
	    _handleDelete: function(range) {
	        var node = range.endContainer;
	        var block = dom.closestEditableOfType(node, dom.blockElements);

	        if (block && editorNS.RangeUtils.isEndOf(range, block)) {
	            // join with next sibling
	            var next = dom.next(block);
	            if (!next || dom.name(next) != "p") {
	                return false;
	            }

	            var caret = this._addCaret(next);

	            this._merge(block, next);

	            this._restoreCaret(caret);

	            return true;
	        }

	        return false;
	    },
	    _cleanBomBefore: function(range) {
	        var offset = range.startOffset;
	        var node = range.startContainer;
	        var text = node.nodeValue;
	        var count = 0;
	        while (offset-count >= 0 && text[offset-count-1] == "\ufeff") {
	            count++;
	        }

	        if (count > 0) {
	            node.deleteData(offset-count, count);

	            range.setStart(node, Math.max(0, offset-count));
	            range.collapse(true);

	            this.editor.selectRange(range);
	        }
	    },
	    _handleBackspace: function(range) {
	        var node = range.startContainer;
	        var li = dom.closestEditableOfType(node, ['li']);
	        var block = dom.closestEditableOfType(node, 'p,h1,h2,h3,h4,h5,h6'.split(','));
	        var editor = this.editor;
	        var previousSibling;

	        if (dom.isDataNode(node)) {
	            if (range.collapsed && /^\s[\ufeff]+$/.test(node.nodeValue)) {
	                range.setStart(node, 0);
	                range.setEnd(node, node.length);
	                editor.selectRange(range);
	                return false;
	            }
	            this._cleanBomBefore(range);
	        }

	        previousSibling = getSibling(block, PREVIOUS_SIBLING, function(sibling) {
	            return !dom.htmlIndentSpace(sibling);
	        });

	        //deleting the first list item with empty content in IE results in invalid range
	        if (range.collapsed && range.startOffset !== range.endOffset && range.startOffset < 0) {
	            range.startOffset = 0;
	            range.endOffset = 0;
	            editor.selectRange(range);
	        }

	        var startAtLi = li && editorNS.RangeUtils.isStartOf(range, li);
	        var liIndex = li && $(li).index();
	        var startAtNonFirstLi = startAtLi && liIndex > 0;
	        if (startAtNonFirstLi) {
	            block = li;
	            previousSibling = dom.prev(li);
	        }

	        // unwrap block
	        if ((block && previousSibling && editorNS.RangeUtils.isStartOf(range, block)) || startAtNonFirstLi) {
	            var caret = this._addCaret(block);
	            this._merge(previousSibling, block);
	            this._restoreCaret(caret);

	            return true;
	        }

	        // unwrap li element
	        if (startAtLi && liIndex === 0) {
	            var child = li.firstChild;
	            if (!child) {
	                li.innerHTML = editorNS.emptyElementContent;
	                child = li.firstChild;
	            }

	            var formatter = new editorNS.ListFormatter(dom.name(li.parentNode), "p");
	            range.selectNodeContents(li);
	            formatter.toggle(range);

	            if (dom.insignificant(child)) {
	                range.setStartBefore(child);
	            } else {
	                range.setStart(child, 0);
	            }

	            editor.selectRange(range);

	            return true;
	        }

	        var rangeStartNode = node.childNodes[range.startOffset - 1];
	        var linkRange = range;
	        var anchor = rangeStartNode && dom.closestEditableOfType(rangeStartNode, ['a']);
	        var previousNode = getSibling(rangeStartNode || node, PREVIOUS_SIBLING, function(sibling) {
	            return !dom.isDataNode(sibling) || (!dom.isBom(sibling) && sibling.length > 0);
	        });
	        if (anchor || ((range.startOffset === 0 || rangeStartNode) && dom.is(previousNode, "a"))) {
	            anchor = anchor || previousNode;
	            linkRange = editor.createRange();
	            linkRange.setStart(anchor, anchor.childNodes.length);
	            linkRange.collapse(true);
	        }

	        anchor = anchor || dom.closestEditableOfType(rangeStartNode || linkRange.startContainer, ['a']);
	        var isEndOfLink = anchor && editorNS.RangeUtils.isEndOf(linkRange, anchor);
	        if (isEndOfLink) {
	            var command = new editorNS.UnlinkCommand({ range: linkRange, body: editor.body, immutables: !!editor.immutables });
	            editor.execCommand(command);
	            editor._selectionChange();
	        }
	        return false;
	    },
	    _handleSelection: function(range) {
	        var ancestor = range.commonAncestorContainer;
	        var table = dom.closest(ancestor, "table");
	        var emptyParagraphContent = editorNS.emptyElementContent;
	        var editor = this.editor;

	        if (inTable(range)) {
	            var removeTableContent = new RemoveTableContent(editor);
	            removeTableContent.remove(range);
	            editor.selectRange(range);
	            return true;
	        }

	        var marker = new Marker();
	        marker.add(range, false);

	        if (editor.immutables) {
	            this._handleImmutables(marker);
	        }

	        this._surroundFullySelectedAnchor(marker, range);

	        range.setStartAfter(marker.start);
	        range.setEndBefore(marker.end);

	        var start = range.startContainer;
	        var end = range.endContainer;

	        range.deleteContents();

	        if (table && $(table).text() === "") {
	            range.selectNode(table);
	            range.deleteContents();
	        }

	        ancestor = range.commonAncestorContainer;

	        if (dom.name(ancestor) === "p" && ancestor.innerHTML === "") {
	            ancestor.innerHTML = emptyParagraphContent;
	            range.setStart(ancestor, 0);
	        }

	        this._join(start, end);

	        dom.insertAfter(editor.document.createTextNode("\ufeff"), marker.start);
	        marker.remove(range);

	        start = range.startContainer;
	        if (dom.name(start) == "tr") {
	            start = start.childNodes[Math.max(0, range.startOffset-1)];
	            range.setStart(start, dom.getNodeLength(start));
	        }

	        range.collapse(true);

	        editor.selectRange(range);

	        return true;
	    },
	    _handleImmutables: function (marker) {
	        var immutableParent = editorNS.Immutables.immutableParent;
	        var startImmutable = immutableParent(marker.start);
	        var endImmutable = immutableParent(marker.start);
	        if (startImmutable) {
	            dom.insertBefore(marker.start, startImmutable);
	        }
	        if (endImmutable) {
	            dom.insertAfter(marker.end, endImmutable);
	        }
	        if (startImmutable) {
	            dom.remove(startImmutable);
	        }
	        if (endImmutable && endImmutable.parentNode) {
	            dom.remove(endImmutable);
	        }
	    },
	    _surroundFullySelectedAnchor: function(marker, range) {
	        var start = marker.start,
	            startParent = $(start).closest("a").get(0),
	            end = marker.end,
	            endParent = $(end).closest("a").get(0);

	        if(startParent && RangeUtils.isStartOf(range, startParent)){
	            dom.insertBefore(start, startParent);
	        }

	        if(endParent && RangeUtils.isEndOf(range, endParent)){
	            dom.insertAfter(end, endParent);
	        }
	    },
	    _root: function(node) {
	        while (node && node.parentNode && dom.name(node.parentNode) != "body") {
	            node = node.parentNode;
	        }

	        return node;
	    },
	    _join: function(start, end) {
	        start = this._root(start);
	        end = this._root(end);

	        if (start != end && dom.is(end, "p")) {
	            this._merge(start, end);
	        }
	    },
	    _merge: function(dest, src) {
	        dom.removeTrailingBreak(dest);

	        while (dest && src.firstChild) {
	            if (dest.nodeType == 1) {
	                dest = dom.list(dest) ? dest.children[dest.children.length - 1] : dest;

	                if (dest) {
	                    dest.appendChild(src.firstChild);
	                }
	            } else if (dest.nodeType === nodeTypes.TEXT_NODE) {
	                this._mergeWithTextNode(dest, src.firstChild);
	            } else {
	                dest.parentNode.appendChild(src.firstChild);
	            }
	        }

	        dom.remove(src);
	    },

	    _mergeWithTextNode: function(textNode, appendedNode) {
	        if (textNode && textNode.nodeType === nodeTypes.TEXT_NODE) {
	            if (textNode.nextSibling && this._isCaret(textNode.nextSibling)) {
	                dom.insertAfter(appendedNode, textNode.nextSibling);
	            }
	            else {
	                dom.insertAfter(appendedNode, textNode);
	            }
	        }
	    },

	    _isCaret: function(element) {
	        return $(element).is("a");
	    },

	    keydown: function(e) {
	        var method, startRestorePoint;
	        var editor = this.editor;
	        var range = editor.getRange();
	        var keyCode = e.keyCode;
	        var keys = kendo.keys;
	        var backspace = keyCode === keys.BACKSPACE;
	        var del = keyCode == keys.DELETE;

	        if (editor.immutables && editor.immutables.keydown(e, range)) {
	            return;
	        }

	        if ((backspace || del) && !range.collapsed) {
	            method = "_handleSelection";
	        } else if (backspace) {
	            method = "_handleBackspace";
	        } else if (del) {
	            method = "_handleDelete";
	        }

	        if (!method) {
	            return;
	        }

	        startRestorePoint = new RestorePoint(range, editor.body);

	        if (this[method](range)) {
	            e.preventDefault();

	            finishUpdate(editor, startRestorePoint);
	        }
	    },
	    deleteSelection: function (range) {
	        this._handleSelection(range);
	    },
	    keyup: $.noop
	});

	var SystemHandler = Class.extend({
	    init: function(editor) {
	        this.editor = editor;
	        this.systemCommandIsInProgress = false;
	    },

	    createUndoCommand: function () {
	        this.startRestorePoint = this.endRestorePoint = finishUpdate(this.editor, this.startRestorePoint);
	    },

	    changed: function () {
	        if (this.startRestorePoint) {
	            return this.startRestorePoint.html != this.editor.body.innerHTML;
	        }

	        return false;
	    },

	    keydown: function (e) {
	        var that = this,
	            editor = that.editor,
	            keyboard = editor.keyboard;

	        if (keyboard.isModifierKey(e)) {

	            if (keyboard.isTypingInProgress()) {
	                keyboard.endTyping(true);
	            }

	            that.startRestorePoint = new RestorePoint(editor.getRange(), editor.body);
	            return true;
	        }

	        if (keyboard.isSystem(e)) {
	            that.systemCommandIsInProgress = true;

	            if (that.changed()) {
	                that.systemCommandIsInProgress = false;
	                that.createUndoCommand();
	            }

	            return true;
	        }

	        return false;
	    },

	    keyup: function () {
	        var that = this;

	        if (that.systemCommandIsInProgress && that.changed()) {
	            that.systemCommandIsInProgress = false;
	            that.createUndoCommand();
	            return true;
	        }

	        return false;
	    }
	});

	var SelectAllHandler = Class.extend({
	    init: function(editor) {
	        this.editor = editor;
	    },

	    keydown: function (e) {
	        if (!browser.webkit || e.isDefaultPrevented() ||
	            !(e.ctrlKey && e.keyCode == 65 && !e.altKey && !e.shiftKey)) {
	            return;
	        }
	        if (this.editor.options.immutables) {
	            this._toSelectableImmutables();
	        }
	        this._selectEditorBody();
	    },

	    _selectEditorBody: function() {
	        var editor = this.editor;
	        var range = editor.getRange();
	        range.selectNodeContents(editor.body);
	        editor.selectRange(range);
	    },

	    _toSelectableImmutables: function() {
	        var editor = this.editor,
	            body = editor.body,
	            immutable = editorNS.Immutables.immutable,
	            emptyTextNode = dom.emptyTextNode,
	            first = body.firstChild,
	            last = body.lastChild;

	        while (emptyTextNode(first)){
	            first = first.nextSibling;
	        }

	        while (emptyTextNode(last)){
	            last = last.previousSibling;
	        }

	        if (first && immutable(first)) {
	            $(br).prependTo(body);
	        }

	        if (last && immutable(last)) {
	            $(br).appendTo(body);
	        }
	    },

	    keyup: $.noop
	});

	var Keyboard = Class.extend({
	    init: function(handlers) {
	        this.handlers = handlers;
	        this.typingInProgress = false;
	    },

	    isCharacter: function(keyCode) {
	        return (keyCode >= 48 && keyCode <= 90) || (keyCode >= 96 && keyCode <= 111) ||
	               (keyCode >= 186 && keyCode <= 192) || (keyCode >= 219 && keyCode <= 222) ||
	               keyCode == 229;
	    },

	    toolFromShortcut: function (tools, e) {
	        var key = String.fromCharCode(e.keyCode),
	            toolName,
	            toolOptions,
	            modifier = this._getShortcutModifier(e, navigator.platform);

	        for (toolName in tools) {
	            toolOptions = $.extend({ ctrl: false, alt: false, shift: false }, tools[toolName].options);

	            if ((toolOptions.key == key || toolOptions.key == e.keyCode) &&
	                toolOptions.ctrl == modifier &&
	                toolOptions.alt == e.altKey &&
	                toolOptions.shift == e.shiftKey) {
	                return toolName;
	            }
	        }
	    },

	    _getShortcutModifier: function (e, platform) {
	        var mac = platform.toUpperCase().indexOf('MAC') >= 0;
	        return mac ? e.metaKey : e.ctrlKey;
	    },

	    toolsFromShortcut: function (tools, e) {
	        var key = String.fromCharCode(e.keyCode),
	            toolName,
	            o,
	            matchesKey,
	            found = [];
	        var matchKey = function (toolKey) { return toolKey == key || toolKey == e.keyCode || toolKey == e.charCode; };

	        for (toolName in tools) {
	            o = $.extend({ ctrl: false, alt: false, shift: false }, tools[toolName].options);

	            matchesKey = $.isArray(o.key) ? $.grep(o.key, matchKey).length > 0 : matchKey(o.key);
	            if (matchesKey &&
	                o.ctrl == e.ctrlKey &&
	                o.alt == e.altKey &&
	                o.shift == e.shiftKey) {
	                found.push(tools[toolName]);
	            }
	        }

	        return found;
	    },

	    isTypingKey: function (e) {
	        var keyCode = e.keyCode;
	        return (this.isCharacter(keyCode) && !e.ctrlKey && !e.altKey) ||
	               keyCode == 32 || keyCode == 13 || keyCode == 8 ||
	               (keyCode == 46 && !e.shiftKey && !e.ctrlKey && !e.altKey);
	    },

	    isModifierKey: function (e) {
	        var keyCode = e.keyCode;
	        return (keyCode == 17 && !e.shiftKey && !e.altKey) ||
	               (keyCode == 16 && !e.ctrlKey && !e.altKey) ||
	               (keyCode == 18 && !e.ctrlKey && !e.shiftKey);
	    },

	    isSystem: function (e) {
	        return e.keyCode == 46 && e.ctrlKey && !e.altKey && !e.shiftKey;
	    },

	    startTyping: function (callback) {
	        this.onEndTyping = callback;
	        this.typingInProgress = true;
	    },

	    stopTyping: function() {
	        if (this.typingInProgress && this.onEndTyping) {
	            this.onEndTyping();
	        }
	        this.typingInProgress = false;
	    },

	    endTyping: function (force) {
	        var that = this;
	        that.clearTimeout();
	        if (force) {
	            that.stopTyping();
	        } else {
	            that.timeout = window.setTimeout($.proxy(that.stopTyping, that), 1000);
	        }
	    },

	    isTypingInProgress: function () {
	        return this.typingInProgress;
	    },

	    clearTimeout: function () {
	        window.clearTimeout(this.timeout);
	    },

	    notify: function(e, what) {
	        var i, handlers = this.handlers;

	        for (i = 0; i < handlers.length; i++) {
	            if (handlers[i][what](e)) {
	                break;
	            }
	        }
	    },

	    keydown: function (e) {
	        this.notify(e, 'keydown');
	    },

	    keyup: function (e) {
	        this.notify(e, 'keyup');
	    }
	});

	var Clipboard = Class.extend({
	    init: function(editor) {
	        this.editor = editor;
	        var pasteCleanup = editor.options.pasteCleanup;
	        this.cleaners = [
	            new ScriptCleaner(pasteCleanup),
	            new TabCleaner(pasteCleanup),
	            new MSWordFormatCleaner(pasteCleanup),
	            new WebkitFormatCleaner(pasteCleanup),
	            new HtmlTagsCleaner(pasteCleanup),
	            new HtmlAttrCleaner(pasteCleanup),
	            new HtmlContentCleaner(pasteCleanup),
	            new CustomCleaner(pasteCleanup) //always keep at end
	        ];
	    },

	    htmlToFragment: function(html) {
	        var editor = this.editor,
	            doc = editor.document,
	            container = dom.create(doc, 'div'),
	            fragment = doc.createDocumentFragment();

	        container.innerHTML = html;

	        while (container.firstChild) {
	            fragment.appendChild(container.firstChild);
	        }

	        return fragment;
	    },

	    isBlock: function(html) {
	        return (/<(div|p|ul|ol|table|h[1-6])/i).test(html);
	    },

	    _startModification: function() {
	        var range;
	        var restorePoint;
	        var editor = this.editor;

	        if (this._inProgress) {
	            return;
	        }

	        this._inProgress = true;

	        range = editor.getRange();
	        restorePoint = new RestorePoint(range, editor.body);

	        dom.persistScrollTop(editor.document);

	        return { range: range, restorePoint: restorePoint };
	    },

	    _endModification: function(modificationInfo) {
	        finishUpdate(this.editor, modificationInfo.restorePoint);

	        this.editor._selectionChange();

	        this._inProgress = false;
	    },

	    _contentModification: function(before, after) {
	        var that = this;
	        var editor = that.editor;
	        var modificationInfo = that._startModification();

	        if (!modificationInfo) {
	            return;
	        }

	        before.call(that, editor, modificationInfo.range);

	        setTimeout(function() {
	            after.call(that, editor, modificationInfo.range);

	            that._endModification(modificationInfo);
	        });
	    },

	    _removeBomNodes: function(range) {
	        var nodes = editorNS.RangeUtils.textNodes(range);

	        for (var i = 0; i < nodes.length; i++) {
	            nodes[i].nodeValue = dom.stripBom(nodes[i].nodeValue);
	        }
	    },

	    _onBeforeCopy: function(range) {
	        var marker = new Marker();
	        marker.add(range);

	        this._removeBomNodes(range);

	        marker.remove(range);

	        this.editor.selectRange(range);
	    },

	    oncopy: function() {
	        this._onBeforeCopy(this.editor.getRange());
	    },

	    oncut: function() {
	        this._onBeforeCopy(this.editor.getRange());
	        this._contentModification($.noop, $.noop);
	    },

	    _fileToDataURL: function(blob) {
	        var deferred = $.Deferred();

	        var reader = new FileReader();

	        if (!(blob instanceof window.File) && blob.getAsFile) {
	            blob = blob.getAsFile();
	        }

	        reader.onload = $.proxy(deferred.resolve, deferred);

	        reader.readAsDataURL(blob);

	        return deferred.promise();
	    },

	    _triggerPaste: function(html, options) {
	        var args = { html: html || "" };

	        args.html = args.html.replace(/\ufeff/g, "");

	        this.editor.trigger("paste", args);

	        this.paste(args.html, options || {});
	    },

	    _handleImagePaste: function(e) {
	        if (!('FileReader' in window) || (browser.msie && browser.version > 10)) {
	            return;
	        }

	        var clipboardData = e.clipboardData || e.originalEvent.clipboardData ||
	                    window.clipboardData || {};

	        var items = clipboardData.items || clipboardData.files;

	        return this._insertImages(items);
	    },

	    _insertImages: function(items){
	        if (!items) {
	            return;
	        }

	        var images = $.grep(items, function(item) { return (/^image\//i).test(item.type); });
	        var html = $.grep(items, function(item) { return (/^text\/html/i).test(item.type); });

	        if (html.length || !images.length) {
	            return;
	        }

	        var modificationInfo = this._startModification();

	        if (!modificationInfo) {
	            return;
	        }

	        $.when.apply($, $.map(images, this._fileToDataURL))
	            .done($.proxy(function() {
	                var results = Array.prototype.slice.call(arguments);
	                var html = $.map(results, function(e) {
	                    return '<img src="' + e.target.result + '" />';
	                }).join("");

	                this._triggerPaste(html);

	                this._endModification(modificationInfo);
	            }, this));

	        return true;
	    },

	    onpaste: function(e) {
	        if (this._handleImagePaste(e)) {
	            e.preventDefault();
	            return;
	        }

	        this.expandImmutablesIn();

	        this._contentModification(
	            function beforePaste(editor, range) {
	                var clipboardNode = dom.create(editor.document, 'div', {
	                        className:'k-paste-container',
	                        innerHTML: "\ufeff"
	                    });
	                var browser = kendo.support.browser;
	                var body = editor.body;

	                this._decoreateClipboardNode(clipboardNode, body);

	                body.appendChild(clipboardNode);

	                //Browser scrolls to clipboardNode
	                if (browser.webkit) {
	                    this._moveToCaretPosition(clipboardNode, range);
	                }

	                // text ranges are slow in IE10-, DOM ranges are buggy in IE9-10
	                if (browser.msie && browser.version < 11) {
	                    e.preventDefault();
	                    var r = editor.createRange();
	                    r.selectNodeContents(clipboardNode);
	                    editor.selectRange(r);
	                    var textRange = editor.document.body.createTextRange();
	                    textRange.moveToElementText(clipboardNode);
	                    $(body).unbind('paste');
	                    textRange.execCommand('Paste');
	                    $(body).bind('paste', $.proxy(this.onpaste, this));
	                } else {
	                    var clipboardRange = editor.createRange();
	                    clipboardRange.selectNodeContents(clipboardNode);
	                    editor.selectRange(clipboardRange);
	                }

	                range.deleteContents();
	            },
	            function afterPaste(editor, range) {
	                var html = "", containers;

	                editor.selectRange(range);

	                containers = $(editor.body).children(".k-paste-container");

	                containers.each(function() {
	                    var lastChild = this.lastChild;

	                    if (lastChild && dom.is(lastChild, 'br')) {
	                        dom.remove(lastChild);
	                    }

	                    html += this.innerHTML;
	                });

	                containers.remove();

	                this._triggerPaste(html, { clean: true });
	            }
	        );
	    },
	    ondragover: function(e){
	        if (browser.msie || browser.edge) {
	            e.stopPropagation();
	            e.preventDefault();
	        }
	    },
	    ondrop: function(e){
	        if (!('FileReader' in window)) {
	            return;
	        }

	        var dataTransfer = (e.originalEvent || e).dataTransfer || {};
	        var items = dataTransfer.items || dataTransfer.files;

	        if (this._insertImages(items)) {
	            e.preventDefault();
	        }
	    },
	    _decoreateClipboardNode: function(node, body) {
	        if (!browser.msie && !browser.webkit) {
	            return;
	        }

	        node = $(node);
	        node.css({
	            borderWidth : "0px",
	            width : "0px",
	            height : "0px",
	            overflow: "hidden",
	            margin : "0",
	            padding : "0"
	        });

	        if (browser.msie) {
	            //node inherits BODY styles and this causes the browser to add additional
	            var documentElement = $(body.ownerDocument.documentElement);

	            node.css({
	                fontVariant : "normal",
	                fontWeight : "normal",
	                lineSpacing : "normal",
	                lineHeight : "normal",
	                textDecoration : "none"
	            });
	            var color = documentElement.css("color");
	            if (color) {
	                node.css("color", color);
	            }
	            var fontFamily = documentElement.css("fontFamily");
	            if (fontFamily) {
	                node.css("fontFamily", fontFamily);
	            }
	            var fontSize = documentElement.css("fontSize");
	            if (fontSize) {
	                node.css("fontSize", fontSize);
	            }
	        }
	    },
	    _moveToCaretPosition: function(node, range) {
	        var that = this;
	        var body = that.editor.body;
	        var nodeOffset = dom.offset(node, body);
	        var caretOffset = that._caretOffset(range, body);
	        var translateX = caretOffset.left - nodeOffset.left;
	        var translateY = caretOffset.top - nodeOffset.top;
	        var translate = "translate(" + translateX + "px," + translateY + "px)";

	        $(node).css({
	            "-webkit-transform": translate,
	            "transform" : translate
	        });
	    },
	    _caretOffset: function (range, body) {
	        var editor = this.editor;
	        var caret = dom.create(editor.document, 'span', { innerHTML: "\ufeff" });
	        var startContainer = range.startContainer;
	        var rangeChanged;

	        if (range.collapsed) {
	            var isStartTextNode = dom.isDataNode(startContainer);
	            if (isStartTextNode && (dom.isBom(startContainer) || range.startOffset === 0)) {
	                dom.insertBefore(caret, startContainer);
	            } else if(isStartTextNode && range.startOffset === startContainer.length) {
	                dom.insertAfter(caret, startContainer);
	            } else {
	                range.insertNode(caret);
	                rangeChanged = true;
	            }
	        } else {
	            startContainer = startContainer === body ?
	                startContainer.childNodes[range.startOffset] : startContainer;
	            dom.insertBefore(caret, startContainer);
	        }

	        var offset = dom.offset(caret, body);
	        var prev = caret.previousSibling;
	        var next = caret.nextSibling;

	        dom.remove(caret);

	        if(rangeChanged && dom.isDataNode(prev) && dom.isDataNode(next) && !dom.isBom(prev) && !dom.isBom(next)) {
	            var prevLength = prev.length;
	            next.data = prev.data + next.data;
	            range.setStart(next, prevLength);
	            dom.remove(prev);

	            range.collapse(true);
	            editor.selectRange(range);
	        }

	        return offset;
	    },

	    expandImmutablesIn: function(range){
	        var editor = this.editor;
	        if (editor && editor.options.immutables) {
	            var body = editor.body;
	            range = range || editor.getRange();
	            kendo.ui.editor.Immutables.expandImmutablesIn(range);
	            if (range.startContainer === body && range.startOffset === 0) {
	                var doc = body.ownerDocument;
	                var bomNode = doc.createTextNode("\ufeff");
	                body.insertBefore(bomNode, body.childNodes[0]);
	                range.setStartBefore(bomNode);
	            }
	            editor.selectRange(range);
	        }
	    },

	    splittableParent: function(block, node) {
	        var parentNode, body;

	        if (block) {
	            return dom.closestEditableOfType(node, ['p', 'ul', 'ol']) || node.parentNode;
	        }

	        parentNode = node.parentNode;
	        body = node.ownerDocument.body;

	        if (dom.isInline(parentNode)) {
	            while (parentNode.parentNode != body && !dom.isBlock(parentNode.parentNode)) {
	                parentNode = parentNode.parentNode;
	            }
	        }

	        return parentNode;
	    },

	    paste: function (html, options) {
	        var editor = this.editor,
	            i, l;

	        this.expandImmutablesIn();

	        options = extend({ clean: false, split: true }, options);

	        if(!options.skipCleaners) {
	            for (i = 0, l = this.cleaners.length; i < l; i++) {
	                if (this.cleaners[i].applicable(html)) {
	                    html = this.cleaners[i].clean(html);
	                }
	            }
	        }

	        if (options.clean) {
	            // remove br elements which immediately precede block elements
	            html = html.replace(/(<br>(\s|&nbsp;)*)+(<\/?(div|p|li|col|t))/ig, "$3");
	            // remove empty inline elements
	            html = html.replace(/<(a|span)[^>]*><\/\1>/ig, "");
	        }

	        // It is possible in IE to copy just <li> tags
	        html = html.replace(/^<li/i, '<ul><li').replace(/li>$/g, 'li></ul>');

	        var block = this.isBlock(html);

	        editor.focus();
	        var range = editor.getRange();
	        range.deleteContents();

	        if (range.startContainer == editor.document) {
	            range.selectNodeContents(editor.body);
	        }

	        var marker = new Marker();
	        var caret = marker.addCaret(range);

	        var parent = this.splittableParent(block, caret);
	        var unwrap = false;
	        var splittable = parent != editor.body && !dom.is(parent, "td");

	        if (options.split && splittable && (block || dom.isInline(parent))) {
	            range.selectNode(caret);
	            editorNS.RangeUtils.split(range, parent, true);
	            unwrap = true;
	        }

	        var fragment = this.htmlToFragment(html);

	        if (fragment.firstChild && fragment.firstChild.className === "k-paste-container") {
	            var fragmentsHtml = [];
	            for (i = 0, l = fragment.childNodes.length; i < l; i++) {
	                fragmentsHtml.push(fragment.childNodes[i].innerHTML);
	            }

	            fragment = this.htmlToFragment(fragmentsHtml.join('<br />'));
	        }

	        $(fragment.childNodes)
	            .filter("table").addClass("k-table").end()
	            .find("table").addClass("k-table");

	        range.insertNode(fragment);

	        parent = this.splittableParent(block, caret);
	        if (unwrap) {
	            while (caret.parentNode != parent) {
	                dom.unwrap(caret.parentNode);
	            }

	            dom.unwrap(caret.parentNode);
	        }

	        dom.normalize(range.commonAncestorContainer);
	        caret.style.display = 'inline';
	        dom.restoreScrollTop(editor.document);
	        dom.scrollTo(caret);
	        marker.removeCaret(range);

	        var rangeEnd = range.commonAncestorContainer.parentNode;
	        if (range.collapsed && dom.name(rangeEnd) == "tbody") {
	            range.setStartAfter($(rangeEnd).closest("table")[0]);
	            range.collapse(true);
	        }

	        editor.selectRange(range);
	    }
	});

	var Cleaner = Class.extend({
	    init: function(options) {
	        this.options = options || {};
	        this.replacements = [];
	    },

	    clean: function(html, customReplacements) {
	        var that = this,
	            replacements = customReplacements || that.replacements,
	            i, l;

	        for (i = 0, l = replacements.length; i < l; i += 2) {
	            html = html.replace(replacements[i], replacements[i+1]);
	        }

	        return html;
	    }
	});

	var ScriptCleaner = Cleaner.extend({
	    init: function(options) {
	        Cleaner.fn.init.call(this, options);

	        this.replacements = [
	            /<(\/?)script([^>]*)>/i, "<$1telerik:script$2>"
	        ];
	    },

	    applicable: function(html) {
	        return !this.options.none && (/<script[^>]*>/i).test(html);
	    }
	});

	var TabCleaner = Cleaner.extend({
	    init: function(options) {
	        Cleaner.fn.init.call(this, options);

	        var replacement = ' ';
	        this.replacements = [
	            /<span\s+class="Apple-tab-span"[^>]*>\s*<\/span>/gi, replacement,
	            /\t/gi, replacement,
	            /&nbsp;&nbsp; &nbsp;/gi, replacement
	        ];
	    },

	    applicable: function(html) {
	        return (/&nbsp;&nbsp; &nbsp;|class="?Apple-tab-span/i).test(html);
	    }
	});

	var MSWordFormatCleaner = Cleaner.extend({
	    init: function(options) {
	        Cleaner.fn.init.call(this, options);

	        this.junkReplacements = [
	            /<\?xml[^>]*>/gi, '',
	            /<!--(.|\n)*?-->/g, '', /* comments */
	            /&quot;/g, "'", /* encoded quotes (in attributes) */
	            /<o:p>&nbsp;<\/o:p>/ig, '&nbsp;',
	            /<\/?(meta|link|style|o:|v:|x:)[^>]*>((?:.|\n)*?<\/(meta|link|style|o:|v:|x:)[^>]*>)?/ig, '', /* external references and namespaced tags */
	            /<\/o>/g, ''
	        ];
	        this.replacements = this.junkReplacements.concat([
	            /(?:<br>&nbsp;[\s\r\n]+|<br>)*(<\/?(h[1-6]|hr|p|div|table|tbody|thead|tfoot|th|tr|td|li|ol|ul|caption|address|pre|form|blockquote|dl|dt|dd|dir|fieldset)[^>]*>)(?:<br>&nbsp;[\s\r\n]+|<br>)*/g, '$1',
	            /<br><br>/g, '<BR><BR>',
	            /<br>(?!\n)/g, ' ',
	            /<table([^>]*)>(\s|&nbsp;)+<t/gi, '<table$1><t',
	            /<tr[^>]*>(\s|&nbsp;)*<\/tr>/gi, '',
	            /<tbody[^>]*>(\s|&nbsp;)*<\/tbody>/gi, '',
	            /<table[^>]*>(\s|&nbsp;)*<\/table>/gi, '',
	            /<BR><BR>/g, '<br>',
	            /^\s*(&nbsp;)+/gi, '',
	            /(&nbsp;|<br[^>]*>)+\s*$/gi, '',
	            /mso-[^;"]*;?/ig, '', /* office-related CSS attributes */
	            /<(\/?)b(\s[^>]*)?>/ig, '<$1strong$2>',
	            /<(\/?)font(\s[^>]*)?>/ig, this.convertFontMatch,
	            /<(\/?)i(\s[^>]*)?>/ig, '<$1em$2>',
	            /style=(["|'])\s*\1/g, '', /* empty style attributes */
	            /(<br[^>]*>)?\n/g, function ($0, $1) { return $1 ? $0 : ' '; } /* phantom extra line feeds */
	        ]);
	    },

	    convertFontMatch: function(match, closing, args) {
	        var faceRe = /face=['"]([^'"]+)['"]/i;
	        var face = faceRe.exec(args);
	        var family = args && face && face[1];

	        if (closing) {
	            return '</span>';
	        } else if (family) {
	            return '<span style="font-family:' + family + '">';
	        } else {
	            return '<span>';
	        }
	    },

	    applicable: function(html) {
	        return (/class="?Mso/i).test(html) ||
	               (/style="[^"]*mso-/i).test(html) ||
	               (/urn:schemas-microsoft-com:office/).test(html);
	    },

	    stripEmptyAnchors: function(html) {
	        return html.replace(/<a([^>]*)>\s*<\/a>/ig, function(a, attributes) {
	            if (!attributes || attributes.indexOf("href") < 0) {
	                return "";
	            }

	            return a;
	        });
	    },

	    listType: function(p, listData) {
	        var html = p.innerHTML;
	        var text = dom.innerText(p);

	        var startingSymbol;
	        var matchSymbol = html.match(/^(?:<span [^>]*texhtml[^>]*>)?<span [^>]*(?:Symbol|Wingdings)[^>]*>([^<]+)/i);
	        var symbol = matchSymbol && matchSymbol[1];
	        var isNumber = /^[a-z\d]/i.test(symbol);//including alpha-numeric and roman numerals

	        var trimStartText = function(text) {
	            return text.replace(/^(?:&nbsp;|[\u00a0\n\r\s])+/, '');
	        };

	        if (matchSymbol) {
	            startingSymbol = true;
	        }

	        html = html.replace(/<\/?\w+[^>]*>/g, '').replace(/&nbsp;/g, '\u00a0');

	        if ((!startingSymbol && /^[\u2022\u00b7\u00a7\u00d8o]\u00a0+/.test(html)) ||
	            (startingSymbol && /^.\u00a0+/.test(html)) ||
	            (symbol && !isNumber && listData)) {
	            return {
	                tag: 'ul',
	                style: this._guessUnorderedListStyle(trimStartText(text))
	            };
	        }

	        if (/^\s*\w+[\.\)][\u00a0 ]{2,}/.test(html)) {
	            return {
	                tag: 'ol',
	                style: this._guessOrderedListStyle(trimStartText(text))
	            };
	        }
	    },

	    _convertToLi: function(p) {
	        var content,
	            name = dom.name(p);

	        if (p.childNodes.length == 1) {
	            content = p.firstChild.innerHTML.replace(/^\w+[\.\)](&nbsp;)+ /, "");
	        } else {
	            dom.remove(p.firstChild);

	            // check for roman numerals
	            if (p.firstChild.nodeType == 3) {
	                if (/^[ivxlcdm]+\.$/i.test(p.firstChild.nodeValue)) {
	                    dom.remove(p.firstChild);
	                }
	            }

	            if (/^(&nbsp;|\s)+$/i.test(p.firstChild.innerHTML)) {
	                dom.remove(p.firstChild);
	            }

	            if (name != "p") {
	                content = "<" + name + ">" + p.innerHTML + "</" + name + ">";
	            } else {
	                content = p.innerHTML;
	            }
	        }

	        dom.remove(p);

	        return dom.create(document, 'li', { innerHTML: content });
	    },

	    _guessUnorderedListStyle: function(symbol) {
	        if (/^[\u2022\u00b7\u00FC\u00D8\u002dv-]/.test(symbol)) {
	            return null;//return "disc"; //default CSS value
	        } else if (/^o/.test(symbol)) {
	            return "circle";
	        } else {
	            return "square";
	        }
	    },
	    _guessOrderedListStyle: function(symbol) {
	        var listType = null;
	        if (!/^\d/.test(symbol)) {
	            listType = (/^[a-z]/.test(symbol) ? 'lower-' : 'upper-') +
	                       (/^[ivxlcdm]/i.test(symbol) ? 'roman' : 'alpha');
	        }

	        return listType;
	    },

	    extractListLevels: function(html) {
	        var msoListRegExp = /style=['"]?[^'"]*?mso-list:\s?[a-zA-Z]+(\d+)\s[a-zA-Z]+(\d+)\s(\w+)/gi;

	        html = html.replace(msoListRegExp, function(match, list, level) {
	            return kendo.format('data-list="{0}" data-level="{1}" {2}', list, level, match);
	        });

	        return html;
	    },

	    _createList: function(type, styleType) {
	        return dom.create(document, type, {
	            style: { listStyleType: styleType }
	        });
	    },

	    lists: function(placeholder) {
	        var blockChildren = $(placeholder).find(dom.blockElements.join(',')),
	            lastMargin = -1,
	            name,
	            levels = {},
	            li,
	            rootMargin,
	            rootIndex,
	            lastRootLi,
	            isLastRootLi,
	            rootList,
	            i, p, type, margin, list, listData,
	            acceptedNameTags = ["p", "h1", "h2", "h3", "h4", "h5", "h6"];

	        for (i = 0; i < blockChildren.length; i++) {
	            p = blockChildren[i];
	            listData = $(p).data();
	            var listIndex = listData.list;
	            name = dom.name(p);

	            if (name == "td") {
	                continue;
	            }

	            var listType = this.listType(p, listData);
	            type = listType && listType.tag;

	            if (!type || acceptedNameTags.indexOf(name) < 0) {
	                if (!p.innerHTML) {
	                    dom.remove(p);
	                } else if (li && !isLastRootLi) {
	                    li.append(p);
	                }
	                continue;
	            }

	            margin = listData.level || parseFloat(p.style.marginLeft || 0);

	            var levelType = type + listIndex;
	            if (!levels[margin]) {
	                levels[margin] = {};
	            }

	            if (!rootMargin || rootMargin < 0) {
	                rootMargin = margin;
	                rootIndex = listIndex;
	                lastRootLi = $(placeholder).find("[data-list='" + rootIndex + "']:last")[0];
	                rootList = this._createList(type, listType.style);
	                dom.insertBefore(rootList, p);
	                lastMargin = margin;
	                levels[margin][levelType] = rootList;
	            }

	            isLastRootLi = lastRootLi === p;

	            list = levels[margin][levelType];

	            if (margin > lastMargin || !list) {
	                list = this._createList(type, listType.style);
	                levels[margin][levelType] = list;
	                li.appendChild(list);
	            }

	            li = this._convertToLi(p);
	            list.appendChild(li);

	            if (isLastRootLi) {
	                rootMargin = lastMargin = -1;
	            } else {
	                lastMargin = margin;
	            }
	        }
	    },

	    removeAttributes: function(element) {
	        var attributes = element.attributes,
	            i = attributes.length;

	        while (i--) {
	            if (dom.name(attributes[i]) != "colspan") {
	                element.removeAttributeNode(attributes[i]);
	            }
	        }
	    },

	    createColGroup: function(row) {
	        var cells = row.cells;
	        var table = $(row).closest("table");
	        var colgroup = table.children("colgroup");

	        if (cells.length < 2) {
	            return;
	        } else if (colgroup.length) {
	            cells = colgroup.children();
	            colgroup[0].parentNode.removeChild(colgroup[0]);
	        }

	        colgroup = $($.map(cells, function(cell) {
	                var width = cell.width;
	                if (width && parseInt(width, 10) !== 0) {
	                    return kendo.format('<col style="width:{0}px;"/>', width);
	                }

	                return "<col />";
	            }).join(""));

	        // jquery 1.9/2.0 discrepancy
	        if (!colgroup.is("colgroup")) {
	            colgroup = $("<colgroup/>").append(colgroup);
	        }

	        colgroup.prependTo(table);
	    },

	    convertHeaders: function(row) {
	        var cells = row.cells,
	            i,
	            boldedCells = $.map(cells, function(cell) {
	                var child = $(cell).children("p").children("strong")[0];

	                if (child && dom.name(child) == "strong") {
	                    return child;
	                }
	            });

	        if (boldedCells.length == cells.length) {
	            for (i = 0; i < boldedCells.length; i++) {
	                dom.unwrap(boldedCells[i]);
	            }

	            $(row).closest("table")
	                .find("colgroup").after("<thead></thead>").end()
	                .find("thead").append(row);

	            for (i = 0; i < cells.length; i++) {
	                dom.changeTag(cells[i], "th");
	            }
	        }
	    },

	    removeParagraphs: function(cells) {
	        var i, j, len, cell, paragraphs;

	        for (i = 0; i < cells.length; i++) {
	            this.removeAttributes(cells[i]);

	            // remove paragraphs and insert line breaks between them
	            cell = $(cells[i]);
	            paragraphs = cell.children("p");

	            for (j = 0, len = paragraphs.length; j < len; j++) {
	                if (j < len - 1) {
	                    dom.insertAfter(dom.create(document, "br"), paragraphs[j]);
	                }

	                dom.unwrap(paragraphs[j]);
	            }
	        }
	    },

	    removeDefaultColors: function(spans) {
	        for (var i = 0; i < spans.length; i++) {
	            if (/^\s*color:\s*[^;]*;?$/i.test(spans[i].style.cssText)) {
	                dom.unwrap(spans[i]);
	            }
	        }
	    },

	    tables: function(placeholder) {
	        var tables = $(placeholder).find("table"),
	            that = this,
	            rows,
	            firstRow, longestRow, i, j;

	        for (i = 0; i < tables.length; i++) {
	            rows = tables[i].rows;
	            longestRow = firstRow = rows[0];

	            for (j = 1; j < rows.length; j++) {
	                if (rows[j].cells.length > longestRow.cells.length) {
	                    longestRow = rows[j];
	                }
	            }

	            that.createColGroup(longestRow);
	            that.convertHeaders(firstRow);

	            that.removeAttributes(tables[i]);

	            that.removeParagraphs(tables.eq(i).find("td,th"));
	            that.removeDefaultColors(tables.eq(i).find("span"));
	        }
	    },

	    headers: function(placeholder) {
	        var titles = $(placeholder).find("p.MsoTitle");

	        for (var i = 0; i < titles.length; i++) {
	            dom.changeTag(titles[i], "h1");
	        }
	    },

	    removeFormatting: function (placeholder) {
	        $(placeholder).find("*").each(function() {
	            $(this).css({
	                fontSize: "",
	                fontFamily: ""
	            });

	            if (!this.getAttribute("style") && !this.style.cssText) {
	                this.removeAttribute("style");
	            }
	        });
	    },

	    clean: function(html) {
	        var that = this, placeholder;
	        var filters = this.options;

	        if (filters.none) {
	            html = Cleaner.fn.clean.call(that, html, this.junkReplacements);
	            html = that.stripEmptyAnchors(html);
	        } else {
	            html = this.extractListLevels(html);
	            html = Cleaner.fn.clean.call(that, html);
	            html = that.stripEmptyAnchors(html);

	            placeholder = dom.create(document, 'div', {innerHTML: html});
	            that.headers(placeholder);

	            if (filters.msConvertLists) {
	                that.lists(placeholder);
	            }
	            that.tables(placeholder);

	            if (filters.msAllFormatting) {
	                that.removeFormatting(placeholder);
	            }

	            html = placeholder.innerHTML.replace(/(<[^>]*)\s+class="?[^"\s>]*"?/ig, '$1');
	        }

	        return html;
	    }
	});

	var WebkitFormatCleaner = Cleaner.extend({
	    init: function(options) {
	        Cleaner.fn.init.call(this, options);

	        this.replacements = [
	            /\s+class="Apple-style-span[^"]*"/gi, '',
	            /<(div|p|h[1-6])\s+style="[^"]*"/gi, '<$1',
	            /^<div>(.*)<\/div>$/, '$1'
	        ];
	    },

	    applicable: function(html) {
	        return (/class="?Apple-style-span|style="[^"]*-webkit-nbsp-mode/i).test(html);
	    }
	});

	    var DomCleaner = Cleaner.extend({
	        clean: function(html) {
	            var container = dom.create(document, 'div', {innerHTML: html});
	            container = this.cleanDom(container);
	            return container.innerHTML;
	        },

	        cleanDom: function(container) {
	            return container;
	        }
	    });

	    var HtmlTagsCleaner = DomCleaner.extend({
	        cleanDom: function(container) {
	            var tags = this.collectTags();

	            $(container).find(tags).each(function() {
	                dom.unwrap(this);
	            });

	            return container;
	        },

	        collectTags: function() {
	            if (this.options.span) {
	                return "span";
	            }
	        },

	        applicable: function() {
	            return this.options.span;
	        }
	    });

	    var HtmlAttrCleaner = DomCleaner.extend({
	        cleanDom: function(container) {
	            var attributes = this.collectAttr();
	            var nodes = $(container).find("[" + attributes.join("],[") + "]");
	            nodes.removeAttr(attributes.join(" "));

	            return container;
	        },

	        collectAttr: function() {
	            if (this.options.css) {
	                return ["class", "style"];
	            }

	            return [];
	        },

	        applicable: function() {
	            return this.options.css;
	        }
	    });


	    var TextContainer = function() {
	        this.text = "";
	        this.add = function(text) {
	            this.text += text;
	        };
	    };

	    var HtmlTextLines = Class.extend({
	        init: function(separators) {
	            this.separators = separators || {
	                    text: " ",
	                    line: "<br/>"
	                };
	            this.lines = [];
	            this.inlineBlockText = [];
	            this.resetLine();
	        },

	        appendText: function(text) {
	            if (text.nodeType === 3) {
	                text = text.nodeValue;
	            }

	            this.textContainer.add(text);
	        },

	        appendInlineBlockText: function(text) {
	            this.inlineBlockText.push(text);
	        },

	        flashInlineBlockText: function() {
	            if (this.inlineBlockText.length) {
	                this.appendText(this.inlineBlockText.join(" "));
	                this.inlineBlockText = [];
	            }
	        },

	        endLine: function() {
	            this.flashInlineBlockText();
	            this.resetLine();
	        },

	        html: function() {
	            var separators = this.separators;
	            var result = "";
	            var lines = this.lines;

	            this.flashInlineBlockText();

	            for (var i = 0, il = lines.length, il1 = il - 1; i < il; i++) {
	                var line = lines[i];
	                for (var j = 0, jl = line.length, jl1 = jl - 1; j < jl; j++) {
	                    var text = line[j].text;
	                    result += text;
	                    if (j !== jl1) {
	                        result += separators.text;
	                    }
	                }
	                if (i !== il1) {
	                    result += separators.line;
	                }
	            }

	            return result;
	        },

	        resetLine: function() {
	            this.textContainer = new TextContainer();
	            this.line = [];
	            this.line.push(this.textContainer);
	            this.lines.push(this.line);
	        }
	    });

	    var DomEnumerator = Class.extend({
	        init: function(callback) {
	            this.callback = callback;
	        },
	        enumerate: function(node) {
	            if (!node) {
	                return;
	            }

	            var preventDown = this.callback(node);

	            var child = node.firstChild;
	            if (!preventDown && child) {
	                this.enumerate(child);
	            }

	            this.enumerate(node.nextSibling);
	        }
	    });

	    var HtmlContentCleaner = Cleaner.extend({
	        init: function(options) {
	            Cleaner.fn.init.call(this, options);
	            this.hasText = false; //unpleasant flag to prevent an empty line at the beginning of the generated content.
	            this.enumerator = new DomEnumerator($.proxy(this.buildText, this));
	        },

	        clean: function(html) {
	            var container = dom.create(document, 'div', {innerHTML: html});

	            return this.cleanDom(container);
	        },

	        cleanDom: function(container) {
	            this.separators = this.getDefaultSeparators();
	            this.htmlLines = new HtmlTextLines(this.separators);
	            this.enumerator.enumerate(container.firstChild);
	            this.hasText = false;

	            return this.htmlLines.html();
	        },

	        buildText: function(node) {
	            if (dom.isDataNode(node)) {
	                if (dom.isEmptyspace(node)) {
	                    return;
	                }
	                this.htmlLines.appendText(node.nodeValue.replace('\n', this.separators.line));
	                this.hasText = true;
	            } else if (dom.isBlock(node) && this.hasText) {
	                var action = this.actions[dom.name(node)] || this.actions.block;
	                return action(this, node);
	            }
	        },

	        applicable: function() {
	            var o = this.options;
	            return o.all || o.keepNewLines;
	        },

	        getDefaultSeparators: function() {
	            if (this.options.all) {
	                return {text: " ", line: " "};
	            } else {
	                return {text: " ", line: "<br/>"};
	            }
	        },

	        actions: {
	            ul: $.noop,
	            ol: $.noop,
	            table: $.noop,
	            thead: $.noop,
	            tbody: $.noop,
	            td: function(cleaner, node) {
	                var tdCleaner = new HtmlContentCleaner({all: true});

	                var cellText = tdCleaner.cleanDom(node);
	                cleaner.htmlLines.appendInlineBlockText(cellText);

	                return true;
	            },

	            block: function(cleaner) {
	                cleaner.htmlLines.endLine();
	            }
	        }
	    });

	    var CustomCleaner = Cleaner.extend({
	        clean: function(html) {
	            return this.options.custom(html);
	        },

	        applicable: function() {
	            return typeof(this.options.custom) === "function";
	        }
	    });

	var PrintCommand = Command.extend({
	    init: function(options) {
	        Command.fn.init.call(this, options);

	        this.managesUndoRedo = true;
	    },

	    exec: function() {
	        var editor = this.editor;

	        if (kendo.support.browser.msie) {
	            editor.document.execCommand("print", false, null);
	        } else if (editor.window.print) {
	            editor.window.print();
	        }
	    }
	});

	var ExportPdfCommand = Command.extend({
	    init: function(options) {
	        this.async = true;
	        Command.fn.init.call(this, options);
	    },

	    exec: function() {
	        var that = this;
	        var range = that.lockRange(true);
	        var editor = that.editor;

	        editor._destroyResizings();

	        editor.saveAsPDF().then(function() {
	            that.releaseRange(range);
	            editor._initializeColumnResizing();
	            editor._initializeRowResizing();
	            editor._initializeTableResizing();
	        });
	    }
	});
	extend(editorNS, {
	    _finishUpdate: finishUpdate,
	    Command: Command,
	    GenericCommand: GenericCommand,
	    InsertHtmlCommand: InsertHtmlCommand,
	    InsertHtmlTool: InsertHtmlTool,
	    TypingHandler: TypingHandler,
	    SystemHandler: SystemHandler,
	    BackspaceHandler: BackspaceHandler,
	    SelectAllHandler: SelectAllHandler,
	    Keyboard: Keyboard,
	    Clipboard: Clipboard,
	    Cleaner: Cleaner,
	    ScriptCleaner: ScriptCleaner,
	    TabCleaner: TabCleaner,
	    MSWordFormatCleaner: MSWordFormatCleaner,
	    WebkitFormatCleaner: WebkitFormatCleaner,
	    HtmlTagsCleaner: HtmlTagsCleaner,
	    HtmlAttrCleaner: HtmlAttrCleaner,
	    HtmlContentCleaner: HtmlContentCleaner,
	    HtmlTextLines: HtmlTextLines,
	    CustomCleaner: CustomCleaner,
	    PrintCommand: PrintCommand,
	    ExportPdfCommand: ExportPdfCommand
	});

	registerTool("insertHtml", new InsertHtmlTool({template: new ToolTemplate({template: EditorUtils.dropDownListTemplate, title: "Insert HTML", initialValue: "Insert HTML"})}));
	registerTool("print", new Tool({ command: PrintCommand, template: new ToolTemplate({template: EditorUtils.buttonTemplate, title: "Print"})}));
	registerTool("pdf", new Tool({ command: ExportPdfCommand, template: new ToolTemplate({template: EditorUtils.buttonTemplate, title: "Export PDF"})}));

	})(window.kendo.jQuery);

	}, __webpack_require__(3));


/***/ }),

/***/ 969:
/***/ (function(module, exports) {

	module.exports = require("./range");

/***/ })

/******/ });