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

	__webpack_require__(974);
	module.exports = __webpack_require__(974);


/***/ }),

/***/ 3:
/***/ (function(module, exports) {

	module.exports = function() { throw new Error("define cannot be used indirect"); };


/***/ }),

/***/ 974:
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function(f, define){
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__(975) ], __WEBPACK_AMD_DEFINE_FACTORY__ = (f), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	})(function(){

	(function($, undefined) {

	var kendo = window.kendo,
	    extend = $.extend,
	    proxy = $.proxy,
	    Editor = kendo.ui.editor,
	    dom = Editor.Dom,
	    EditorUtils = Editor.EditorUtils,
	    RangeUtils = Editor.RangeUtils,
	    Command = Editor.Command,
	    NS = "kendoEditor",
	    ACTIVESTATE = "k-state-active",
	    SELECTEDSTATE = "k-state-selected",
	    Tool = Editor.Tool,
	    ToolTemplate = Editor.ToolTemplate,
	    InsertHtmlCommand = Editor.InsertHtmlCommand,
	    BlockFormatFinder = Editor.BlockFormatFinder,
	    registerTool = Editor.EditorUtils.registerTool,
	    getTouches = kendo.getTouches;
	var template = kendo.template;

	var columnTemplate = "<td style='width:#=width#%;'>#=content#</td>";

	var tableFormatFinder = new BlockFormatFinder([{tags:["table"]}]);

	var TableCommand = InsertHtmlCommand.extend({
	    init: function(options) {
	        var o = $.extend({
	            postProcess: this.postProcess,
	            skipCleaners: true
	        }, options || {});

	        InsertHtmlCommand.fn.init.call(this, o);
	    },
	    _tableHtml: function(rows, columns) {
	        rows = rows || 1;
	        columns = columns || 1;
	        var columnHtml = template(columnTemplate)({ width: 100 / columns, content: Editor.emptyTableCellContent });
	        var rowHeight = 100 / rows;

	        return "<table class='k-table' data-last>" +
	                    new Array(rows + 1).join(
	                    "<tr style='height:" + rowHeight + "%;'>" +
	                        new Array(columns + 1).join(columnHtml) +
	                    "</tr>") +
	               "</table>";
	    },

	    postProcess: function(editor, range) {
	        var insertedTable = $("table[data-last]", editor.document).removeAttr("data-last");

	        range.setStart(insertedTable.find("td")[0], 0);
	        range.collapse(true);

	        editor.selectRange(range);
	    },

	    exec: function() {
	        var options = this.options;
	        options.html = this._tableHtml(options.rows, options.columns);

	        InsertHtmlCommand.fn.exec.call(this);
	    }
	});

	var PopupTool = Tool.extend({
	    initialize: function(ui, options) {
	        Tool.fn.initialize.call(this, ui, options);

	        var popup = $(this.options.popupTemplate).appendTo("body").kendoPopup({
	            anchor: ui,
	            copyAnchorStyles: false,
	            open: proxy(this._open, this),
	            activate: proxy(this._activate, this),
	            close: proxy(this._close, this)
	        }).data("kendoPopup");

	        ui.click(proxy(this._toggle, this))
	          .keydown(proxy(this._keydown, this));

	        var editor = this._editor = options.editor;
	        this._popup = popup;

	        var tableWizard = new Editor.TableWizardTool({
	            template: new ToolTemplate({ template: EditorUtils.buttonTemplate, title: editor.options.messages.tableWizard }),
	            command: Editor.TableWizardCommand,
	            insertNewTable: true
	        });

	        registerTool("tableWizardInsert", tableWizard);

	        var twTool = $("<div class='k-editor-toolbar'>" + tableWizard.options.template.getHtml() + "</div>");
	        twTool.appendTo(popup.element);
	        if (editor.toolbar) {
	            editor.toolbar.attachToolsEvents(twTool);
	        }
	    },

	    popup: function() {
	        return this._popup;
	    },

	    _activate: $.noop,

	    _open: function() {
	        this._popup.options.anchor.addClass(ACTIVESTATE);
	    },

	    _close: function() {
	        this._popup.options.anchor.removeClass(ACTIVESTATE);
	    },

	    _keydown: function(e) {
	        var keys = kendo.keys;
	        var key = e.keyCode;

	        if (key == keys.DOWN && e.altKey) {
	            this._popup.open();
	        } else if (key == keys.ESC) {
	            this._popup.close();
	        }
	    },

	    _toggle: function(e) {
	        var button = $(e.target).closest(".k-tool");

	        if (!button.hasClass("k-state-disabled")) {
	            this.popup().toggle();
	        }
	    },

	    update: function(ui) {
	        var popup = this.popup();

	        if (popup.wrapper && popup.wrapper.css("display") == "block") {
	            popup.close();
	        }

	        ui.removeClass("k-state-hover");
	    },

	    destroy: function() {
	        this._popup.destroy();
	    }
	});

	var InsertTableTool = PopupTool.extend({
	    init: function(options) {
	        this.cols = 8;
	        this.rows = 6;

	        PopupTool.fn.init.call(this, $.extend(options, {
	            command: TableCommand,
	            popupTemplate:
	                "<div class='k-ct-popup'>" +
	                    new Array(this.cols * this.rows + 1).join("<span class='k-ct-cell k-state-disabled' />") +
	                    "<div class='k-status'></div>" +
	                "</div>"
	        }));
	    },

	    _activate: function() {
	        var that = this,
	            element = that._popup.element,
	            cells = element.find(".k-ct-cell"),
	            firstCell = cells.eq(0),
	            lastCell = cells.eq(cells.length - 1),
	            start = kendo.getOffset(firstCell),
	            end = kendo.getOffset(lastCell),
	            cols = that.cols,
	            rows = that.rows,
	            cellWidth, cellHeight;

	        element.find("*").addBack().attr("unselectable", "on");

	        end.left += lastCell[0].offsetWidth;
	        end.top += lastCell[0].offsetHeight;

	        cellWidth = (end.left - start.left) / cols;
	        cellHeight = (end.top - start.top) / rows;

	        function tableFromLocation(e) {
	            var w = $(window);
	            return {
	                row: Math.floor((e.clientY + w.scrollTop() - start.top) / cellHeight) + 1,
	                col: Math.floor((e.clientX + w.scrollLeft() - start.left) / cellWidth) + 1
	            };
	        }

	        element.autoApplyNS(NS)
	            .on("mousemove", function(e) {
	                that._setTableSize(tableFromLocation(e));
	            })
	            .on("mouseleave", function() {
	                that._setTableSize();
	            })
	            .on("down", function(e) {
	                e.preventDefault();
	                var touch = getTouches(e)[0];
	                that._exec(tableFromLocation(touch.location));
	            });
	    },

	    _valid: function(size) {
	        return size && size.row > 0 && size.col > 0 && size.row <= this.rows && size.col <= this.cols;
	    },

	    _exec: function(size) {
	        if (this._valid(size)) {
	            this._editor.exec("createTable", {
	                rows: size.row,
	                columns: size.col
	            });
	            this._popup.close();
	        }
	    },

	    _setTableSize: function(size) {
	        var element = this._popup.element;
	        var status = element.find(".k-status");
	        var cells = element.find(".k-ct-cell");
	        var cols = this.cols;
	        var messages = this._editor.options.messages;

	        if (this._valid(size)) {
	            status.text(kendo.format(messages.createTableHint, size.row, size.col));

	            cells.each(function(i) {
	                $(this).toggleClass(
	                    SELECTEDSTATE,
	                    i % cols < size.col && i / cols < size.row
	                );
	            });
	        } else {
	            status.text(messages.createTable);
	            cells.removeClass(SELECTEDSTATE);
	        }
	    },

	    _keydown: function(e) {
	        PopupTool.fn._keydown.call(this, e);

	        if (!this._popup.visible()) {
	            return;
	        }

	        var keys = kendo.keys;
	        var key = e.keyCode;
	        var cells = this._popup.element.find(".k-ct-cell");
	        var focus = Math.max(cells.filter(".k-state-selected").last().index(), 0);
	        var selectedRows = Math.floor(focus / this.cols);
	        var selectedColumns = focus % this.cols;

	        var changed = false;

	        if (key == keys.DOWN && !e.altKey) {
	            changed = true;
	            selectedRows++;
	        } else if (key == keys.UP) {
	            changed = true;
	            selectedRows--;
	        } else if (key == keys.RIGHT) {
	            changed = true;
	            selectedColumns++;
	        } else if (key == keys.LEFT) {
	            changed = true;
	            selectedColumns--;
	        }

	        var tableSize = {
	            row: Math.max(1, Math.min(this.rows, selectedRows + 1)),
	            col: Math.max(1, Math.min(this.cols, selectedColumns + 1))
	        };

	        if (key == keys.ENTER) {
	            this._exec(tableSize);
	        } else {
	            this._setTableSize(tableSize);
	        }

	        if (changed) {
	            e.preventDefault();
	            e.stopImmediatePropagation();
	        }
	    },

	    _open: function() {
	        var messages = this._editor.options.messages;

	        PopupTool.fn._open.call(this);

	        this.popup().element
	            .find(".k-status").text(messages.createTable).end()
	            .find(".k-ct-cell").removeClass(SELECTEDSTATE);
	    },

	    _close: function() {
	        PopupTool.fn._close.call(this);
	        this.popup().element.off("." + NS);
	    }
	});

	var InsertRowCommand = Command.extend({
	    exec: function () {
	        var range = this.lockRange(true),
	            td = range.endContainer,
	            cellCount, row,
	            newRow;

	        while (dom.name(td) != "td") {
	            td = td.parentNode;
	        }

	        if (this.immutables() && Editor.Immutables.immutableParent(td)) {
	            return;
	        }

	        row = td.parentNode;

	        cellCount = row.children.length;
	        newRow = row.cloneNode(true);

	        for (var i = 0; i < row.cells.length; i++) {
	            newRow.cells[i].innerHTML = Editor.emptyTableCellContent;
	        }

	        if (this.options.position == "before") {
	            dom.insertBefore(newRow, row);
	        } else {
	            dom.insertAfter(newRow, row);
	        }

	        this.releaseRange(range);
	    }
	});

	var InsertColumnCommand = Command.extend({
	    exec: function () {
	        var range = this.lockRange(true),
	            td = dom.closest(range.endContainer, "td"),
	            table = dom.closest(td, "table"),
	            columnIndex,
	            i,
	            rows = table.rows,
	            cell,
	            newCell,
	            position = this.options.position;

	        if (this.immutables() && Editor.Immutables.immutableParent(td)) {
	            return;
	        }

	        columnIndex = dom.findNodeIndex(td, true);

	        for (i = 0; i < rows.length; i++) {
	            cell = rows[i].cells[columnIndex];

	            newCell = cell.cloneNode();
	            newCell.innerHTML = Editor.emptyTableCellContent;

	            if (position == "before") {
	                dom.insertBefore(newCell, cell);
	            } else {
	                dom.insertAfter(newCell, cell);
	            }
	        }

	        this.releaseRange(range);
	    }
	});

	var DeleteRowCommand = Command.extend({
	    exec: function () {
	        var range = this.lockRange();
	        var rows = RangeUtils.mapAll(range, function(node) {
	            return $(node).closest("tr")[0];
	        });
	        var row = rows[0];

	        if (this.immutables() && Editor.Immutables.immutableParent(row)) {
	            return;
	        }

	        var table = dom.closest(row, "table");
	        var focusElement;

	        if (table.rows.length <= rows.length) {
	            focusElement = dom.next(table);
	            if (!focusElement || dom.insignificant(focusElement)) {
	                focusElement = dom.prev(table);
	            }

	            dom.remove(table);
	        } else {
	            for (var i = 0; i < rows.length; i++) {
	                row = rows[i];
	                dom.removeTextSiblings(row);

	                focusElement = dom.next(row) || dom.prev(row);
	                focusElement = focusElement.cells[0];

	                dom.remove(row);
	            }
	        }

	        if (focusElement) {
	            range.setStart(focusElement, 0);
	            range.collapse(true);
	            this.editor.selectRange(range);
	        }
	    }
	});

	var DeleteColumnCommand = Command.extend({
	    exec: function () {
	        var range = this.lockRange(),
	            td = dom.closest(range.endContainer, "td"),
	            table = dom.closest(td, "table"),
	            rows = table.rows,
	            columnIndex = dom.findNodeIndex(td, true),
	            columnCount = rows[0].cells.length,
	            focusElement, i;

	        if (this.immutables() && Editor.Immutables.immutableParent(td)) {
	            return;
	        }

	        if (columnCount == 1) {
	            focusElement = dom.next(table);
	            if (!focusElement || dom.insignificant(focusElement)) {
	                focusElement = dom.prev(table);
	            }

	            dom.remove(table);
	        } else {
	            dom.removeTextSiblings(td);

	            focusElement = dom.next(td) || dom.prev(td);

	            for (i = 0; i < rows.length; i++) {
	                dom.remove(rows[i].cells[columnIndex]);
	            }
	        }

	        if (focusElement) {
	            range.setStart(focusElement, 0);
	            range.collapse(true);
	            this.editor.selectRange(range);
	        }
	    }
	});

	var TableModificationTool = Tool.extend({
	    command: function (options) {
	        options = extend(options, this.options);

	        if (options.action == "delete") {
	            if (options.type == "row") {
	                return new DeleteRowCommand(options);
	            } else {
	                return new DeleteColumnCommand(options);
	            }
	        } else {
	            if (options.type == "row") {
	                return new InsertRowCommand(options);
	            } else {
	                return new InsertColumnCommand(options);
	            }
	        }
	    },

	    initialize: function(ui, options) {
	        Tool.fn.initialize.call(this, ui, options);
	        ui.addClass("k-state-disabled");
	    },

	    update: function(ui, nodes) {
	        var isFormatted = !tableFormatFinder.isFormatted(nodes);
	        ui.toggleClass("k-state-disabled", isFormatted);
	    }
	});

	extend(kendo.ui.editor, {
	    PopupTool: PopupTool,
	    TableCommand: TableCommand,
	    InsertTableTool: InsertTableTool,
	    TableModificationTool: TableModificationTool,
	    InsertRowCommand: InsertRowCommand,
	    InsertColumnCommand: InsertColumnCommand,
	    DeleteRowCommand: DeleteRowCommand,
	    DeleteColumnCommand: DeleteColumnCommand
	});

	registerTool("createTable", new InsertTableTool({ template: new ToolTemplate({template: EditorUtils.buttonTemplate, popup: true, title: "Create table"})}));

	registerTool("addColumnLeft", new TableModificationTool({ type: "column", position: "before", template: new ToolTemplate({template: EditorUtils.buttonTemplate, title: "Add column on the left"})}));
	registerTool("addColumnRight", new TableModificationTool({ type: "column", template: new ToolTemplate({template: EditorUtils.buttonTemplate, title: "Add column on the right"})}));
	registerTool("addRowAbove", new TableModificationTool({ type: "row", position: "before", template: new ToolTemplate({template: EditorUtils.buttonTemplate, title: "Add row above"})}));
	registerTool("addRowBelow", new TableModificationTool({ type: "row", template: new ToolTemplate({template: EditorUtils.buttonTemplate, title: "Add row below"})}));
	registerTool("deleteRow", new TableModificationTool({ type: "row", action: "delete", template: new ToolTemplate({template: EditorUtils.buttonTemplate, title: "Delete row"})}));
	registerTool("deleteColumn", new TableModificationTool({ type: "column", action: "delete", template: new ToolTemplate({template: EditorUtils.buttonTemplate, title: "Delete column"})}));
	//registerTool("mergeCells", new Tool({ template: new ToolTemplate({template: EditorUtils.buttonTemplate, title: "Merge cells"})}));

	})(window.kendo.jQuery);

	}, __webpack_require__(3));


/***/ }),

/***/ 975:
/***/ (function(module, exports) {

	module.exports = require("./toolbar");

/***/ })

/******/ });