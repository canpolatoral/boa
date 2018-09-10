/* eslint-disable no-console */
import React from 'react';
import PropTypes from 'prop-types';
// import ReactDOM from 'react-dom';
import { BComponent, BComponentComposer } from 'b-component';
import { InputSearch } from './inputsearch';
import { CheckBoxList } from './checkboxlist';
import { BLabel } from 'b-label';
@BComponentComposer
export class BSelectListBox extends BComponent {

  static propTypes = {
    ...BComponent.propTypes,
    name: PropTypes.string,
    hintText: PropTypes.string,
    dataSource: PropTypes.array,
    disabled: PropTypes.bool,
    defaultChecked: PropTypes.bool,
    onChange: PropTypes.func,
    errorText: PropTypes.string,
  };

  static defaultProps = {
    ...BComponent.defaultProps,
    hintText: 'Ara',
    disabled: false,
    defaultChecked: false
  };

  _selectBoxCheckedList: any

  constructor(props, context) {

    super(props, context);
    this._selectBoxCheckedList = [];
    this._searchText = '';

    this.state = {
      dataSource: this.props.dataSource,
      dataSourceSearch: this.props.dataSource,
      disabled: this.props.disabled,
      defaultChecked: this.props.defaultChecked,
      checkedItemList: [],
      filterList: [],
      searchText: ''
    };

    // eğer herhangi bir çağrıda datasource undefined set edilmişse component patlamasın
    if (this.state.dataSource) {
      if (this.state.dataSource && this.state.dataSource.length > 0) {
        for (let i = 0; i < this.state.dataSource.length; i++) {
          this.state.dataSource[i].bComboboxIndex = i;
          this.state.dataSource[i].isChecked = false;
        }
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.dataSource !== this.props.dataSource) {
      this.setState({ dataSource: nextProps.dataSource });
      this.setState({ dataSourceSearch: nextProps.dataSource });
    }

    if (nextProps.disabled !== this.props.disabled) {
      this.setState({ disabled: nextProps.disabled });
    }
  }


  onCheck() {
    this._selectBoxCheckedList = this.lCheckBox.getInstance().getCheckedItemList();

    if (this.props.onChange) {
      this.props.onChange(this._selectBoxCheckedList);
    }
  }

  getCheckedBoxList() {
    return this._selectBoxCheckedList === undefined ? [] : this._selectBoxCheckedList;
  }

  resetSearchText() {
    this._searchText = '';
    this.setState({ searchText: this._searchText });
  }

  resetCheckBoxList() {
    this._selectBoxCheckedList = [];
    this.setState({ filterList: [] });
    this.setState({ dataSourceSearch: this.props.dataSource });
  }

  reset() {
    this.resetSearchText();
    this.resetCheckBoxList();
  }

  setCheckBoxList(list: any[]) {
    this._selectBoxCheckedList = list;
  }

  onChange() {
    this.state.filterList = this.inputSearch.getInstance().getFilteredList();
    const count = this.state.filterList.length;
    if (this._selectBoxCheckedList !== undefined && this._selectBoxCheckedList.length > 0) {
      for (var i = 0; i < count; i++) {
        if (this._selectBoxCheckedList.findIndex(u => u.id === this.state.filterList[i].id) != -1) {
          this.state.filterList[i].isChecked = true;
        }
      }
    }

    this.setState({ dataSourceSearch: this.state.filterList });

    if (this.props.onChange)
      this.props.onChange();
  }


  getSearchText() {
    return (this._searchText === undefined) ? '' : this._searchText;
  }

  render() {
    let errorStyle = {
      color: this.props.context.theme.boaPalette.error500,
      fontSize: 11,
      marginTop: 2,
      height: 16,
      textAlign: this.props.context.localization.isRightToLeft ? 'right' : 'left',
    };
    const dividerStyle = {
      display: 'table',
      width: '99%',
      height: '1px',
      borderTop: '1px solid',
      marginBottom:'24px',
      borderColor: this.props.context.theme.boaPalette.base250
    };

    return (
      <div>
        <div ref={r => this.divContent = r} >
          <InputSearch
            ref={r => this.inputSearch = r}
            context={this.props.context}
            name={this.props.name}
            dataSource={this.state.dataSource}
            hintText={this.props.hintText}
            disabled={this.state.disabled}
            onChange={this.onChange.bind(this)} />
        </div>
        <div style={dividerStyle}></div>
        <CheckBoxList
          ref={r => this.lCheckBox = r}
          context={this.props.context}
          dataSource={this.state.dataSourceSearch}
          disabled={this.state.disabled}
          defaultChecked={this.props.defaultChecked}
          onChange={this.onCheck.bind(this)} />
        <div>
          {
            this.props.errorText ? (
              <BLabel
                style={errorStyle}
                context={this.props.context}
                text={this.props.errorText}
              />
            ) : null
          }
        </div >
      </div >
    );
  }
}

export default BSelectListBox;
