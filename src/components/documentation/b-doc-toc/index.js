import React from 'react'; 
import PropTypes from 'prop-types';
import { BComponent } from 'b-component';

const headerId = 'top_of_page';

export class BDocToc extends BComponent {

  static propTypes = {
    content: PropTypes.array.isRequired,
    header: PropTypes.string,
    activeItem: PropTypes.string,
    linkOnClick: PropTypes.func,
    style: PropTypes.object
  };

  static defaultProps = {
    header: 'Contents'
  };

  state = {
    activeItem: this.props.activeItem
  };

  constructor(props, context) {
    super(props, context);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.activeItem) {
      this.setState({ activeItem: nextProps.activeItem });
    }
  }

  render() {
    const mainStyle = Object.assign({
      borderLeftColor: this.props.context.theme.boaPalette.pri500,
      borderLeftWidth: 3,
      borderLeftStyle: 'solid'
    }, this.props.style);
    this.minLevel = this.getMinLevel(this.props.content);
    const content = this.populateContent(this.props.content);

    return (
      <div style={mainStyle}>
        {content}
      </div>
    );
  }

  getMinLevel(content: Array<any>) {
    var level = 0;
    if (content.length > 0)
      level = content[0].level;
    content.forEach((item) => {
      if (item.level < level) level = item.level;
    });
    return level;
  }

  onClick(id) {
    if (this.state.activeItem != id) {
      this.setState({ activeItem: id });
    }
    this.props.linkOnClick && this.props.linkOnClick(id);
  }

  getLinkStyle(content, isHeader) {
    const style = {
      textDecoration: 'none',
      textOverflow: 'ellipsis',
      color: this.props.context.theme.palette.textColor,
      overflow: 'hidden',
      userSelect: 'none',
      lineHeight: '16px',
      fontSize: '13px',
      cursor: 'pointer'
    };
    if (isHeader === true)
      style.fontWeight = 'bold';
    if (content === this.state.activeItem)
      style.color = this.props.context.theme.boaPalette.pri500;
    return style;
  }

  getListItemStyle(level, index) {
    return {
      textDecoration: 'none',
      textOverflow: 'ellipsis',
      listStyleType: 'none',
      lineHeight: '16px',
      marginTop: index === -1 ? 0 : 8,
      marginLeft: level ? (level - this.minLevel) * 12 : undefined
    };
  }

  getListStyle() {
    return {
      listStyleType: 'none',
      paddingLeft: 12,
      marginTop: 0,
      marginBottom: 1
    };
  }

  populateContent(children, level = 0) {
    const items = children.map((child, index) => {
      return (
        <li key={index} style={this.getListItemStyle(child.level, index)}>
          {child && <label style={this.getLinkStyle(child.id)} onClick={this.onClick.bind(this, child.id)}>{child.content}</label>}
          {child.children ? this.populateContent(child.children, level + 1) : null}
        </li>);
    }
    );
    return (
      <ul style={this.getListStyle()}>
        {level === 0 ? (
          <li style={this.getListItemStyle(0, -1)}>
            <label style={this.getLinkStyle(headerId, true)} onClick={this.onClick.bind(this, headerId)}>{this.props.header}</label>
          </li>) : null}
        {items}
      </ul>);
  }
}

export default BDocToc;
