import React from 'react'; import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import RenderedMenu from './RenderedMenu';
import RenderedDataGrid from './RenderedDataGrid';
import SelectionsPresenter from './SelectionsPresenter';
import { BComponent } from 'b-component';
import { BInputAction } from 'b-input-action';
import { BPopover } from 'b-popover';
import { BLocalization } from 'b-localization';
import { BDialog } from 'b-dialog-box';

class SelectField extends BComponent {
  static propTypes = {
    ...BComponent.propTypes,
    style: PropTypes.object,
    value: PropTypes.arrayOf(PropTypes.any),
    autocompleteFilter: PropTypes.func,
    name: PropTypes.string,
    hintText: PropTypes.string,
    labelText: PropTypes.string,
    multiSelect: PropTypes.bool,
    multiColumn: PropTypes.bool,
    columns: PropTypes.array,
    dataSource: PropTypes.array,
    disableSearch: PropTypes.bool,
    onSelect: PropTypes.func,
    errorText: PropTypes.string,
    disabled: PropTypes.bool,
    fullWidth: PropTypes.bool,
    displayMemberPath: PropTypes.string,
    valueMemberPath: PropTypes.string,
    displayLabelMemberPath: PropTypes.arrayOf(PropTypes.string),
    displayLabelSeperator: PropTypes.string,
    inlineGridMode: PropTypes.bool,
    hideRightIcons: PropTypes.bool,

  };

  static defaultProps = {
    disableSearch: false,
    autoComplete: false,
    autocompleteFilter: (searchText, text) => {
      if (text && text.length > 0) {
        return BLocalization.stringLowerCase(text).includes(BLocalization.stringLowerCase(searchText));
      }
      return false;
    },
    disabled: false,
    fullWidth: true,
    hideRightIcons: true,
  };

  constructor(props, context) {
    super(props, context);
    this.organizeState(this.props, true);
    this.openMenu = this.openMenu.bind(this);
    this.handleItemTouchTap = this.handleItemTouchTap.bind(this);
    this.handleMenuSelection = this.handleMenuSelection.bind(this);
    this.onClickClearSelected = this.onClickClearSelected.bind(this);
    this.state = Object.assign({}, { open: false, value: props.value });
  }

  getValue() {
    if (this.props && !this.props.multiSelect) {
      if (this.currentValue && this.currentValue.length > 0) {
        return this.currentValue[0];
      }
      return null;
    }
    else {
      if (this.currentValue) {
        return this.currentValue;
      }
      return [];
    }
  }

  resetValue(defaultValue) {
    if (!defaultValue) {
      defaultValue = [];
    }
    else if (Array.isArray(defaultValue) == false) {
      defaultValue = [defaultValue];
    }

    let tmpProps = { ...this.props };
    tmpProps.value = defaultValue;
    this.organizeState(tmpProps, false);

    // this.currentValue = defaultValue;
    // this.selectedItems = defaultValue;
    // this.currentIndexes =
    // this.setState({
    //   value : this.currentValue,
    //   selectedItems : this.selectedItems
    // });
  }

  getSelectedItems() {
    if (this.props && !this.props.multiSelect && this.selectedItems && this.selectedItems.length > 0) {
      return this.selectedItems[0];
    }
    else if (this.selectedItems) {
      return this.selectedItems;
    }
    return [];
  }

  getSnapshot() {
    let snapshot = {
      state: this.state,
      currentValue: this.currentValue,
      currentIndexes: this.currentIndexes,
      selectedItems: this.selectedItems
    };
    return snapshot;
  }

  setSnapshot(snapshot) {
    this.currentValue = snapshot.currentValue;
    this.currentIndexes = snapshot.currentIndexes;
    this.selectedItems = snapshot.selectedItems;
    this.setState({ ...snapshot.state });
  }

  componentDidMount() {
    this.presenterBlockEl = findDOMNode(this.presenterBlock);
  }

