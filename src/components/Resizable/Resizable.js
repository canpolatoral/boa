import React from 'react';
import Draggable from 'react-draggable';
import { ComponentBase, ComponentComposer } from '@boa/base';
import InnerResizable from './resizer';

const boxStyle = {
  width: '100%',
  height: '100%',
  display: 'inline-block',
};

const contentStyle = {
  width: '100%',
  height: '100%',
  display: 'inline-block',
  overflow: 'auto',
};

@ComponentComposer
class Resizable extends ComponentBase {
  constructor(props, context) {
    super(props, context);
    this.state = {
      disableDragging: false,
      z: props.z,
      original: {
        x: props.default.x || 0,
        y: props.default.y || 0,
      },
      bounds: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
      maxWidth: props.maxWidth,
      maxHeight: props.maxHeight,
      enable: props.enable,
    };
    this.onResizeStart = this.onResizeStart.bind(this);
    this.onResize = this.onResize.bind(this);
    this.onResizeStop = this.onResizeStop.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.onDrag = this.onDrag.bind(this);
    this.onDragStop = this.onDragStop.bind(this);
  }

  onDragStart(e, data) {
    if (this.props.onDragStart) {
      this.props.onDragStart(e, data);
    }
    if (!this.props.bounds) return;
    const parent = this.wrapper && this.wrapper.parentNode;
    const target =
      this.props.bounds === 'parent' ? parent : document.querySelector(this.props.bounds);
    if (!(target instanceof HTMLElement) || !(parent instanceof HTMLElement)) return;
    const targetRect = target.getBoundingClientRect();
    const targetLeft = targetRect.left;
    const targetTop = targetRect.top;
    const parentRect = parent.getBoundingClientRect();
    const parentLeft = parentRect.left;
    const parentTop = parentRect.top;
    const left = targetLeft - parentLeft;
    const top = targetTop - parentTop;
    if (this.resizable && this.resizable.size) {
      this.setState({
        bounds: {
          top,
          right: left + (target.offsetWidth - this.resizable.size.width),
          bottom: top + (target.offsetHeight - this.resizable.size.height),
          left,
        },
      });
    }
  }

  onDrag(e, data) {
    if (this.props.onDrag) {
      this.props.onDrag(e, data);
    }
  }

  onDragStop(e, data) {
    if (this.props.onDragStop) {
      this.props.onDragStop(e, data);
    }
  }

  onResizeStart(e, dir, refToResizableElement) {
    this.setState({
      disableDragging: true,
      original: { x: this.draggable.state.x, y: this.draggable.state.y },
    });
    if (this.props.bounds) {
      const parent = this.wrapper && this.wrapper.parentNode;
      const target =
        this.props.bounds === 'parent' ? parent : document.querySelector(this.props.bounds);
      const self = this;
      if (target instanceof HTMLElement && parent instanceof HTMLElement) {
        const selfRect = self.wrapper.getBoundingClientRect();
        const selfLeft = selfRect.left;
        const selfTop = selfRect.top;
        const targetRect = target.getBoundingClientRect();
        const targetLeft = targetRect.left;
        const targetTop = targetRect.top;
        if (/left/i.test(dir)) {
          const max = selfLeft - targetLeft + this.resizable.size.width;
          this.setState({ maxWidth: max > this.props.maxWidth ? this.props.maxWidth : max });
        }
        if (/right/i.test(dir)) {
          const max = target.offsetWidth + (targetLeft - selfLeft);
          this.setState({ maxWidth: max > this.props.maxWidth ? this.props.maxWidth : max });
        }
        if (/top/i.test(dir)) {
          const max = selfTop - targetTop + this.resizable.size.height;
          this.setState({ maxHeight: max > this.props.maxHeight ? this.props.maxHeight : max });
        }
        if (/bottom/i.test(dir)) {
          const max = target.offsetHeight + (targetTop - selfTop);
          this.setState({ maxHeight: max > this.props.maxHeight ? this.props.maxHeight : max });
        }
      }
    } else {
      this.setState({ maxWidth: this.props.maxWidth, maxHeight: this.props.maxHeight });
    }
    if (this.props.onResizeStart) {
      this.props.onResizeStart(e, dir, refToResizableElement);
    }
  }

