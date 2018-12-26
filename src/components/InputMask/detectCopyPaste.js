export default function detectCopyPaste(keyCode, event) {
  let result = false;
  const charCode = String.fromCharCode(keyCode).toLowerCase();

  if (event.ctrlKey && charCode === 'c') {
    // this.debugLog('Ctrl + C pressed');
    result = true;
  } else if (event.ctrlKey && charCode === 'v') {
    // this.debugLog('Ctrl + V pressed');
    result = true;
  } else if (event.ctrlKey && charCode === 'a') {
    // this.debugLog('Ctrl + A pressed');
    result = true;
  } else if (event.metaKey && charCode === 'c') {
    // this.debugLog('Cmd + C pressed');
    result = true;
  } else if (event.metaKey && charCode === 'v') {
    // this.debugLog('Cmd + V pressed');
    result = true;
  }
  return result;
}
