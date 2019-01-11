import React from 'react';
import { Utils, isWrappedWithStyles } from './utils';
import ErrorBoundary from './ErrorBoundary';

export default function ComponentComposer(WrappedComponent) {
  return class IIBComponent extends WrappedComponent {
    static propTypes = {
      ...WrappedComponent.propTypes,
    };

    static displayName = `ComponentComposer(${Utils.getDisplayName(WrappedComponent)})`;

    getInstance() {
      return this.innerRef || this;
    }

    render() {
      if (this.props.visible || this.props.visible === undefined) {
        if (isWrappedWithStyles(WrappedComponent)) {
          const innerComp = super.render();
          const newProps = {
            ref: r => {
              this.innerRef = r;
            },
          };
          this.comp = React.cloneElement(innerComp, newProps);
        } else {
          this.innerRef = null;
          this.comp = super.render();
        }
        return <ErrorBoundary>{this.comp}</ErrorBoundary>;
      }
      return null;
    }
  };
}
