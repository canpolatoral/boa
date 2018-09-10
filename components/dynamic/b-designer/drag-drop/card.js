import React from 'react'; import PropTypes from 'prop-types';
import { DragSource, DropTarget } from 'react-dnd';

import { BCard } from 'b-card';
import { ItemTypes } from 'b-drag-drop';

const cardTarget = {
  drop(props, monitor) {
    if (monitor.didDrop())
      return;
    if (props.className === 'BCard' && monitor.getItem().className === 'BCard') {
      props.onDropCartToCard(props.itemKey, monitor.getItem().itemKey);
    } else {
      props.onDropComponentToCard(props.itemKey, monitor.getItem());
    }
  },
  canDrop(props, monitor) {
    if (props.itemKey === monitor.getItem().itemKey)
      return false;
    if (props.itemKey === monitor.getItem().owner)
      return false;
    return true;
  }
};

const cardSource = {
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

@DropTarget([ItemTypes.CARD, ItemTypes.COMPONENT], cardTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))
@DragSource(ItemTypes.CARD, cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
class DropableCard extends BCard {

  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired
  }

  constructor(props, context) {
    super(props, context);
  }

  render() {
    const { connectDropTarget, connectDragSource, isDragging, isOver, canDrop } = this.props;
    let content = this.props.children.map((element) => {
      return element;
    });
    const opacity = isDragging ? 0.4 : 1;
    let backgroundColor = (isOver && canDrop) ? 'chartreuse' : (canDrop ? 'lemonchiffon' : 'white');
    return connectDragSource(connectDropTarget(
      <div>
        <BCard {...this.props} style={{ ...this.props.style, opacity, backgroundColor }}>
          {content}
        </BCard>
      </div>
    ));
  }

}

export default DropableCard;
