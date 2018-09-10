import React from 'react';
import PropTypes from 'prop-types';
import { BComponent, BComponentComposer } from 'b-component';
import { BFlexPanel } from 'b-flex-panel';
import { BIconButton } from 'b-icon-button';
import { BCard } from 'b-card';
import { BInput } from 'b-input';
import { BComboBox } from 'b-combo-box';
import { BLabel } from 'b-label';
import { Common } from './common';
import { BInputNumeric } from 'b-input-numeric';
import { BToggle } from 'b-toggle';

@BComponentComposer
export class BIterationEventItem extends BComponent {

  static propTypes = {
    /**
    * Base properties from BComponent
    */
    ...BComponent.props,
    /**
    * History item for interaction.
    */
    historyItem: PropTypes.any,
    /**
    * Defines icon theme.
    */
    dividerVisibility: PropTypes.bool,
    /**
    * Event for interaction type changed.
    */
    onInteractionTypeSelect: PropTypes.func,
    /**
    * Event to handle interaction button clicked.
    */
    onInteractionButtonClick: PropTypes.func,
    /**
    * Event to handle delete button clicked.
    */
    onDeleteButtonClick: PropTypes.func,
    /**
    * Event to handle move up buton clicked.
    */
    onMoveUpButtonClick: PropTypes.func,
    /**
    * Event to handle move down buton clicked.
    */
    onMoveDownButtonClick: PropTypes.func,
    /**
    * Event to handle combo selection.
    */
    onDataComboSelect: PropTypes.func,
    /**
    * The property source of component.
    */
    componentPropertySource: PropTypes.any
  };

  static defaultProps = {
    /**
    * Default prop values from BBusinessComponent
    */
    ...BComponent.defaultProps
  };

  constructor(props, context) {
    super(props, context);
    var hasHeader = (!this.props.historyItem.interactionHeader || this.props.historyItem.interactionHeader == '') ? true : false;
    this.state = {
      isEditHeader: hasHeader,
      isEditButtonVisible: false
    };
  }

  interactionTypeChanged(index, selectedItems, selectedValues) {
    if (selectedValues && selectedValues.length > 0) {
      this.props.historyItem.interactionType = selectedValues[0];
      if (this.props.onInteractionTypeSelect) {
        this.props.onInteractionTypeSelect(this.props.historyItem);
      }
    }
  }

  dataComboSelect(key: any, index, selectedItems, selectedValues) {
    if (selectedValues && selectedValues.length > 0) {
      var changedData = {
        changeKey: key,
        newValue: selectedValues[0],
        interaction: this.props.historyItem
      };
      if (this.props.onDataComboSelect) {
        this.props.onDataComboSelect(changedData);
      }
    }
  }

  staticValueChanged(key: any, b: any, checkValue: any) {
    var newValue;
    switch (key) {
      case 'inputValue':
        newValue = this.inputValue.getInstance().getValue();
        break;
      case 'inputNumericValue':
        newValue = this.inputNumericValue.getValue();
        break;
      case 'checkValue':
        newValue = checkValue;
        break;
    }
    var changeKey = this.props.historyItem.interactionType == Common.interactionTypeEnum.assignmentInteraction ? 'fromValue' : 'compareValue';
    var changedData = {
      changeKey: changeKey,
      newValue: newValue,
      interaction: this.props.historyItem
    };
    if (this.props.onDataComboSelect) {
      this.props.onDataComboSelect(changedData);
    }
  }

  componentDidMount() {
    super.componentDidMount();
    if ((!this.props.historyItem.interactionHeader || this.props.historyItem.interactionHeader == '') && this.headerInput) {
      this.setState({ isEditHeader: true }, () => { this.headerInput.getInstance().focus(); });
    }
  }

  componentDidUpdate() {
    super.componentDidUpdate();
    if ((!this.props.historyItem.interactionHeader || this.props.historyItem.interactionHeader == '') && this.state.isEditHeader == false) {
      this.setState({ isEditHeader: true }, () => { this.headerInput.getInstance().focus(); });
    }
  }

