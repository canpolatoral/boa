import {
  getSelection,
  setSelection
} from './lib/InputTextSelection';

import copy from 'copy-to-clipboard';
import PHE from 'print-html-element';
import ReactDOM from 'react-dom';

export {
  getSelection,
  setSelection
};

export function copyToClipboard(data) {
  copy(data);
}

export function printElement(element) {
  PHE.printElement(ReactDOM.findDOMNode(element));
}


export function convertTreeList(arr, parent) {
  var out = [];
  arr.forEach(function (item) {
    if (item.pid == parent) {
      var children = convertTreeList(arr, item.id);

      if (children.length) {
        item.children = children;
      }
      out.push(item);
    }
  });
  return out;
}
