import React from 'react';
import {getFrameworkMessage} from 'b-messaging';
import {BDivitComponent} from 'b-divit-component';
import {BDialogHelper} from 'b-dialog-box';
import {BComponent, Sizes, BComponentComposer} from 'b-component';
import FileSaver from 'file-saver';

const isMobileDevice = (context) => {
  return context.deviceSize < Sizes.MEDIUM;
};

@BComponentComposer
export class BDivitHelper extends BComponent {

  static propTypes = {
    /**
     * Base properties from BComponent.
     */
    ...BComponent.propTypes,
  };

  static defaultProps = {
    /**
     * Base default properties from BComponent.
     */
    ...BComponent.defaultProps,
  };

  /**
   * dilaog closing helper method, do not use from outside :)
   *
   * @param context
   * @param dialog
   * @param ref
   */
  static fireWhenDialogClosing(context, dialog, ref) {
    if (!ref.canRunOnClosingFunction()) {
      dialog.open(false);
      return;
    }

    if (ref.isUnSavedFileExits()) {
      let msg = getFrameworkMessage('DocumentManagement', 'FoundNotSavedChanges') + getFrameworkMessage('DocumentManagement', 'WantToSave');
      BDialogHelper.show(context, msg, BComponent.DialogType.QUESTION, BComponent.DialogResponseStyle.YESNO, '?',
        (dialogResponse) => {
          if (dialogResponse === BComponent.DialogResponse.YES) {
            ref.saveDocuments(false, () => {
              dialog.open(false);
            });
          } else {
            dialog.open(false);
          }
        }
      );
    } else {
      dialog.open(false);
    }
  }

  /**
   * Opens BDivitComponent as a dialog screen.
   *
   * @param context : this.props.context
   * @param divitId : PropTypes.string.isRequired
   * @param instanceId : PropTypes.string.isRequired
   * @param editorMode : PropTypes.oneOf(['Read', 'Write']).isRequired
   * @param onClose callback
   */
  static showDivitDialog(context, divitId, instanceId, editorMode, onClose) {
    let dialog = (
      <BDivitComponent context={context} divitId={divitId} instanceId={instanceId} editorMode={editorMode}/>);

    BDialogHelper.showWithResourceCode(context, 'YONTDMSEDT', dialog, BComponent.DialogType.INFO
      , BComponent.DialogResponseStyle.OK, getFrameworkMessage('BusinessComponents', 'Divit'), onClose,
      !isMobileDevice(context) ? {width: '90%', height: '90%'} : {width: '95%', height: '95%'},
      (d, ref) => {
        this.fireWhenDialogClosing(context, d.getInstance(), ref.getInstance());
      });
  }

  /**
   * Opens BDivitComponent as a dialog screen for person divit.
   *
   * @param context: this.props.context
   * @param personId: PersonId
   * @param customerId: CustomerId
   * @param editorMode: PropTypes.oneOf(['Read', 'Write']).isRequired
   * @param onClose callback
   */
  static showPersonDivitDialog(context, personId, customerId, editorMode, onClose) {
    let dialog = (
      <BDivitComponent context={context} personId={personId} customerId={customerId} editorMode={editorMode}/>);

    BDialogHelper.showWithResourceCode(context, 'YONTDMSEDT', dialog, 0, 0, getFrameworkMessage('BusinessComponents', 'Divit'), onClose,
      !isMobileDevice(context) ? {width: '90%', height: '90%'} : {width: '95%', height: '95%'},
      (d, ref) => {
        this.fireWhenDialogClosing(context, d, ref.getInstance());
      });
  }

  /**
   * Saves document with given base64 string content and filename.
   *
   * @param base64Content
   * @param filename
   * @param contentType
   */
  static saveFile(base64Content, filename, contentType = '') {
    let blobData = this.base64ToBlob(base64Content, contentType);
    FileSaver.saveAs(blobData, filename);
  }

  /**
   * Converts base64String to Blob data.
   *
   * @param base64Content
   * @param contentType
   * @param sliceSize
   * @returns {Blob}
   */
  static base64ToBlob(base64Content, contentType = '', sliceSize = 512) {
    const byteCharacters = atob(base64Content);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, {type: contentType});
  }

}

export default BDivitHelper;