  componentWillReceiveProps(nextProps) {
    let organizeState = false;
    if (this.props.dataSource != nextProps.dataSource || this.props.text != nextProps.text || this.props.disabled != nextProps.disabled) {
      organizeState = true;
    }
    else if (this.props.value != nextProps.value) {
      if (this.props.value && nextProps.value) {
        if (this.props.value.length != nextProps.value.length) {
          organizeState = true;
        }
        else {
          for (let i = 0; i < this.props.value.length; i++) {
            if (this.props.value[i] != nextProps.value[i]) {
              organizeState = true;
              break;
            }
          }
        }
      }
      else if (!this.props.value && !nextProps.value) {
        organizeState = false;
      }
      else {
        organizeState = true;
      }
    }
    if (organizeState) {
      this.selectedItems = [];
      this.organizeState(nextProps, false);
    }
  }

  closeMenu() {

    this.setState({ open: false });
    findDOMNode(this.root).focus();
  }


  getPopoverWidth() {
    var widthOfResizable = 250;
    if (this.props.multiColumn)
      widthOfResizable = 600;
    else if (this.props.multiSelect && !this.props.multiColumn)
      widthOfResizable = 350;
    if (this.props.context.deviceSize < BComponent.Sizes.MEDIUM)
      widthOfResizable = 350;

    var selectionPgetWidth = 0;
    if (this.selectionPresenter != undefined) {
      selectionPgetWidth = this.selectionPresenter.getWidth();
    }
    if (widthOfResizable < selectionPgetWidth) {
      widthOfResizable = selectionPgetWidth;
    }

    return widthOfResizable;
  }


  openMenu() {
    this.setState({ open: true });
    let isMobileOrTablet = this.props.context.deviceSize < BComponent.Sizes.MEDIUM;
    !isMobileOrTablet && this.focusTextField();
  }

  clearTextField() {
    this.clearMenuItemsHover();
    this.handleTextFieldAutocompletionFiltering(null, '');
    this.searchTextField.resetValue();
  }

  // To focus first item of menu and search input of the component.
  focusTextField() {

    setTimeout(function () {
      if (this.menu) {
        const input2 = findDOMNode(this.menu).querySelector('div:first-child');
        input2.style.paddingTop = '10px';
        input2.style.paddingBottom = '10px';
        if (this.state.searchText.length > 0) {
          input2.querySelector('div:first-child').querySelector('span:first-child').className += ' menuItemfirstSelected';
        }
      }
      if (this.searchTextField) {
        const input = findDOMNode(this.searchTextField).querySelector('input');
        input.focus();
      }
    }.bind(this), 10);


  }

  // Root Div > HandleClick
  handleClick = () => {
    if (this.props.disabled)
      return;
    this.openMenu();
  }

  // Root Div > HandleKeyDown
  handleKeyDown = (event) => {
    if (/ArrowDown|Enter/.test(event.key)) this.openMenu();
  }

  // Popover > Callback function fired when the popover is requested to be closed.
  handlePopoverClose = () => {
    this.closeMenu();
    this.props.onClose && this.props.onClose();
  }

  // SelectionPresenter > AutoCompletion Filtering
  handleTextFieldAutocompletionFiltering = (event, searchText) => {
    this.setState({ hideRightIcons: false });
    this.clearMenuItemsHover();
    if (!this.props.multiSelect && !this.props.multiColumn) {
      this.renderedMenu.updateSearchText(searchText);
    }
    else {
      this.renderedDataGrid.updateSearchText(searchText);
    }
    if (searchText.length > 0) {
      this.searchTextField.showRightIcons();
    }
    else {
      this.searchTextField.hideRightIcons();
    }
    this.focusTextField();
  }

  handleTextFieldKeyDown = (event) => {
    switch (event.key) {
      case 'ArrowDown':
        // this.focusFirstMenuItem();
        break;
      case 'Escape':
        this.clearTextField();
        this.closeMenu();
        break;
      default: break;
    }
  }

