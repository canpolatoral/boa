/* eslint-disable no-console */
import React from 'react';
import PropTypes from 'prop-types';
import { BComponent, BComponentComposer } from 'b-component';
import { BCheckBox } from 'b-check-box';
import {List, ListItem } from '@material-ui/core';
import { BScroll } from 'b-scroll';

@BComponentComposer
export class CheckBoxList extends BComponent {

  static propTypes = {
    ...BComponent.propTypes,
    dataSource: PropTypes.array,
    disabled : PropTypes.bool,
    defaultChecked: PropTypes.bool,
    onChange: PropTypes.func
  }
 
  constructor(props, context)
  {
    super(props, context);
    this.onChange = this.onChange.bind(this);
    this.state = {
      dataSource: this.props.dataSource,
      disable: this.props.disable != undefined ? this.props.disable : false,
      defaultChecked: this.props.defaultChecked != undefined ? this.props.defaultChecked : false,
      dataCheckedList: []
    };
  }
  
  componentWillReceiveProps(nextProps) {
    if (nextProps.dataSource !== this.props.dataSource || 
        nextProps.disabled !== this.props.disabled ||
        nextProps.defaultChecked !== this.props.defaultChecked) {
      this.setState({ 
        dataSource: nextProps.dataSource, 
        disabled: nextProps.disabled, 
        defaultChecked: nextProps.defaultChecked  
      });

      this.state.dataCheckedList = nextProps.dataSource.filter(c=>c.isChecked);

    } 
  }

  getCheckedItemList()
  {
    return this.state.dataCheckedList;
  }

  onChange(event, isChecked, value) {
  
    if (this.props.dataSource.find((e) => e.id == value) !== undefined)
    {
      var tempList= [];
      if (isChecked)
      {
        tempList = this.state.dataCheckedList.concat(this.props.dataSource.find(e => e.id == value));
        this.state.dataCheckedList = tempList;
      }
      else
      {
        let index = this.state.dataCheckedList.findIndex((e) => e.id == value);
        if (index !== undefined)
        {
          this.state.dataCheckedList.splice(index, 1); 
        }
      }
    }

    if (this.props.onChange)
      this.props.onChange();
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
            label={item.label}
            defaultChecked={defaultChecked}
            checked={item.isChecked}
            onChange={this.onChange}
            value={item.id.toString()}
            disabled={disabled} />
        </ListItem>
      );
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

export default CheckBoxList;
