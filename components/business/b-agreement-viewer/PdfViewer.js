import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import PDF from 'pdfjs-dist';

const styles = {
  pdfViewer: {
    overflowX: 'visible',
    overflowY: 'scroll',
    maxHeight: 'none',
    width: '100%', 
    height: '100%'
  }
};

const buildPages = (file) => {
  let arr = [];
  for (let i = 1; i <= file.numPages; i++) {
    arr.push({ key: i, file });
  }
  return arr;
};

export default class PdfViewer extends Component {
  static propTypes = {
    onProgress: PropTypes.func,
    onComplete: PropTypes.func,
    onError: PropTypes.func,
    url: PropTypes.string.isRequired
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      loadedUrl: null,
      file: null,
      error: null,
      loaded: 0,
      total: 100
    };
  }

  onProgress(progressData) {
    if (progressData.total) {
      this.setState({
        loaded: progressData.loaded,
        total: progressData.total
      });

      if (typeof this.props.onProgress === 'function') {
        this.props.onProgress(progressData);
      }
    }
  }

  loadPDF() {
        // Destroy any old file
    if (this.state.file) {
      this.state.file.destroy();
    }

        // Clear the state
    this.setState({
      loadedUrl: this.props.url,
      error: null,
      loaded: 0,
      total: 0,
      file: null
    });

        // Load the PDF
    const task = PDF.getDocument(this.props.url);
    task.onProgress = this.onProgress.bind(this);

    return task
      .then(file => {
        this.setState({ file });
        if (typeof this.props.onComplete === 'function')
          this.props.onComplete(buildPages(file));
      })
      .catch(error => {
        this.setState({ error });
        if (typeof this.props.onError === 'function')
          this.props.onError(error);
      });
  }

  componentDidUpdate() {
    if (this.props.url !== this.state.loadedUrl) {
      this.loadPDF();
    }
  }

  componentDidMount() {
    this.loadPDF();
  }

  componentWillUnmount() {
    if (this.state.file) {
      this.state.file.destroy();
    }
  }

  render() {
    return (
      <div style={styles.pdfViewer}>
        {this.props.children}
      </div>
    );
  }
}
