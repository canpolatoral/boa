import React from 'react';
import { ErrorBoundary } from '..';
import { isWrappedWithStyles } from '../helpers';

export default function ComponentComposer(WrappedComponent) {
  return class IIBComponent extends WrappedComponent {
    static propTypes = {
      ...WrappedComponent.propTypes,
    };

    static displayName = `ComponentComposer(${WrappedComponent.displayName ||
      WrappedComponent.name ||
      'Component'})`;

    getInstance() {
      return this.innerRef || this;
    }

    render() {
      const visible = this.props.visible !== undefined ? this.props.visible : this.props.isVisible;
      if (visible || visible === undefined) {
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
