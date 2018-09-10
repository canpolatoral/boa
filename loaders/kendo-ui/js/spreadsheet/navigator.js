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

	__webpack_require__(1449);
	module.exports = __webpack_require__(1449);


/***/ }),

/***/ 3:
/***/ (function(module, exports) {

	module.exports = function() { throw new Error("define cannot be used indirect"); };


/***/ }),

/***/ 920:
/***/ (function(module, exports) {

	module.exports = require("../kendo.core");

/***/ }),

/***/ 1449:
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function(f, define){
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__(920),  __webpack_require__(1450) ], __WEBPACK_AMD_DEFINE_FACTORY__ = (f), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	})(function(){

	(function(kendo) {
	    if (kendo.support.browser.msie && kendo.support.browser.version < 9) {
	        return;
	    }

	    var RangeRef = kendo.spreadsheet.RangeRef;
	    var CellRef = kendo.spreadsheet.CellRef;

	    var EdgeNavigator = kendo.Class.extend({
	        init: function(field, axis, rangeGetter, union) {
	            this.rangeGetter = rangeGetter;

	            this.prevLeft = function(index) {
	                var current = union(this.range(index));
	                var range = this.range(axis.prevVisible(current.topLeft[field]));
	                return union(range).topLeft[field];
	            };

	            this.nextRight = function(index) {
	                var current = union(this.range(index));
	                var range = this.range(axis.nextVisible(current.bottomRight[field]));
	                return union(range).bottomRight[field];
	            };

	            // these two don't look like the other ones, as they "shrink"
	            this.nextLeft = function(index) {
	                var range = union(this.range(index));
	                return axis.nextVisible(range.bottomRight[field]);
	            };

	            this.prevRight = function(index) {
	                var range = union(this.range(index));
	                return axis.prevVisible(range.topLeft[field]);
	            };
	        },

	        boundary: function(top, bottom) {
	            this.top = top;
	            this.bottom = bottom;
	        },

	        range: function(index) {
	            return this.rangeGetter(index, this.top, this.bottom);
	        }
	    });

	    var SheetNavigator = kendo.Class.extend({
	        init: function(sheet) {
	            this._sheet = sheet;
	            this.columns = this._sheet._grid._columns;
	            this.autoFillCalculator = new kendo.spreadsheet.AutoFillCalculator(sheet._grid);

	            this.colEdge = new EdgeNavigator("col", this._sheet._grid._columns, this.columnRange.bind(this), this.union.bind(this));
	            this.rowEdge = new EdgeNavigator("row", this._sheet._grid._rows, this.rowRange.bind(this), this.union.bind(this));
	        },

	        height: function(height) {
	            this._viewPortHeight = height;
	        },

	        union: function(ref) {
	            return this._sheet.unionWithMerged(ref);
	        },

	        columnRange: function(col, topRow, bottomRow) {
	            return this._sheet._ref(topRow, col, bottomRow - topRow, 1);
	        },

	        rowRange: function(row, leftCol, rightCol) {
	            return this._sheet._ref(row, leftCol, 1, rightCol - leftCol);
	        },

	        selectionIncludesMergedCells: function() {
	            return this._sheet.select().contains(this._sheet._mergedCells);
	        },

	        setSelectionValue: function(value) {
	            var selection = this._sheet.selection();

	            setTimeout(function() {
	                selection.value(value());
	            });
	        },

	        selectAll: function() {
	            this._sheet.select(this._sheet._sheetRef);
	        },

	        select: function(ref, mode, addToExisting) {
	            ref = this.refForMode(ref, mode);

	            if (addToExisting) {
	                ref = this._sheet.select().concat(ref);
	            }

	            this._sheet.select(ref);
	        },

	        refForMode: function(ref, mode) {
	            var grid = this._sheet._grid;

	            switch(mode) {
	                case "range":
	                    ref = grid.normalize(ref);
	                    break;
	                case "row":
	                    ref = grid.rowRef(ref.row);
	                    break;
	                case "column":
	                    ref = grid.colRef(ref.col);
	                    break;
	                case "sheet":
	                    ref = this._sheet._sheetRef;
	                    break;
	            }

	            return ref;
	        },

	        startSelection: function(ref, mode, addToExisting, shiftKey) {
	            if (mode == "autofill") {
	                this._sheet.startAutoFill();
	            } else if (shiftKey && mode == "range") {
	                var range = new RangeRef(this._sheet.activeCell().first(), ref);
	                this._sheet.select(range, false, false);
	                this._sheet.startSelection();
	            } else {
	                this._sheet.startSelection();
	                this.select(ref, mode, addToExisting);
	            }
	        },

	        completeSelection: function() {
	            this._sheet.completeSelection();
	        },

	        selectForContextMenu: function(ref, mode) {
	            var sheet = this._sheet;

	            if (!sheet.select().contains(this.refForMode(ref, mode))) {
	                this.select(ref, mode);
	            }
	        },

	        modifySelection: function(action) {
	            var direction = this.determineDirection(action);

	            var sheet = this._sheet;
	            var viewPortHeight = this._viewPortHeight;
	            var rows = sheet._grid._rows;
	            var columns = sheet._grid._columns;

	            var originalSelection = sheet.currentOriginalSelectionRange();
	            var selection = sheet.select().toRangeRef();
	            var activeCell = sheet.activeCell();

	            var topLeft = originalSelection.topLeft.clone();
	            var bottomRight = originalSelection.bottomRight.clone();

	            var scrollInto;

	            this.colEdge.boundary(selection.topLeft.row, selection.bottomRight.row);
	            this.rowEdge.boundary(selection.topLeft.col, selection.bottomRight.col);

	            switch (direction) {
	                case "expand-left": // <| |
	                    topLeft.col = this.colEdge.prevLeft(topLeft.col);
	                    scrollInto = topLeft;
	                    break;
	                case "shrink-right": // |>|
	                    topLeft.col = this.colEdge.nextLeft(topLeft.col);
	                    scrollInto = topLeft;
	                    break;
	                case "expand-right": // | |>
	                    bottomRight.col = this.colEdge.nextRight(bottomRight.col);
	                    scrollInto = bottomRight;
	                    break;
	                case "shrink-left": // |<|
	                    bottomRight.col = this.colEdge.prevRight(bottomRight.col);
	                    scrollInto = bottomRight;
	                    break;

	                // four actions below mirror the upper ones, on the vertical axis
	                case "expand-up":
	                    topLeft.row = this.rowEdge.prevLeft(topLeft.row);
	                    scrollInto = topLeft;
	                    break;
	                case "shrink-down":
	                    topLeft.row = this.rowEdge.nextLeft(topLeft.row);
	                    scrollInto = topLeft;
	                    break;
	                case "expand-down":
	                    bottomRight.row = this.rowEdge.nextRight(bottomRight.row);
	                    scrollInto = bottomRight;
	                    break;
	                case "shrink-up":
	                    bottomRight.row = this.rowEdge.prevRight(bottomRight.row);
	                    scrollInto = bottomRight;
	                    break;

	                // pageup/down - may need improvement
	                case "expand-page-up":
	                    topLeft.row = rows.prevPage(topLeft.row, viewPortHeight);
	                    break;
	                case "shrink-page-up":
	                    bottomRight.row = rows.prevPage(bottomRight.row, viewPortHeight);
	                    break;
	                case "expand-page-down":
	                    bottomRight.row = rows.nextPage(bottomRight.row, viewPortHeight);
	                    break;
	                case "shrink-page-down":
	                    topLeft.row = rows.nextPage(topLeft.row, viewPortHeight);
	                    break;

	                case "first-col":
	                    topLeft.col = columns.firstVisible();
	                    bottomRight.col = activeCell.bottomRight.col;
	                    scrollInto = topLeft;
	                    break;
	                case "last-col":
	                    bottomRight.col = columns.lastVisible();
	                    topLeft.col = activeCell.topLeft.col;
	                    scrollInto = bottomRight;
	                    break;
	                case "first-row":
	                    topLeft.row = rows.firstVisible();
	                    bottomRight.row = activeCell.bottomRight.row;
	                    scrollInto = topLeft;
	                    break;
	                case "last-row":
	                    bottomRight.row = rows.lastVisible();
	                    topLeft.row = activeCell.topLeft.row;
	                    scrollInto = bottomRight;
	                    break;
	                case "last":
	                    bottomRight.row = rows.lastVisible();
	                    bottomRight.col = columns.lastVisible();
	                    topLeft = activeCell.topLeft;
	                    scrollInto = bottomRight;
	                    break;
	                case "first":
	                    topLeft.row = rows.firstVisible();
	                    topLeft.col = columns.firstVisible();
	                    bottomRight = activeCell.bottomRight;
	                    scrollInto = topLeft;
	                    break;
	            }

	            var newSelection = new RangeRef(topLeft, bottomRight);

	            if (!this.union(newSelection).intersects(activeCell)) {
	                // throw new Error(newSelection.print() + " does not contain " + activeCell.print());
	                this.modifySelection(direction.replace("shrink", "expand"));
	                return;
	            }

	            if (scrollInto) {
	                sheet.focus(scrollInto);
	            }

	            this.updateCurrentSelectionRange(newSelection);
	        },

	        moveActiveCell: function(direction) {
	            var sheet = this._sheet;
	            var activeCell = sheet.activeCell();
	            var topLeft = activeCell.topLeft;
	            var bottomRight = activeCell.bottomRight;

	            var cell = sheet.originalActiveCell();
	            var rows = sheet._grid._rows;
	            var columns = sheet._grid._columns;

	            var row = cell.row;
	            var column = cell.col;

	            switch (direction) {
	                case "left":
	                    column = columns.prevVisible(topLeft.col);
	                    break;
	                case "up":
	                    row = rows.prevVisible(topLeft.row);
	                    break;
	                case "right":
	                    column = columns.nextVisible(bottomRight.col);
	                    break;
	                case "down":
	                    row = rows.nextVisible(bottomRight.row);
	                    break;
	                case "first-col":
	                    column = columns.firstVisible();
	                    break;
	                case "last-col":
	                    column = columns.lastVisible();
	                    break;
	                case "first-row":
	                    row = rows.firstVisible();
	                    break;
	                case "last-row":
	                    row = rows.lastVisible();
	                    break;
	                case "last":
	                    row = rows.lastVisible();
	                    column = columns.lastVisible();
	                    break;
	                case "first":
	                    row = rows.firstVisible();
	                    column = columns.firstVisible();
	                    break;
	                case "next-page":
	                    row = rows.nextPage(bottomRight.row, this._viewPortHeight);
	                    break;
	                case "prev-page":
	                    row = rows.prevPage(bottomRight.row, this._viewPortHeight);
	                    break;

	            }

	            sheet.select(new CellRef(row, column));
	        },

	        navigateInSelection: function(direction) {
	            var sheet = this._sheet;
	            var activeCell = sheet.activeCell();
	            var topLeft = activeCell.topLeft;

	            var cell = sheet.originalActiveCell();
	            var rows = sheet._grid._rows;
	            var columns = sheet._grid._columns;

	            var row = cell.row;
	            var column = cell.col;

	            var selection = sheet.currentNavigationRange();
	            var selTopLeft = selection.topLeft;
	            var selBottomRight = selection.bottomRight;

	            var done = false;

	            var topLeftCol = topLeft.col;
	            var topLeftRow = topLeft.row;

	            while (!done) {
	                var current = new CellRef(row, column);

	                switch (direction) {
	                    case "next":
	                        if (selBottomRight.eq(current)) {
	                            selection = sheet.nextNavigationRange();
	                            row = selection.topLeft.row;
	                            column = selection.topLeft.col;
	                        } else {
	                            column = columns.nextVisible(topLeftCol, true);
	                            if (column > selBottomRight.col) {
	                                column = selTopLeft.col;
	                                row = rows.nextVisible(row, true);
	                            }
	                        }
	                        break;
	                    case "previous":
	                        if (selTopLeft.eq(current)) {
	                            selection = sheet.previousNavigationRange();
	                            row = selection.bottomRight.row;
	                            column = selection.bottomRight.col;
	                        } else {
	                            column = columns.prevVisible(topLeftCol, true);
	                            if (column < selTopLeft.col) {
	                                column = selBottomRight.col;
	                                row = rows.prevVisible(row, true);
	                            }
	                        }
	                        break;
	                    case "lower":
	                        if (selBottomRight.eq(current)) {
	                            selection = sheet.nextNavigationRange();
	                            row = selection.topLeft.row;
	                            column = selection.topLeft.col;
	                        } else {
	                            row = rows.nextVisible(topLeftRow, true);
	                            if (row > selBottomRight.row) {
	                                row = selTopLeft.row;
	                                column = columns.nextVisible(column, true);
	                            }
	                        }
	                        break;
	                    case "upper":
	                        if (selTopLeft.eq(current)) {
	                            selection = sheet.previousNavigationRange();
	                            row = selection.bottomRight.row;
	                            column = selection.bottomRight.col;
	                        } else {
	                            row = rows.prevVisible(topLeftRow, true);
	                            if (row < selTopLeft.row) {
	                                row = selBottomRight.row;
	                                column = columns.prevVisible(column, true);
	                            }
	                        }
	                        break;
	                    default:
	                        throw new Error("Unknown entry navigation: " + direction);
	                }

	                done = !this.shouldSkip(row, column);
	                // if (!done) { console.log("skipping", row, column); }
	                topLeftCol = column;
	                topLeftRow = row;
	            }

	            if (sheet.singleCellSelection()) {
	                sheet.select(new CellRef(row, column));
	            } else {
	                sheet.activeCell(new CellRef(row, column));
	            }
	        },

	        extendSelection: function(ref, mode) {
	            var sheet = this._sheet;
	            var grid = sheet._grid;

	            if (mode === "autofill") {
	               this.resizeAutoFill(ref);
	               return;
	            }
	            if (mode === "range") {
	                ref = grid.normalize(ref);
	            }
	            else if (mode === "row") {
	                ref = grid.rowRef(ref.row).bottomRight;
	            } else if (mode === "column") {
	                ref = grid.colRef(ref.col).bottomRight;
	            }

	            var activeCell = sheet.originalActiveCell().toRangeRef();

	            this.updateCurrentSelectionRange(new RangeRef(activeCell.topLeft, ref));
	        },

	        shouldSkip: function(row, col) {
	            var ref = new CellRef(row, col);
	            var isMerged = false;
	            this._sheet.forEachMergedCell(function(merged) {
	                if (merged.intersects(ref) && !merged.collapse().eq(ref)) {
	                    isMerged = true;
	                }
	            });

	            return isMerged;
	        },

	        resizeAutoFill: function(ref) {
	            var sheet = this._sheet;
	            var selection = sheet.select();
	            var origin = sheet._autoFillOrigin;
	            var dest = this.autoFillCalculator.autoFillDest(selection, ref);

	            var punch = this.punch(selection, dest);
	            var hint, direction, row;

	            if (!punch) {
	                var preview = sheet.range(dest)._previewFillFrom(sheet.range(origin));

	                if (preview) {
	                    direction = preview.direction;
	                    var props = preview.props;

	                    if (direction === 0 || direction == 1) {
	                        row = props[props.length - 1];
	                        hint = row[row.length - 1].value;
	                    } else if (direction === 2) {
	                        row = props[0];
	                        hint = row[row.length - 1].value;
	                    } else if (direction === 3) {
	                        row = props[props.length - 1];
	                        hint = row[0].value;
	                    }
	                }
	            }

	            sheet.updateAutoFill(dest, punch, hint, direction);
	        },

	        determineDirection: function(action) {
	            var selection = this._sheet.currentSelectionRange();
	            var activeCell = this._sheet.activeCell();

	            // There may be a third, indeterminate state, caused by a merged cell.
	            // In this state, all key movements are treated as shrinks.
	            // The navigator will reverse them if it detects this it will cause the selection to exclude the active cell.
	            var leftMode = activeCell.topLeft.col == selection.topLeft.col;
	            var rightMode = activeCell.bottomRight.col == selection.bottomRight.col;
	            var topMode = activeCell.topLeft.row == selection.topLeft.row;
	            var bottomMode = activeCell.bottomRight.row == selection.bottomRight.row;

	            switch(action) {
	                case "left":
	                    action = rightMode ? "expand-left" : "shrink-left";
	                    break;
	                case "right":
	                    action = leftMode ? "expand-right" : "shrink-right";
	                    break;
	                case "up":
	                    action = bottomMode ? "expand-up" : "shrink-up";
	                    break;
	                case "down":
	                    action = topMode ? "expand-down" : "shrink-down";
	                    break;
	                case "prev-page":
	                    action = bottomMode ? "expand-page-up" : "shrink-page-up";
	                    break;
	                case "next-page":
	                    action = topMode ? "expand-page-down" : "shrink-page-down";
	                    break;
	            }

	            return action;
	        },

	        updateCurrentSelectionRange: function(ref) {
	            var sheet = this._sheet;
	            sheet.select(sheet.originalSelect().replaceAt(sheet.selectionRangeIndex(), ref), false);
	        },

	        punch: function(selection, subset) {
	            var punch;
	            if (subset.topLeft.eq(selection.topLeft)) {
	                if (subset.bottomRight.row < selection.bottomRight.row) {
	                    var bottomRow = this.rowEdge.nextRight(subset.bottomRight.row);

	                    punch = new RangeRef(
	                        new CellRef(bottomRow, selection.topLeft.col),
	                        selection.bottomRight
	                    );
	                } else if (subset.bottomRight.col < selection.bottomRight.col) {
	                    var bottomCol = this.colEdge.nextRight(subset.bottomRight.col);

	                    punch = new RangeRef(
	                        new CellRef(selection.topLeft.row, bottomCol),
	                        selection.bottomRight
	                    );
	                }
	            }

	            return punch;
	        }
	    });

	    kendo.spreadsheet.SheetNavigator = SheetNavigator;
	})(kendo);
	}, __webpack_require__(3));


/***/ }),

/***/ 1450:
/***/ (function(module, exports) {

	module.exports = require("./autofillcalculator");

/***/ })

/******/ });