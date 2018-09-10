import React from 'react'; import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { BComponent } from 'b-component';
import { BResizableBeta } from 'b-resizable-beta';
import { BLocalization } from 'b-localization';
import { MenuItem } from '@material-ui/core';
import { BVirtualizedList  } from 'b-virtualized-list';

var ResizableIcon = require('b-icon').Others.Resizable;

class RenderedMenu extends BComponent {
  static propTypes = {
    autocompleteFilter: PropTypes.func,
    datasource: PropTypes.array,
    searchText: PropTypes.string,
    value: PropTypes.arrayOf(PropTypes.any),
    valueMemberPath: PropTypes.string,
    displayMemberPath: PropTypes.string,
    onItemTouchTap: PropTypes.func,
    onChange: PropTypes.func,
    onEscKeyDown: PropTypes.func,
    onKeyDown: PropTypes.func,
    getCurrentValueOfParent: PropTypes.func
  }

  constructor(props, context) {
    super(props, context);
    let searchText = this.props.searchText ? this.props.searchText : '';
    this.state = {
      dataSource: this.prepareDataSource(this.props.dataSource, searchText),
      searchText: searchText,
      value: this.props.value,
      disableAutoFocus: false,
      comboMenuHeight: 36
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.dataSource !== this.props.dataSource ||
      nextProps.searchText !== this.props.searchText) {
      let searchText = this.state.searchText ? this.state.searchText : '';
      if (nextProps.searchText !== this.props.searchText) {
        searchText = nextProps.searchText;
      }
      this.setState({ dataSource: this.prepareDataSource(nextProps.dataSource, searchText), searchText: searchText });
    }
  }

  updateSearchText(searchText) {
    let newSearchText = searchText ? searchText : '';
    this.setState({
      dataSource: this.prepareDataSource(this.props.dataSource, searchText),
      searchText: newSearchText,
      disableAutoFocus: true
    });
  }

  prepareDataSource(dataSource, searchText) {
    var list = [];
    if (dataSource && searchText && searchText != '') {
      for (var i = 0; i < dataSource.length; i++) {
        var item = dataSource[i];
        var text = item[this.props.displayMemberPath];
        if (this.props.autocompleteFilter(searchText, text)) {
          list.push(item);
        }
      }
    }
    else if (dataSource) {
      list = dataSource;
    }
    return list;
  }

  onChange(event, value) {
    if (this.props.onChange) {
      if (this.state.dataSource && this.state.dataSource.length > 0) {
        for (let i = 0; i < this.state.dataSource.length; i++) {
          if (this.state.dataSource[i][this.props.valueMemberPath] == value) {
            this.setState({ value: [value] });
            this.props.onChange(this.state.dataSource[i], this.state.dataSource[i].bCombobComboboxIndex, [this.state.dataSource[i]]);
            break;
          }
        }
      }
    }
  }

  // To make colorful matched letters of the text according to search text.
  getColoredTextBySearchText(searchText, child) {
    let label = child[this.props.displayMemberPath];
    const labelTextcolor = this.props.context.theme.boaPalette.pri500;
    if (searchText && searchText.length > 0 && BLocalization.stringLowerCase(label).includes(BLocalization.stringLowerCase(searchText))) {
      let spanArray = [];
      while (BLocalization.stringLowerCase(label).includes(BLocalization.stringLowerCase(searchText))) {
        let index = BLocalization.stringLowerCase(label).indexOf(BLocalization.stringLowerCase(searchText));
        if (index > 0) {
          let plaintText = String(label).substring(0, index);
          let colorfulText = String(label).substring(index, index + searchText.length);
          label = String(label).substring(index + searchText.length);
          spanArray.push(<span>{plaintText}</span>);
          spanArray.push(<span style={{ color: labelTextcolor }}>{colorfulText}</span>);
        }
        else if (index == 0) {
          let colorfulText = String(label).substring(index, index + searchText.length);
          label = String(label).substring(index + searchText.length);
          spanArray.push(<span style={{ color: labelTextcolor }}>{colorfulText}</span>);
        }
      }
      if (label && label.length > 0) {
        spanArray.push(<span>{label}</span>);
      }
      return <div>{spanArray}</div>;
    }
    else {
      return label;
    }
  }

