import React from 'react'; import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import ps from './perfect-scrollbar';
import './scrollbar.scss';
import merge from 'lodash/merge';
import { BComponent, BComponentComposer } from 'b-component';

const handlerNameByEvent = {
  'ps-scroll-y': 'onScrollY',
  'ps-scroll-x': 'onScrollX',
  'ps-scroll-up': 'onScrollUp',
  'ps-scroll-down': 'onScrollDown',
  'ps-scroll-left': 'onScrollLeft',
  'ps-scroll-right': 'onScrollRight',
  'ps-y-reach-start': 'onYReachStart',
  'ps-y-reach-end': 'onYReachEnd',
  'ps-x-reach-start': 'onXReachStart',
  'ps-x-reach-end': 'onXReachEnd',
};
Object.freeze(handlerNameByEvent);
@BComponentComposer
export class BScroll extends BComponent {

  static propTypes = {
    ...BComponent.propTypes,
    children: PropTypes.node.isRequired,
    disabled: PropTypes.bool,
    option: PropTypes.object,
    onScrollY: PropTypes.func,
    onScrollX: PropTypes.func,
    onScrollUp: PropTypes.func,
    onScrollDown: PropTypes.func,
    onScrollLeft: PropTypes.func,
    onScrollRight: PropTypes.func,
    onYReachStart: PropTypes.func,
    onYReachEnd: PropTypes.func,
    onXReachStart: PropTypes.func,
    onXReachEnd: PropTypes.func,
    style: PropTypes.object,
    divStyle: PropTypes.object
  };

  static defaultProps = {
    divStyle: { overflow: 'auto' }
  }
  
  state = { disabled: this.props.disabled };

  constructor(props, context) {
    super(props, context);
    this._handlerByEvent = new Map();
  }

  componentDidMount() {
    super.componentDidMount();
    if (this._mbcontainer) {
      this.fixMobileScroll();
    } else {
      let innerStyleScroll = { minScrollbarLength: 16 }; // scrool min height 16 px olması isteniyor.

      ps.initialize(this._container, merge(innerStyleScroll, this.props.option));
      // hook up events
      Object.keys(handlerNameByEvent).forEach((key) => {
        const callback = this.props[handlerNameByEvent[key]];
        if (callback) {
          const handler = () => callback(this._container);
          this._handlerByEvent.set(key, handler);
          this._container.addEventListener(key, handler, false);
        }
      });
    }
  }

  componentDidUpdate() {
    super.componentDidMount();
    if (this._mbcontainer) {
      this.fixMobileScroll();
    }
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    // unhook up evens
    Object.keys(this._handlerByEvent).forEach((value, key) => {
      this._container.removeEventListener(key, value, false);
    });
    this._handlerByEvent.clear();
    if (this._container) {
      ps.destroy(this._container);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ disabled: nextProps.disabled });
  }

  fixMobileScroll() {
    var mbcontainerDomNode = ReactDOM.findDOMNode(this._mbcontainer);
    var parentHeight;
    if (mbcontainerDomNode.parentNode.clientHeight != 0) {
      parentHeight = mbcontainerDomNode.parentNode.clientHeight;
    } else { // workaround olarak tab için konuldu. burası kökten düzeltilmeli (coral)
      var oldHeight = mbcontainerDomNode.parentNode.parentNode.style.height;
      mbcontainerDomNode.parentNode.parentNode.style.height = '';
      parentHeight = mbcontainerDomNode.parentNode.clientHeight;
      mbcontainerDomNode.parentNode.parentNode.style.height = oldHeight;
    }
    mbcontainerDomNode.style.height = parentHeight.toString() + 'px';
  }

  setDisable(value) {
    this.setState({ disabled: value });
  }

  // methods can be invoked by outside
  setScrollTop(top) {
    if (this._container) {
      this._container.scrollTop = top;
      ps.update(this._container);
      return true;
    }
    return false;
  }

  setScrollLeft(left) {
    if (this._container) {
      if (!this.props.context.localization.isRightToLeft) {
        this._container.scrollLeft = left;
      }
      else {
        this._container.scrollRight = left;
      }
      ps.update(this._container);
      return true;
    }
    return false;
  }

  shouldComponentUpdate() {
    return true;
  }

  render() {
    let childs = BComponent.Utils.getFormChildren(this.props.children, this.state.disabled);
    const { context } = this.props;
    let divStyle = {};
    divStyle = Object.assign({}, divStyle, this.props.divStyle);
    let innerStyle = { direction: 'ltr' };
    innerStyle = Object.assign({}, innerStyle, this.props.style);

    if (context.platform == BComponent.Platforms.MOBILE || context.platform == BComponent.Platforms.TABLET) {
      divStyle = Object.assign({}, divStyle, { '-webkit-overflow-scrolling': 'touch' });
      if (this.props.context.localization.isRightToLeft) {
        divStyle = divStyle = Object.assign({}, divStyle, { direction: 'rtl', '-webkit-overflow-scrolling': 'touch' });
      }
      return (
        <div style={divStyle} ref={(ref) => { this._mbcontainer = ref; }}>
          <div style={innerStyle}>
            {childs}
          </div>
        </div>
      );
    } else {
      if (this.props.context.localization.isRightToLeft) {
        divStyle = { direction: 'rtl' };
      }
      return (
        <div className="scrollbar-container" style={divStyle} ref={(ref) => { this._container = ref; }}>
          <div style={innerStyle}>
            {childs}
          </div>
        </div>
      );
    }
  }
}

export default BScroll;
