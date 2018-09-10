import React from 'react';
import PropTypes from 'prop-types';
import {BComponent, BComponentComposer} from 'b-component';
import {BBusinessComponent} from 'b-business-component';
import {BBaseForm} from 'b-base-form';
import {BDialogHelper} from 'b-dialog-box';
import {BCard} from 'b-card';
import {BInput} from 'b-input';
import {BScroll} from 'b-scroll';

@BComponentComposer
export default class AddDescriptionComponent extends BBusinessComponent {
  static propTypes = {
    /**
     * Base properties from BBusinessComponent.
     */
    ...BBusinessComponent.propTypes,
    /**
     * Idicates the description.
     */
    description: PropTypes.string,
  };

  static defaultProps = {
    /**
     * Base default properties from BBusinessComponent.
     */
    ...BBusinessComponent.defaultProps,
    resourceCode: 'YONTDMSDDD'
  };

  state = {
    description: this.props.description
  };

  actionBarButtonClick(e) {
    switch (e.actionId) {
      case 26: {
        BDialogHelper.close(this, BComponent.DialogResponse.OK, {description: this.state.description});
        break;
      }
      case 6: {
        BDialogHelper.close(this, BComponent.DialogResponse.CANCEL, null);
        break;
      }
    }
  }

  onCloseClick() {
    BDialogHelper.close(this, BComponent.DialogResponse.CANCEL, null);
  }

  render() {
    const {context} = this.props;

    return (
      <BBaseForm context={context}
                 {...this.props}
                 resourceInfo={this.props.resourceInfo}
                 onActionClick={this.actionBarButtonClick.bind(this)}
                 onClosing={this.onCloseClick.bind(this)}>
        <BScroll context={context} option={{suppressScrollX: true}}>
          <div style={{padding: '24px'}}>
            <BCard context={context}>
              <BInput context={context}
                      type="text"
                      multiLine={true}
                      rows={3}
                      rowsMax={5}
                      noWrap={true}
                      floatingLabelText={this.getMessage('BusinessComponents', 'Description')}
                      onChange={(event, value) => {
                        this.setState({description: value});
                      }}
                      value={this.state.description}/>
            </BCard>
          </div>
        </BScroll>
      </BBaseForm>
    );
  }
}
