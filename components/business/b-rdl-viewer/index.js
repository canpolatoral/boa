import React from 'react';
import PropTypes from 'prop-types';
import PDF from 'pdfjs-dist';
import PDFPage from './PdfPage';
import styled from 'styled-components';

import { BBusinessComponent } from 'b-business-component';
import { BCard } from 'b-card';
import { getProxy } from 'b-proxy';
import {BComponentComposer } from 'b-component';

const Container = styled.div`
  text-align: center;
  padding: 0px;
  font-family: Helvetica, Arial, sans-serif;
`;

const Loading = styled.div`
  color: #aaa;
`;

const PageContainer = styled.div`
  margin: 0px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  @media (max-width: 700px) {
    width: 100%;
  }
`;

const Error = styled.div`
  background-color: #bb0000;
  border: 1px solid #aa0000;
  border-radius: 3px;
  padding: 0px;
  display: inline-block;
  color: #fff;
`;

const buildPages = (file) => {
  let arr = [];
  for (let i = 1; i <= file.numPages; i++) {
    arr.push({ key: i, file });
  }
  return arr;
};

@BComponentComposer
export class BRDLViewer extends BBusinessComponent {
  static propTypes = {
    ...BBusinessComponent.propTypes,
    isOpenFromDialog: PropTypes.bool,
    reportPath: PropTypes.string.isRequired,
    reportParameters: PropTypes.array,
    reportDatasources: PropTypes.array,
    onComplete: PropTypes.func
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      resultData: '',
      reportPath: this.props.reportPath,
      reportParameters: this.props.reportParameters,
      reportDatasources: this.props.reportDatasources,
      pages: null,
      isDownloaded: false,
      isLoaded: false,
      loadedContent: 0,
      totalContent: 0,
      error: null
    };
  }

  componentWillMount() {
    super.componentWillMount();
    this.loadPDF();
  }

  onProgress(progressData) {
    if (progressData.total) {
      this.setState({ loadedContent: progressData.loaded, totalContent: progressData.total });
    }
  }

  loadPDF() {
    this.setState({ isDownloaded: false, isLoaded: false });
    let promise = getProxy().callManual({
      servicePath: (process.env.NODE_ENV == 'production' ? 'values/CreateReport' : 'development/CreateReport'),
      data: {
        reportPath: this.props.reportPath,
        parameters: this.props.reportParameters,
        datasources: this.props.reportDatasources
      },
      method: 'POST'
    });
    promise.then((result) => {
      if (result && result.data) {
        var loadedBinary = result.data;
        this.setState({ isDownloaded: true, isLoaded: false });
        // Load the PDF
        const task = PDF.getDocument({data: atob(result.data)});
        task.onProgress = this.onProgress.bind(this);
        task.promise.then(file => {
          this.props.onComplete && this.props.onComplete(loadedBinary);
          this.setState({ isDownloaded: true, isLoaded: true });
          this.setState({ resultData: loadedBinary, error: null, pages: buildPages(file) });
        }).catch(error => {
          this.setState({ error: error });
        });
      } else {
        this.setState({ error: this.getMessage('BOA', 'PDFCouldNotLoaded') });
      }
    });
  }

  render() {
    var customCardStyle = {
      padding:'0px',
      minWidth: '100px',
      maxWidth: 'none',
      maxHeight: 'none',
    };
    if (this.state.isDownloaded && this.state.isLoaded && !this.state.error) {
      if (this.props.isOpenFromDialog) {
        return (
          <Container>
            { this.state.pages ?
              <div>
                {this.state.pages.map((page) =>
                  <PageContainer key={page.key}>
                    <PDFPage page={page} />
                  </PageContainer>
                )}
              </div> :
              <Loading></Loading>
            }
          </Container>
        );
      }
      else {
        return (
          <BCard style={customCardStyle} context={this.props.context} expandable={false} initiallyExpanded={false}>
            <Container>
              { this.state.pages ?
                <div>
                  {this.state.pages.map((page) =>
                    <PageContainer key={page.key}>
                      <PDFPage page={page} />
                    </PageContainer>
                  )}
                </div> :
                <Loading></Loading>
              }
            </Container>
          </BCard>
        );
      }
    }
    else {
      if (this.props.isOpenFromDialog) {
        return (
          this.state.error ?
            <Error>{ this.state.error }</Error> :
            !this.state.isDownloaded ?
              <Loading>{this.getMessage('BOA', 'ReportIsDownloading')}</Loading> :
              <Loading>{this.getMessage('BOA', 'ReportIsLoading')} ({this.state.loadedContent} / {this.state.totalContent})</Loading>
        );
      }
      else {
        return (
          <BCard style={customCardStyle} context={this.props.context} expandable={false} initiallyExpanded={false}>
            { this.state.error ?
              <Error>{ this.state.error }</Error> :
              !this.state.isDownloaded ?
                <Loading>{this.getMessage('BOA', 'ReportIsDownloading')}</Loading> :
                <Loading>{this.getMessage('BOA', 'ReportIsLoading')} ({this.state.loadedContent} / {this.state.totalContent})</Loading>
            }
          </BCard>
        );
      }
    }
  }
}

export default BRDLViewer;