  // Callback function fired when ESC key is pressed.
  handleMenuEscKeyDown = () => this.closeMenu()

  handleMenuSelection(selectedItem, selectedIndex, selectedItems) {
    selectedItem && this.setState({
      value: [selectedItem[this.props.valueMemberPath]]
    });
    this.onSelect(selectedItem, selectedIndex, selectedItems);
    !this.props.multiSelect && this.closeMenuDependsonSelect();
  }

  // HandleItemTochTap method to close menu when same item is selected.
  handleItemTouchTap() {
    this.closeMenuDependsonSelect();
  }

  // To close menu if multiselect set.
  closeMenuDependsonSelect = () => {
    this.closeMenu();
  }

  handleMenuKeyDown = (event) => {
    // TODO: this solution propagates and triggers double onKeyDown
    // if event.stopPropagation(), nothing works, so the correct trigger is the 2nd one
    switch (event.key) {
      case 'ArrowUp':
        // TODO: add Shift+Tab
        // TODO: add if current MenuItem === firstChild
        this.focusTextField();
        break;

      case 'ArrowDown':
        // TODO: if current MenuItem === lastChild, this.focusFirstMenuItem()
        break;

      case 'PageUp':
        // TODO: this.focusFirstMenuItem()
        break;

      case 'PageDown':
        // TODO: this.focusLastMenuItem()
        break;
      default: break;
    }
  }

  // Callback function fired when close button is clicked.
  btnCloseOnclick() {
    this.clearTextField();
  }

  // To clearn hover style of menu items after search.
  clearMenuItemsHover() {
    if (findDOMNode(this.menu) != null) {
      const input2 = findDOMNode(this.menu).querySelector('div:first-child');
      var items = input2.querySelectorAll('span.menuItemfirstSelected');
      for (var i = 0; i < items.length; i++) {
        items[i].className -= 'menuItemfirstSelected';
      }
    }
  }

  getCurrentValueOfParent() {
    return this.currentValue;
  }

  getCurrentIndexesOfParent() {
    return this.currentIndexes;
  }

  getCurrentSelectedItemsOfParent() {
    return this.selectedItems;
  }

  organizeState(props, setFirstTime) {
    let indexes = [];
    let selectedItems = [];

    var newValue = props.value ? props.value : [];
    if (newValue == null || newValue == undefined || (newValue.length > 0 && newValue[0] == undefined)) {
      newValue = [];
    }

    // Datasourceda olmayan degerleri listeden siliyoruz. // by mbrn
    for (let i = newValue.length - 1; i >= 0; i--) {
      if (props.dataSource && props.dataSource.length > 0 && !props.dataSource.find(a => { return a[props.valueMemberPath] == newValue[i]; })) {
        newValue.splice(i, 1);
      }
    }

    if (newValue && newValue.length > 0 && props.dataSource && props.dataSource.length > 0) {
      let convertNumberToString = false;
      let data = props.dataSource[0][props.valueMemberPath];
      if (data && (typeof data === 'string')) {
        convertNumberToString = true;
      }
      for (let i = 0; convertNumberToString && i < newValue.length; i++) {
        if (newValue[i] && (typeof newValue[i] === 'number')) {
          newValue[i] = newValue[i].toString();
        }
      }
    }
    this.currentValue = newValue;

    // To get index(es) of data source using assigned value(s).
    if (props.dataSource) {
      for (let i = 0; i < props.dataSource.length; i++) {
        var data = props.dataSource[i][props.valueMemberPath];
        if (Array.isArray(newValue)) {
          if (data != null && data != undefined && newValue.length > 0 && (newValue.indexOf(data) > -1 || newValue.indexOf(data.toString()) > -1)) {
            indexes.push(i);
            selectedItems.push(props.dataSource[i]);
          }
        }
        else {
          if (newValue && newValue == data) {
            indexes.push(i);
            selectedItems.push(props.dataSource[i]);
          }
        }
      }
    }

    this.currentIndexes = indexes;
    this.selectedItems = selectedItems;

    if (setFirstTime) {
      this.state = {
        value: newValue,
        text: props.text ? props.text : [],
        selectedIndexes: indexes
      };
    }
    else {
      this.setState({
        value: newValue,
        text: props.text ? props.text : [],
        selectedIndexes: indexes
      });
    }
  }

