import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import SelectionsPresenterPopup from './SelectionsPresenterPopup';

import { BComponent } from 'b-component';
import { BResizableBeta } from 'b-resizable-beta';
import { BDataGrid } from 'b-data-grid-dx';
var ResizableIcon = require('b-icon').Others.Resizable;
import { BScroll } from 'b-scroll';

class RenderedDataGrid extends BComponent {
  static propTypes = {
    autocompleteFilter: PropTypes.func,
    dataSource: PropTypes.array,
    searchText: PropTypes.string,
    value: PropTypes.arrayOf(PropTypes.any),
    valueMemberPath: PropTypes.string,
    displayMemberPath: PropTypes.string,
    columns: PropTypes.array,
    multiSelect: PropTypes.bool,
    selectedIndexes: PropTypes.arrayOf(PropTypes.number),
    onItemTouchTap: PropTypes.func,
    onChange: PropTypes.func,
    onEscKeyDown: PropTypes.func,
    onKeyDown: PropTypes.func,
    onClickClearSelected: PropTypes.func,
    getCurrentIndexesOfParent: PropTypes.func,
    getCurrentSelectedItemsOfParent: PropTypes.func
  }

  constructor(props, context) {
    super(props, context);

    this.selectedItems = [];
    let selectedIndexes = this.props.getCurrentIndexesOfParent ? this.props.getCurrentIndexesOfParent() : this.props.selectedIndexes;
    if (selectedIndexes && selectedIndexes.length > 0) {
      for (let i in selectedIndexes) {
        this.selectedItems.push(this.props.dataSource[selectedIndexes[i]]);
      }
    }

    let searchText = this.props.searchText ? this.props.searchText : '';
    let newSource = this.prepareDataSource(this.props.dataSource, selectedIndexes, searchText);

    this.state = {
      dataSource: newSource.dataSource,
      selectedIndexes: newSource.selectedIndexes,
      searchText: this.props.searchText ? this.props.searchText : '',
      value: this.props.value,
      disableAutoFocus: false
    };

    this.onClickClearSelected = this.onClickClearSelected.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.dataSource !== this.props.dataSource ||
      nextProps.searchText !== this.props.searchText ||
      nextProps.selectedIndexes !== this.props.selectedIndexes) {
      this.selectedItems = [];
      let selectedIndexes = this.props.getCurrentIndexesOfParent ? this.props.getCurrentIndexesOfParent() : this.props.selectedIndexes;
      if (selectedIndexes && selectedIndexes.length > 0) {
        for (let i in selectedIndexes) {
          this.selectedItems.push(this.props.dataSource[selectedIndexes[i]]);
        }
      }
      let searchText = this.state.searchText ? this.state.searchText : '';
      if (nextProps.searchText !== this.props.searchText) {
        searchText = nextProps.searchText;
      }
      let newSource = this.prepareDataSource(nextProps.dataSource, selectedIndexes, searchText);
      this.setState({ dataSource: newSource.dataSource, selectedIndexes: newSource.selectedIndexes, searchText: searchText });
    }
  }

  updateSearchText(searchText) {
    let selectedIndexes = this.props.getCurrentIndexesOfParent ? this.props.getCurrentIndexesOfParent() : this.props.selectedIndexes;
    let newSearchText = searchText ? searchText : '';
    let newSource = this.prepareDataSource(this.props.dataSource, selectedIndexes, newSearchText);

    this.setState({
      dataSource: newSource.dataSource,
      selectedIndexes: newSource.selectedIndexes,
      searchText: searchText ? searchText : '',
      disableAutoFocus: true
    });
  }

  updateSelectedIndexes() {
    let selectedIndexes = this.props.getCurrentIndexesOfParent ? this.props.getCurrentIndexesOfParent() : this.props.selectedIndexes;
    let newSource = this.prepareDataSource(this.props.dataSource, selectedIndexes, this.state.searchText);

    this.setState({
      dataSource: newSource.dataSource,
      selectedIndexes: newSource.selectedIndexes,
      disableAutoFocus: true
    });
  }

  getCurrentSelectedItemsOfParent() {
    return this.props.getCurrentSelectedItemsOfParent();
  }

  prepareDataSource(dataSource, selectedIndexes, searchText) {
    var list = [];
    var newSelectedIndexes = [];
    if (dataSource && searchText && searchText != '') {
      for (var i = 0; i < dataSource.length; i++) {
        var item = dataSource[i];

        for (var j = 0; j < this.props.columns.length; j++) {
          var column = this.props.columns[j];
          var text = item[column.key];
          if (this.props.autocompleteFilter(searchText, text)) {
            list.push(item);
            if (selectedIndexes.indexOf(item.bComboboxIndex) > -1) {
              newSelectedIndexes.push(list.length - 1);
            }
            break;
          }
        }
      }
    }
    else if (dataSource) {
      list = dataSource;
      newSelectedIndexes = selectedIndexes;
    }
    return { dataSource: Object.assign([], list), selectedIndexes: newSelectedIndexes };
  }


  onResize(e, direction, refToResizableElement) {
    try {
      let resizableParent = ReactDOM.findDOMNode(this.resizable).parentNode;

      resizableParent.style.height = (refToResizableElement.height) + 'px';
      resizableParent.style.width = (refToResizableElement.width) + 'px';
      this.dataGrid.setSize(refToResizableElement.width, this.props.multiSelect ? (refToResizableElement.height - 58) : refToResizableElement.height);
    } catch (ex) {
      this.debugLog(ex);
    }
  }


  onRowSelectionChanged(dataItem) {

    this.selectedItems=this.dataGrid && this.dataGrid.getSelectedItems();

    if (this.props.onChange && this.dataGrid) {
      this.props.onChange(dataItem, (dataItem!=undefined ? dataItem.bComboboxIndex:null), this.selectedItems);
    }

    // aliilhan: şair aşağıda ne demek istemiş hiç bişey anlamadım. KAPATTIM, yukarıdaki 3 satır yeterli.

    // if (this.props.multiSelect && dataItem == null && selectedIndex == null) { // All row selected or unselected
    //   this.selectedItems = [];
    //   if (checked) {
    //     for (let i = 0; i < this.props.dataSource.length; i++) {
    //       this.selectedItems.push(this.props.dataSource[i]);
    //     }
    //   }
    //   else {
    //     this.selectedItems = [];
    //   }
    //   if (this.props.onChange) {
    //     this.props.onChange(null, null, this.selectedItems);
    //   }
    //   return;
    // }
    // if (this.props.multiSelect) {
    //   this.selectedItems = this.dataGrid.getSelectedItems();
    // }
    // else {
    //   // single select
    //   this.selectedItems = [dataItem];
    // }

    // if (this.props.onChange) {
    //   this.props.onChange(dataItem, dataItem.bComboboxIndex, this.selectedItems);
    // }
  }

  onClickClearSelected() {
    this.props.onClickClearSelected && this.props.onClickClearSelected();
  }

  // todo: çöp, gidecek
  componentDidMount() {
    setTimeout(function () {
      this.dataGrid && this.dataGrid.setSize(null, this.getMaxGridHeight(this.state.dataSource));
    }.bind(this), 200);

  }

  getMaxResizableHeight(menuItems) {

    var height = this.getMaxGridHeight(menuItems);
    height = height + 15; // resizable icon
    if (this.props.multiSelect)
      height = height + 60; // presenter
    return height;
  }

  getMaxGridHeight(menuItems) {

    var maxItemLength = menuItems.length >= 7 ? 7 : menuItems.length;
    var menuHeight = (maxItemLength ) * 36; // row
    menuHeight = menuHeight + (maxItemLength)+36; // divider
    return menuHeight;
  }


  render() {
    const summaryTextColor = this.props.context.theme.boaPalette.base400;
    const resizableIconColor = this.props.context.theme.boaPalette.base300;

    var notFoundText = this.getMessage('BOA', 'NotFoundLike') ? this.getMessage('BOA', 'NotFoundLike').replace('{0}', this.state.searchText) : this.getMessage('BOA', 'NotFoundLike');
    var noItemFoundText = this.getMessage('BOA', 'NotFound');

    var divStyle = { textAlign: 'left', color: summaryTextColor, fontSize: '14px', minHeight: 32, marginLeft: 12, marginTop: 8, marginBottom: 8 };
    var resizableIconStyle = { position: 'absolute', bottom: -14, right: -14, display: 'inline-block' };

    const { isRightToLeft } = this.props.context.localization;
    if (isRightToLeft) {
      divStyle = { textAlign: 'right', color: summaryTextColor, fontSize: '14px', minHeight: 32, marginRight: 12, marginTop: 8, marginBottom: 8 };
      resizableIconStyle = { position: 'absolute', bottom: -14, left: -14, display: 'inline-block' };
    }
    var columns = this.props.columns;
    if (!this.props.multiColumn) {
      columns = [{ key: this.props.displayMemberPath, name: this.props.labelText }];
    }
    let isMobileOrTablet = this.props.context.deviceSize < BComponent.Sizes.MEDIUM;
    const isResizable = {
      top: false,
      right: isRightToLeft ? false : true,
      bottom: true,
      left: isRightToLeft ? true : false,
      topRight: false,
      bottomRight: isRightToLeft ? false : true,
      bottomLeft: isRightToLeft ? true : false,
      topLeft: false
    };

    return (
      isMobileOrTablet ?
        <BScroll
          context={this.props.context}
        >
          <div
            style={{
              maxHeight: this.getMaxResizableHeight(this.state.dataSource)
            }}>
            {
              this.props.dataSource && this.state.dataSource.length > 0 ?
                (
                  <div style={{marginLeft:-12}} >
                    <BDataGrid
                      ref={r => this.dataGrid = r}
                      context={this.props.context}
                      dataSource={this.state.dataSource}
                      columns={columns}
                      selectedIndexes={this.state.selectedIndexes}
                      selectable={this.props.multiSelect ? 'multiple' : 'singleNonPointer'}
                      onRowSelectionChanged={this.onRowSelectionChanged.bind(this)}
                      headerBarOptions={{ show: false }}
                      sortable={false}
                      groupable={false}
                      reordable={false}
                      resizable={false}
                      filterable={false}
                      columnMenu={false}
                      height={this.getMaxGridHeight(this.state.dataSource)}
                      autoFit={false}
                      isInsideTheCard={false}
                      rowHeight={36}

                    />

                    <div style={{ display: this.props.multiSelect ? '' : 'none' }}>
                      <SelectionsPresenterPopup
                        context={this.props.context}
                        ref={r => this.selectionPresenterPopup = r}
                        dataSource={this.props.dataSource}
                        displayMemberPath={this.props.displayMemberPath}
                        onClickClearSelected={this.onClickClearSelected}
                        getCurrentSelectedItemsOfParent={this.getCurrentSelectedItemsOfParent.bind(this)} />
                    </div>
                  </div>

                )
                :
                (<div style={divStyle}>
                  {this.props.dataSource && this.props.dataSource.length > 0 ? notFoundText : noItemFoundText}
                </div>)
            }
          </div>
        </BScroll>
        :
        <BResizableBeta
          context={this.props.context}
          ref={r => this.resizable = r}
          bounds='parent'
          minWidth={this.props.minWidth}
          minHeight={150}
          default={{ x: 0, y: 0, width: this.props.minWidth, height: '100%' }}
          onResize={this.onResize.bind(this)}
          isResizable={isResizable}>
          <div
            style={{
              // maxHeight: this.getMaxResizableHeight(this.state.dataSource)
            }}>
            {
              this.props.dataSource && this.state.dataSource.length > 0 ?
                (
                  <div style={{marginLeft: this.props.multiSelect ? -12:0}}>
                    <BDataGrid
                      ref={r => this.dataGrid = r}
                      context={this.props.context}
                      dataSource={this.state.dataSource}
                      columns={columns}
                      selectedIndexes={this.state.selectedIndexes}
                      selectable={this.props.multiSelect ? 'multiple' : 'singleNonPointer'}
                      onRowSelectionChanged={this.onRowSelectionChanged.bind(this)}
                      headerBarOptions={{ show: false }}
                      sortable={false}
                      groupable={false}
                      reordable={false}
                      resizable={false}
                      filterable={false}
                      columnMenu={false}
                      showHeaderRow={ this.props.multiSelect!=true && this.props.multiColumn!=true ?  false :true}
                      height={this.getMaxGridHeight(this.state.dataSource)}
                      autoFit={false}
                      isInsideTheCard={false}
                      rowHeight={36}
                    />

                    <div style={{ display: this.props.multiSelect ? '' : 'none' }}>
                      <SelectionsPresenterPopup
                        context={this.props.context}
                        ref={r => this.selectionPresenterPopup = r}
                        dataSource={this.props.dataSource}
                        displayMemberPath={this.props.displayMemberPath}
                        onClickClearSelected={this.onClickClearSelected}
                        getCurrentSelectedItemsOfParent={this.getCurrentSelectedItemsOfParent.bind(this)} />
                    </div>
                  </div>

                )
                :
                (<div style={divStyle}>
                  {this.props.dataSource && this.props.dataSource.length > 0 ? notFoundText : noItemFoundText}
                </div>)
            }
          </div>
          <ResizableIcon style={resizableIconStyle} context={this.props.context} color={resizableIconColor} />
        </BResizableBeta>
    );
  }
}

export default RenderedDataGrid;
