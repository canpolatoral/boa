import React from 'react';
import { Utils } from './utils';
import ErrorBoundary from './ErrorBoundary';

export default function ComponentComposer(WrappedComponent) {
  return class IIBComponent extends WrappedComponent {
    static propTypes = {
      ...WrappedComponent.propTypes,
    };

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

    render() {
      if (this.props.isVisible || this.props.isVisible === undefined) {
        if (
          // eslint-disable-next-line no-proto
          IIBComponent.prototype.__proto__.constructor.name.includes('WithStyles') ||
          IIBComponent.displayName.includes('WithStyles')
        ) {
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
