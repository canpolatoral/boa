import React from 'react';
import { BTransactionForm } from 'b-transaction-form';
import { getModule } from 'b-dynamic-components';

export class BDynamicTransaction extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.onActionClick = this.onActionClick.bind(this);
  }

  onActionClick() {
  }

  // eslint-disable-next-line
  onChange(itemKey, eventName, ...parameters) {
    var modal = this.state.modal;
    if (modal.events && modal.events.length > 0) {
      let event = modal.events.find(x => x.itemKey === itemKey && x.name === eventName);
      if (event) {
        event.interactions.forEach(function (interaction) {
          if (interaction.type === 'assignment') {
            let toComponent = this.findComponent(modal.components, interaction.to);
            if (toComponent) {
              if (interaction.source === 'constant') {
                toComponent.props[interaction.prop] = interaction.value;
              } else {
                toComponent.props[interaction.prop] = this.getValueFromComponent(interaction.from, interaction.fromValue);
              }
              this.setState({ modal });
            }
          }
        }, this);
      }
    }
  }

  findComponent(components, itemKey) {
    let result = null;
    if (components && components.length > 0) {
      components.forEach((component) => {
        if (!result) {
          if (component.props.itemKey === itemKey) {
            result = component;
          } else if (component.children && component.children.length > 0) {
            result = this.findComponent(component.children, itemKey);
          }
        }
      });
    }
    return result;
  }

  componentWillMount() {
    if (this.props.modal) {
      this.setState({ modal: this.props.modal });
    }
  }

  componentDidMount() {
    var modal = this.state.modal;
    if (modal.events && modal.events.length > 0) {
      modal.events.forEach((event) => {
        var component = this.findComponent(modal.components, event.itemKey);
        if (component) {
          component.props[event.name] = this.onChange.bind(this, component.props.itemKey, event.name);
        }
      });
      this.setState({ modal });
    }
  }

  render() {
    return (
      <BTransactionForm
        context={this.props.context}
        onActionClick={this.onActionClick}
        resourceInfo={this.props.resourceInfo}>
        {
          this.state.modal.components.map((card) => {
            var DynamicCard = getModule(card.props.packageName);
            return (
              <DynamicCard
                {...card.props}
                context={this.props.context}
                key={card.key}
                ref={ref => this[card.key] = ref}>
                {
                  card.children.map((child) => {
                    var DynamicComponent = getModule(child.props.packageName);
                    return (
                      <DynamicComponent
                        {...child.props}
                        context={this.props.context}
                        key={child.key}
                        ref={ref => this[child.key] = ref}>
                      </DynamicComponent>
                    );
                  })
                }
              </DynamicCard>
            );
          })
        }
      </BTransactionForm>
    );
  }

  getValueFromComponent(itemKey, value) {
    let component = this[itemKey];
    if (component) {
      if (value === 'value') {
        return component.getValue();
      } else {
        return component.getValue()[value];
      }
    }
  }
}

export default BDynamicTransaction;
