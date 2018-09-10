import * as React from 'react';
import PropTypes from 'prop-types';

export default class PanelAvailableComponentItem extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    e.stopPropagation();

    const {componentType, data, componentName} = this.props;

    this.props.onClick(componentType, data, componentName);
  }

  render() {
    const {componentName, selectedComponentName} = this.props;

    let titleComponentName = componentName;
    const titleMaxLength = 20;

    if (titleComponentName.length > titleMaxLength) {
      titleComponentName = `${titleComponentName.substr(0, titleMaxLength)}...`;
    }

    const colorStyle = {
      backgroundColor: selectedComponentName === componentName ? '#16a08630' : 'transparent',
      textDecoration: 'none',
      color: '#000',
      display: 'block',
      padding: '5px 15px'
    };


    var refname=componentName;
    return (
      <a
      ref={ (r) => { this.props.snaps[refname] = r; } }
        style={colorStyle}
        href="#"
        onClick={this.handleClick}
        >
        <span
          title={titleComponentName.length > titleMaxLength ? titleComponentName : null}
          >
          {titleComponentName}
        </span>
      </a>
    );
  }
}

PanelAvailableComponentItem.propTypes = {
  onClick: PropTypes.func.isRequired,
  componentName: PropTypes.any.isRequired,
  selectedComponentName: PropTypes.any,
  componentType: PropTypes.any.isRequired,
  data: PropTypes.any
};
