import React from 'react';
import { Utils } from './utils';
import { ErrorBoundary } from './ErrorBoundary';

export function ComponentComposer(WrappedComponent) {
  return class IIBComponent extends WrappedComponent {

    static propTypes = {
      ...WrappedComponent.propTypes,
    }

    static displayName = `ComponentComposer(${Utils.getDisplayName(WrappedComponent)})`;

    getComponentPropTypes() {
      return this.innerRef ? this.comp.type.propTypes : WrappedComponent.propTypes;
    }

    getComponentDefaultProps() {
      return this.innerRef ? this.comp.type.defaultProps : WrappedComponent.defaultProps;
    }

    getInstance() {
      return this.innerRef || this;
    }

    getDisplayName() {
      return IIBComponent.displayName;
    }

    render() {
      if (this.props.isVisible || this.props.isVisible === undefined) {
        this.comp;
        if (IIBComponent.displayName.includes('WithStyles') || IIBComponent.prototype.__proto__.constructor.name.includes('WithStyles')) {
          let innerComp = super.render();
          let newProps = {
            ref: r => {
              this.innerRef = r;
            }
          };
          this.comp = React.cloneElement(innerComp, newProps);
        } else {
          this.innerRef = null;
          this.comp = super.render();
        }
        return (
          <ErrorBoundary>
            {this.comp}
          </ErrorBoundary>
        );
      }
      else {
        return null;
      }
    }
  };
}
