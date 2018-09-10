import * as React from 'react';
import BasePage from '../base';
import { BTransactionForm } from 'b-transaction-form';
import { BLoading } from 'b-loading';
import { getMessage } from '../index';


export default class TransactionPage extends BasePage {

  constructor(props, context) {
    super(props, context);
  }
}

export function TransactionPageComposer(WrappedComponent) {
  return class IITransactionPage extends WrappedComponent {
    shallowEqual(objA, objB) {
      if (objA === objB) {
        return true;
      }
      if (typeof objA !== 'object' || objA === null ||
        typeof objB !== 'object' || objB === null) {
        return false;
      }
      const keysA = Object.keys(objA);
      const keysB = Object.keys(objB);
      if (keysA.length !== keysB.length) {
        return false;
      }
      const bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);
      for (let i = 0; i < keysA.length; i++) {
        if (keysA[i] != 'snapshotStore' && keysA[i] != 'executeStore') {
          if (!bHasOwnProperty(keysA[i]) || (objA[keysA[i]] !== objB[keysA[i]])) {
            return false;
          }
        }
      }
      return true;
    }

    shouldComponentUpdate(nextProps, nextState) {
      return !this.shallowEqual(this.state, nextState);
    }

    pageDidMount() {
      super.pageDidMount && super.pageDidMount();
    }
    render() {
      if (this.state.pageParams && this.state.pageParams.resourceInfo && this.state.pageParams.resourceInfo.resourceActionList) {
        const render = this.tabEnabled ? super.renderTab() : super.render();
        let renderContent = null;
        if (render) {
          renderContent = render.props ? render.props.children : render;
        }
        return (
          <BTransactionForm
            // ref={(r) => this.form = r}
            ref={r => this.snaps.form = r}
            snapshot={this.state.snapshot['form']}
            context={this.state.context}
            resourceInfo={this.state.pageParams.resourceInfo}
            onActionClick={this.onPageActionClick.bind(this)}
            onClosing={this.onPageCloseClick.bind(this)}
            page={this}
            readyOnly={this.readyOnly}
            cardSectionThresholdColumn={this.columnCount}
            cardSectionThresholdWidth={this.thresholdWidth}
            tabEnabled={this.tabEnabled}
            isWideCardEnabled={this.isWideCardEnabled}
            enableCardSortOnMobile={this.enableCardSortOnMobile}
            disableCardWidth={this.disableCardWidth}
            rightPaneWidth={this.rightPaneWidth}
            rightPaneContent={this.rightPaneContent}
            leftPaneWidth={this.leftPaneWidth}
            leftPaneContent={this.leftPaneContent}
            formHeader={this.state.formHeader}
            formHeaderTransactionTypes={this.state.formHeaderTransactionTypes}
            criteriaPanelHeader={getMessage('BusinessComponents', 'Criterias')}
            pageLoaded={this.pageDidMount.bind(this)}
            hideActionManager={this.hideActionManager}
            actionManager={this.createActionManager()}>
            {renderContent}
          </BTransactionForm>
        );
      }
      else {
        return <BLoading context={this.state.context} />;
      }
    }

    print() {
      this.snaps.form.baseForm.printContent();
    }
  };
}
