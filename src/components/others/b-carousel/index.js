import React from 'react'; import PropTypes from 'prop-types';
import Slider from 'react-slick';

import './slick.css';
import './slick-theme.css';

import { BComponent } from 'b-component';
import { BButton } from 'b-button';

export class BCarousel extends BComponent {

  static defaultProps = {
    imagePaths: null
  }

  static propTypes = {
    imagePaths: PropTypes.array,
    contentList: PropTypes.arrayOf(PropTypes.object),
    style: PropTypes.object,
    linkOnClick: PropTypes.func
  }

  constructor(props, context) {
    super(props, context);
  }

  linkOnClick(index) {
    this.props.linkOnClick && this.props.linkOnClick(index);
  }

  render() {
    // var defaultProps = {
    //   className: '',
    //   accessibility: true,
    //   adaptiveHeight: false,
    //   arrows: true,
    //   autoplay: false,
    //   autoplaySpeed: 3000,
    //   centerMode: false,
    //   centerPadding: '50px',
    //   cssEase: 'ease',
    //   customPaging: function (i) {
    //     return <button>{i + 1}</button>;
    //   },
    //   dots: false,
    //   dotsClass: 'slick-dots',
    //   draggable: true,
    //   easing: 'linear',
    //   edgeFriction: 0.35,
    //   fade: false,
    //   focusOnSelect: false,
    //   infinite: true,
    //   initialSlide: 0,
    //   lazyLoad: false,
    //   pauseOnHover: true,
    //   responsive: null,
    //   rtl: false,
    //   slide: 'div',
    //   slidesToShow: 1,
    //   slidesToScroll: 1,
    //   speed: 500,
    //   swipe: true,
    //   swipeToSlide: false,
    //   touchMove: true,
    //   touchThreshold: 5,
    //   useCSS: true,
    //   variableWidth: false,
    //   vertical: false,
    //   waitForAnimate: true,
    //   afterChange: null,
    //   beforeChange: null,
    //   edgeEvent: null,
    //   init: null,
    //   swipeEvent: null,
    //   // nextArrow, prevArrow are react componets
    //   nextArrow: null,
    //   prevArrow: null
    // };

    const { context, imagePaths, contentList, style } = this.props;
    const { centeredLayout } = context.theme;
    const isMobile = context.deviceSize == BComponent.Sizes.SMALL;
    const isLarge = context.deviceSize > BComponent.Sizes.MEDIUM;

    var settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      centerMode: true,
      centerPadding: 0
    };

    const rootStyle = Object.assign({ height: 500 }, style);
    const imageDivStyle = (path) => {
      return {
        backgroundImage: `url(${path})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover'
      };
    };

    var rows = [];
    var numRows = imagePaths.length;
    for (var i = 0; i < numRows; i++) {
      const content = contentList ? contentList[i] : null;
      const titleColor = content && content.titleColor ? content.titleColor : 'white';
      const summaryColor = content && content.summaryColor ? content.summaryColor : 'white';
      rows.push(
        <div style={imageDivStyle(imagePaths[i])}>
          {content ? (
            <div style={{ maxWidth: centeredLayout ? 1400 : null, height: '100%', display: 'flex', margin: 'auto', }}>
              <div style={{ maxWidth: 600, margin: `auto ${isMobile ? '6%' : '10%'}` }}>
                <h1 style={{ fontSize: isMobile ? 24 : 32, fontWeight: 500, color: titleColor }}>{content.title}</h1>
                <h3 style={{ fontSize: isMobile ? 14 : 18, fontWeight: 'lighter', color: summaryColor }}>{content.summary}</h3>
                {content.linkTitle ? (
                  <BButton context={context}
                    type={'raised'}
                    colorType={'primary'}
                    text={content.linkTitle}
                    backgroundColor={this.props.context.theme.boaPalette.pri500}
                    onClick={this.linkOnClick.bind(this, i)} />
                ) : null}
              </div>
            </div>
          ) : null
          }
        </div>
        /* <img src={imagePaths[i]} />*/
      );
    }
    return (
      <div style={rootStyle}>
        <style>
          {`
          .slick-dots li.slick-active button:before { opacity: .75; color: ${context.theme.boaPalette.sec500}}
          ${isLarge ? '' : '.slick-prev, .slick-next { display: none !important; }'}
          `}
        </style>
        <Slider {...settings}>{rows}</Slider>
      </div>
    );
  }

}

export default BCarousel;