  onResize(e, direction, refToResizableElement, delta) {
    let parentLeft = 0;
    let selfLeft = 0;
    let parentTop = 0;
    let selfTop = 0;
    if (this.props.bounds) {
      const parent = this.wrapper && this.wrapper.parentNode;
      const target =
        this.props.bounds === 'parent' ? parent : document.querySelector(this.props.bounds);
      const self = this;
      if (target instanceof HTMLElement && parent instanceof HTMLElement) {
        const selfRect = self.wrapper.getBoundingClientRect();
        const parentRect = parent.getBoundingClientRect();
        selfLeft = selfRect.left;
        selfTop = selfRect.top;
        parentLeft = parentRect.left;
        parentTop = parentRect.top;
      }
    }
    if (/left/i.test(direction)) {
      const x =
        selfLeft >= parentLeft ? this.state.original.x - delta.width : parentLeft - selfLeft;
      this.draggable.setState({ x });
    }
    if (/top/i.test(direction)) {
      const y = selfTop >= parentTop ? this.state.original.y - delta.height : parentTop - selfTop;
      this.draggable.setState({ y });
    }
    if (this.props.onResize) {
      this.props.onResize(e, direction, refToResizableElement, delta, {
        x: this.draggable.state.x,
        y: this.draggable.state.y,
      });
    }
  }

  onResizeStop(e, direction, refToResizableElement, delta) {
    this.setState({ disableDragging: false });
    if (this.props.onResizeStop) {
      this.props.onResizeStop(e, direction, refToResizableElement, delta, {
        x: this.draggable.state.x,
        y: this.draggable.state.y,
      });
    }
  }

  updateSize(size) {
    const defaultSizes = this.props.default;
    this.resizable.updateSize({
      width: size.width || defaultSizes.width,
      height: size.height || defaultSizes.height,
    });
  }

  updatePosition(position) {
    this.draggable.setState(position);
  }

  updateZIndex(z) {
    this.setState({ z });
  }

  setEnabled(enable) {
    this.setState({ enable });
  }

  render() {
    return (
      <Draggable
        ref={c => {
          this.draggable = c;
        }}
        handle={this.props.dragHandlerClassName}
        defaultPosition={{ x: this.props.default.x, y: this.props.default.y }}
        onStart={this.onDragStart}
        onDrag={this.onDrag}
        onStop={this.onDragStop}
        enableUserSelectHack={false}
        axis={this.props.dragAxis}
        grid={this.props.dragGrid}
        bounds={this.props.bounds ? this.state.bounds : undefined}
      >
        <div
          className={this.props.className}
          style={{ ...boxStyle, zIndex: this.state.z }}
          ref={c => {
            this.wrapper = c;
          }}
        >
          <InnerResizable
            ref={c => {
              this.resizable = c;
            }}
            onResizeStart={this.onResizeStart}
            onResizing={this.props.onResizing}
            onResize={this.onResize}
            onResizeStop={this.onResizeStop}
            style={this.props.style}
            width={this.props.default.width}
            height={this.props.default.height}
            minWidth={this.props.minWidth}
            minHeight={this.props.minHeight}
            maxWidth={this.state.maxWidth}
            maxHeight={this.state.maxHeight}
            grid={this.props.resizeGrid}
            lockAspectRatio={this.props.lockAspectRatio}
            enable={this.state.enable}
            isResizable={this.props.isResizable}
          >
            <div className="b-resizable-content" style={{ ...contentStyle }}>
              {this.props.children}
            </div>
          </InnerResizable>
        </div>
      </Draggable>
    );
  }
}

export default Resizable;
