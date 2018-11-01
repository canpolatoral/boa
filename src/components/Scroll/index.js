import React from 'react'; import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import merge from 'lodash/merge';
import { ComponentBase, ComponentComposer, Utils, Platforms } from '@boa/base';
import PerfectScrollbar from 'perfect-scrollbar';

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
@ComponentComposer
export class Scroll extends ComponentBase {

  static propTypes = {
    ...ComponentBase.propTypes,
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

  state = {
    disabled: this.props.disabled
  };

  constructor(props, context) {
    super(props, context);
    this.handlerByEvent = new Map();
  }

  componentDidMount() {
    super.componentDidMount();
    if (this.mbContainer) {
      this.fixMobileScroll();
    } else {
      let innerStyleScroll = { minScrollbarLength: 16 }; // scrool min height 16 px olması isteniyor.
      this.ps = new PerfectScrollbar(this.container, merge(innerStyleScroll, this.props.option));
      // hook up events
      Object.keys(handlerNameByEvent).forEach((key) => {
        const callback = this.props[handlerNameByEvent[key]];
        if (callback) {
          const handler = () => callback(this.container);
          this.handlerByEvent.set(key, handler);
          this.container.addEventListener(key, handler, false);
        }
      });
    }
  }

  componentDidUpdate() {
    super.componentDidMount();
    if (this.mbContainer) {
      this.fixMobileScroll();
    }
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    // unhook up evens
    Object.keys(this.handlerByEvent).forEach((value, key) => {
      this.container.removeEventListener(key, value, false);
    });
    this.handlerByEvent.clear();
    if (this.ps) {
      this.ps.destroy();
      this.ps = null;
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ disabled: nextProps.disabled });
  }

  fixMobileScroll() {
    var mbcontainerDomNode = ReactDOM.findDOMNode(this.mbContainer);
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

  setScrollTop(top) {
    if (this.container) {
      this.container.scrollTop = top;
      this.ps.update();
      return true;
    }
    return false;
  }

  setScrollLeft(left) {
    if (this.container) {
      if (!this.props.context.localization.isRightToLeft) {
        this.container.scrollLeft = left;
      }
      else {
        this.container.scrollRight = left;
      }
      this.ps.update();
      return true;
    }
    return false;
  }

  shouldComponentUpdate() {
    return true;
  }

  render() {
    let childs = Utils.getFormChildren(this.props.children, this.state.disabled);
    const { context } = this.props;
    let divStyle = { overflow: 'auto' };
    divStyle = Object.assign({}, divStyle, this.props.divStyle);
    let innerStyle = { direction: 'ltr' };
    innerStyle = Object.assign({}, innerStyle, this.props.style);

    if (context.platform == Platforms.MOBILE || context.platform == Platforms.TABLET) {
      divStyle = Object.assign({}, divStyle, { '-webkit-overflow-scrolling': 'touch' });
      if (this.props.context.localization.isRightToLeft) {
        divStyle = divStyle = Object.assign({}, divStyle, { direction: 'rtl', '-webkit-overflow-scrolling': 'touch' });
      }
      return (
        <div style={divStyle} ref={(ref) => { this.mbContainer = ref; }}>
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
        <div className="scrollbar-container" style={divStyle} ref={(ref) => { this.container = ref; }}>
          <div style={innerStyle}>
            {childs}
          </div>
        </div>
      );
    }
  }
}

export default Scroll;