  prepareMenuItems(searchText) {
    const listItemTextColor = this.props.context.theme.boaPalette.base450;
    var menuItemDivStyle = {
      direction:'ltr',
      textAlign: 'left',
      height: this.state.comboMenuHeight,
      paddingLeft: 12,
      paddingRight: 12,
      fontSize: '14px',
      color: listItemTextColor,
      minHeight: this.state.comboMenuHeight,
      lineHeight: '36px',
      paddingBottom: 0,
      paddingTop: 0
    };
    if (this.props.context.localization.isRightToLeft) {
      menuItemDivStyle = {
        direction:'rtl',
        textAlign: 'right',
        height: this.state.comboMenuHeight,
        paddingRight: 12,
        paddingLeft: 12,
        fontSize: '14px',
        color: listItemTextColor,
        minHeight: this.state.comboMenuHeight,
        lineHeight: '36px',
        paddingBottom: 0,
        paddingTop: 0
      };
    }

    const menuItems = this.state.dataSource &&
      this.state.dataSource.map((child, index) => {
        // Get colurful text by searching
        let colorfulText = this.getColoredTextBySearchText(searchText, child);

        let isSelected = false;
        if (this.state.value && this.state.value.length > 0 && this.state.value[0] == child[this.props.valueMemberPath])
          isSelected = true;


        return (
          <MenuItem
            context={this.props.context}
            onClick={() => {
              this.onChange(null, child[this.props.valueMemberPath]);
              this.props.onItemTouchTap && this.props.onItemTouchTap();

            }}
            key={'menuItem' + index}
            className={'menuItem'}
            classes={{
              selected: 'menuItemSelected'
            }}

            selected={isSelected}
            tabIndex={index}
            value={child[this.props.valueMemberPath]}
            primaryText={colorfulText}
            style={
              menuItemDivStyle
            }
          >
            {
              colorfulText
              /* {child[this.props.displayMemberPath]} */}
          </MenuItem>
        );
      });
    return menuItems;
  }

  onResize(e, direction, refToResizableElement) {
    try {
      let resizableParent = ReactDOM.findDOMNode(this.resizable).parentNode;

      resizableParent.style.height = (refToResizableElement.height) + 'px';
      resizableParent.style.width = (refToResizableElement.width) + 'px';
    } catch (ex) {
      this.debugLog(ex);
    }
  }

  // handleMenuKeyDownKeyDown
  handleMenuKeyDown(event) {
    // TODO: this solution propagates and triggers double onKeyDown
    // if event.stopPropagation(), nothing works, so the correct trigger is the 2nd one
    switch (event.key) {
      case 'ArrowUp':
        // TODO: add Shift+Tab
        // TODO: add if current MenuItem === firstChild
        break;

      case 'ArrowDown':
        // TODO: if current MenuItem === lastChild, this.focusFirstMenuItem()
        break;

      case 'PageUp':
        // TODO: this.focusFirstMenuItem()
        this.focusFirstMenuItem();
        break;

      case 'PageDown':
        // TODO: this.focusLastMenuItem()
        this.focusLastMenuItem();
        break;

      default: break;
    }
    // this.props.onKeyDown && this.props.onKeyDown(event);
  }

  focusFirstMenuItem() {
    const firstMenuItem = React.findDOMNode(this.menu).querySelector('[tabindex="0"]');
    firstMenuItem.focus();
  }

  focusLastMenuItem() {
    var index = this.state.dataSource && this.state.dataSource.length > 0 ? this.state.dataSource.length - 1 : 0;
    const lastMenuItem = ReactDOM.findDOMNode(this.menu).querySelector('[tabindex="' + index + '"]');
    lastMenuItem.focus();
  }

  getDefaultMenuHeight(menuItems) {

    var maxItemLength = menuItems.length >= 7 ? 7 : menuItems.length;
    var menuHeight = (maxItemLength) * this.state.comboMenuHeight;
    // menuHeight = menuHeight + 15; // resizable icon height
    return menuHeight;

  }

