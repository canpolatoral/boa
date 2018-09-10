let proxyDelegates = {};
let proxyDelegatesStack = [];

export function setUIProxy(_proxyDelegates) {
  proxyDelegates = _proxyDelegates;
}

export function pushUIProxy(_proxyDelegates) {
  if (proxyDelegates) {
    proxyDelegatesStack.push(proxyDelegates);
  }
  setUIProxy(_proxyDelegates);
}

export function popUIProxy() {
  if (proxyDelegatesStack.length > 0) {
    proxyDelegates = proxyDelegatesStack.pop();
  }
}

export function proxyExecute(...args) {
  proxyDelegates.proxyExecute && proxyDelegates.proxyExecute(...args);
}

export function proxyFreeExecute(...args) {
  // TODO: Free yapılacak.
  proxyDelegates.proxyExecute && proxyDelegates.proxyExecute(...args);
}

export function proxyMultiExecute(...args) {
  proxyDelegates.proxyMultiExecute && proxyDelegates.proxyMultiExecute(...args);
}

export function proxyReportExecute(...args) {
  proxyDelegates.proxyReportExecute && proxyDelegates.proxyReportExecute(...args);
}

export function proxyTransactionExecute(...args) {
  proxyDelegates.proxyTransactionExecute && proxyDelegates.proxyTransactionExecute(...args);
}
