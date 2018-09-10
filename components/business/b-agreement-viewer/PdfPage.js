import React, { Component } from 'react';
import PropTypes from 'prop-types';

const styles = {
  canvas: {
    width: '100%',
    height: 'auto',
    marginBottom: '8px'
  }
};

export default class PdfPage extends Component {
  static propTypes = {
    page: PropTypes.shape({
      key: PropTypes.number.isRequired,
      file: PropTypes.shape({
        getPage: PropTypes.func.isRequired
      })
    }).isRequired,
    onSizeReady: PropTypes.func
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
    this.renderPage();
  }

  render() {
    return (
      <canvas ref={(canvas) => {
        this.pageCanvas = canvas;
      } } style={styles.canvas} />
    );
  }
}
