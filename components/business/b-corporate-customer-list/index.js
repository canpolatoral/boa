/* eslint-disable no-console */
import React from 'react';
import PropTypes from 'prop-types';
import { BComponent, BComponentComposer } from 'b-component';
import { CustomerInputSearch } from './customerinputsearch';
import { CustomerCheckBoxList } from './customercheckboxlist';
import { BLabel } from 'b-label';
import { getProxy } from 'b-proxy';
import cloneDeep from 'lodash/cloneDeep';
import { BLocalization } from 'b-localization';

@BComponentComposer
export class BCorporateCustomerList extends BComponent {

  static propTypes = {
    ...BComponent.propTypes,
    name: PropTypes.string,
    hintText: PropTypes.string,
    disabled: PropTypes.bool,
    defaultChecked: PropTypes.bool,
    onChecked: PropTypes.func,
    onCustomerKeyPress: PropTypes.func,
    errorText: PropTypes.string
  };

  static defaultProps = {
    ...BComponent.defaultProps,
    hintText: 'Müşteri Numarası',
    disabled: false,
    defaultChecked: false
  };

  _selectBoxCheckedList: any[] = [];
  tmpDataSource: any[] = [];
  
  constructor(props, context) {

    super(props, context);
    this.state = {
      disabled: this.props.disabled,
      defaultChecked: this.props.defaultChecked,
      isFiltered: this.props.isFiltered
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.disabled !== this.props.disabled) {
      this.setState({ disabled: nextProps.disabled });
    }
  }

  onChecked() {
    this._selectBoxCheckedList = this.lCheckBox.getInstance().getCheckedItemList();
   
    if (this.props.onChecked) {
      this.props.onChecked();
    }
  }

  getCheckedBoxList() {
    return this._selectBoxCheckedList === undefined ? [] : this._selectBoxCheckedList;
  }

  resetCustomer() {
    this.customerInputSearch.getInstance().resetValue();
  }

  resetCheckBoxList() {
    this._selectBoxCheckedList = [];
    this.setState({ dataSource: [] });
  }

  reset() {
    this.resetCustomer();
    this.resetCheckBoxList();
  }

  setCheckBoxList( list: any[] ) {

    if (this.state.dataSource != undefined) {

      let tmpDataSource = cloneDeep(this.state.dataSource);
      if (list == null) list = [];
      tmpDataSource.forEach(u => {
        u.isChecked = ((list.find(x => x.userId == u.userId)) != undefined && (list.find(x => x.userId == u.userId)) != null) ?true: false;
      });
      this.setState({dataSource: tmpDataSource, isFiltered: false});
    }
  }

  _serviceCallInternal(requestClass, requestBody) {
    if (getProxy()) {
      return getProxy().call(requestClass, requestBody);
    }
    else {
      throw 'b-framework proxy instance not set';
    }
  }

 
  onKeyPress(customerId) {

    if (typeof customerId === 'number' && customerId >= 0) {
      
      let requestClass = 'BOA.Types.One.WebUserRequest';
      var request = {
        MethodName: 'GetCorporateCustomerListByCustomerId',
        ResourceId: 0,
        WebCustomerId: customerId,
        ResourceCode: 'YONTBOAONE'
      };
  
      let promise = this._serviceCallInternal(requestClass, request);
      promise.then((result) => {
        if (result.success) {
          if (result.value == null) {
            result.value = [];
          } else {
            var list: any[] = result.value;
          
            list.forEach((u) => {
              var name = BLocalization.stringLowerCase(u.name);
              var lName = name.split(' ');
              let count = lName.length;
              for (var i:number = 0; i< count; i++) {
                lName[i] = this.Capitalize(lName[i]);
              }
              name = lName.join(' ');
              u.name = name;
              u.customerId = customerId;
              u.isChecked = false;
            });
          } 

          this.tmpDataSource = cloneDeep(list);
          
          this.setState({dataSource: list, isFiltered: (list.length == 0) });

          if (this.props.onCustomerKeyPress && list.length > 0) {
            this.props.onCustomerKeyPress();
          }
          
        } 
      }, () => {
        this.tmpDataSource = [];
        this.setState({dataSource: [], isFiltered: true});
      });
    } else {
      this.setState({isFiltered: false});
    }

   
  }

  Capitalize(str) {
    return BLocalization.stringUpperCase(str.charAt(0)) + str.slice(1);
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
          <CustomerInputSearch
            ref={r => this.customerInputSearch = r}
            context={this.props.context}
            name={this.props.name}
            hintText={this.props.hintText}
            disabled={this.state.disabled}
            onKeyPress={this.onKeyPress.bind(this)} />
        </div>
        <div style={dividerStyle}></div>
        <CustomerCheckBoxList
          ref={r => this.lCheckBox = r}
          context={this.props.context}
          dataSource={this.state.dataSource}
          disabled={this.state.disabled}
          isFiltered={this.state.isFiltered}
          defaultChecked={this.props.defaultChecked}
          onChecked={this.onChecked.bind(this)} />
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

export default BCorporateCustomerList;
