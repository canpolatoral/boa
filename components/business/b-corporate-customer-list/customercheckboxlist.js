/* eslint-disable no-console */
import React from 'react';
import PropTypes from 'prop-types';
import { BComponent, BComponentComposer } from 'b-component';
import { BCheckBox } from 'b-check-box';
import {List, ListItem } from '@material-ui/core';
import { BScroll } from 'b-scroll';
import cloneDeep from 'lodash/cloneDeep';

@BComponentComposer
export class CustomerCheckBoxList extends BComponent {

  static propTypes = {
    ...BComponent.propTypes,
    dataSource: PropTypes.array,
    disabled : PropTypes.bool,
    defaultChecked: PropTypes.bool,
    onChecked: PropTypes.func,
    isFiltered: PropTypes.bool
  }
 
  constructor(props, context)
  {
    super(props, context);
    this.onChecked = this.onChecked.bind(this);
    this.state = {
      dataSource: this.props.dataSource,
      isFiltered: this.props.isFiltered,
      disable: this.props.disable != undefined ? this.props.disable : false,
      defaultChecked: this.props.defaultChecked != undefined ? this.props.defaultChecked : false,
      dataCheckedList: []
    };
  }
  
  componentWillReceiveProps(nextProps) {
    if (nextProps.dataSource !== this.props.dataSource || 
        nextProps.disabled !== this.props.disabled ||
        nextProps.isFiltered !== this.props.isFiltered ||
        nextProps.defaultChecked !== this.props.defaultChecked) {
      this.setState({ 
        dataSource: nextProps.dataSource, 
        disabled: nextProps.disabled, 
        isFiltered: nextProps.isFiltered,
        defaultChecked: nextProps.defaultChecked  
      });

      if (nextProps.dataSource != undefined && nextProps.dataSource != null) {
        this.state.dataCheckedList = nextProps.dataSource.filter(c => c.isChecked);
      }
    } 
  }

  getCheckedItemList() {
    return this.state.dataCheckedList;
  }

  onChecked(event, isChecked, value) {
    var userId = Number.parseInt(value);
    let tmpDataSource = cloneDeep(this.state.dataSource);
    if (tmpDataSource.find((e) => e.userId == userId) !== undefined)
    {
      var tempList= [];
      tmpDataSource.find(e => e.userId == userId).isChecked = isChecked;
      if (isChecked)
      {
        tempList = this.state.dataCheckedList.concat(tmpDataSource.find(e => e.userId == userId));
        this.state.dataCheckedList = tempList;
      }
      else
      {
        let index = this.state.dataCheckedList.findIndex((e) => e.userId == userId);
        if (index !== undefined && index != -1)
        {
          this.state.dataCheckedList.splice(index, 1); 
        }
      }
      this.setState({dataSource: tmpDataSource});
    }

    if (this.props.onChecked)
      this.props.onChecked();
  }
  
  getItems() {
    const { disabled, defaultChecked, context } = this.props;
    if (this.state.dataSource && this.state.dataSource.length > 0) {
      return this.state.dataSource.map((item, key) =>
        <ListItem key={key.toString()} style={{margin:'0px', padding:'0px'}}>
          <BCheckBox
            ref={r => this.roleCheckBox = r}
            context={context}
            errorTextVisible={false}    
            iconStyle={{ marginRight: '0' }}
            label={item.name}
            defaultChecked={defaultChecked}
            checked={item.isChecked}
            onChange={this.onChecked}
            value={item.userId.toString()}
            disabled={disabled} />
        </ListItem>
      );
    } else if (this.state.isFiltered) {
      return (<div style={{margin: '10px', color:'#999'}}>Müşteri numarasına ait çalışan bulunamadı.</div>);
    }
  }

  render()
  {
    return (
      <div style={{ maxHeight:'250px', display:'block', overflow:'auto', paddingRight:'5px', position:'relative'}}>
        <BScroll context={this.props.context} option={{ suppressScrollX: true }}>
          <List key="1" style={{width:'100%'}}>
            {this.getItems()} 
          </List>   
        </BScroll>
      </div>

    );
  }
}

export default CustomerCheckBoxList;
