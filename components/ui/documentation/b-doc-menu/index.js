import React from 'react';
import PropTypes from 'prop-types';
import { BComponent } from 'b-component';

export class BDocMenu extends BComponent {

  constructor(props, context) {
    super(props, context);
  }

  static propTypes = {
    title: PropTypes.string,
    selectedSubTitle: PropTypes.string,
    selectedTitle: PropTypes.string,
    fixedTitle: PropTypes.string,
    fixedItemList: PropTypes.array,
    menuItemList: PropTypes.array,
    style: PropTypes.object
  };

  state = {
    selectedSubTitle: this.props.selectedSubTitle,
    selectedTitle: this.props.selectedTitle
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedSubTitle) {
      this.setState({ selectedSubTitle: nextProps.selectedSubTitle });
    }
  }

  render() {
    const { fixedTitle, fixedItemList, title, menuItemList } = this.props;

    var fixedContent;
    if (fixedItemList) {
      fixedContent = (
        <div>
          <ul style={this.getListStyle()}>
            <li>
              <b style={this.getTitleStyle(false)}>{fixedTitle}</b>
            </li>
            {this.getMenuItemListContent(fixedItemList)}
          </ul>
        </div>);
    }

    var content;
    if (menuItemList.length == 1) { /* Combo değilse */
      var menuItem = menuItemList[0];
      content =
        <div>
          <ul style={this.getListStyle()}>
            <li>
              <b style={this.getTitleStyle(false)}>{title || menuItem.title}</b>
            </li>
            {this.getMenuItemListContent(menuItem.itemList)}
          </ul>
        </div>;
    }
    else if (menuItemList.length > 1) {
      if (!this.state.selectedTitle || this.state.selectedTitle.length == 0) {
        this.state.selectedTitle = menuItemList[0].title;
      }
      menuItem = menuItemList.find(x => x.title == this.state.selectedTitle);
      content =
        <div>
          <div style={{ marginTop: 10, marginBottom: 10 }}>
            <b style={this.getTitleStyle(false)}>{title}</b>
          </div>
          {menuItemList.map((item, index) => {
            return (
              <div key={index}>
                <b style={this.getTitleStyle(true)}>{item.title}</b>
                {item.itemList ?
                  <ul key={index} style={this.getListStyle(true)}>
                    {this.getMenuItemListContent(item.itemList)}
                  </ul> : null}
              </div>);
          })}
        </div>;
    }
    var style = {
      paddingLeft: 30,
      paddingRight: 10
    };
    style = Object.assign(style, this.props.style);

    return (
      <div style={style}>
        {fixedContent}
        {content}
      </div>
    );
  }

  selectMenuItem(index, selectedItems, selectedValues) {
    if (selectedValues && selectedValues.length > 0 && this.state.selectedTitle != selectedValues[0]) {
      this.setState({ selectedTitle: selectedValues[0], selectedSubTitle: '' });
    }
  }

  getMenuItemListContent(menuItemlist) {
    return menuItemlist.map((item, index) => {
      return (
        <li key={index} style={this.getListItemStyle()}>
          <a href={item.link} style={this.getLinkStyle(item.subTitle)} onClick={this.onClick.bind(this, item.subTitle)}>{item.subTitle}</a>
        </li>
      );
    });
  }

  onClick(subTitle) {
    if (this.state.selectedSubTitle != subTitle) {
      this.setState({ selectedSubTitle: subTitle });
    }
  }

  getLinkStyle(subtitle) {
    const style = {
      textDecoration: 'none',
      textOverflow: 'ellipsis',
      color: this.props.context.theme.palette.textColor,
      overflow: 'hidden',
      userSelect: 'none',
      lineHeight: '16px',
      fontSize: 13
    };
    if (subtitle === this.state.selectedSubTitle) {
      style.color = this.props.context.theme.boaPalette.pri500;
      style.fontWeight = 'bold';
    }
    return style;
  }

  getListItemStyle() {
    return {
      textDecoration: 'none',
      textOverflow: 'ellipsis',
      listStyleType: 'none',
      lineHeight: '16px',
      marginTop: 13
    };
  }

  getListStyle(inner) {
    return {
      listStyleType: 'none',
      paddingLeft: inner ? 12 : 0
    };
  }

  getTitleStyle(isSubTitle) {
    return { color: '#A1A1A1', fontSize: isSubTitle ? 13 : 15, fontWeight: isSubTitle ? 500 : 'bold' };
  }
}

export default BDocMenu;