  getStateIcon() {
    var returnObject;
    var iconName = 'AddBox';
    var iconProperties = { color: this.props.context.theme.boaPalette.base200 };
    if (this.props.dividerVisibility == true) {
      iconProperties.color = this.props.context.theme.boaPalette.info500;
      if (this.props.historyItem.isExpanded == false) {
        iconName = 'IndeterminateCheckBox';
      }
      else {
        iconName = 'AddBox';
      }
    }

    returnObject = (<BIconButton
      disabled={false}
      iconProperties={iconProperties}
      context={this.props.context}
      dynamicIcon={iconName}
      style={{ margin: -12 }}
      onClick={() => {
        if (this.props.onInteractionButtonClick) {
          this.props.onInteractionButtonClick(this.props.historyItem);
        }
      }} />);
    return returnObject;
  }

  getOperationButtons() {
    return (<div style={{ marginRight: 20, marginLeft: 50 }}>
      {/* Yukarı Taşıma Butonu */}
      <BIconButton
        disabled={this.props.historyItem.isFirstItem}
        iconProperties={{
          color: this.props.context.theme.boaPalette.info500
        }}
        context={this.props.context}
        dynamicIcon={'ArrowUpward'}
        onClick={() => {
          if (this.props.onMoveUpButtonClick) {
            this.props.onMoveUpButtonClick(this.props.historyItem);
          }
        }} />
      {/* Aşağı Taşıma Butonu */}
      <BIconButton
        disabled={this.props.historyItem.isLastItem}
        iconProperties={{
          color: this.props.context.theme.boaPalette.info500
        }}
        context={this.props.context}
        dynamicIcon={'ArrowDownward'}
        onClick={() => {
          if (this.props.onMoveDownButtonClick) {
            this.props.onMoveDownButtonClick(this.props.historyItem);
          }
        }} />
      {/* Silme Butonu */}
      <BIconButton
        disabled={false}
        iconProperties={{
          color: this.props.context.theme.boaPalette.info500
        }}
        context={this.props.context}
        dynamicIcon={'Delete'}
        onClick={() => {
          if (this.props.onDeleteButtonClick) {
            this.props.onDeleteButtonClick(this.props.historyItem);
          }
        }} />
    </div>);
  }

  editHeader() {
    if (this.state.isEditHeader) {
      this.props.historyItem.interactionHeader = this.headerInput.getInstance().getValue();
      this.setState({ isEditHeader: false });
    }
    else {
      this.setState({ isEditHeader: true, isEditButtonVisible: false }, () => { this.headerInput.getInstance().focus(); });
    }
  }

  showEditButton(showButton: any) {
    if (!this.state.isEditHeader) {
      this.setState({ isEditButtonVisible: showButton });
    }
  }


  getTitleContent() {
    var headerStye = {
      color: this.props.context.theme.boaPalette.base400,
      fontWeight: '700',
      height: 21,
      paddingLeft: 8,
      paddingRight: 8,
      paddingTop: 5,
      borderRadius: 4,
      fontSize: 13,
      minWidth: 550
    };

    return (
      <div onMouseEnter={this.showEditButton.bind(this)}
        onMouseLeave={this.showEditButton.bind(this)}>
        <BFlexPanel
          isReverse={this.props.context.localization.isRightToLeft ? true : false}
          alignment='left'
          direction='horizontal'
          alignItems='stretch'
          responsive={false}
          context={this.props.context}
          style={headerStye}>
          {this.state.isEditHeader ?
            <BInput
              ref={ref => (this.headerInput = ref)}
              context={this.props.context}
              hintText={this.getMessage('BusinessComponents', 'EnterDescription')}
              onBlur={this.editHeader.bind(this)}
              value={this.props.historyItem.interactionHeader}>
            </BInput>
            :
            <BLabel
              context={this.props.context}
              text={this.props.historyItem.interactionHeader}
              style={{
                color: this.props.context.theme.boaPalette.pri500,
                display: 'flex',
                fontSize: '16px', 'margin-bottom': '10px', 'margin-top': '14px'
              }} />}
          {this.state.isEditButtonVisible && <BIconButton
            disabled={false}
            iconProperties={{
              color: this.props.context.theme.boaPalette.info500
            }}
            context={this.props.context}
            dynamicIcon={'ModeEdit'}
            style={{ marginLeft: 20 }}
            onClick={() => {
              this.editHeader();
            }} />}
        </BFlexPanel>
      </div>);
  }

