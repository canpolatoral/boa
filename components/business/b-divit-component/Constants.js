import { Sizes } from 'b-component';
import { addMessage } from 'b-snackbar';

export const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
  let byteCharacters = '';
  if (b64Data == 'data:') {
    byteCharacters = ' ';
  } else {
    byteCharacters = atob(b64Data);
  }

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

  return new Blob(byteArrays, { type: contentType });
};

export const s4 = () => {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
};

export const generateGUID = () => {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
};

export const showToastMessage = (message, closeCallback) => {
  const timeout = 3000;
  addMessage('b-divit-component', message, 'tamam', null, null, timeout, null);
  if (closeCallback) {
    setTimeout(closeCallback, timeout);
  }
};

export const isMobileDevice = (context) => {
  return context.deviceSize < Sizes.MEDIUM;
};

export const proxyCallHelper = (businessComponent, requestClass, requestBody, callback) => {
  let promise = businessComponent.proxyCall(requestClass, requestBody);
  promise.then((result) => {
    if (result.success) {
      callback({ success: true, value: result.value });
    } else {
      this.debugLog(result.results[0].errorMessage, 3);
    }
  }, (error) => {
    this.debugLog(error, 3);
  });
};


export const buildPages = (file) => {
  let arr = [];
  for (let i = 1; i <= file.numPages; i++) {
    arr.push({ key: i, file });
  }
  return arr;
};

export const styles = {
  container: {
    textAlign: 'center'
  },
  loading: {
    color: '#aaa',
  },
  pageContainer: {
    margin: '0 auto 10px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
  },
  error: {
    backgroundColor: '#bb0000',
    border: '1px solid #aa0000',
    borderRadius: '3px',
    padding: '10px',
    display: 'inline-block',
    color: '#fff'
  }
};