  rowRenderer (activeRow) {

    let child=activeRow;

    const listItemTextColor = this.props.context.theme.boaPalette.base450;
    var menuItemDivStyle = {
      direction:'ltr',
      textAlign: 'left',
      height: this.state.comboMenuHeight,
      paddingLeft: 12,
      paddingRight: 12,
      fontSize: '14px',
      color: listItemTextColor,
      minHeight: this.state.comboMenuHeight,
      lineHeight: '36px',
      paddingBottom: 0,
      paddingTop: 0
    };
    if (this.props.context.localization.isRightToLeft) {
      menuItemDivStyle = {
        direction:'rtl',
        textAlign: 'right',
        height: this.state.comboMenuHeight,
        paddingRight: 12,
        paddingLeft: 12,
        fontSize: '14px',
        color: listItemTextColor,
        minHeight: this.state.comboMenuHeight,
        lineHeight: '36px',
        paddingBottom: 0,
        paddingTop: 0
      };
    }

    let colorfulText = this.getColoredTextBySearchText(this.state.searchText, child);

    let isSelected = false;
    if (this.state.value && this.state.value.length > 0 && this.state.value[0] == child[this.props.valueMemberPath])
      isSelected = true;
    return (
      <MenuItem
        context={this.props.context}
        onClick={() => {
          this.onChange(null, child[this.props.valueMemberPath]);
          this.props.onItemTouchTap && this.props.onItemTouchTap();
        }}
        key={'menuItem' + child.bCombobComboboxIndex}
        className={'menuItem'}
        classes={{
          selected: 'menuItemSelected'
        }}
        selected={isSelected}
        // tabIndex={index}
        value={child[this.props.valueMemberPath]}
        primaryText={colorfulText}
        style={
          menuItemDivStyle
        }
      >
        {
          colorfulText
          /* {child[this.props.displayMemberPath]} */}
      </MenuItem>
    );
  }


  render() {
    let isMobileOrTablet = this.props.context.deviceSize < BComponent.Sizes.MEDIUM;
    const summaryTextColor = this.props.context.theme.boaPalette.base400;
    const resizableIconColor = this.props.context.theme.boaPalette.base300;

    var notFoundText = this.getMessage('BOA', 'NotFoundLike').replace('{0}', this.state.searchText);
    var noItemFoundText = this.getMessage('BOA', 'NotFound');

    var notFoundDivStyle = { textAlign: 'left', color: summaryTextColor, fontSize: '14px', minHeight: 32, marginLeft: 12, marginTop: 8, marginBottom: 8 };
    var resizableIconStyle = { position: 'absolute', bottom: -14, right: -14, display: 'inline-block' };

    const { isRightToLeft } = this.props.context.localization;
    if (isRightToLeft) {
      notFoundDivStyle = { textAlign: 'right', color: summaryTextColor, fontSize: '14px', minHeight: 32, marginRight: 12, marginTop: 8, marginBottom: 8 };
      resizableIconStyle = { position: 'absolute', bottom: -14, left: -14, display: 'inline-block' };
    }
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

    let defaultMenuHeight=this.getDefaultMenuHeight(this.state.dataSource);
    let list=(

      <div style={{
        height:'calc(100% - 5px)',
        width:'calc(100% - 5px)',
        minHeight: isMobileOrTablet ? defaultMenuHeight :undefined

      }}>
        {( this.state.dataSource &&  this.state.dataSource.length>0 ) ?
          <BVirtualizedList
            context={this.props.context}
            dataSource={ this.state.dataSource}
            rowRenderer={this.rowRenderer.bind(this)}
            estimatedRowSize={ 36}
            overscanRowCount={5}
            >

          </BVirtualizedList>
          :
          (<div style={notFoundDivStyle}>
            {this.props.dataSource && this.props.dataSource.length > 0 ? notFoundText : noItemFoundText}
          </div>)
        }
      </div>
    );

    return (
      isMobileOrTablet ?
        list
        :
        <BResizableBeta
          context={this.props.context}
          ref={r => this.resizable = r}
          bounds='parent'
          minWidth={this.props.minWidth}
          minHeight={75}
          maxWidth={600}
          default={{
            x: 0, y: 0,
            width: '100%',
            height: defaultMenuHeight<200 ? 200 :defaultMenuHeight }}
          maxHeight={defaultMenuHeight+100}
          onResize={this.onResize.bind(this)}
          isResizable={isResizable}>
          {list}
          <ResizableIcon style={resizableIconStyle} context={this.props.context} color={resizableIconColor} />
        </BResizableBeta>

    );
  }
}

export default RenderedMenu;
