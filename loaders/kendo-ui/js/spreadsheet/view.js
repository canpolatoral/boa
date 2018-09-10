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

	__webpack_require__(1474);
	module.exports = __webpack_require__(1474);


/***/ }),

/***/ 3:
/***/ (function(module, exports) {

	module.exports = function() { throw new Error("define cannot be used indirect"); };


/***/ }),

/***/ 920:
/***/ (function(module, exports) {

	module.exports = require("../kendo.core");

/***/ }),

/***/ 1474:
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function(f, define){
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__(920), __webpack_require__(1475), __webpack_require__(1476) ], __WEBPACK_AMD_DEFINE_FACTORY__ = (f), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	})(function(){

	(function(kendo) {
	    if (kendo.support.browser.msie && kendo.support.browser.version < 9) {
	        return;
	    }

	    var $ = kendo.jQuery;
	    var CellRef = kendo.spreadsheet.CellRef;
	    var DOT = ".";
	    var RESIZE_HANDLE_WIDTH = 7;
	    var viewClassNames = {
	        view: "k-spreadsheet-view",
	        fixedContainer: "k-spreadsheet-fixed-container",
	        editContainer: "k-spreadsheet-edit-container",
	        scroller: "k-spreadsheet-scroller",
	        viewSize: "k-spreadsheet-view-size",
	        clipboard: "k-spreadsheet-clipboard",
	        cellEditor: "k-spreadsheet-cell-editor",
	        barEditor: "k-spreadsheet-editor",
	        topCorner: "k-spreadsheet-top-corner",
	        filterHeadersWrapper: "k-filter-wrapper",
	        filterRange: "k-filter-range",
	        filterButton: "k-spreadsheet-filter",
	        filterButtonActive: "k-state-active",
	        horizontalResize: "k-horizontal-resize",
	        verticalResize: "k-vertical-resize",
	        icon: "k-icon",
	        iconFilterDefault: "k-i-arrow-60-down",
	        sheetsBar: "k-spreadsheet-sheets-bar",
	        sheetsBarActive: "k-spreadsheet-sheets-bar-active",
	        sheetsBarInactive: "k-spreadsheet-sheets-bar-inactive",
	        cellContextMenu: "k-spreadsheet-cell-context-menu",
	        rowHeaderContextMenu: "k-spreadsheet-row-header-context-menu",
	        colHeaderContextMenu: "k-spreadsheet-col-header-context-menu"
	    };

	    kendo.spreadsheet.messages.view = {
	        nameBox: "Name Box",
	        errors: {
	            openUnsupported: "Unsupported format. Please select an .xlsx file.",
	            shiftingNonblankCells: "Cannot insert cells due to data loss possibility. Select another insert location or delete the data from the end of your worksheet.",
	            insertColumnWhenRowIsSelected: "Cannot insert column when all columns are selected.",
	            insertRowWhenColumnIsSelected: "Cannot insert row when all rows are selected.",
	            filterRangeContainingMerges: "Cannot create a filter within a range containing merges",
	            sortRangeContainingMerges: "Cannot sort a range containing merges",
	            cantSortMultipleSelection: "Cannot sort multiple selection",
	            cantSortNullRef: "Cannot sort empty selection",
	            cantSortMixedCells: "Cannot sort range containing cells of mixed shapes",
	            validationError: "The value that you entered violates the validation rules set on the cell.",
	            cannotModifyDisabled: "Cannot modify disabled cells."
	        },
	        tabs: {
	            home: "Home",
	            insert: "Insert",
	            data: "Data"
	        }
	    };

	    function selectElementContents(el) {
	        var sel = window.getSelection();
	        sel.removeAllRanges();

	        var range = document.createRange();
	        range.selectNodeContents(el);

	        sel.addRange(range);
	    }

	    function cellBefore(table, row) {
	        var cells = table.trs[row].children;
	        return cells[cells.length - 2];
	    }

	    function cellAbove(table, row) {
	        var prevRow = table.trs[row-1];
	        var index = table.trs[row].children.length-1;

	        if (prevRow && index >= 0) {
	            return prevRow.children[index];
	        }
	    }

	    function cellBorder(value) {
	        return (value.size || 1) + "px solid " + (value.color || "#000");
	    }

	    function asURL(link) {
	        if (!/:\/\//.test(link)) {
	            link = "http://" + link;
	        }
	        return link;
	    }

	    function drawCell(collection, cell, cls, showGrid) {
	        function maybeLink(el) {
	            var link = cell.link;
	            if (!link) {
	                if (typeof cell.value == "object") {
	                    link = cell.value.link;
	                }
	            }
	            if (link) {
	                var style = {
	                    textDecoration: "none"
	                };
	                if (cell.color) {
	                    style.color = cell.color;
	                }
	                if (cell.underline) {
	                    style.textDecoration = "underline";
	                }
	                return kendo.dom.element("a", {
	                    href   : asURL(link),
	                    style  : style,
	                    target : "_blank" // XXX: customizable?
	                }, el ? [ el ] : []);
	            }
	            return el;
	        }

	        var shouldDraw = (cell.value != null || (cell.validation != null && !cell.validation.value) || // jshint ignore:line
	                          cell.background || cell.merged);
	        if (!cls && !shouldDraw) {
	            return;
	        }

	        var style = {};
	        var background = cell.background;
	        if (background) {
	            var defaultBorder = background;
	            if (showGrid) {
	                // darken
	                defaultBorder = kendo.parseColor(defaultBorder).toHSV();
	                defaultBorder.v *= 0.9;
	                defaultBorder = defaultBorder.toCssRgba();
	            }
	            defaultBorder = cellBorder({ color: defaultBorder });
	            style.outline = defaultBorder;
	        }

	        if (background) {
	            style.backgroundColor = background;
	        }

	        if (cell.color) {
	            style.color = cell.color;
	        }

	        if (cell.fontFamily) {
	            style.fontFamily = cell.fontFamily;
	        }

	        if (cell.underline) {
	            style.textDecoration = "underline";
	        }

	        if (cell.italic) {
	            style.fontStyle = "italic";
	        }

	        if (cell.textAlign) {
	            style.textAlign = cell.textAlign;
	        }

	        if (cell.bold) {
	            style.fontWeight = "bold";
	        }

	        if (cell.fontSize) {
	            style.fontSize = cell.fontSize + "px";
	        }

	        if (cell.wrap === true) {
	            style.whiteSpace = "pre-wrap";
	            style.overflowWrap = "break-word";
	            style.wordWrap = "break-word";
	        }

	        style.left = (cell.left + 1) + "px";
	        style.top = (cell.top + 1) + "px";
	        style.width = (cell.width - 1) + "px";
	        style.height = (cell.height - 1) + "px";

	        var data = cell.value, type = typeof data;
	        if (cell.format && data != null) { // jshint ignore:line
	            data = kendo.spreadsheet.formatting.format(data, cell.format);
	            if (data.__dataType) {
	                type = data.__dataType;
	            }
	        } else if (data !== null && data !== undefined) {
	            data = kendo.dom.text(data);
	        }

	        if (!style.textAlign) {
	            switch (type) {
	              case "number":
	              case "date":
	              case "percent":
	              case "currency":
	                style.textAlign = "right";
	                break;
	              case "boolean":
	                style.textAlign = "center";
	                break;
	            }
	        }

	        var classNames = [ paneClassNames.cell ];

	        if (cls) {
	            classNames.push(cls);
	        }
	        if (cell.enable === false) {
	            classNames.push("k-state-disabled");
	        }
	        if (cell.merged) {
	            classNames.push("k-spreadsheet-merged-cell");
	        }

	        var verticalAlign = cell.verticalAlign || "bottom";

	        if (verticalAlign && data) {
	            data = kendo.dom.element("div", { className: "k-vertical-align-" + verticalAlign }, [ maybeLink(data) ]);
	        } else {
	            data = maybeLink(data);
	        }

	        var children = data ? [ data ] : [];
	        var properties = {
	            style: style
	        };
	        var validation = cell.validation;
	        if (validation && !validation.value) {
	            children.push(kendo.dom.element("span", { className: "k-dirty" }));
	            classNames.push("k-dirty-cell");

	            properties.title = validation.message;
	        }
	        properties.className = classNames.join(" ");

	        var div = kendo.dom.element("div", properties, children);
	        collection.push(div);
	        return div;
	    }

	    function addCell(table, row, cell) {
	        var style = {};

	        if (cell.background) {
	            style.backgroundColor = cell.background;
	        }

	        if (cell.color) {
	            style.color = cell.color;
	        }

	        if (cell.fontFamily) {
	            style.fontFamily = cell.fontFamily;
	        }

	        if (cell.underline) {
	            style.textDecoration = "underline";
	        }

	        if (cell.italic) {
	            style.fontStyle = "italic";
	        }

	        if (cell.textAlign) {
	            style.textAlign = cell.textAlign;
	        }

	        if (cell.verticalAlign) {
	            style.verticalAlign = (cell.verticalAlign === "center") ? "middle" : cell.verticalAlign;
	        }

	        if (cell.bold) {
	            style.fontWeight = "bold";
	        }

	        if (cell.fontSize) {
	            style.fontSize = cell.fontSize + "px";
	        }

	        if (cell.wrap === true) {
	            style.whiteSpace = "pre-wrap";
	            style.wordBreak = "break-all";
	        }

	        if (cell.borderRight) {
	            style.borderRight = cellBorder(cell.borderRight);
	        } else if (cell.background) {
	            style.borderRightColor = cell.background;
	        }

	        if (cell.borderBottom) {
	            style.borderBottom = cellBorder(cell.borderBottom);
	        } else if (cell.background) {
	            style.borderBottomColor = cell.background;
	        }

	        var data = cell.value, type = typeof data;
	        if (cell.format && data != null) { // jshint ignore:line
	            data = kendo.spreadsheet.formatting.format(data, cell.format);
	            if (data.__dataType) {
	                type = data.__dataType;
	            }
	        }

	        if (!style.textAlign) {
	            switch (type) {
	              case "number":
	              case "date":
	              case "percent":
	              case "currency":
	                style.textAlign = "right";
	                break;
	              case "boolean":
	                style.textAlign = "center";
	                break;
	            }
	        }

	        var className = null;

	        if (cell.enable === false) {
	            className = "k-state-disabled";
	        }

	        var td = table.addCell(row, data, style, className, cell.validation);

	        var border, sibling;

	        if (cell.borderLeft) {
	            sibling = cellBefore(table, row);
	            border = cellBorder(cell.borderLeft);
	            if (sibling && border) {
	                sibling.attr.style.borderRight = border;
	            }
	        } else if (cell.background) {
	            style.borderLeftColor = cell.background;
	        }

	        if (cell.borderTop) {
	            sibling = cellAbove(table, row);
	            border = cellBorder(cell.borderTop);
	            if (sibling && border) {
	                sibling.attr.style.borderBottom = border;
	            }
	        } else if (cell.background) {
	            style.borderTopColor = cell.background;
	        }

	        return td;
	    }

	    var HtmlTable = kendo.Class.extend({
	        init: function() {
	            this.cols = [];
	            this.trs = [];
	            this._height = 0;
	            this._width = 0;
	        },

	        addColumn: function(width) {
	            this._width += width;

	            var col = kendo.dom.element("col", { style: { width: width + "px" } });

	            col.visible = width > 0;

	            this.cols.push(col);
	        },

	        addRow: function(height) {
	            var attr = null;

	            attr = { style: { height: height + "px" } };

	            this._height += height;

	            var tr = kendo.dom.element("tr", attr);

	            tr.visible = height > 0;

	            this.trs.push(tr);
	        },

	        addCell: function(rowIndex, text, style, className, validation) {
	            if (text === null || text === undefined) {
	                text = "";
	            }
	            if (!(text instanceof kendo.dom.Node)) {
	                text = kendo.dom.text(text);
	            }

	            var children = [ text ];
	            var properties = { style: style };

	            if (validation && !validation.value) {
	                children.push(kendo.dom.element("span", { className: "k-dirty" }));

	                className = (className || "") + (className ? " " : "") + "k-dirty-cell";
	                properties.title = validation.message;
	            }

	            if (className) {
	                properties.className = className;
	            }
	            var td = kendo.dom.element("td", properties, children);

	            this.trs[rowIndex].children.push(td);
	            return td;
	        },

	        toDomTree: function(x, y, className) {
	            this.trs = this.trs.filter(function(tr) {
	                return tr.visible;
	            });

	            var offset = 0;
	            this.cols = this.cols.filter(function(col, ci) {
	                if (!col.visible) {
	                    this.trs.forEach(function(tr) {
	                        tr.children.splice(ci - offset, 1);
	                    });
	                    offset++;
	                }

	                return col.visible;
	            }, this);

	            return kendo.dom.element("table", { style: { left: x + "px", top: y + "px", height: this._height + "px", width: this._width + "px" }, className: className },
	                [
	                    kendo.dom.element("colgroup", null, this.cols),
	                    kendo.dom.element("tbody", null, this.trs)
	                ]);
	        }
	    });

	    var CELL_CONTEXT_MENU = '<ul class="#=classNames.cellContextMenu#">' +
	        '<li data-action=cut>Cut</li>' +
	        '<li data-action=copy>Copy</li>' +
	        '<li data-action=paste>Paste</li>' +
	        '<li class="k-separator"></li>' +
	        '<li data-action=merge>Merge</li>' +
	        '<li data-action=unmerge>Unmerge</li>' +
	    '</ul>';

	    var ROW_HEADER_CONTEXT_MENU = '<ul class="#=classNames.rowHeaderContextMenu#">' +
	        '<li data-action=cut>Cut</li>' +
	        '<li data-action=copy>Copy</li>' +
	        '<li data-action=paste>Paste</li>' +
	        '<li class="k-separator"></li>' +
	        '<li data-action="delete-row">Delete</li>'+
	        '<li data-action="hide-row">Hide</li>'+
	        '<li data-action="unhide-row">Unhide</li>'+
	    '</ul>';

	    var COL_HEADER_CONTEXT_MENU = '<ul class="#=classNames.colHeaderContextMenu#">' +
	        '<li data-action=cut>Cut</li>' +
	        '<li data-action=copy>Copy</li>' +
	        '<li data-action=paste>Paste</li>' +
	        '<li class="k-separator"></li>' +
	        '<li data-action="delete-column">Delete</li>'+
	        '<li data-action="hide-column">Hide</li>'+
	        '<li data-action="unhide-column">Unhide</li>'+
	    '</ul>';


	    kendo.spreadsheet.ContextMenu = kendo.ui.ContextMenu;

	    var VIEW_CONTENTS = kendo.template('<div class="#=classNames.view#"><div class="#=classNames.fixedContainer#"></div><div class="#=classNames.scroller#"><div class="#=classNames.viewSize#"></div></div>' +
	        '<div tabindex="0" class="#=classNames.clipboard#" contenteditable=true></div><div class="#=classNames.cellEditor#"></div></div><div class="#=classNames.sheetsBar#"></div>' +
	        CELL_CONTEXT_MENU + ROW_HEADER_CONTEXT_MENU + COL_HEADER_CONTEXT_MENU
	    );

	    function within(value, min, max) {
	        return value >= min && value <= max;
	    }

	    var View = kendo.Class.extend({
	        init: function(element, options) {
	            var classNames = View.classNames;

	            this.element = element;

	            this.options = $.extend(true, {
	                messages: kendo.spreadsheet.messages.view
	            }, this.options, options);

	            this._chrome();

	            this._dialogs = [];

	            element.append(VIEW_CONTENTS({ classNames: classNames }));

	            this._formulaInput();

	            this.wrapper =      element.find(DOT + classNames.view);
	            this.container =    element.find(DOT + classNames.fixedContainer)[0];
	            this.scroller =     element.find(DOT + classNames.scroller)[0];
	            this.clipboard =    element.find(DOT + classNames.clipboard);

	            this.viewSize = $(this.scroller.firstChild);

	            this.tree = new kendo.dom.Tree(this.container);
	            this.clipboardContents = new kendo.dom.Tree(this.clipboard[0]);

	            this.editor = new kendo.spreadsheet.SheetEditor(this);

	            this._sheetsbar();

	            var contextMenuConfig = {
	                target: element,
	                animation: false,
	                showOn: "never" // this is just an invalid event name to prevent the show
	            };

	            this.cellContextMenu = new kendo.spreadsheet.ContextMenu(element.find(DOT + classNames.cellContextMenu), contextMenuConfig);

	            this.colHeaderContextMenu = new kendo.spreadsheet.ContextMenu(element.find(DOT + classNames.colHeaderContextMenu), contextMenuConfig);

	            this.rowHeaderContextMenu = new kendo.spreadsheet.ContextMenu(element.find(DOT + classNames.rowHeaderContextMenu), contextMenuConfig);

	            var scrollbar = kendo.support.scrollbar();

	            $(this.container).css({
	                width: this.wrapper[0].clientWidth - scrollbar,
	                height: this.wrapper[0].clientHeight - scrollbar
	            });
	        },

	        enableClipboard: function(enable) {
	            this.isClipboardDeactivated = !enable;

	            if (enable) {
	                this.clipboard.attr("contenteditable", enable);
	            } else {
	                this.clipboard.removeAttr("contenteditable");
	            }
	        },

	        _resize: function() {
	            var outerHeight = kendo._outerHeight;
	            var tabstripHeight = this.tabstrip ? outerHeight(this.tabstrip.element) : 0;
	            var formulaBarHeight = this.formulaBar ? outerHeight(this.formulaBar.element) : 0;
	            var sheetsBarHeight = this.sheetsbar ? outerHeight(this.sheetsbar.element) : 0;

	            this.wrapper.height(
	                this.element.height() -
	                    (tabstripHeight + formulaBarHeight + sheetsBarHeight)
	            );

	            if (this.tabstrip) {
	                this.tabstrip.quickAccessAdjust();
	            }
	        },

	        _chrome: function() {
	            var wrapper = $("<div class='k-spreadsheet-action-bar' />").prependTo(this.element);

	            var nameEditor = $("<div class='k-spreadsheet-name-editor' />").appendTo(wrapper);
	            this.nameEditor = new kendo.spreadsheet.NameEditor(nameEditor, this.options);

	            var formulaBar = $("<div />").appendTo(wrapper);
	            this.formulaBar = new kendo.spreadsheet.FormulaBar(formulaBar);

	            if (this.options.toolbar) {
	                this._tabstrip();
	            }
	        },

	        _formulaInput: function() {
	            var editor = this.element.find(DOT + View.classNames.cellEditor);

	            this.formulaInput = new kendo.spreadsheet.FormulaInput(editor, {
	                autoScale: true
	            });
	        },

	        _sheetsbar: function() {
	            if (this.options.sheetsbar) {
	                var options = $.extend(true, {
	                    openDialog: this.openDialog.bind(this)
	                }, this.options.sheetsbar);

	                this.sheetsbar = new kendo.spreadsheet.SheetsBar(this.element.find(DOT + View.classNames.sheetsBar), options);
	            }
	        },

	        _tabstrip: function() {
	            var messages = this.options.messages.tabs;
	            var options = $.extend(true, { home: true, insert: true, data: true }, this.options.toolbar);
	            var tabs = [];

	            if (this.tabstrip) {
	                this.tabstrip.destroy();
	                this.element.children(".k-tabstrip").remove();
	            }

	            for (var name in options) {
	                if (options[name] === true || options[name] instanceof Array) {
	                    tabs.push({ id: name, text: messages[name], content: "" });
	                }
	            }

	            this.tabstrip = new kendo.spreadsheet.TabStrip($("<div />").prependTo(this.element), {
	                animation: false,
	                dataTextField: "text",
	                dataContentField: "content",
	                dataSource: tabs,
	                toolbarOptions: options,
	                view: this
	            });

	            this.tabstrip.select(0);
	        },

	        _executeCommand: function(e) {
	            this._sheet.trigger("commandRequest", e);
	        },

	        workbook: function(workbook) {
	            this._workbook = workbook;
	            this.nameEditor._workbook = workbook;
	        },

	        sheet: function(sheet) {
	            this._sheet = sheet;
	        },

	        activeCellRectangle: function() {
	            return this.cellRectangle(this._sheet._viewActiveCell());
	        },

	        _rectangle: function(pane, ref) {
	            return pane._grid.boundingRectangle(ref.toRangeRef());
	        },

	        isColumnResizer: function(x, pane, ref) {
	            var rectangle = this._rectangle(pane, ref);

	            x -= this._sheet._grid._headerWidth;

	            var handleWidth = RESIZE_HANDLE_WIDTH/2;
	            var right = rectangle.right - this.scroller.scrollLeft;

	            return right - handleWidth <= x && x <= right + handleWidth;
	        },

	        isRowResizer: function(y, pane, ref) {
	            var rectangle = this._rectangle(pane, ref);

	            y -= this._sheet._grid._headerHeight;

	            var handleWidth = RESIZE_HANDLE_WIDTH/2;
	            var bottom = rectangle.bottom - this.scroller.scrollTop;

	            return bottom - handleWidth <= y && y <= bottom + handleWidth;
	        },

	        isFilterIcon: function(x, y, pane, ref) {
	            var theGrid = pane._grid;
	            var scrollTop = theGrid.rows.frozen ? 0 : this.scroller.scrollTop;
	            var scrollLeft = theGrid.columns.frozen ? 0 : this.scroller.scrollLeft;

	            x -= this._sheet._grid._headerWidth - scrollLeft;
	            y -= this._sheet._grid._headerHeight - scrollTop;

	            var result = false;
	            this._sheet.forEachFilterHeader(ref, function(ref) {
	                if (!result) {
	                    var rect = this._rectangle(pane, ref);
	                    result = pane.filterIconRect(rect).intersects(x, y);
	                }
	            }.bind(this));
	            return result;
	        },

	        isAutoFill: function(x, y, pane) {
	            var selection = this._sheet.select();

	            if (selection.size > 1) {
	                return false;
	            }

	            x -= this._sheet._grid._headerWidth;
	            y -= this._sheet._grid._headerHeight;

	            if (!pane._grid.columns.frozen) {
	                x += this.scroller.scrollLeft;
	            }

	            if (!pane._grid.rows.frozen) {
	                y += this.scroller.scrollTop;
	            }

	            var rectangle = this._rectangle(pane, selection);

	            return Math.abs(rectangle.right - x) < 8 && Math.abs(rectangle.bottom - y) < 8;
	        },

	        isEditButton: function(x, y, column, columnCount) {
	            var ed = this._sheet.activeCellCustomEditor();
	            if (ed) {
	                var editorOnLastColumn = column == columnCount - 2;
	                var r = this.activeCellRectangle();
	                // XXX: hard-coded button width (20)
	                if (y >= r.top && y <= r.bottom) {
	                    return editorOnLastColumn ? x < r.left && x >= r.left - 20
	                        : x > r.right && x <= r.right + 20;
	                }
	            }
	        },

	        objectAt: function(x, y) {
	            var grid = this._sheet._grid;
	            var object, pane;

	            if (x < 0 || y < 0 || x > this.scroller.clientWidth || y > this.scroller.clientHeight) {
	                object = { type: "outside" };
	            } else if (x < grid._headerWidth && y < grid._headerHeight) {
	                object = { type: "topcorner" };
	            } else {
	                pane = this.paneAt(x, y);

	                if (!pane) {
	                    object = { type: "outside" };
	                } else {
	                    var row = pane._grid.rows.indexVisible(y, this.scroller.scrollTop);
	                    var column = pane._grid.columns.indexVisible(x, this.scroller.scrollLeft);

	                    var type = "cell";
	                    var ref = new CellRef(row, column);
	                    var selecting = this._sheet.selectionInProgress();

	                    if (this.isAutoFill(x, y, pane)) {
	                        type = "autofill";
	                    } else if (this.isFilterIcon(x, y, pane, ref)) {
	                        type = "filtericon";
	                    } else if (!selecting && x < grid._headerWidth) {
	                        ref = new CellRef(row, -Infinity);
	                        type = this.isRowResizer(y, pane, ref) ? "rowresizehandle" : "rowheader";
	                    } else if (!selecting && y < grid._headerHeight) {
	                        ref = new CellRef(-Infinity, column);
	                        type = this.isColumnResizer(x, pane, ref) ? "columnresizehandle" : "columnheader";
	                    } else if (this.isEditButton(x, y, column, grid.columnCount)) {
	                        type = "editor";
	                    }

	                    object = { type: type, ref: ref };
	                }
	            }

	            object.pane = pane;
	            object.x = x;
	            object.y = y;
	            return object;
	        },

	        paneAt: function(x, y) {
	            return this.panes.filter(function paneLocationWithin(pane) {
	                var grid = pane._grid;
	                return within(y, grid.top, grid.bottom) && within(x, grid.left, grid.right);
	            })[0];
	        },

	        containingPane: function(cell) {
	            return this.panes.filter(function(pane) {
	                if (pane._grid.contains(cell)) {
	                    return true;
	                }
	                return false;
	            })[0];
	        },

	        cellRectangle: function(cell) {
	            var theGrid = this.containingPane(cell)._grid;
	            var rectangle = this._sheet._grid.rectangle(cell);

	            return rectangle.offset(
	                theGrid.headerWidth - (theGrid.columns.frozen ? 0 : this.scroller.scrollLeft),
	                theGrid.headerHeight - (theGrid.rows.frozen ? 0 : this.scroller.scrollTop)
	            );
	        },

	        refresh: function(reason) {
	            var sheet = this._sheet;

	            if (this.tabstrip) {
	                this.tabstrip.refreshTools(sheet.range(sheet.activeCell()));
	            }

	            if (reason.sheetSelection && this.sheetsbar) {
	                this.sheetsbar.renderSheets(this._workbook.sheets(), this._workbook.sheetIndex(this._sheet));
	            }

	            this._resize();

	            //TODO: refresh sheets list on sheetSelection
	            this.viewSize[0].style.height = sheet._grid.totalHeight() + "px";
	            this.viewSize[0].style.width = sheet._grid.totalWidth() + "px";

	            if (reason.layout) {
	                var frozenColumns = sheet.frozenColumns();
	                var frozenRows = sheet.frozenRows();

	                // main or bottom or right pane
	                this.panes = [ this._pane(frozenRows, frozenColumns) ];

	                // left pane
	                if (frozenColumns > 0) {
	                    this.panes.push(this._pane(frozenRows, 0, null, frozenColumns));
	                }

	                // top pane
	                if (frozenRows > 0) {
	                    this.panes.push(this._pane(0, frozenColumns, frozenRows, null));
	                }

	                // left-top "fixed" pane
	                if (frozenRows > 0 && frozenColumns > 0) {
	                    this.panes.push(this._pane(0, 0, frozenRows, frozenColumns));
	                }
	            }

	            if (reason.filter) {
	                this._destroyFilterMenu();
	            }

	            if (reason.activeCell) {
	                this._focus = sheet.activeCell().toRangeRef();
	            }
	        },

	        createFilterMenu: function(column) {
	            if (this._filterMenu && this._filterMenu.options.column == column) {
	                return this._filterMenu;
	            }

	            this._destroyFilterMenu();

	            var sheet = this._sheet;
	            var ref = sheet.filter().ref;
	            var range = new kendo.spreadsheet.Range(ref, sheet);
	            var element = $("<div />").appendTo(this.element);
	            var options = { column: column, range: range };
	            var filterMenu = new kendo.spreadsheet.FilterMenu(element, options);

	            this._filterMenu = filterMenu;

	            return filterMenu;
	        },

	        selectClipBoardContents: function() {
	            if (!this.isClipboardDeactivated) {
	                this.clipboard.focus();
	                selectElementContents(this.clipboard[0]);
	            }
	        },

	        scrollIntoView: function(cell) {
	            var willScroll = false;
	            var theGrid = this.containingPane(cell)._grid;

	            var boundaries = theGrid.scrollBoundaries(cell);

	            var scroller = this.scroller;
	            var scrollTop = theGrid.rows.frozen ? 0 : scroller.scrollTop;
	            var scrollLeft = theGrid.columns.frozen ? 0 : scroller.scrollLeft;

	            if (boundaries.top < scrollTop) {
	                willScroll = true;
	                scroller.scrollTop = boundaries.scrollTop;
	            }

	            if (boundaries.bottom > scrollTop) {
	                willScroll = true;
	                scroller.scrollTop = boundaries.scrollBottom;
	            }

	            if (boundaries.left < scrollLeft) {
	                willScroll = true;
	                scroller.scrollLeft = boundaries.scrollLeft;
	            }

	            if (boundaries.right > scrollLeft) {
	                willScroll = true;
	                scroller.scrollLeft = boundaries.scrollRight;
	            }

	            return willScroll;
	        },

	        _destroyDialog: function() {
	            this._dialogs.pop();
	        },

	        openCustomEditor: function() {
	            var self = this;
	            var cell = self._sheet.activeCell().first();
	            var editor = self._sheet.activeCellCustomEditor();
	            var range = self._sheet.range(cell);
	            editor.edit({
	                range      : range,
	                rect       : self.activeCellRectangle(),
	                view       : this,
	                validation : this._sheet.validation(cell),
	                callback   : function(value, parse){
	                    self._executeCommand({
	                        command: "EditCommand",
	                        options: {
	                            operatingRange: range,
	                            property: parse ? "input" : "value",
	                            value: value
	                        }
	                    });
	                }
	            });
	        },

	        openDialog: function(name, options) {
	            var dialog = kendo.spreadsheet.dialogs.create(name, options);

	            if (dialog) {
	                dialog.bind("action", this._executeCommand.bind(this));
	                dialog.bind("deactivate", this._destroyDialog.bind(this));
	                this._dialogs.push(dialog);

	                var sheet = this._sheet;
	                var ref = sheet.activeCell();
	                var range = new kendo.spreadsheet.Range(ref, sheet);

	                dialog.open(range);
	                return dialog;
	            }
	        },

	        showError: function(options, reopenEditor) {
	            var errorMessages = this.options.messages.errors;

	            var focusButton = function(e) {
	                var cont = e.sender.dialog().element;
	                cont.find(".k-button:first").focus();
	                cont.find(".k-button, input").on("keydown", function(ev){
	                    if (ev.keyCode == kendo.keys.ESC) {
	                        e.sender.close();
	                    }
	                });
	            };

	            var onClose = function(e) {
	                var dlg = e.sender;
	                this.selectClipBoardContents();
	                if (dlg._retry && reopenEditor) {
	                    reopenEditor();
	                }
	            }.bind(this);

	            if (kendo.spreadsheet.dialogs.registered(options.type)) {
	                var dialogOptions = {
	                    close: onClose
	                };

	                if (options.type === "validationError") {
	                    dialogOptions = $.extend(dialogOptions, {
	                        title: options.title || "Error",
	                        text: options.body ? options.body : errorMessages[options.type],
	                        activate: focusButton
	                    });
	                }

	                this.openDialog(options.type, dialogOptions);
	            } else {
	                this.openDialog("message", {
	                    title : options.title || "Error",
	                    text  : options.body ? options.body : errorMessages[options.type],
	                    activate: focusButton,
	                    close: onClose
	                });
	            }
	        },

	        destroy: function() {
	            this._dialogs.forEach(function(dialog) {
	                dialog.destroy();
	            });
	            this.cellContextMenu.destroy();
	            this.rowHeaderContextMenu.destroy();
	            this.colHeaderContextMenu.destroy();

	            if (this.tabstrip) {
	                this.tabstrip.destroy();
	            }

	            this._destroyFilterMenu();
	        },

	        _destroyFilterMenu: function() {
	            if (this._filterMenu) {
	                this._filterMenu.destroy();
	                this._filterMenu = undefined;
	                this._filterMenuColumn = undefined;
	            }
	        },

	        render: function() {
	            if (!this.element.is(":visible")) {
	                return;
	            }
	            var sheet = this._sheet;
	            var focus = sheet.focus();

	            if (focus && this.scrollIntoView(focus)) {
	                return;
	            }

	            var resizeDirection =
	                !sheet.resizingInProgress() ? "none" :
	                sheet.resizeHandlePosition().col === -Infinity ? "column" :
	                "row";

	            this.wrapper
	                .toggleClass(viewClassNames.editContainer, this.editor.isActive())
	                .toggleClass(viewClassNames.horizontalResize, resizeDirection == "row")
	                .toggleClass(viewClassNames.verticalResize, resizeDirection == "column");

	            var grid = sheet._grid;

	            var scrollTop = this.scroller.scrollTop;
	            var scrollLeft = this.scroller.scrollLeft;

	            if (scrollTop < 0) {
	                scrollTop = 0;
	            }

	            if (scrollLeft < 0) {
	                scrollLeft = 0;
	            }

	            var result = this.panes.map(function(pane) {
	                return pane.render(scrollLeft, scrollTop);
	            });

	            var topCorner = kendo.dom.element("div", {
	                style: { width: grid._headerWidth + "px", height: grid._headerHeight + "px" },
	                className: View.classNames.topCorner
	            });

	            result.push(topCorner);

	            if (sheet.resizeHandlePosition() && sheet.resizeHintPosition()) {
	                result.push(this.renderResizeHint());
	            }

	            this.tree.render(result);

	            if (this.editor.isActive()) {
	                this.editor.toggleTooltip(this.activeCellRectangle());
	            } else if (!sheet.selectionInProgress() && !sheet.resizingInProgress() && !sheet.isInEditMode()) {
	                this.renderClipboardContents();
	            }
	        },

	        renderResizeHint: function() {
	            var sheet = this._sheet;
	            var ref = sheet.resizeHandlePosition();

	            var horizontal = ref.col !== -Infinity;

	            var style;
	            if (horizontal) {
	                style = {
	                    height: this.scroller.clientHeight + "px",
	                    width: RESIZE_HANDLE_WIDTH + "px",
	                    left: sheet.resizeHintPosition().x + "px",
	                    top: "0px"
	                };
	            } else {
	                style = {
	                    height: RESIZE_HANDLE_WIDTH + "px",
	                    width: this.scroller.clientWidth + "px",
	                    top: sheet.resizeHintPosition().y + "px",
	                    left: "0px"
	                };
	            }

	            var classNames = Pane.classNames;

	            return kendo.dom.element("div", {
	                className: classNames.resizeHint + (!horizontal ? " " + classNames.resizeHintVertical : ""),
	                style: style
	            },[
	                kendo.dom.element("div", { className: classNames.resizeHintHandle }),
	                kendo.dom.element("div", { className: classNames.resizeHintMarker })
	            ]);
	        },

	        renderClipboardContents: function() {
	            var sheet = this._sheet;
	            var grid = sheet._grid;

	            var selection = sheet.select().toRangeRef();
	            var status = this._workbook.clipboard().canCopy();
	            if(status.canCopy === false && status.multiSelection) {
	                this.clipboardContents.render([]);
	                this.selectClipBoardContents();
	                return;
	            }

	            selection = sheet.trim(selection);

	            var table = new HtmlTable();

	            var selectionView = grid.rangeDimensions(selection);

	            selectionView.rows.forEach(function(height) {
	                table.addRow(height);
	            });

	            selectionView.columns.forEach(function(width) {
	                table.addColumn(width);
	            });

	            var tmp = sheet._getMergedCells(selection);
	            var primaryMergedCells = tmp.primary;
	            var secondaryMergedCells = tmp.secondary;

	            sheet.forEach(selection, function(row, col, cell) {
	                var location = new CellRef(row, col).print();

	                if (!secondaryMergedCells[location]) {
	                    var td = addCell(table, row - selection.topLeft.row, cell);

	                    var mergedCell = primaryMergedCells[location];

	                    if (mergedCell) {
	                       td.attr.colspan = mergedCell.width();
	                       td.attr.rowspan = mergedCell.height();
	                    }
	                }
	            });
	            this.clipboardContents.render([ table.toDomTree(0, 0, "kendo-clipboard-" + this._workbook.clipboard()._uid) ]);

	            this.selectClipBoardContents();
	        },

	        _pane: function(row, column, rowCount, columnCount) {
	            var pane = new Pane(this._sheet, this._sheet._grid.pane({ row: row, column: column, rowCount: rowCount, columnCount: columnCount }));
	            pane.refresh(this.scroller.clientWidth, this.scroller.clientHeight);
	            return pane;
	        }
	    });

	    var paneClassNames = {
	        cell: "k-spreadsheet-cell",
	        vaxis: "k-spreadsheet-vaxis",
	        haxis: "k-spreadsheet-haxis",
	        vborder: "k-spreadsheet-vborder",
	        hborder: "k-spreadsheet-hborder",
	        rowHeader: "k-spreadsheet-row-header",
	        columnHeader: "k-spreadsheet-column-header",
	        pane: "k-spreadsheet-pane",
	        data: "k-spreadsheet-data",
	        mergedCell: "k-spreadsheet-merged-cell",
	        mergedCellsWrapper: "k-merged-cells-wrapper",
	        activeCell: "k-spreadsheet-active-cell",
	        selection: "k-spreadsheet-selection",
	        selectionWrapper: "k-selection-wrapper",
	        autoFillWrapper: "k-auto-fill-wrapper",
	        single: "k-single",
	        top: "k-top",
	        right: "k-right",
	        bottom: "k-bottom",
	        left: "k-left",
	        resizeHandle: "k-resize-handle",
	        columnResizeHandle: "k-column-resize-handle",
	        rowResizeHandle: "k-row-resize-handle",
	        resizeHint: "k-resize-hint",
	        resizeHintHandle: "k-resize-hint-handle",
	        resizeHintMarker: "k-resize-hint-marker",
	        resizeHintVertical: "k-resize-hint-vertical",
	        selectionHighlight: "k-spreadsheet-selection-highlight",
	        series: [
	            "k-series-a",
	            "k-series-b",
	            "k-series-c",
	            "k-series-d",
	            "k-series-e",
	            "k-series-f"
	        ]
	    };

	    var Pane = kendo.Class.extend({
	        init: function(sheet, grid) {
	            this._sheet = sheet;
	            this._grid = grid;
	        },

	        refresh: function(width, height) {
	            this._grid.refresh(width, height);
	        },

	        isVisible: function(scrollLeft, scrollTop, ref) {
	            return this._grid.view(scrollLeft, scrollTop).ref.intersects(ref);
	        },

	        render: function(scrollLeft, scrollTop) {
	            var classNames = Pane.classNames;
	            var sheet = this._sheet;
	            var grid = this._grid;

	            var view = grid.view(scrollLeft, scrollTop);
	            this._currentView = view;
	            this._currentRect = this._rectangle(view.ref);
	            this._selectedHeaders = sheet.selectedHeaders();

	            var children = [];

	            children.push(this.renderData());

	            children.push(this.renderSelection());

	            children.push(this.renderAutoFill());

	            children.push(this.renderEditorSelection());

	            children.push(this.renderFilterHeaders());

	            if (grid.hasRowHeader) {
	                var rowHeader = kendo.dom.element("div", {
	                    className: classNames.rowHeader,
	                    style: {
	                        width: grid.headerWidth + "px",
	                        top: view.rowOffset + "px"
	                    }
	                });
	                children.push(rowHeader);
	                sheet.forEach(view.ref.leftColumn(), function(row){
	                    if (!sheet.isHiddenRow(row)) {
	                        var text = row + 1, height = sheet.rowHeight(row);
	                        rowHeader.children.push(kendo.dom.element("div", {
	                            className: this.headerClassName(row, "row"),
	                            style: {
	                                width: grid.headerWidth + "px",
	                                height: height + "px"
	                            }
	                        }, [ kendo.dom.element("div", {
	                            className: "k-vertical-align-center"
	                        }, [ kendo.dom.text(text+"") ])]));
	                    }
	                }.bind(this));
	            }

	            if (grid.hasColumnHeader) {
	                var columnHeader = kendo.dom.element("div", {
	                    className: classNames.columnHeader,
	                    style: {
	                        top: "0px",
	                        left: view.columnOffset + "px",
	                        width: this._currentRect.width + "px",
	                        height: grid.headerHeight + "px"
	                    }
	                });
	                children.push(columnHeader);
	                var left = 0;
	                sheet.forEach(view.ref.topRow(), function(row, col){
	                    if (!sheet.isHiddenColumn(col)) {
	                        var text = kendo.spreadsheet.Ref.display(null, Infinity, col),
	                            width = sheet.columnWidth(col);
	                        columnHeader.children.push(kendo.dom.element("div", {
	                            className: this.headerClassName(col, "col"),
	                            style: {
	                                position: "absolute",
	                                left: left + "px",
	                                width: width + "px",
	                                height: grid.headerHeight + "px"
	                            }
	                        }, [ kendo.dom.element("div", {
	                            className: "k-vertical-align-center"
	                        }, [ kendo.dom.text(text+"") ])]));
	                        left += width;
	                    }
	                }.bind(this));
	            }

	            if (sheet.resizeHandlePosition() && (grid.hasColumnHeader || grid.hasRowHeader)) {
	                var ref = sheet._grid.normalize(sheet.resizeHandlePosition());

	                if (view.ref.intersects(ref)) {
	                    if (!sheet.resizeHintPosition()) {
	                        children.push(this.renderResizeHandle());
	                    }
	                }
	            }

	            var paneClasses = [classNames.pane];

	            if (grid.hasColumnHeader) {
	                paneClasses.push(classNames.top);
	            }

	            if (grid.hasRowHeader) {
	                paneClasses.push(classNames.left);
	            }

	            return kendo.dom.element("div", {
	                style: grid.style,
	                className: paneClasses.join(" ")
	            }, children);
	        },

	        headerClassName: function(index, type) {
	            var selectedHeaders = this._selectedHeaders;

	            var itemSelection;
	            var allHeaders;

	            if (type === "row") {
	                itemSelection = selectedHeaders.rows[index];
	                allHeaders = selectedHeaders.allRows;
	            } else {
	                itemSelection = selectedHeaders.cols[index];
	                allHeaders = selectedHeaders.allCols;
	            }

	            var className = itemSelection || (selectedHeaders.all ? "full" : (allHeaders ? "partial" : "none"));

	            if (className) {
	                className = "k-selection-" + className;
	            }

	            return className;
	        },

	        renderData: function() {
	            var sheet = this._sheet;
	            var view = this._currentView;
	            var cont = kendo.dom.element("div", {
	                className: Pane.classNames.data,
	                style: {
	                    position: "relative",
	                    left: view.columnOffset + "px",
	                    top: view.rowOffset + "px"
	                }
	            });
	            var rect = this._currentRect;
	            var layout = kendo.spreadsheet.draw.doLayout(sheet, view.ref, { forScreen: true }), prev;
	            var showGridLines = sheet._showGridLines;
	            if (showGridLines) {
	                // draw axis first
	                prev = null;
	                layout.xCoords.forEach(function(x){
	                    if (x !== prev) {
	                        prev = x;
	                        cont.children.push(kendo.dom.element("div", {
	                            className: paneClassNames.vaxis,
	                            style: {
	                                left: x + "px",
	                                height: rect.height + "px",
	                                borderColor: sheet.gridLinesColor()
	                            }
	                        }));
	                    }
	                });
	                prev = null;
	                layout.yCoords.forEach(function(y){
	                    if (y !== prev) {
	                        prev = y;
	                        cont.children.push(kendo.dom.element("div", {
	                            className: paneClassNames.haxis,
	                            style: {
	                                top: y + "px",
	                                width: rect.width + "px",
	                                borderColor: sheet.gridLinesColor()
	                            }
	                        }));
	                    }
	                });
	            }
	            var borders = kendo.spreadsheet.draw.Borders();
	            layout.cells.forEach(function(cell){
	                borders.add(cell);
	                drawCell(cont.children, cell, null, showGridLines);
	            });
	            borders.vert.forEach(function(a){
	                a.forEach(function(b){
	                    if (!b.rendered) {
	                        b.rendered = true;
	                        var style = {
	                            left        : b.x + "px",
	                            top         : b.top + "px",
	                            height      : (b.bottom - b.top + 1) + "px",
	                            borderWidth : b.size + "px",
	                            borderColor : b.color
	                        };
	                        if (b.size != 1) {
	                            style.transform = "translateX(-" + (b.size-1)/2 + "px)";
	                        }
	                        cont.children.push(kendo.dom.element("div", {
	                            className: paneClassNames.vborder,
	                            style: style
	                        }));
	                    }
	                });
	            });
	            borders.horiz.forEach(function(a){
	                a.forEach(function(b){
	                    if (!b.rendered) {
	                        b.rendered = true;
	                        var style = {
	                            top         : b.y + "px",
	                            left        : b.left + "px",
	                            width       : (b.right - b.left) + "px",
	                            borderWidth : b.size + "px",
	                            borderColor : b.color
	                        };
	                        if (b.size != 1) {
	                            style.transform = "translateY(-" + (b.size-1)/2 + "px)";
	                        }
	                        cont.children.push(kendo.dom.element("div", {
	                            className: paneClassNames.hborder,
	                            style: style
	                        }));
	                    }
	                });
	            });
	            return cont;
	        },

	        renderResizeHandle: function() {
	            var sheet = this._sheet;
	            var ref = sheet.resizeHandlePosition();
	            var rectangle = this._rectangle(ref);
	            var classNames = [ Pane.classNames.resizeHandle ];

	            var style;
	            if (ref.col !== -Infinity) {
	                style = {
	                    height: this._grid.headerHeight + "px",
	                    width: RESIZE_HANDLE_WIDTH + "px",
	                    left: rectangle.right - RESIZE_HANDLE_WIDTH/2  + "px",
	                    top: "0px"
	                };
	                classNames.push(viewClassNames.horizontalResize);
	            } else {
	                style = {
	                    height: RESIZE_HANDLE_WIDTH + "px",
	                    width:  this._grid.headerWidth + "px",
	                    top: rectangle.bottom - RESIZE_HANDLE_WIDTH/2  + "px",
	                    left: "0px"
	                };
	                classNames.push(viewClassNames.verticalResize);
	            }
	            return kendo.dom.element("div", {
	                className: classNames.join(" "),
	                style: style
	            });
	        },

	        filterIconRect: function(rect) {
	            var BUTTON_SIZE = 16;
	            var BUTTON_OFFSET = 3;

	            return new kendo.spreadsheet.Rectangle(
	                rect.right - BUTTON_SIZE - BUTTON_OFFSET,
	                rect.top + BUTTON_OFFSET,
	                BUTTON_SIZE,
	                BUTTON_SIZE
	            );
	        },

	        renderFilterHeaders: function() {
	            var sheet = this._sheet;
	            var children = [];
	            var classNames = View.classNames;
	            var filter = sheet.filter();

	            function icon(className) {
	                return kendo.dom.element("span", {
	                    className: classNames.icon + " " + className
	                });
	            }

	            function filterButton(classNames, position, index) {
	                var style = {
	                    left: position.left + "px",
	                    top: position.top + "px"
	                };
	                var filtered = filter && filter.columns.some(function(c) {
	                    return c.index === index;
	                });
	                var classes = classNames.filterButton;

	                if (filtered) {
	                    classes += " " + classNames.filterButtonActive;
	                }

	                var button = kendo.dom.element(
	                    "span",
	                    { className: classes, style: style },
	                    [ icon(classNames.iconFilterDefault) ]
	                );

	                return button;
	            }

	            if (filter) {
	                this._addDiv(children, filter.ref, classNames.filterRange);
	            }

	            sheet.forEachFilterHeader(this._currentView.ref, function(ref) {
	                var rect = this._rectangle(ref);
	                var position = this.filterIconRect(rect);
	                var column = this._sheet.filterColumn(ref);
	                var button = filterButton(classNames, position, column);

	                children.push(button);
	            }.bind(this));

	            return kendo.dom.element("div", {
	                className: classNames.filterHeadersWrapper
	            }, children);

	        },

	        renderEditorSelection: function() {
	            var classNames = Pane.classNames;
	            var sheet = this._sheet;
	            var selections = [];

	            sheet._formulaSelections.forEach(function(range) {
	                var ref = range.ref;

	                if (ref === kendo.spreadsheet.NULLREF) {
	                    return;
	                }

	                this._addDiv(selections, ref, classNames.selectionHighlight + " " + range.colorClass);
	            }.bind(this));

	            return kendo.dom.element("div", { className: classNames.selectionWrapper }, selections);

	        },

	        renderSelection: function() {
	            var classNames = Pane.classNames;
	            var selections = [];
	            var activeCellClasses = [classNames.activeCell];
	            var selectionClasses = [classNames.selection];
	            var sheet = this._sheet;
	            var activeCell = sheet.activeCell().toRangeRef();
	            var activeFormulaColor = this._activeFormulaColor();
	            var selection = sheet.select();

	            activeCellClasses = activeCellClasses.concat(activeFormulaColor, this._directionClasses(activeCell));
	            selectionClasses = selectionClasses.concat(activeFormulaColor);

	            if (sheet.singleCellSelection()) {
	                activeCellClasses.push(classNames.single);
	            }

	            if (selection.size() === 1) {
	                selectionClasses.push("k-single-selection");
	            }

	            if (this._sheet.autoFillPunch()) {
	               selectionClasses.push("k-dim-auto-fill-handle");
	            }

	            selection.forEach(function(ref) {
	                if (ref !== kendo.spreadsheet.NULLREF) {
	                    this._addDiv(selections, ref, selectionClasses.join(" "));
	                }
	            }.bind(this));

	            this._addTable(selections, activeCell, activeCellClasses.join(" "));

	            return kendo.dom.element("div", { className: classNames.selectionWrapper }, selections);
	        },

	        renderAutoFill: function() {
	            var autoFillRectangle = [];

	            if (this._sheet.autoFillInProgress()) {
	                var autoFillRef = this._sheet.autoFillRef();
	                var punch = this._sheet.autoFillPunch();
	                var direction = this._sheet._autoFillDirection;

	                this._addDiv(autoFillRectangle, autoFillRef, "k-auto-fill");

	                if (punch) { // collapsing, add overlay
	                    this._addDiv(autoFillRectangle, punch, "k-auto-fill-punch");
	                } else if (direction !== undefined) { // expanding - add hint
	                    var ref, cssClass;

	                    switch(direction) {
	                        case 0:
	                            ref = autoFillRef.bottomRight;
	                            cssClass = "k-auto-fill-br-hint";
	                            break;
	                        case 1:
	                            ref = autoFillRef.bottomRight;
	                            cssClass = "k-auto-fill-br-hint";
	                            break;
	                        case 2:
	                            ref = new CellRef(autoFillRef.topLeft.row, autoFillRef.bottomRight.col);
	                            cssClass = "k-auto-fill-tr-hint";
	                            break;
	                        case 3:
	                            ref = new CellRef(autoFillRef.bottomRight.row, autoFillRef.topLeft.col);
	                            cssClass = "k-auto-fill-bl-hint";
	                            break;
	                    }

	                    var hint = kendo.dom.element("span", { className: "k-tooltip" }, [ kendo.dom.text(this._sheet._autoFillHint) ]);

	                    var rectangle = this._addDiv(autoFillRectangle, ref, cssClass);
	                    if (rectangle) {
	                        rectangle.children.push(hint);
	                    }
	                }
	            }

	            return kendo.dom.element("div", { className: Pane.classNames.autoFillWrapper }, autoFillRectangle);
	        },

	        _addDiv: function(collection, ref, className) {
	            var view = this._currentView, div;

	            if (view.ref.intersects(ref)) {
	                div = this._rectangle(ref).resize(1, 1).toDiv(className);
	                collection.push(div);
	            }
	            return div;
	        },

	        _addTable: function(collection, ref, className) {
	            var self = this;
	            var sheet = self._sheet;
	            var view = self._currentView;
	            var columnCount = self._grid.columns._axis._count;

	            if (view.ref.intersects(ref)) {
	                var rectangle = self._rectangle(ref);
	                var ed = self._sheet.activeCellCustomEditor();
	                sheet.forEach(ref.collapse(), function(row, col, cell) {
	                    cell.left = rectangle.left;
	                    cell.top = rectangle.top;
	                    cell.width = rectangle.width;
	                    cell.height = rectangle.height;
	                    drawCell(collection, cell, className, true);

	                    if (ed) {
	                        var btnClass = "k-button k-spreadsheet-editor-button";
	                        var isLastColumn = col == columnCount - 1;
	                        if (isLastColumn) {
	                            btnClass += " k-spreadsheet-last-column";
	                        }
	                        var btn = kendo.dom.element("div", {
	                            className: btnClass,
	                            style: {
	                                left   : (cell.left + (isLastColumn ? 0 : cell.width)) + "px",
	                                top    : cell.top + "px",
	                                height : cell.height + "px"
	                            }
	                        });
	                        if (ed.icon) {
	                            btn.children.push(kendo.dom.element("span", {
	                                className: "k-icon " + ed.icon
	                            }));
	                        }
	                        collection.push(btn);
	                    }
	                });
	            }
	        },

	        _activeFormulaColor: function() {
	            var activeFormulaSelection;
	            var colorClasses = [];

	            if (this._sheet.isInEditMode()) {
	                activeFormulaSelection = this._sheet._formulaSelections.filter(function(sel) { return sel.active && sel.type == "ref"; })[0];

	                if (activeFormulaSelection) {
	                    colorClasses.push(activeFormulaSelection.colorClass);
	                }
	            }

	            return colorClasses;
	        },

	        _directionClasses: function(cell) {
	            var cellClasses = [];
	            var classNames = Pane.classNames;
	            var view = this._currentView.ref;

	            if (!cell.move(0, -1).intersects(view)) {
	                cellClasses.push(classNames.left);
	            }

	            if (!cell.move(-1, 0).intersects(view)) {
	                cellClasses.push(classNames.top);
	            }

	            if (!cell.move(0, 1).intersects(view)) {
	                cellClasses.push(classNames.right);
	            }

	            if (!cell.move(1, 0).intersects(view)) {
	                cellClasses.push(classNames.bottom);
	            }

	            return cellClasses;
	        },

	        _rectangle: function(ref) {
	            return this._grid.boundingRectangle(ref.toRangeRef()).offset(-this._currentView.mergedCellLeft, -this._currentView.mergedCellTop);
	        }
	    });

	    kendo.spreadsheet.View = View;
	    kendo.spreadsheet.Pane = Pane;
	    kendo.spreadsheet.drawCell = drawCell;

	    $.extend(true, View, { classNames: viewClassNames });
	    $.extend(true, Pane, { classNames: paneClassNames });

	})(window.kendo);
	}, __webpack_require__(3));


/***/ }),

/***/ 1475:
/***/ (function(module, exports) {

	module.exports = require("../kendo.menu");

/***/ }),

/***/ 1476:
/***/ (function(module, exports) {

	module.exports = require("./sheetsbar");

/***/ })

/******/ });