  onClickClearSelected() {
    this.currentValue = [];
    this.currentIndexes = [];
    this.selectedItems = [];
    this.selectionPresenter && this.selectionPresenter.updateSelectionRender(this.selectedItems, this.currentValue);
    this.props.dataSource.forEach(element => {
      element.isSelected=false;
    });
    this.setState({ selectedIndexes: this.currentIndexes, value: [] });
  }

  // Fires when Menu Item Selection Changed
  onSelect(selectedItem, selectedIndex, selectedItems) {
    this.currentValue = [];
    this.currentIndexes = [];
    this.selectedItems = selectedItems;
    if (selectedItems && selectedItems.length > 0) {
      for (let i = 0; i < selectedItems.length; i++) {
        this.currentValue.push(selectedItems[i][this.props.valueMemberPath]);
        this.currentIndexes.push(selectedItems[i].bComboboxIndex);
      }
    }

    if (this.selectedItems == null || !this.selectedItems) {
      return;
    }
    this.selectionPresenter && this.selectionPresenter.updateSelectionRender(selectedItems, this.currentValue);
    this.renderedDataGrid && this.props.multiSelect && this.renderedDataGrid.updateSelectedIndexes(this.selectedItems, this.currentValue);
    if (this.props.onSelect) {
      if (selectedIndex != null && selectedItem != null) {
        this.props.onSelect(selectedIndex, selectedItems, this.currentValue);
      }
      else {
        this.props.onSelect(null, selectedItems, this.currentValue);
      }
    }
    this.debugLog(selectedItems);
  }

  validateConstraint() {
    return this.selectionPresenter ? this.selectionPresenter.validateConstraint() : true;
  }

