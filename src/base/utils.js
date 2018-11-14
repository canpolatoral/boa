import React from 'react';
import indigo from '@material-ui/core/colors/indigo';
/* eslint-disable */
import { Sizes, ComponentSize, FormHeaderTransactionTypes } from './types';

Array.prototype.findIndex =
  Array.prototype.findIndex ||
  function(callback) {
    if (this === null) {
      throw new TypeError('Array.prototype.findIndex called on null or undefined');
    } else if (typeof callback !== 'function') {
      throw new TypeError('callback must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    for (var i = 0; i < length; i++) {
      if (callback.call(thisArg, list[i], i, list)) {
        return i;
      }
    }
    return -1;
  };

export class Utils {
  static uniqueKey = 0;

  static generateUUID() {
    var d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
      d += performance.now(); // use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
  }

  static stringFormat(value, args) {
    var regex = new RegExp('{-?[0-9]+}', 'g');
    return value.replace(regex, function(item) {
      var intVal = parseInt(item.substring(1, item.length - 1));
      var replace;
      if (intVal >= 0) {
        replace = args[intVal];
      } else if (intVal === -1) {
        replace = '{';
      } else if (intVal === -2) {
        replace = '}';
      } else {
        replace = '';
      }
      return replace;
    });
  }

  static stringPadLeft(str, len, ch) {
    const padCache = [
      '',
      ' ',
      '  ',
      '   ',
      '    ',
      '     ',
      '      ',
      '       ',
      '        ',
      '         ',
    ];

    // convert `str` to `string`
    str = str + '';
    // `len` is the `pad`'s length now
    len = len - str.length;
    // doesn't need to pad
    if (len <= 0) return str;
    // `ch` defaults to `' '`
    if (!ch && ch !== 0) ch = ' ';
    // convert `ch` to `string`
    ch = ch + '';
    // cache common use cases
    if (ch === ' ' && len < 10) return padCache[len] + str;
    // `pad` starts with an empty string
    var pad = '';
    var loop = true;
    // loop
    while (loop) {
      // add `ch` to `pad` if `len` is odd
      if (len & 1) pad += ch;
      // divide `len` by 2, ditch the remainder
      len >>= 1;
      // "double" the `ch` so this operation count grows logarithmically on `len`
      // each time `ch` is "doubled", the `len` would need to be "doubled" too
      // similar to finding a value in binary search tree, hence O(log(n))
      if (len) ch += ch;
      // `len` is 0, exit the loop
      else break;
    }
    // pad `str`!
    return pad + str;
  }

  static getShowStatusMessageReplacedText(value) {
    let text = value.replace(/\n/gi, '#00100#');
    let textArray = text.split('#00100#');
    let messages = [];
    if (textArray && textArray.length > 0) {
      if (textArray.length == 1) messages.push(<div>{textArray[0]}</div>);
      else
        textArray.forEach(function(item, index) {
          messages.push(
            <div>
              {item}
              {index != textArray.length ? <br /> : ''}
            </div>,
          );
        }, this);
    }
    return messages;
  }

  static getUniqueKey(isNumeric = false) {
    this.uniqueKey = this.uniqueKey + 1;
    return isNumeric ? this.uniqueKey : 'BUniqueKey' + this.uniqueKey;
  }

  static getFormChildren(children, isDisabled) {
    this.uniqueKey = 0;
    const childArray = [];
    if (children) {
      React.Children.map(children, child => {
        const newChild = this.getFormChildrenRecursive(child, isDisabled);
        newChild && childArray.push(newChild);
      });
    }
    return childArray;
  }

  static getFormChildrenRecursive(parent, isDisabled) {
    if (parent && parent != null) {
      if (parent.type == 'div') {
        const childArray = [];
        React.Children.map(parent.props.children, child => {
          if (child) {
            if (child.type == 'div') {
              let childDiv = this.getFormChildrenRecursive(child, isDisabled);
              childDiv && childArray.push(childDiv);
            } else {
              if (React.isValidElement(child)) {
                let newChild = React.cloneElement(child, {
                  key: child.props.key ? child.props.key : this.getUniqueKey(),
                  disabled: child.props && child.props.disabled ? true : isDisabled,
                });
                childArray.push(newChild);
              } else {
                childArray.push(child);
              }
            }
          }
        });
        let divChildren = React.cloneElement(parent, { children: childArray });
        return divChildren;
      } else if (React.isValidElement(parent)) {
        let newChild = React.cloneElement(parent, {
          disabled: parent.props && parent.props.disabled ? true : isDisabled,
        });
        return newChild;
      } else {
        return parent;
      }
    }
  }

  static getCardChildren(children, isDisabled) {
    this.uniqueKey = 0;
    const childArray = [];
    if (children) {
      React.Children.map(children, child => {
        if (child && child.props && child.props.isVisible !== false) {
          const newChild = this.getCardChildrenRecursive(child, isDisabled);
          newChild && childArray.push(newChild);
        }
      });
    }
    return childArray;
  }

  static getCardChildrenRecursive(parent, isDisabled) {
    if (parent && parent != null) {
      if (parent.type == 'div') {
        const childArray = [];
        React.Children.map(parent.props.children, child => {
          if (child) {
            if (child.type == 'div') {
              let childDiv = this.getCardChildrenRecursive(child, isDisabled);
              childDiv && childArray.push(childDiv);
            } else if (React.isValidElement(child)) {
              let newChild = React.cloneElement(child, {
                key: child.props.key ? child.props.key : this.getUniqueKey(true),
                componentSize: child.props.componentSize
                  ? child.props.componentSize
                  : ComponentSize.LARGE,
                newLine: child.props.newLine ? child.props.newLine : false,
                disabled: child.props && child.props.disabled ? true : isDisabled,
              });
              childArray.push(newChild);
            } else {
              childArray.push(child);
            }
          }
        });
        let divChildren = React.cloneElement(parent, { children: childArray });
        return divChildren;
      } else if (React.isValidElement(parent)) {
        let newChild = React.cloneElement(parent, {
          key: parent.props.key ? parent.props.key : this.getUniqueKey(),
          size: parent.props.size ? parent.props.size : ComponentSize.LARGE,
          newLine: parent.props.newLine ? parent.props.newLine : false,
          disabled: parent.props && parent.props.disabled ? true : isDisabled,
        });
        return newChild;
      } else {
        return parent;
      }
    }
  }

  static isMobile(props) {
    return props.context.deviceSize <= Sizes.SMALL; // platform.MOBILE olarak set edilmişti değiştirildi.
  }

  static formHeaderTransactionTypesColor(formHeaderTransactionTypes, props) {
    if (formHeaderTransactionTypes == FormHeaderTransactionTypes.TransactionalInput) {
      return props.context.theme.boaPalette.success500;
    }
    if (formHeaderTransactionTypes == FormHeaderTransactionTypes.TransactionalOutput) {
      return props.context.theme.boaPalette.error500;
    } else {
      return indigo[900];
    }
  }

  static isMobileOrTablet(props) {
    return props.context.deviceSize <= Sizes.MEDIUM;
  }

  static getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
  }

  static getLogLevel() {
    return ['debug', 'test', 'preprod', 'production'].findIndex(
      v => v === (process.env.NODE_ENV || 'debug'),
    );
  }
}

export function shallowEqual(objA, objB) {
  if (objA === objB) {
    return true;
  }
  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    return false;
  }
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
  if (keysA.length !== keysB.length) {
    return false;
  }
  const bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);
  for (let i = 0; i < keysA.length; i++) {
    if (!bHasOwnProperty(keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
      return false;
    }
  }
  return true;
}
