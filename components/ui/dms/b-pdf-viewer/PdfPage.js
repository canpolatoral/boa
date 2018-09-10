import React from 'react';
import PropTypes from 'prop-types';
import {BComponent, BComponentComposer} from 'b-component';

const styles = {
  canvas: {
    width: '100%',
    height: 'auto'
  }
};
@BComponentComposer
export default class PdfPage extends BComponent {
  static propTypes = {
    /**
    * Base properties from BBusinessComponent.
    */
    ...BComponent.props,
    /**
    * Indicates the page property.
    */
    page: PropTypes.shape({
      key: PropTypes.number.isRequired,
      file: PropTypes.shape({
        getPage: PropTypes.func.isRequired
      })
    }).isRequired,
    /**
    * The event to handle ready status of size.
    */
    onSizeReady: PropTypes.func
  };

  static defaultProps = {
    /**
    * Base default properties from BComponent.
    */
    ...BComponent.defaultProps,
  };

  renderPage() {
    const {key, file} = this.props.page;
    const canvas = this.pageCanvas;

    file.getPage(key)
      .then(page => {
        // Make pages look nice on retina screens
        const pixelScale = window.devicePixelRatio || 1;
        const scale = 1.5;
        const viewport = page.getViewport(scale * pixelScale);

        // Prepare canvas using PDF page dimensions
        if (!canvas)
          return;
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Render PDF page into canvas context
        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };

        page.render(renderContext).promise.then(() => {
          if (typeof this.props.onSizeReady === 'function') {
            const rect = canvas.getBoundingClientRect();
            const height = rect.bottom - rect.top;
            const width = rect.right - rect.left;
            this.props.onSizeReady(width, height);
          }
        });
      })
      .catch(error => {
        throw error;
      });
  }

  componentDidMount() {
    super.componentDidMount();
    this.renderPage();
  }

  render() {
    return (
      <canvas ref={(canvas) => { this.pageCanvas = canvas;}} style={styles.canvas}/>
    );
  }
}
