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

	module.exports = __webpack_require__(970);


/***/ }),

/***/ 3:
/***/ (function(module, exports) {

	module.exports = function() { throw new Error("define cannot be used indirect"); };


/***/ }),

/***/ 970:
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function(f, define) {
	   !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(971)], __WEBPACK_AMD_DEFINE_FACTORY__ = (f), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	})(function() {

	(function($, undefined) {

	var kendo = window.kendo,
	    Editor = kendo.ui.editor,
	    EditorUtils = Editor.EditorUtils,
	    RangeUtils = Editor.RangeUtils,
	    dom = Editor.Dom,
	    registerTool = EditorUtils.registerTool,
	    ToolTemplate = Editor.ToolTemplate,
	    Command = Editor.Command;

	var tableFormatFinder = new Editor.BlockFormatFinder([{tags:["table"]}]);
	var cellsFormatFinder = new Editor.BlockFormatFinder([{tags:["td","th"]}]);
	var reUnit = /([a-z]+|%)$/i;

	var TableWizardCommand = Command.extend({
	    exec: function() {
	        var cmd = this;
	        var editor = cmd.editor;
	        var range = cmd.range = cmd.lockRange();
	        var selectedTable = cmd._sourceTable = !cmd.options.insertNewTable ? cmd._selectedTable(range) : undefined;
	        var selectedCells = cmd._selectedTableCells = selectedTable ? cmd._selectedCells(range) : undefined;
	        var options = {
	            visible: false,
	            messages: editor.options.messages,
	            closeCallback: $.proxy(cmd.onDialogClose, cmd),
	            table: cmd.parseTable(selectedTable, selectedCells),
	            dialogOptions: editor.options.dialogOptions,
	            isRtl: kendo.support.isRtl(editor.wrapper)
	        };

	        var dialog = new Editor.TableWizardDialog(options);
	        dialog.open();
	    },

	    onDialogClose: function(data) {
	        var cmd = this;
	        cmd.releaseRange(cmd.range);

	        if (data) { //Ok button pressed
	            if (cmd.options.insertNewTable) {
	                cmd.insertTable(cmd.createNewTable(data));
	            } else {
	                cmd.updateTable(data, cmd._sourceTable, cmd._selectedTableCells);
	            }
	        }
	    },
	    releaseRange: function(range) {
	        var cmd = this;
	        var doc = cmd.editor.document;
	        dom.windowFromDocument(doc).focus();
	        Command.fn.releaseRange.call(cmd, range);
	    },
	    insertTable: function(table) {
	        var range = this.range;
	        range.insertNode(table);
	        range.collapse(true);
	        this.editor.selectRange(range);
	    },
	    updateTable: function(data, table, selectedCells) {
	        var cmd = this;
	        var tableRows = $(table.rows).toArray();
	        var tableProp = data.tableProperties;
	        var rows = tableProp.rows;
	        var columns = tableProp.columns;
	        var last = function(collection) {
	            return collection[collection.length - 1];
	        };

	        //Leave only first selected cell
	        while (selectedCells.length > 1) {
	            selectedCells.pop();
	        }

	        var lastSelectedRow = selectedCells.length ? last(selectedCells).parentNode : last(tableRows);
	        var row, parent;

	        cmd._deleteTableRows(tableRows, tableRows.length - rows);

	        if (tableRows.length < rows) {
	            var rowIndex = $(lastSelectedRow).index();
	            var cellsLength = lastSelectedRow.cells.length;
	            var newRowsCount = rows - tableRows.length;
	            parent = lastSelectedRow.parentNode;
	            while (newRowsCount) {
	                row = parent.insertRow(rowIndex + 1);
	                cmd._insertCells(cellsLength - row.cells.length, row);
	                newRowsCount--;
	            }
	        }

	        if (tableRows[0].cells.length > columns) {
	            $(tableRows).each(function(i, row){
	                while(row.cells.length > columns) {
	                    row.deleteCell(-1);
	                }
	            });
	        }

	        if (tableRows[0].cells.length < columns) {
	            var cellIndex = $(last(selectedCells) || last(lastSelectedRow.cells)).index();
	            $(tableRows).each(function(i, row) {
	                cmd._insertCells(columns - row.cells.length, row, cellIndex + 1);
	            });
	        }

	        cmd._updateTableProperties(table, tableProp);

	        var cellProp = data.cellProperties;
	        if (selectedCells[0]) {
	            dom.attr(selectedCells[0], {id: cellProp.id || null});
	        }
	        (cellProp.selectAllCells ? $(tableRows).children() : $(selectedCells)).each(function(i, cell){
	            cmd._updateCellProperties(cell, cellProp);
	        });

	        cmd._updateCaption(table, tableProp);

	        tableProp.cellsWithHeaders = tableProp.cellsWithHeaders || false;
	        if (cmd.cellsWithHeadersAssociated(table) != tableProp.cellsWithHeaders) {
	            cmd.associateCellsWithHeader(table, tableProp.cellsWithHeaders);
	        }
	    },
	    _isHeadingRow: function(row) {
	        return dom.is(row.parentNode, "thead") || dom.is(row.cells[0], "th");
	    },
	    associateCellsWithHeader: function(table, associate) {
	        var timestamp = new Date().getTime();
	        var ids = [];
	        var columns = table.rows[0].cells.length;
	        var index, nextRow, isDataRow;

	        var generateIds = function() {
	            for (var i = 0; i < columns; i++) {
	                ids[i] = "table" + (++timestamp);
	            }
	        };
	        var modifySellsIds = function(c, cell) {
	            $(cell)[associate ? "attr" : "removeAttr"]("id", ids[c]);
	        };
	        var modifyCellsHeadings = function(c, cell) {
	            $(cell)[associate ? "attr" : "removeAttr"]("headers", ids[c]);
	        };
	        var isHeadingRow = this._isHeadingRow;

	        $(table.rows).each(function(r, row) {
	            if (isHeadingRow(row)) {
	                index = r;
	                nextRow = table.rows[++index];
	                isDataRow = nextRow && !isHeadingRow(nextRow);
	                if (isDataRow) {
	                    generateIds();
	                    $(row.cells).each(modifySellsIds);
	                }
	                while(isDataRow) {
	                    $(nextRow.cells).each(modifyCellsHeadings);
	                    nextRow = table.rows[++index];
	                    isDataRow = nextRow && !isHeadingRow(nextRow);
	                }
	            }
	        });
	    },
	    cellsWithHeadersAssociated: function(table) {
	        var cells = $(table.rows).children();
	        var isHeadingRow = this._isHeadingRow;
	        var headingIds = [];
	        cells.each(function(c, cell) {
	            if (cell.id && isHeadingRow(cell.parentNode)) {
	                headingIds.push(cell.id);
	            }
	        });

	        var associatedCells = cells.filter(function(c, cell) {
	            var headersAttr = cell.getAttribute("headers");
	            return headersAttr && !isHeadingRow(cell.parentNode) && $.inArray(headersAttr, headingIds) > -1;
	        });

	        return !!associatedCells.length;
	    },
	    _insertCells: function(count, row, index) {
	        index = isNaN(index) ? -1 : index;
	        for (var i = 0, cell; i < count; i++) {
	            cell = row.insertCell(index);
	            cell.innerHTML = "&nbsp;";
	        }
	    },

	    _deleteTableRows: function(rows, count){
	        for (var i = 0, row, rowParent; i < count; i++) {
	            row = rows.pop();
	            rowParent = row.parentNode;
	            rowParent.removeChild(row);
	            if (!rowParent.rows.length) {
	                dom.remove(rowParent);
	            }
	        }
	    },
	    createNewTable: function(data) {
	        var cmd = this;
	        var doc = cmd.editor.document;
	        var tableProp = data.tableProperties;
	        var cellProp = data.cellProperties;
	        var cellPropToAll = cellProp.selectAllCells;
	        var table = dom.create(doc, "table");

	        cmd._updateTableProperties(table, tableProp);
	        cmd._updateCaption(table, tableProp);

	        var tbody = table.createTBody();
	        for (var r = 0, row; r < tableProp.rows; r++) {
	            row = tbody.insertRow();
	            for (var c = 0, cell; c < tableProp.columns; c++) {
	                cell = row.insertCell();
	                cell.innerHTML = "&nbsp;";
	                if (r === 0 && c === 0 && cellProp.id) {
	                    cell.id = cellProp.id;
	                }
	                cmd._updateCellProperties(cell, (cellPropToAll || (r === 0 && c === 0)) ? cellProp : {});
	            }
	        }

	        if (tableProp.cellsWithHeaders) {
	            cmd.associateCellsWithHeader(table, tableProp.cellsWithHeaders);
	        }

	        return table;
	    },
	    _updateTableProperties: function(table, data){
	        var style = this._getStylesData(data);
	        dom.attr(table, {
	            cellSpacing: data.cellSpacing || null,
	            cellPadding: data.cellPadding || null,
	            className: data.className || null,
	            id: data.id || null,
	            summary: data.summary || null,
	            style: style || null
	        });
	        $(table).addClass("k-table");
	    },
	    _updateCellProperties: function(cell, data) {
	        var style = this._getStylesData(data);
	        style.padding = data.cellPadding || null;
	        style.margin = data.cellMargin || null;
	        dom.attr(cell, {
	            style: style || null,
	            className: data.className || null
	        });
	    },
	    _updateCaption: function(table, data){
	        if (table.caption && !data.captionContent) {
	            table.deleteCaption();
	        } else if (data.captionContent) {
	            var caption = table.createCaption();
	            caption.innerHTML = data.captionContent;
	            var alignment = this._getAlignmentData(data.captionAlignment);
	            dom.attr(caption, {
	                style: {
	                    textAlign: alignment.textAlign,
	                    verticalAlign: alignment.verticalAlign
	                }
	            });
	        }
	    },
	    _getStylesData: function(data) {
	        var alignment = this._getAlignmentData(data.alignment);
	        var whiteSpace = "wrapText" in data ? (data.wrapText ? "" : "nowrap") : null;

	        return {
	            width: data.width ? data.width + data.widthUnit : null,
	            height: data.height ? data.height + data.heightUnit : null,
	            textAlign: alignment.textAlign,
	            verticalAlign: alignment.verticalAlign,
	            backgroundColor: data.bgColor || null,
	            borderWidth: data.borderWidth,
	            borderStyle: data.borderStyle,
	            borderColor: data.borderColor,
	            borderCollapse: data.collapseBorders ? "collapse" : null,
	            whiteSpace: whiteSpace
	        };
	    },
	    _getAlignmentData: function(alignment) {
	        var textAlign = "";
	        var verticalAlign = textAlign;

	        if (alignment) {
	            if (alignment.indexOf(" ") != -1) {
	                var align = alignment.split(" ");
	                textAlign = align[0];
	                verticalAlign = align[1];
	            } else {
	                textAlign = alignment;
	            }
	        }
	        return {textAlign: textAlign, verticalAlign: verticalAlign};
	    },
	    parseTable: function(table, selectedCells) {
	        if (!table) {
	            return { tableProperties: {}, selectedCells: [] };
	        }

	        var cmd = this;
	        var tStyle = table.style;
	        var rows = table.rows;
	        var caption = table.caption;
	        var captionClone = $(caption ? caption.cloneNode(true) : undefined);
	        captionClone.find(".k-marker").remove();

	        var cssClass = table.className;
	        cssClass = cssClass.replace(/^k-table\s|\sk-table$/, "");
	        cssClass = cssClass.replace(/\sk-table\s/, " ");
	        cssClass = cssClass.replace(/^k-table$/, "");

	        var tableAlignment = cmd._getAlignment(table, true);
	        var captionAlignment = caption ? cmd._getAlignment(caption) : undefined;
	        var cellsWithHeaders = cmd.cellsWithHeadersAssociated(table);

	        var tableJson = {
	            tableProperties: {
	                width: tStyle.width || table.width ? parseFloat(tStyle.width || table.width) : null,
	                height: tStyle.height || table.height ? parseFloat(tStyle.height || table.height) : null,
	                columns: rows[0] ? rows[0].children.length : 0,
	                rows: rows.length,
	                widthUnit: cmd._getUnit(tStyle.width),
	                heightUnit: cmd._getUnit(tStyle.height),
	                cellSpacing: table.cellSpacing,
	                cellPadding: table.cellPadding,
	                alignment: tableAlignment.textAlign,
	                bgColor: tStyle.backgroundColor || table.bgColor,
	                className: cssClass,
	                id: table.id,
	                borderWidth: tStyle.borderWidth || table.border,
	                borderColor: tStyle.borderColor,
	                borderStyle: tStyle.borderStyle || "",
	                collapseBorders: !!tStyle.borderCollapse,
	                summary: table.summary,
	                captionContent: caption ? captionClone.html() : "",
	                captionAlignment: caption && captionAlignment.textAlign ? captionAlignment.textAlign + " " + captionAlignment.verticalAlign : "",
	                cellsWithHeaders: cellsWithHeaders
	            },
	            selectedCells: []
	        };

	        tableJson.rows = cmd.parseTableRows(rows, selectedCells, tableJson);

	        return tableJson;
	    },
	    parseTableRows: function(rows, selectedCells, tableJson) {
	        var cmd = this;
	        var data = [], row, rowData, cells, cell, cellData;
	        for (var i = 0; i < rows.length; i++) {
	            row = rows[i];
	            rowData = {cells: []};
	            cells = row.cells;
	            data.push(rowData);
	            for (var j = 0; j < cells.length; j++) {
	                cell = cells[j];
	                cellData = cmd.parseCell(cell);
	                if ($.inArray(cell, selectedCells) != -1) {
	                    tableJson.selectedCells.push(cellData);
	                }
	                rowData.cells.push(cellData);
	            }
	        }
	        return data;
	    },
	    parseCell: function(cell) {
	        var cmd = this;
	        var cStyle = cell.style;
	        var alignment = cmd._getAlignment(cell);
	        alignment = alignment.textAlign ? alignment.textAlign + " " + alignment.verticalAlign : "";

	        var data = {
	            width: cStyle.width || cell.width ? parseFloat(cStyle.width || cell.width) : null,
	            height: cStyle.height || cell.height ? parseFloat(cStyle.height || cell.height) : null,
	            widthUnit: cmd._getUnit(cStyle.width),
	            heightUnit: cmd._getUnit(cStyle.height),
	            cellMargin: cStyle.margin,
	            cellPadding: cStyle.padding,
	            alignment: alignment,
	            bgColor: cStyle.backgroundColor || cell.bgColor,
	            className: cell.className,
	            id: cell.id,
	            borderWidth: cStyle.borderWidth || cell.border,
	            borderColor: cStyle.borderColor,
	            borderStyle: cStyle.borderStyle,
	            wrapText: cStyle.whiteSpace != "nowrap"
	        };

	        return data;
	    },
	    _getAlignment: function(element, horizontalOnly) {
	        var style = element.style;
	        var hAlign = style.textAlign || element.align || "";
	        if (horizontalOnly) {
	            return {textAlign: hAlign};
	        }
	        var vAlign = style.verticalAlign || element.vAlign || "";
	        if(hAlign && vAlign) {
	            return {textAlign: hAlign, verticalAlign: vAlign};
	        }
	        if(!hAlign && vAlign) {
	            return {textAlign: "left", verticalAlign: vAlign};
	        }
	        if(hAlign && !vAlign) {
	            return {textAlign: hAlign, verticalAlign: "top"};
	        }
	        return {textAlign: "", verticalAlign: ""};
	    },
	    _getUnit: function(value) {
	        var unit = (value || "").match(reUnit);
	        return unit ? unit[0] : "px";
	    },
	    _selectedTable: function(range) {
	        var nodes = dom.filterBy(RangeUtils.nodes(range), dom.htmlIndentSpace, true);
	        return tableFormatFinder.findSuitable(nodes)[0];
	    },
	    _selectedCells: function(range) {
	        var nodes = dom.filterBy(RangeUtils.nodes(range), dom.htmlIndentSpace, true);
	        return cellsFormatFinder.findSuitable(nodes);
	    }
	});

	var TableWizardTool = Editor.Tool.extend({
	    command: function (options) {
	        options.insertNewTable = this.options.insertNewTable;
	        return new TableWizardCommand(options);
	    }
	});

	var TableWizardEditTool = TableWizardTool.extend({
	    update: function(ui, nodes) {
	        var isFormatted = !tableFormatFinder.isFormatted(nodes);
	        ui.toggleClass("k-state-disabled", isFormatted);
	    }
	});

	kendo.ui.editor.TableWizardTool = TableWizardTool;
	kendo.ui.editor.TableWizardCommand = TableWizardCommand;

	registerTool("tableWizard", new TableWizardEditTool({ command: TableWizardCommand, insertNewTable: false, template: new ToolTemplate({template: EditorUtils.buttonTemplate, title: "Table Wizard"})}));

	})(window.kendo.jQuery);

	}, __webpack_require__(3));

/***/ }),

/***/ 971:
/***/ (function(module, exports) {

	module.exports = require("./../tables");

/***/ })

/******/ });