  render() {
    var comboboxstyle =
      {
        labelTextcolor: this.props.context.theme.boaPalette.pri500,
        inputTextColor: this.props.context.theme.boaPalette.base450,
        strokeColor: this.props.context.theme.boaPalette.base250,
        iconColor: this.props.context.theme.boaPalette.base400,
        emptyHintTextColor: this.props.context.theme.boaPalette.base300,
        pressedStrokeColor: this.props.context.theme.boaPalette.pri500,
        errorStrokeColor: this.props.context.theme.boaPalette.error500,
        errorMessageColor: this.props.context.theme.boaPalette.error500,
        disabledLabelTextColor: this.props.context.theme.boaPalette.pri350,
        disabledInputTextColor: this.props.context.theme.boaPalette.base250,
        disabledStrokeColor: this.props.context.theme.boaPalette.base200,
        obligedStrokeColor: this.props.context.theme.boaPalette.obli500,
        listColumnLabelTextColor: this.props.context.theme.boaPalette.base500,
        listItemTextColor: this.props.context.theme.boaPalette.base450,
        listItemLighterBgColor: this.props.context.theme.boaPalette.comp500,
        listItemDarkerBgColor: this.props.context.theme.boaPalette.base50,
        listItemSeparatorLineColor: this.props.context.theme.boaPalette.base200,
        highlightedTextColor: this.props.context.theme.boaPalette.pri500,
        selectedItemTextColor: this.props.context.theme.boaPalette.pri500,
        selectedItemBgColor: this.props.context.theme.boaPalette.pri250,
        hoveredItemBgColor: this.props.context.theme.boaPalette.base100,
        hoveredSelectedItemBgColor: this.props.context.theme.boaPalette.pri500,
        clearTextBtnColor: this.props.context.theme.boaPalette.pri500,
        summaryTextColor: this.props.context.theme.boaPalette.base400,
        resizableIconColor: this.props.context.theme.boaPalette.base300,
        menuHeight: 36
      };

    const {
      context, disabled, valueConstraint,
      hintText, labelText, errorText, style,
      displayMemberPath, valueMemberPath, displayLabelMemberPath, displayLabelSeperator,
    } = this.props;
    const hoveredItemBgColor = comboboxstyle.hoveredItemBgColor;
    const listItemSeparatorLineColor = comboboxstyle.listItemSeparatorLineColor;

    let closeIconButton = [{
      'dynamicIcon': 'Close',
      'iconProperties': { style: { 'color': comboboxstyle.iconColor } },
      'onClick': this.btnCloseOnclick.bind(this),
      'style': { 'margin-right': '12px', 'margin-left': '4px' }
    }];

    var popoverOrigin = { horizontal: 'left', vertical: 'top' };


    let popoverContent;
    if (!this.props.multiSelect && !this.props.multiColumn) {
      popoverContent =
        <RenderedMenu
          context={this.props.context}
          ref={r => this.renderedMenu = r}
          autocompleteFilter={this.props.autocompleteFilter}
          dataSource={this.props.dataSource}
          searchText={this.state.searchText}
          value={this.state.value}
          valueMemberPath={this.props.valueMemberPath}
          displayMemberPath={this.props.displayMemberPath}
          onItemTouchTap={this.handleItemTouchTap}
          onChange={this.handleMenuSelection}
          onEscKeyDown={this.handleMenuEscKeyDown}
          onKeyDown={this.handleMenuKeyDown}
          getCurrentValueOfParent={this.getCurrentValueOfParent.bind(this)}
          minWidth={this.getPopoverWidth()}
        />;
    }
    else {
      popoverContent = <RenderedDataGrid
        context={this.props.context}
        ref={r => this.renderedDataGrid = r}
        autocompleteFilter={this.props.autocompleteFilter}
        dataSource={this.props.dataSource}
        searchText={this.state.searchText}
        value={this.props.value}
        valueMemberPath={this.props.valueMemberPath}
        displayMemberPath={this.props.displayMemberPath}
        onItemTouchTap={this.handleItemTouchTap}
        onChange={this.handleMenuSelection}
        onEscKeyDown={this.handleMenuEscKeyDown}
        columns={this.props.columns}
        multiSelect={this.props.multiSelect}
        multiColumn={this.props.multiColumn}
        labelText={this.props.labelText}
        selectedIndexes={this.state.selectedIndexes}
        onClickClearSelected={this.onClickClearSelected}
        getCurrentIndexesOfParent={this.getCurrentIndexesOfParent.bind(this)}
        getCurrentSelectedItemsOfParent={this.getCurrentSelectedItemsOfParent.bind(this)}
        minWidth={this.getPopoverWidth()} />;
    }

    let isMobileOrTablet = this.props.context.deviceSize < BComponent.Sizes.MEDIUM;

    const dividerStyle = { display: 'table', width: '100%', height: '1px', position: 'relative', marginTop: 0, borderTop: '1px solid', borderColor: listItemSeparatorLineColor };

    let content = (
      <div style={{
        minWidth: this.getPopoverWidth(),
        overflow: 'hidden'
      }}>
        <div style={{ height: 60 }}>
          <div
            style={{
              marginLeft: 12,
              marginRight: 12,
              paddingTop: 18
            }}>
            <BInputAction
              context={context}
              ref={ref => (this.searchTextField = ref)}
              hintText={hintText}
              rightIconList={closeIconButton}
              hideRightIcons={this.props.hideRightIcons}
              onChange={this.handleTextFieldAutocompletionFiltering}
              onKeyDown={this.handleTextFieldKeyDown}
            />
          </div>

        </div>

        <div style={dividerStyle}></div>

        {/* boyutlandırma için gerekli */}
        <div >
          {popoverContent}
        </div>
      </div>
    );

    let styleSheet = (
      <style>
        {`  .menuItemfirstSelected { background-color: ${hoveredItemBgColor} !important; }
              .menuItem:hover { background-color: ${hoveredItemBgColor} !important; }
              .menuItemSelected
              {
                background-color: ${this.props.context.theme.boaPalette.pri250} !important;
                color: ${this.props.context.theme.boaPalette.pri500} !important;

            }
          `}
      </style>
    );

    return (
      <div
        ref={ref => (this.root = ref)}
        tabIndex='0'
        style={{
          cursor: 'pointer',
          outline: 'none',
          position: 'relative'
        }}
        onKeyDown={this.handleKeyDown}
      >
        {styleSheet}
        <div ref={ref => this.presenterBlock = ref}>
          <SelectionsPresenter
            ref={ref => (this.selectionPresenter = ref)}
            hintText={hintText}
            labelText={labelText}
            disabled={disabled}
            valueConstraint={valueConstraint}
            errorText={errorText}
            value={this.state.value}
            selectedItems={this.selectedItems}
            context={context}
            displayMemberPath={displayMemberPath}
            displayLabelSeperator={displayLabelSeperator}
            displayLabelMemberPath={displayLabelMemberPath}
            valueMemberPath={valueMemberPath}
            dataSource={this.props.dataSource}
            multiSelect={this.props.multiSelect}
            inlineGridMode={this.props.inlineGridMode}
            multiColumn={this.props.multiColumn}
            onFocus={this.handleClick}
          />
        </div>

        {isMobileOrTablet ?
          <BDialog
            context={this.props.context}
            ref={r => this.dialogComponent = r}
            modal={false}
            dialogBoxContentPadding='0px'
            open={this.state.open}
            disableRestoreFocus={true}
            onRequestClose={this.handlePopoverClose.bind(this)}>
            {content}
          </BDialog>
          // <BPopover
          //   context={this.props.context}
          //   ref={r => this.popoverComponent = r}
          //   open={this.state.open}
          //   anchorReference={'anchorPosition'}
          //   anchorPosition={{ top: 0, left: 0 }}
          //   canAutoPosition={true}
          //   anchorOrigin={popoverOrigin}
          //   isOriginSetted={true}
          //   useLayerForClickAway={false}
          //   marginThreshold='0'
          //   repositionOnUpdate={true}
          //   onRequestClose={this.handlePopoverClose.bind(this)}
          //   isResizable={false}
          //   disableRestoreFocus={true}
          //   PaperProps={{ style: { maxWidth: '100%', width: '100%' } }}
          //   style={{
          //     position: 'absolute',
          //     maxWidth: '100%',
          //     width: 'calc(100% - 16px)',
          //     height: 'calc(100% - 16px)',
          //     maxheight: 'calc(100% - 24px)',
          //     margin: '8px',
          //     // zIndex: 10000,
          //     direction: !this.props.context.localization.isRightToLeft ? 'ltr' : 'rtl'
          //   }}
          // >
          //   {content}
          // </BPopover>
          :
          <BPopover
            context={this.props.context}
            ref={r => this.popoverComponent = r}
            open={this.state.open}
            anchorEl={this.root}
            canAutoPosition={true}
            anchorOrigin={popoverOrigin}
            isOriginSetted={true}
            useLayerForClickAway={false}
            repositionOnUpdate={true}
            onRequestClose={this.handlePopoverClose.bind(this)}
            isResizable={false}
            disableRestoreFocus={true}
            style={{
              marginTop: -2,
              marginLeft: -12,
              direction: !this.props.context.localization.isRightToLeft ? 'ltr' : 'rtl'
            }}
          >
            {content}
          </BPopover>
        }

      </div>
    );
  }

}

export default SelectField;
