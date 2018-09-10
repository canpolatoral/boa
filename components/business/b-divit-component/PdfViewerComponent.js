import React from 'react';
import PropTypes from 'prop-types';
import Page from './PdfPage';
import {BComponent, BComponentComposer} from 'b-component';
import {BScroll} from 'b-scroll';
 
import PDF from 'pdfjs-dist';
import {buildPages, styles} from './Constants';

@BComponentComposer
export default class PdfViewerComponent extends BComponent {
  static propTypes = {
    /**
     * Base properties from BBusinessComponent.
     */
    ...BComponent.props,
    /**
     * Indicates the file Url.
     */
    fileUrl: PropTypes.string,
    /**
     * Indicates the pdf container height.
     */
    pdfContainerHeight: PropTypes.number
  };

  static defaultProps = {
    /**
     * Base default properties from BComponent.
     */
    ...BComponent.defaultProps,
  };

  state = {
    url: this.props.fileUrl,
    pages: null,
    file: null,
    error: null,
    loaded: 0,
    total: 0
  };

  onProgress(progressData) {
    if (progressData.total) {
      this.setState({
        loaded: progressData.loaded,
        total: progressData.total
      });
    }
  }

  loadPDF(objectDataUrl) {
    // Destroy any old file
    if (this.state.file) {
      this.state.file.destroy();
    }

    // Clear the state
    this.setState({
      pages: [],
      file: null,
      error: null,
      loaded: 0,
      total: 0
    });

    const task = PDF.getDocument(objectDataUrl);
    task.onProgress = this.onProgress.bind(this);

    return task.then(file => {
      this.setState({file: file, pages: buildPages(file)});
    }).catch(error => {
      this.setState({error});
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.fileUrl !== this.props.fileUrl) {
      this.loadPDF(nextProps.fileUrl);

      if (this.containerScroll) {
        this.containerScroll.getInstance().setScrollTop(0);
      }
    }

    if (nextProps.pdfContainerHeight !== this.props.pdfContainerHeight) {
      this.pdfContainerDiv.style.height = (nextProps.pdfContainerHeight - 64) + 'px';
    }
  }

  componentDidMount() {
    super.componentDidMount();
    this.loadPDF(this.props.fileUrl);
    this.pdfContainerDiv.style.height = this.props.pdfContainerHeight ? (this.props.pdfContainerHeight - 64) + 'px' : '100%';
  }

  render() {
    const {context} = this.props;

    return (
      <div style={styles.container}>
        <BScroll ref={r => this.containerScroll = r} context={this.props.context} option={{suppressScrollX: true}}>
          <div ref={r => this.pdfContainerDiv = r}>
            {
              this.state.error ?
              /* eslint-disable */
                <Error>{this.state.error.message}</Error> :
                /* eslint-disable */
                this.state.pages ?
                  <div>
                    {
                      this.state.pages.map((page) =>
                        <div style={styles.pageContainer} key={page.key}><Page
                          context={context} page={page}/>
                        </div>)
                    }
                  </div> :
                  <div style={styles.loading}>
                    Loading {this.state.loaded} / {this.state.total}
                  </div>
            }
          </div>
        </BScroll>
      </div>
    );
  }
}
