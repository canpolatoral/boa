import React from 'react';
import PropTypes from 'prop-types';
import { DragSource, DropTarget } from 'react-dnd';
import { BComponentComposer, BComponent } from 'b-component';

export function composeDragSource(Component) {
  const dragSource = {
    beginDrag(props) {
      if (props.beginDrag) {
        props.beginDrag();
      }
      return { ...props };
    },
    endDrag(props) {
      if (props.endDrag) {
        props.endDrag();
      }
    }
  };

  @DragSource(ItemTypes.COMPONENT, dragSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }))
  class DraggableComponent extends Component {
    static propTypes = {
      connectDragSource: PropTypes.func.isRequired,
      isDragging: PropTypes.bool.isRequired
    };

    constructor(props, context) {
      super(props, context);
      this.onClick = this.onClick.bind(this);
      this.setSelected = this.setSelected.bind(this);
    }

    onClick(item) {
      if (this.props.onClick) {
        this.props.onClick(item);
      }
    }

    setSelected() {
      this.setState({
        style: {
          border: '3px dotted #B618CE',
          margin: '-3px -10px',
          paddingLeft: '7px',
          paddingRight: '7px',
          overflow: 'hidden'
        }
      });
    }

    clearSelected() {
      this.setState({ style: {} });
    }

    render() {
      const { connectDragSource, isDragging } = this.props;
      const opacity = isDragging ? 0.4 : 1;
      const renderContent = super.render();
      const style = this.state && this.state.style ? this.state.style : {};
      return connectDragSource(
        <div onClick={() => this.onClick(this)} style={{ cursor: 'move', opacity, ...style }}>
          <div style={{ pointerEvents: 'none' }}>{renderContent}</div>
        </div>
      );
    }
  }
  return DraggableComponent;
}

export function composeDropSource(Component) {
  const dropTarget = {
    drop(props, monitor) {
      if (props.onDrop) {
        props.onDrop(monitor.getItem(), props.afterKey);
      }
    },
    canDrop(props, monitor) {
      if (props.canDrop) {
        return props.canDrop(props, monitor);
      } else {
        return true;
      }
    }
  };

  @DropTarget([ItemTypes.COMPONENT, ItemTypes.CARD], dropTarget, (connect, monitor) => {
    return {
      connectDropTarget: connect.dropTarget(),
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    };
  })
  class DropableComponent extends Component {
    static propTypes = {
      connectDropTarget: PropTypes.func.isRequired,
      isOver: PropTypes.bool.isRequired,
      canDrop: PropTypes.bool.isRequired
    };

    constructor(props, context) {
      super(props, context);
    }
    render() {
      const { connectDropTarget, isOver, canDrop, hoverColor } = this.props;
      let background = isOver && canDrop ? hoverColor : canDrop ? 'lemonchiffon' : 'transparent';
      var renderContent = super.render();
      return connectDropTarget(<div style={{ background }}>{renderContent}</div>);
    }
  }

  return DropableComponent;
}

export var ItemTypes = {
  COMPONENT: 'component',
  CARD: 'card'
};

@BComponentComposer
export class BDragDrop extends BComponent {
  composeDragSource = composeDragSource;
  composeDropSource = composeDragSource;
  ItemTypes = ItemTypes;
}

export default BDragDrop;
