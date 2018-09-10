import React from 'react';
import { BComponent, BComponentComposer } from 'b-component';
import PropTypes from 'prop-types';
import ContentLoader from 'react-content-loader';

@BComponentComposer
export class BContentLoader extends BComponent {
  static propTypes = {
    ...BComponent.propTypes,

    height: PropTypes.number,
    speed: PropTypes.number,
    style: PropTypes.any,
    primaryColor:PropTypes.any,
    secondaryColor:PropTypes.any,
  }

  static defaultProps = {
    height:140,
    speed:1,
  }

  constructor(props, context) {
    super(props, context);

    this.state = {
      primaryColor:this.props.context.theme.boaPalette.base200,
      secondaryColor:this.props.context.theme.boaPalette.base150,
      ...props,
    };

  }


  render() {
    return (

      <ContentLoader
        {...this.state}
         >
        {/* Pure SVG */}
        {this.props.children}
      </ContentLoader>
    );
  }
}

export default BContentLoader;
