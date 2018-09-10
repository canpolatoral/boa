import React from 'react'; import PropTypes from 'prop-types';

import { BBusinessComponent, BComponentComposer } from 'b-business-component';
import { getModule } from 'b-dynamic-components';
@BComponentComposer
export class BDynamic extends BBusinessComponent {

  static propTypes = {
    /**
    * Base properties from BBusinessComponent
    */
    ...BBusinessComponent.props,
    /**
    * Indicates the resource code of component.
    */
    resourceCode: PropTypes.string,
    /**
    * Indicates the model of dynamic form.
    */
    modal: PropTypes.object
  }

  static defaultProps = {
    /**
    * Default prop values from BBusinessComponent
    */
    ...BBusinessComponent.defaultProps,
  };
  actions;

  constructor(props, context) {
    super(props, context);
    this.onActionClick = this.onActionClick.bind(this);
  }

  componentWillMount() {
    super.componentWillMount();
    if (this.props.modal) {
      this.setState({ elements: this.generateComponents(this.props.modal.components) });
      this.actions = this.props.modal.actions;
    }
    // TODO: resourceCode verildiyse db'den modal'i çekecek
  }

  generateComponents(modal) {
    let elements = [];
    modal.forEach((component) => {
      elements.push(this.createComponent(component));
    });
    return elements;
  }

  createComponent(component) {
    let children = [];
    if (component.children && component.children.length > 0) {
      component.children.forEach((child) => {
        children.push(this.createComponent(child));
      });
    }
    var bModule = getModule(component.props.packageName);
    if (bModule) {
      let staticProps = {
        context: this.props.context,
        key: component.key,
        ref: ref => this[component.key] = ref,
        errorText: ''
      };
      let props = Object.assign({}, component.props, staticProps);
      return React.createElement(bModule, props, ...children);
    } else {
      return null;
    }
  }

  onActionClick(e) {
    let action = this.actions.find(x => x.actionId === e.actionId);
    if (!action) {
      console.log('The errors occured While actions information getting'); // eslint-disable-line
    } else {
      if (action.typeId === 1) {
        // sp çalıştır
        let parameters = {};
        action.actionInfo.parameterList.forEach((parameter) => {
          var splittedParameter = parameter.value.split('.');
          var valuePath = splittedParameter[splittedParameter.length - 1];
          if (valuePath === 'value') {
            parameters[parameter.value] = this[splittedParameter[0]].getValue();
          } else {
            parameters[parameter.value] = this[splittedParameter[0]].getValue();
          }
        });

        console.log(action.actionInfo.selectedSp.fullSpName); // eslint-disable-line
        console.log(parameters); // eslint-disable-line
      }
    }
  }
}

export default BDynamic;