  getComboContent(label: string, dataSource: any, changeKey: string) {
    return (
      <BComboBox labelText={label}
        context={this.props.context}
        dataSource={dataSource}
        value={[this.props.historyItem[changeKey]]}
        onSelect={this.dataComboSelect.bind(this, changeKey)}
        disableSearch={true}>
      </BComboBox>);
  }

  getComboItem(text: string) {
    var item = {
      'text': text,
      'value': text
    };
    if (text == this.getMessage('BusinessComponents', 'Select')) {
      item.value = '-1';
    }
    return item;
  }

  getCardContent() {
    var fromTypeList = [this.getComboItem(this.getMessage('BusinessComponents', 'Select')), this.getComboItem('Value'), this.getComboItem('Component')];
    var compareWithList = [this.getComboItem(this.getMessage('BusinessComponents', 'Select')), this.getComboItem('Value'), this.getComboItem('Component')];
    var compareOperandList = [this.getComboItem(this.getMessage('BusinessComponents', 'Select')), this.getComboItem('>'), this.getComboItem('='), this.getComboItem('<')];
    var valueTypeList = [this.getComboItem(this.getMessage('BusinessComponents', 'Select')), this.getComboItem('Text'), this.getComboItem('Numeric'), this.getComboItem('Check')];

    var componentList = [this.getComboItem(this.getMessage('BusinessComponents', 'Select'))];
    this.props.componentPropertySource.map((component) => {
      componentList.push(this.getComboItem(component.componentName));
    });

    var toPropertyList = [this.getComboItem(this.getMessage('BusinessComponents', 'Select'))];
    if (this.props.historyItem.toComponent && this.props.historyItem.toComponent != '-1') {
      var selectedToPropertyList = this.props.componentPropertySource.find(x => x.componentName == this.props.historyItem.toComponent).propertyList;
      selectedToPropertyList.map((property) => {
        toPropertyList.push(this.getComboItem(property));
      });
    }

    var fromPropertyList = [this.getComboItem(this.getMessage('BusinessComponents', 'Select'))];
    if (this.props.historyItem.fromComponent && this.props.historyItem.fromComponent != '-1') {
      var selectedFromPropertyList = this.props.componentPropertySource.find(x => x.componentName == this.props.historyItem.fromComponent).propertyList;
      selectedFromPropertyList.map((property) => {
        fromPropertyList.push(this.getComboItem(property));
      });
    }

    var sourcePropertyList = [this.getComboItem(this.getMessage('BusinessComponents', 'Select'))];
    if (this.props.historyItem.sourceComponent && this.props.historyItem.sourceComponent != '-1') {
      var selectedSourcePropertyList = this.props.componentPropertySource.find(x => x.componentName == this.props.historyItem.sourceComponent).propertyList;
      selectedSourcePropertyList.map((property) => {
        sourcePropertyList.push(this.getComboItem(property));
      });
    }

    var comparePropertyList = [this.getComboItem(this.getMessage('BusinessComponents', 'Select'))];
    if (this.props.historyItem.compareComponent && this.props.historyItem.compareComponent != '-1') {
      var selectedComparePropertyList = this.props.componentPropertySource.find(x => x.componentName == this.props.historyItem.compareComponent).propertyList;
      selectedComparePropertyList.map((property) => {
        comparePropertyList.push(this.getComboItem(property));
      });
    }

    var propName = this.props.historyItem.interactionType == Common.interactionTypeEnum.assignmentInteraction ? 'fromValue' : 'compareValue';
    var inputValue =
      <BInput value={this.props.historyItem[propName]}
        ref={ref => (this.inputValue = ref)}
        context={this.props.context}
        onBlur={this.staticValueChanged.bind(this, 'inputValue')}>
      </BInput>;
    var inputNumericValue =
      <BInputNumeric value={this.props.historyItem[propName]}
        ref={ref => (this.inputNumericValue = ref)}
        context={this.props.context}
        onBlur={this.staticValueChanged.bind(this, 'inputNumericValue')}>
      </BInputNumeric>;
    var checkValue =
      <BFlexPanel
        direction='horizontal'
        context={this.props.context}>
        <div>
          <BToggle
            style={{ marginLeft: -10 }}
            context={this.props.context}
            defaultToggled={this.props.historyItem[propName]}
            onToggle={this.staticValueChanged.bind(this, 'checkValue')}
          /></div>
        <BLabel
          context={this.props.context}
          text={this.props.historyItem[propName] ? 'True' : 'False'}
          style={{
            color: this.props.context.theme.boaPalette.pri500,
            display: 'flex',
            fontSize: '16px', 'margin-left': '8px'
          }}
        />
      </BFlexPanel>;

    if (this.props.historyItem.interactionType == Common.interactionTypeEnum.assignmentInteraction) {
      var cmbToComponent = this.getComboContent('To Component', componentList, 'toComponent');
      var cmbToProp = this.getComboContent('To Property', toPropertyList, 'toProp');
      var cmbFromType = this.getComboContent('From Type', fromTypeList, 'fromType');
      var cmbFromValueType = this.getComboContent('From Value Type', valueTypeList, 'fromValueType');
      var cmbFromComponent = this.getComboContent('From Component', componentList, 'fromComponent');
      var cmbFromProp = this.getComboContent('From Property', fromPropertyList, 'fromProp');

      return (
        <div>
          {cmbToComponent}
          {this.props.historyItem.toComponent != '-1' && cmbToProp}
          {this.props.historyItem.toProp != '-1' && cmbFromType}
          {this.props.historyItem.fromType == 'Component' && cmbFromComponent}
          {this.props.historyItem.fromType == 'Value' && cmbFromValueType}
          {this.props.historyItem.fromValueType == 'Text' && inputValue}
          {this.props.historyItem.fromValueType == 'Numeric' && inputNumericValue}
          {this.props.historyItem.fromValueType == 'Check' && checkValue}
          {this.props.historyItem.fromComponent != '-1' && cmbFromProp}
        </div>);
    }
    else if (this.props.historyItem.interactionType == Common.interactionTypeEnum.ifInteraction) {
      var cmbSourceComponent = this.getComboContent('Source Component', componentList, 'sourceComponent');
      var cmbSourceProp = this.getComboContent('Source Property', sourcePropertyList, 'sourceProp');
      var cmbCompareWith = this.getComboContent('Compare With', compareWithList, 'compareWith');
      var cmbCompareValueType = this.getComboContent('Compare Value Type', valueTypeList, 'compareValueType');
      var cmbCompareOperand = this.getComboContent('Compare Operand', compareOperandList, 'compareOperand');
      var cmbCompareComponent = this.getComboContent('Compare Component', componentList, 'compareComponent');
      var cmbCompareProp = this.getComboContent('Compare Property', comparePropertyList, 'compareProp');
      return (
        <div>
          {cmbSourceComponent}
          {this.props.historyItem.sourceComponent != '-1' && cmbSourceProp}
          {this.props.historyItem.sourceProp != '-1' && cmbCompareWith}
          {this.props.historyItem.compareWith != '-1' && cmbCompareOperand}
          {this.props.historyItem.compareWith == 'Component' && cmbCompareComponent}
          {this.props.historyItem.compareWith == 'Value' && cmbCompareValueType}
          {this.props.historyItem.compareValueType == 'Text' && inputValue}
          {this.props.historyItem.compareValueType == 'Numeric' && inputNumericValue}
          {this.props.historyItem.compareValueType == 'Check' && checkValue}
          {this.props.historyItem.compareComponent != '-1' && cmbCompareProp}
        </div>);
    }
    else {
      return (<div></div>);
    }
  }

