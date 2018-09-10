import React from 'react';
import PropTypes from 'prop-types';
import {BComponent, BComponentComposer} from 'b-component';
import {BBusinessComponent} from 'b-business-component';
import {BBaseForm} from 'b-base-form';
import {BDialogHelper} from 'b-dialog-box';

import * as Colors from '@material-ui/core/colors';
import DocumentViewer from './DocumentViewer';

@BComponentComposer
export default class MobileDocumentViewDialog extends BBusinessComponent {
  static propTypes = {
    /**
     * Base properties from BBusinessComponent.
     */
    ...BBusinessComponent.propTypes,
    /**
     * Indicates the file content.
     */
    fileContent: PropTypes.string,
    /**
     * Indicates the file content.
     */
    mimeType: PropTypes.string,
    /**
     * Indicates the file extension.
     */
    fileExtension: PropTypes.string,
    /**
     * Indicates the file server object id.
     */
    fileServerObjectId: PropTypes.string
  };

  static defaultProps = {
    /**
     * Base default properties from BComponent.
     */
    ...BBusinessComponent.defaultProps,
    resourceCode: 'YONTDMSMDV'
  };

  actionBarButtonClick(e) {
    switch (e.actionId) {
      case 26: {
        BDialogHelper.close(this, BComponent.DialogResponse.OK, null);
        break;
      }
    }
  }

  onCloseClick() {
    BDialogHelper.close(this, BComponent.DialogResponse.CANCEL, null);
  }

  render() {
    const {
      context,
      resourceInfo,
      fileServerObjectId,
      fileContent,
      fileExtension,
      mimeType
    } = this.props;

    const divStyle = {
      backgroundColor: Colors.grey600,
      // display: 'flex',
      height: '100%',
      padding: 2,
      overflowY: 'scroll'
    };

    return (
      <BBaseForm context={context}
                 {...this.props}
                 resourceInfo={resourceInfo}
                 onActionClick={this.actionBarButtonClick.bind(this)}
                 onClosing={this.onCloseClick.bind(this)}>
        <div style={divStyle}>
          <DocumentViewer context={context}
                          fileServerObjectId={fileServerObjectId}
                          fileContent={fileContent}
                          fileExtension={fileExtension}
                          mimeType={mimeType}/>
        </div>
      </BBaseForm>
    );
  }
}
