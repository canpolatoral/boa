let frameworkGetMessageMethod = null;
let frameworkGetMessageMethodCode = null;

export function setFrameworkMessage(_getMessage) {
  frameworkGetMessageMethod = _getMessage;
}
export function setFrameworkMessageCode(_getMessageCode) {
  frameworkGetMessageMethodCode = _getMessageCode;
}
export function getFrameworkMessage(groupName, propertyName) {
  if (frameworkGetMessageMethod) {
    return frameworkGetMessageMethod(groupName, propertyName);
  }
  else {
    return groupName + '.' + propertyName;
  }
}
export function getFrameworkMessageCode(groupName, propertyName) {
  if (frameworkGetMessageMethodCode) {
    return frameworkGetMessageMethodCode(groupName, propertyName);
  }
  else {
    return groupName + '.' + propertyName;
  }
}