import React from 'react';
import PropTypes from 'prop-types';
import BMenuHelper from './helper';
import { BBusinessComponent } from 'b-business-component';
import { BFormManager } from 'b-form-manager';
import { BDrawerMenu } from 'b-drawer-menu';
import { BScroll } from 'b-scroll';
import { BComponentComposer } from 'b-component';

@BComponentComposer
class BMainMenu extends BBusinessComponent {

  static propTypes = {
    ...BBusinessComponent.propTypes,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onMenuItemSelected: PropTypes.func,
    onMenuDataAcquired: PropTypes.func,
    serviceCallLoader: PropTypes.string
  };

  static defaultProps = {
    ...BBusinessComponent.defaultProps,
  };

  state = {
    item: this.props.dataSource ? this.props.dataSource : []
  }

  constructor(props, context) {
    super(props, context);
  }

  getSnapshot() {
    return {
      state: this.state
    };
  }
  setSnapshot(snapshot) {
    this.setState(snapshot.state);
  }

  componentWillMount() {
    super.componentWillMount();
    if (!this.state.items || !this.state.items.length) {
      this.getMenuItemsData(this.props.context.language, false);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.context.language !== nextProps.context.language) {
      this.getMenuItemsData(nextProps.context.language, true);
    }
  }

  onDrawerMenuUpdate() {
    if (this.scrollCtrl) {
      this.scrollCtrl.setScrollTop(0);
    }
  }

  onMenuItemSelected(parameters) {
    if (this.props.onMenuItemSelected) {
      this.props.onMenuItemSelected(parameters);
    }
  }

  onMenuDataAcquired(menuItems) {
    if (this.props.onMenuDataAcquired) {
      this.props.onMenuDataAcquired(menuItems);
    }
  }

  getMenuItemsData(language, isForceLoad) {
    if (!this.state.isError && !this.state.isLoading && (isForceLoad || (!this.state.items || !this.state.items.length))) {
      this.setState({ items: [], isLoading: true, isError: false });
      BFormManager.getAllResourceLightInfo(language, (response) => {
        if (response.success) {
          let menuItems = this.isResourceMenu(response) ? BMenuHelper.convertResourceMenu(response.value, this.props.context.localization.isRightToLeft) : response;
          this.setState({ items: menuItems, isLoading: false });
          this.onMenuDataAcquired(menuItems);
        }
        else {
          this.setState({ isError: true });
          this.debugLog('error:' + response.results[0].errorMessage, 3);
        }
      });
    }
  }

  isResourceMenu(result) {
    return result && result.value && result.value.length > 0;
  }

  render() {
    let { context } = this.props;
    let loader = this.getLoader();
    return (
      this.state.items && this.state.items.length ?
        (<BScroll
          context={context}
          style={{ direction: this.props.context.localization.isRightToLeft ? 'rtl' : 'ltr' }}
          ref={(_ref) => this.scrollCtrl = _ref}>
          <BDrawerMenu
            context={context}
            autoWidth={!this.props.width}
            width={this.props.width}
            disableAutoFocus={false}
            initiallyKeyboardFocused={false}
            items={this.state.items}
            onChange={this.onMenuItemSelected.bind(this)}
            onDrawerMenuUpdate={this.onDrawerMenuUpdate.bind(this)} />
        </BScroll>) :
        loader && (<div>{loader}</div>)
    );
  }
}

export {
  BMainMenu,
  BMenuHelper
};

export default BMainMenu;