  render() {
    var interactionTypes = [
      {
        'text': this.getMessage('BusinessComponents', 'Select'),
        'value': '-1'
      },
      {
        'text': this.getMessage('BusinessComponents', 'AssignmentInteraction'),
        'value': '1'
      },
      {
        'text': this.getMessage('BusinessComponents', 'IfInteraction'),
        'value': '2'
      }
    ];

    var leftSide =
      <BFlexPanel
        alignment='left'
        direction='vertical'
        alignItems='left'
        responsive={false}
        alignment='spaceBetween'
        context={this.props.context}>
        {
          <div style={{
            width: (this.props.historyItem.isFirstItem == true || this.props.historyItem.isExpanded === undefined) ? '0px' : '1px',
            height: '20px',
            background: this.props.context.theme.boaPalette.base200,
            alignSelf: 'center',
          }} >
          </div>
        }
        {
          this.getStateIcon()
        }
        {
          <div style={{
            width: '1px',
            display: this.props.dividerVisibility == false ? 'none' : '',
            background: this.props.context.theme.boaPalette.base200,
            alignSelf: 'center',
            flexGrow: '1'
          }} >
          </div>
        }
      </BFlexPanel>;

    return (
      <BFlexPanel
        alignment='left'
        direction='horizontal'
        alignItems='stretch'
        responsive={false}
        context={this.props.context}>
        {leftSide}
        {this.props.dividerVisibility == false ? <div></div> :
        <BFlexPanel
            style={{ marginLeft: 12 }}
            alignment='left'
            direction='vertical'
            alignItems='left'
            responsive={false}
            alignment='spaceBetween'
            context={this.props.context}>
          <div>
            <BFlexPanel context={this.props.context}
                style={{ marginTop: 5, alignSelf: 'left', flexGrow: '1' }}
                alignment='left' direction='horizontal' alignItems='stretch' responsive={false}>
              <BFlexPanel context={this.props.context}
                  style={{ marginLeft: 12, marginTop: -4 }}
                  alignment='left' direction='vertical' alignItems='left' responsive={false}>
                <BCard context={this.props.context}
                    expanded={!this.props.historyItem.isExpanded}
                    expandable={true}
                    isExpandableButtonVisible={false}
                    isTitleVisible={true}
                    titleContent={this.getTitleContent()}
                    headerContent={this.getOperationButtons()}>
                  <BComboBox style={{ marginTop: -12 }}
                      labelText={'Interaction Type'}
                      disableSearch={true}
                      context={this.props.context}
                      dataSource={interactionTypes}
                      displayMemberPath='text'
                      valueMemberPath='value'
                      value={this.props.historyItem ? [this.props.historyItem.interactionType] : [1]}
                      onSelect={this.interactionTypeChanged.bind(this)}
                      disabled={this.props.historyItem.interactionKey.toString().indexOf('.') > -1 ? true : false}>
                  </BComboBox>
                  {this.getCardContent()}
                </BCard>

                {!this.props.historyItem.isExpanded && this.props.children}

              </BFlexPanel>
            </BFlexPanel>
          </div>
          <div
              style={{ height: 28 }}>
          </div>

        </BFlexPanel>}
      </BFlexPanel>
    );
  }
}
export default BIterationEventItem;
