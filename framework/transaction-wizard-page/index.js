import * as React from 'react';
import BasePage from '../base';
import { BTransactionWizardForm } from 'b-transaction-wizard-form';
import { BLoading } from 'b-loading';
import { __ } from 'lodash';

export default class TransactionWizardPage extends BasePage {

  constructor(props, context) {
    super(props, context);
    this.setStepper(true);
    this.showActionManager(false);
  }

  onPageFinishClick(e, callBack) {
    if (this.onFinishClick) {
      return this.onFinishClick(e, callBack);
    }
  }
  
  onWizardPageActionClick(e, callBack) {
    this.activeAction = e;
    if (this.onWizardActionClick) {
      return this.onWizardActionClick(e, callBack);
    }
  }

  showActionManager(state: boolean) {
    this.hideActionManager = !state;
  }

  isFormUpdated(firstObject, secondObject) {
    return __.deepEqual(firstObject, secondObject);
  }
}

export function TransactionWizardPageComposer(WrappedComponent) {
  return class IITransactionWizardPage extends WrappedComponent {
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
        const render = super.render();
        let renderContent = null;
        if (render) {
          renderContent = render.props ? render.props.children : render;
        }
        return (
          <div>
            <div style={{margin:'10px'}}>{renderContent}</div>
            <div style={{paddingLeft:20}}>
              <BTransactionWizardForm
                ref={r => this.snaps.form = r}
                snapshot={this.state.snapshot['form']}
                context={this.state.context}
                resourceInfo={this.state.pageParams.resourceInfo}
                onActionClick={this.onPageActionClick.bind(this)}
                onWizardClick={this.onWizardPageActionClick.bind(this)}
                onFinishClick={this.onPageFinishClick.bind(this)}
                onClosing={this.onPageCloseClick.bind(this)}
                page={this}
                readyOnly={this.readyOnly}
                cardSectionThresholdColumn={this.columnCount}
                cardSectionThresholdWidth={this.thresholdWidth}
                isWideCardEnabled={this.isWideCardEnabled}
                disableCardWidth={this.disableCardWidth}
                rightPaneWidth={this.rightPaneWidth}
                rightPaneContent={this.rightPaneContent}
                leftPaneWidth={this.leftPaneWidth}
                leftPaneContent={this.leftPaneContent}
                pageLoaded={this.pageDidMount.bind(this)}
                activeStep={this.state.activeStep}
                stepList={this.state.stepList}
                finisherPage={this.state.finisherPage}
                hideActionManager={this.hideActionManager}
                actionManager={this.createActionManager()}>
              </BTransactionWizardForm>
            </div>
          </div>
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
