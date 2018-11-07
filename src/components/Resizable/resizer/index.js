/* eslint-disable no-bitwise, jsx-a11y/click-events-have-key-events,
jsx-a11y/no-static-element-interactions */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Resizer from './resizer';
import isEqual from 'lodash/isEqual';

const clamp = (n, min, max) => Math.max(Math.min(n, max), min);
const snap = (n, size) => Math.round(n / size) * size;
const directions = [
  'top', 'right', 'bottom', 'left', 'topRight', 'bottomRight', 'bottomLeft', 'topLeft',
];

export default class Resizable extends Component {
  static propTypes = {
    children: PropTypes.any,
    customClass: PropTypes.string,
    customStyle: PropTypes.object,
    extendsProps: PropTypes.object,
    grid: PropTypes.arrayOf(PropTypes.number),
    handleClass: PropTypes.shape({
      bottom: PropTypes.string,
      bottomLeft: PropTypes.string,
      bottomRight: PropTypes.string,
      left: PropTypes.string,
      right: PropTypes.string,
      top: PropTypes.string,
      topLeft: PropTypes.string,
      topRight: PropTypes.string,
    }),
    handleStyle: PropTypes.shape({
      bottom: PropTypes.object,
      bottomLeft: PropTypes.object,
      bottomRight: PropTypes.object,
      left: PropTypes.object,
      right: PropTypes.object,
      top: PropTypes.object,
      topLeft: PropTypes.object,
      topRight: PropTypes.object,
    }),
    height: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    isResizable: PropTypes.shape({
      bottom: PropTypes.bool,
      bottomLeft: PropTypes.bool,
      bottomRight: PropTypes.bool,
      left: PropTypes.bool,
      right: PropTypes.bool,
      top: PropTypes.bool,
      topLeft: PropTypes.bool,
      topRight: PropTypes.bool,
    }),
    lockAspectRatio: PropTypes.bool.isRequired,
    maxHeight: PropTypes.number,
    maxWidth: PropTypes.number,
    minHeight: PropTypes.number,
    minWidth: PropTypes.number,
    onClick: PropTypes.func,
    onDoubleClick: PropTypes.func,
    onMouseDown: PropTypes.func,
    onResize: PropTypes.func,
    onResizeStart: PropTypes.func,
    onResizeStop: PropTypes.func,
    onTouchStart: PropTypes.func,
    width: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
  };

  static defaultProps = {
    onResizeStart: () => null,
    onResize: () => null,
    onResizeStop: () => null,
    isResizable: {
      top: true,
      right: true,
      bottom: true,
      left: true,
      topRight: true,
      bottomRight: true,
      bottomLeft: true,
      topLeft: true,
    },
    customStyle: {},
    handleStyle: {},
    handleClass: {},
    grid: [1, 1],
  }

  constructor(props, context) {
    super(props, context);
    const { width, height } = props;
    this.state = {
      isActive: false,
      width,
      height,
    };

    this.onResizeStartWithDirection = {};
    directions.forEach(d => {
      this.onResizeStartWithDirection[d] = this.onResizeStart.bind(this, d);
    });
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    if (typeof window !== 'undefined') {
      window.addEventListener('mouseup', this.onMouseUp);
      window.addEventListener('mousemove', this.onMouseMove);
      window.addEventListener('touchmove', this.onTouchMove);
      window.addEventListener('touchend', this.onMouseUp);
    }
  }

  componentDidMount() {
    const size = this.getBoxSize();
    this.setSize(size);
  }

  componentWillReceiveProps({ width, height }) {
    if (width !== this.props.width) this.setState({ width });
    if (height !== this.props.height) this.setState({ height });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(this.props, nextProps) || !isEqual(this.state, nextState);
  }

