import React from 'react'; import PropTypes from 'prop-types';
import { BComponent, BComponentComposer } from 'b-component';
import { BCardSection } from 'b-card-section';
import { BScroll } from 'b-scroll';

// TODO: temaya gidecek
const CardSectionCardPadding = 12;
const CardSectionThresholdColumn = 2;
const CardSectionThresholdWidth = 1024;
@BComponentComposer
export class BPageModule extends BComponent {

  static propTypes = {
    ...BComponent.propTypes,
    pageInstance: PropTypes.any.isRequired,
    tabParams: PropTypes.any,
    isWideCardEnabled:PropTypes.bool,
    isCardSectionEnabled:PropTypes.bool,
    contentAlignMode: PropTypes.number
  }

  static defaultProps = {
    ...BComponent.defaultProps,
    isCardSectionEnabled:true

  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      snapshot: {},
      dynamicProps: {},
      pageInstance: props.pageInstance,
      tabParams: props.tabParams,
      context: props.context ? props.context : {}
    };
    this.snaps = {};
    this.setTabParams = this.setTabParams.bind(this);

    this.state.dynamicProps = props; // for definition based props loading
  }

  setTabParams(tabParams) {
    this.setState({tabParams});
  }

  getSnapshot() {
    let snapshot = {};
    snapshot.snaps = {};
    for (var name in this.snaps) {
      if (this.snaps[name]) {
        snapshot.snaps[name] = this.snaps[name].getInstance().getSnapshot();
      }
    }
    snapshot.state = this.state;
    return snapshot;
  }

  setSnapshot(snapshot) {
    if (this.state) {
      this.state = Object.assign({}, this.state, snapshot.state, { snapshot: snapshot.snaps });
      // this.setState({ snapshot: snapshot.snaps });
    }
  }
}

export default BPageModule;

export function BPageModuleComposer(WrappedComponent) {
  return class IIPageModule extends WrappedComponent {

    render() {
      this.contentDivStyle = {
        pointerEvents:this.props.readyOnly ? 'none' : 'all'
      };

      var divStyle = {
        padding: 0,
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
        position: 'absolute'
      };

      const render = super.render();
      let renderContent = null;
      if (render) {
        renderContent = (render.props &&  render.props.children ) ? render.props.children : render;
      }
      return (

        this.props.isCardSectionEnabled ?
          <div style={divStyle}>
            <BScroll context={this.props.context}>
              <div  style={this.contentDivStyle}>
                <BCardSection
                    context={this.props.context}
                    cardPadding={CardSectionCardPadding}
                    thresholdWidth={CardSectionThresholdWidth}
                    thresholdColumnCount={this.props.isWideCardEnabled? 1: CardSectionThresholdColumn}
                    contentAlignMode={this.props.contentAlignMode}>
                  {renderContent}
                </BCardSection>
              </div>
            </BScroll>
          </div>
        :
          renderContent

      );
    }
  };
}
