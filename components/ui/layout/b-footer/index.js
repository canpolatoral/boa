import React from 'react'; import PropTypes from 'prop-types';

import { BComponent } from 'b-component';
import { BFlexPanel } from 'b-flex-panel';

export class BFooter extends BComponent {

  constructor(props, context) {
    super(props, context);
  }

  static propTypes = {
    menuItemList: PropTypes.array,
    textColor: PropTypes.string,
    textTitleColor: PropTypes.string,
    backgroundColor: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    menuItemList: [],
    textColor: '#6E6E6E',
    textTitleColor: '#BFBFBF',
    backgroundColor: 'transparent'
  };

  render() {
    let { style, backgroundColor, menuItemList } = this.props;
    var content = menuItemList.map((item, index) => {
      return (
        <ul key={index} style={this.getListStyle()}>
          <li style={this.getListTitleStyle()}>
            <label>{item.title}</label>
          </li>
          {this.getMenuItemListContent(item.itemList)}
        </ul>
      );
    });
    style = Object.assign({}, style, { backgroundColor: backgroundColor });
    return (
      <BFlexPanel alignment='spaceBetween' style={style}>
        {content}
      </BFlexPanel>
    );
  }

  getMenuItemListContent(menuItemlist) {
    return menuItemlist.map((item, index) => {
      return (
        <li key={index} style={this.getListItemStyle()}>
          <a href={item.link} style={this.getLinkStyle()}>{item.subTitle}</a>
        </li>
      );
    });
  }

  getLinkStyle() {
    const style = {
      textDecoration: 'none',
      textOverflow: 'ellipsis',
      color: this.props.textColor,
      overflow: 'hidden',
      userSelect: 'none',
      lineHeight: '16px',
    };
    return style;
  }

  getListTitleStyle() {
    return {
      color: this.props.textTitleColor,
      paddingBottom: 8
    };
  }

  getListItemStyle() {
    return {
      textDecoration: 'none',
      textOverflow: 'ellipsis',
      listStyleType: 'none',
      lineHeight: '16px',
      marginTop: 8,
      paddingBottom:3
    };
  }

  getListStyle() {
    return {
      listStyleType: 'none',
      paddingLeft: 0,
      minWidth: 200,
    };
  }
}

export default BFooter;