  componentWillUnmount() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('mouseup', this.onMouseUp);
      window.removeEventListener('mousemove', this.onMouseMove);
      window.removeEventListener('touchmove', this.onTouchMove);
      window.removeEventListener('touchend', this.onMouseUp);
    }
  }

  onTouchMove(event) {
    this.onMouseMove(event.touches[0]);
  }

  onMouseMove({ clientX, clientY }) {
    if (!this.state.isActive) return;
    const { direction, original, width, height } = this.state;
    const { minWidth, maxWidth, minHeight, maxHeight, lockAspectRatio } = this.props;
    const ratio = original.height / original.width;
    let newWidth = original.width;
    let newHeight = original.height;
    if (/right/i.test(direction)) {
      newWidth = original.width + clientX - original.x;
      const min = (minWidth < 0 || typeof minWidth === 'undefined') ? 0 : minWidth;
      const max = (maxWidth < 0 || typeof maxWidth === 'undefined') ? newWidth : maxWidth;
      newWidth = clamp(newWidth, min, max);
      newWidth = snap(newWidth, this.props.grid[0]);
    }
    if (/left/i.test(direction)) {
      newWidth = original.width - clientX + original.x;
      const min = (minWidth < 0 || typeof minWidth === 'undefined') ? 0 : minWidth;
      const max = (maxWidth < 0 || typeof maxWidth === 'undefined') ? newWidth : maxWidth;
      newWidth = clamp(newWidth, min, max);
      newWidth = snap(newWidth, this.props.grid[0]);
    }
    if (/bottom/i.test(direction)) {
      newHeight = original.height + clientY - original.y;
      const min = (minHeight < 0 || typeof minHeight === 'undefined') ? 0 : minHeight;
      const max = (maxHeight < 0 || typeof maxHeight === 'undefined') ? newHeight : maxHeight;
      newHeight = clamp(newHeight, min, max);
      newHeight = snap(newHeight, this.props.grid[1]);
    }
    if (/top/i.test(direction)) {
      newHeight = original.height - clientY + original.y;
      const min = (minHeight < 0 || typeof minHeight === 'undefined') ? 0 : minHeight;
      const max = (maxHeight < 0 || typeof maxHeight === 'undefined') ? newHeight : maxHeight;
      newHeight = clamp(newHeight, min, max);
      newHeight = snap(newHeight, this.props.grid[1]);
    }
    if (lockAspectRatio) {
      const deltaWidth = Math.abs(newWidth - original.width);
      const deltaHeight = Math.abs(newHeight - original.height);
      if (deltaWidth < deltaHeight) {
        newWidth = newHeight / ratio;
      } else {
        newHeight = newWidth * ratio;
      }
    }
    this.setState({
      width: width !== 'auto' ? newWidth : 'auto',
      height: height !== 'auto' ? newHeight : 'auto',
    });
    const resizable = this.resizable;
    const styleSize = {
      width: newWidth || this.state.width,
      height: newHeight || this.state.height,
    };
    const clientSize = {
      width: resizable.clientWidth,
      height: resizable.clientHeight,
    };
    const delta = {
      width: newWidth - original.width,
      height: newHeight - original.height,
    };
    this.props.onResize(direction, styleSize, clientSize, delta);
  }

  onMouseUp() {
    const { isActive, direction, original } = this.state;
    if (!isActive) return;
    const resizable = this.resizable;
    const styleSize = this.getBoxSize();
    const clientSize = {
      width: resizable.clientWidth,
      height: resizable.clientHeight,
    };
    const delta = {
      width: styleSize.width - original.width,
      height: styleSize.height - original.height,
    };
    this.props.onResizeStop(direction, styleSize, clientSize, delta);
    this.setState({ isActive: false });
  }

  onResizeStart(direction, e) {
    const ev = e.touches ? e.touches[0] : e;
    const clientSize = {
      width: this.resizable.clientWidth,
      height: this.resizable.clientHeight,
    };
    this.props.onResizeStart(direction, this.getBoxSize(), clientSize, e);
    const size = this.getBoxSize();
    this.setState({
      original: {
        x: ev.clientX,
        y: ev.clientY,
        width: size.width,
        height: size.height,
      },
      isActive: true,
      direction,
    });
  }

  getBoxSize() {
    let width = '0';
    let height = '0';
    if (typeof window !== 'undefined') {
      const style = window.getComputedStyle(this.resizable, null);
      width = ~~style.getPropertyValue('width').replace('px', '');
      height = ~~style.getPropertyValue('height').replace('px', '');
    }
    return { width, height };
  }

  setSize(size) {
    const { width, height } = this.state;
    this.setState({
      width: width || size.width,
      height: height || size.height,
    });
  }

  getBoxStyle() {
    const getSize = key => {
      if (typeof this.state[key] === 'undefined' || this.state[key] === 'auto') return 'auto';
      if (/px$/.test(this.state[key].toString())) return this.state[key];
      if (/%$/.test(this.state[key].toString())) return this.state[key];
      return `${this.state[key]}px`;
    };
    return {
      width: getSize('width'),
      height: getSize('height'),
    };
  }

  updateSize({ width, height }) {
    this.setState({ width, height });
  }

  renderResizer() {
    const { isResizable, handleStyle, handleClass } = this.props;
    return Object.keys(isResizable).map(dir => {
      if (isResizable[dir] !== false) {
        return (
          <Resizer
            key={dir}
            type={dir}
            onResizeStart={this.onResizeStartWithDirection[dir]}
            replaceStyles={handleStyle[dir]}
            className={handleClass[dir]}
          />
        );
      }
      return null;
    });
  }

  render() {
    const userSelect = this.state.isActive
      ? {
        userSelect: 'none',
        MozUserSelect: 'none',
        WebkitUserSelect: 'none',
        MsUserSelect: 'none',
      }
      : {
        userSelect: 'auto',
        MozUserSelect: 'auto',
        WebkitUserSelect: 'auto',
        MsUserSelect: 'auto',
      };
    const style = this.getBoxStyle();
    const { onClick, customStyle, customClass,
      onMouseDown, onDoubleClick, onTouchStart } = this.props;
    return (
      <div
        ref={r => this.resizable = r}
        style={{
          position: 'relative',
          ...userSelect,
          ...customStyle,
          ...style,
        }}
        className={customClass}
        onClick={onClick}
        onMouseDown={onMouseDown}
        onDoubleClick={onDoubleClick}
        onTouchStart={onTouchStart}
        {...this.props.extendsProps}
      >
        {this.props.children}
        {this.renderResizer()}
      </div>
    );
  }
}
