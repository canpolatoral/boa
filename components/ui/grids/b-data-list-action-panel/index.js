import React from 'react'; 
import PropTypes from 'prop-types';
import { BComponent } from 'b-component';
import { BButton } from 'b-button';
import { BCheckBox } from 'b-check-box';
import { BScroll } from 'b-scroll';
import { Delete, Create, RadioButtonChecked, RadioButtonUnchecked } from '@material-ui/icons';

export class BDataListActionPanel extends BComponent {

  static defaultProps = {
    historyButtonText: 'Geçmiş',
    addButtonText: 'Ekle',
    displayItemCount: 3
  }

  static propTypes = {
    panelKey: PropTypes.string.isRequired,
    columns: PropTypes.arrayOf(PropTypes.shape({
      field: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['header', 'body', 'footer']).isRequired,
      title: PropTypes.string,
      compareValue: PropTypes.any
    })),
    dataSource: PropTypes.array.isRequired,
    focusedField: PropTypes.string,
    focusedFieldCompareValue: PropTypes.any,
    focusedFieldTitle: PropTypes.string,
    displayItemCount: PropTypes.number,
    addButtonText: PropTypes.string,
    historyButtonText: PropTypes.string,
    showAddButton: PropTypes.bool,
    showDeleteButton: PropTypes.bool,
    showEditButton: PropTypes.bool,
    showHistoryButton: PropTypes.bool,
    addButtonDisabled: PropTypes.bool,
    historyButtonDisabled: PropTypes.bool,
    onItemSelected: PropTypes.func,
    onAddClicked: PropTypes.func,
    onEditClicked: PropTypes.func,
    onDeleteClicked: PropTypes.func,
    onHistoryClicked: PropTypes.func
  }

  state = {
    dataSource: this.props.dataSource,
    displayItemsHeight: this.props.displayItemCount ? 0 : 'inherit'
  }

  constructor(props, context) {
    super(props, context);
    this.handleOnAddClicked = this.handleOnAddClicked.bind(this);
    this.handleOnDeleteClicked = this.handleOnDeleteClicked.bind(this);
    this.handleOnEditClicked = this.handleOnEditClicked.bind(this);
    this.handleOnHistoryClicked = this.handleOnHistoryClicked.bind(this);
  }

  componentDidMount() {
    if (this.props.displayItemCount) {
      this.setState({ displayItemsHeight: this.getDisplayItemsHeight() });
    }
  }

  componentDidUpdate() {
    if (this.props.displayItemCount) {
      let height = this.getDisplayItemsHeight();
      if (height != this.state.displayItemsHeight) {
        this.setState({ displayItemsHeight: this.getDisplayItemsHeight() });
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props) {
      if (nextProps.dataSource !== this.state.dataSource) {
        this.setState({ dataSource: nextProps.dataSource });
      }
    }
  }

  getDisplayItemsHeight() {
    let height = 0;
    const panelInnerWrap = document.getElementsByClassName('panelInnerWrap');
    if (panelInnerWrap && panelInnerWrap.length > 0) {
      let displayCount = this.props.displayItemCount;
      let panelWrap = panelInnerWrap[0];
      if (panelWrap.childNodes.length > 0) {
        displayCount = panelWrap.childNodes.length >= displayCount ? displayCount : panelWrap.childNodes.length;
        for (var i = 0; i < displayCount; i++) {
          let node = panelWrap.childNodes[i];
          height = height + node.clientHeight;
        }
      }
    }
    return (height + 20) + 'px';
  }

  getSnapshot() {
    return {
      state: this.state,
    };
  }

  setSnapshot(snapshot) {
    let {state} = snapshot;
    this.setState({ ...state });
  }

    /**
     * Get the selected value
     */
  getValue() {
    return this.selectedItem;
  }

  getSelectedIndex() {
    return this.selectedIndex;
  }

  deleteItem(index) {
    if (this.state.dataSource && this.state.dataSource.length > 0) {
      this.state.dataSource.splice(index, 1);
      this.resetState();
    }
  }

  resetState() {
    let count = this.state.renderCount || 1;
    this.setState({ renderCount: count + 1 });
  }

  setSelectedItem(isInputChecked, dataIndex, dataItem) {
    this.state.dataSource.forEach((item) => {
      item.checked = false;
    }, this);
    dataItem.checked = isInputChecked;
    this.resetState();
    if (this.props.onItemSelected) {
      this.props.onItemSelected(dataIndex, dataItem);
    }
  }

    /**
     * Handle function fired when add button is clicked
     * @param {any} e
     */
  handleOnAddClicked() {
    if (this.props.onAddClicked) {
      this.props.onAddClicked();
    }
  }

    /**
     * Handle function fired when delete button is clicked
     * @param {any} e
     */
  handleOnDeleteClicked() {
    if (this.props.onDeleteClicked) {
      let index = this.selectedIndex;
      let item = this.selectedItem;
      this.props.onDeleteClicked(index, item);
    }
        // this.deleteItem(this.selectedIndex);
  }

    /**
     * Handle function fired when edit button is clicked
     * @param {any} e
     */
  handleOnEditClicked() {
    if (this.props.onEditClicked) {
      let index = this.selectedIndex;
      let item = this.selectedItem;
      this.props.onEditClicked(index, item);
    }
  }

    /**
     * Handle function fired when history button is clicked
     * @param {any} e
     */
  handleOnHistoryClicked() {
    if (this.props.onHistoryClicked) {
      let index = this.selectedIndex;
      let item = this.selectedItem;
      this.props.onHistoryClicked(index, item);
    }
  }

  render() {
    let {context} = this.props;
    let hasItem = this.state.dataSource && this.state.dataSource.length > 0;
    let boaPalette = this.props.context.theme.boaPalette;
    this.selectedIndex = -1;
    this.selectedItem = null;

    let items = this.state.dataSource.map((dataItem, dataIndex) => {
      let m = this.props.columns.map((column, columnIndex) => {
        let header; let body; let footer;

        switch (column.type) {
          case 'header': {
            header = <div className={'headerWrap'}>{dataItem[column.field]} </div>;
            break;
          }
          case 'body': {
            let isFocused = dataItem[this.props.focusedField] == this.props.focusedFieldCompareValue;
            body = (
              <div style={{display:'flex'}}>
                <BCheckBox
                                context={context}
                                checkedIcon={<RadioButtonChecked />}
                                uncheckedIcon={<RadioButtonUnchecked />}
                                defaultChecked={dataItem.checked}
                                checked={dataItem.checked}
                                label={dataItem[column.field]}
                                labelStyle={{ marginBottom: '0px', width: '100%' }}
                                style={isFocused ? { width: 'inherit', float: 'left', display: 'flex' } : {}}
                                onCheck={(event, isInputChecked) => {
                                  this.setSelectedItem(isInputChecked, dataIndex, dataItem);
                                }} />
                {isFocused &&
                  <div className={'focusedFieldTitleWrap'}>({this.props.focusedFieldTitle})
                  </div>
                }
              </div>);
            if (dataItem.checked) {
              this.selectedIndex = dataIndex;
              this.selectedItem = dataItem;
            }
            break;
          }
          case 'footer': {
            let compareValue = column.compareValue === undefined ? true : column.compareValue;
            footer = (<div className={'footerWrap'}> {dataItem[column.field] == compareValue ? column.title : dataItem[column.field]} </div>);
            break;
          }
          default:
        }
        return (<div key={'key_rgpa' + dataIndex + '_' + columnIndex}> {header}{body}{footer} </div>);
      });
      return <div key={'key_rgpa' + dataIndex} className={'panelItemWrap'}> {m} </div>;
    });

    return (
      <div className={this.props.panelKey}>
        <div className={'panelWrap'}>
          <BScroll context={context}>
            <div key={'radio-grid-panel-action'} className='panelInnerWrap'>
              {items}
            </div>
          </BScroll>
        </div>
        {this.props.showHistoryButton && hasItem &&
        <div className='historyButtonWrap'>
          <BButton
                            context={context}
                            type="flat"
                            text={this.props.historyButtonText}
                            colorType="primary"
                            disabled={this.props.historyButtonDisabled}
                            onClick={this.handleOnHistoryClicked}
                            style={{ minWidth: '70px' }} />
        </div>
                }
        <div className='actionButtonWrap'>
          {this.props.showAddButton &&
            <BButton
                            context={context}
                            type="flat"
                            text={this.props.addButtonText}
                            colorType="primary"
                            disabled={this.props.addButtonDisabled}
                            style={{ minWidth: '70px' }}
                            onClick={this.handleOnAddClicked} />
                    }
          {this.props.showDeleteButton && hasItem &&
            <BButton
                            context={context}
                            type="flat"
                            icon={<Delete />}
                            disabled={!(this.selectedIndex > -1)}
                            onClick={this.handleOnDeleteClicked}
                            style={{ minWidth: '40px' }} />
                    }
          {this.props.showEditButton && hasItem &&
            <BButton
                            context={context}
                            type="flat"
                            icon={<Create />}
                            disabled={!(this.selectedIndex > -1)}
                            onClick={this.handleOnEditClicked}
                            style={{ minWidth: '40px' }} />
                    }
        </div>
        <style>
          {`
                        .${this.props.panelKey} .headerWrap { font-size: 11px; margin-left: 40px; margin-bottom: 0px; color: ${boaPalette.pri500} }
                        .${this.props.panelKey} .footerWrap { font-size: 11px; margin-left: 40px; margin-bottom: 0px; color: ${boaPalette.base250} }
                        .${this.props.panelKey} .panelWrap {margin-bottom: ${hasItem ? 10: 0}px;}
                        .${this.props.panelKey} .panelItemWrap { margin-bottom: 16px; }
                        .${this.props.panelKey} .panelInnerWrap { max-height: ${this.state.displayItemsHeight} }
                        .${this.props.panelKey} .actionButtonWrap { float:right; }
                        .${this.props.panelKey} .historyButtonWrap { float:left; }
                        .${this.props.panelKey} .focusedFieldTitleWrap { font-size: 13px; line-height: 22px;margin-left: 10px; display: inline-block; color: ${boaPalette.sec500} }
                    `}
        </style>
      </div>
    );
  }
}

export default BDataListActionPanel;
