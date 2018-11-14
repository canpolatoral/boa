/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import { ComponentBase, ComponentComposer } from '@boa/base';
import { Localization } from '@boa/utils';
import { Button } from '@boa/components/Button';
import { withStyles } from '@material-ui/core/styles';
import { ListItem } from '@boa/components/ListItem';
import { IconMenu } from '@boa/components/IconMenu';
import Tabs from './Tabs';
import Tab from './Tab';
// eslint-disable-line
const DoubleChevronRight = require('@boa/components/Icon').Actions.DoubleChevronRight;
const DoubleChevronLeft = require('@boa/components/Icon').Actions.DoubleChevronLeft;

const styles = theme => ({
  primary: {
    fontSize: '13px',
    textAlign: 'center',
    color: theme.boaPalette.comp500,
    background: theme.boaPalette.pri500,
    minWidth: '64px',
  },
  secondary: {
    fontSize: '13px',
    textAlign: 'center',
    color: theme.boaPalette.pri500,
    background: theme.boaPalette.comp500,
    minWidth: '64px',
  },
  // labelIcon: {},
  // textColorInherit: {},
  // textColorPrimary: {},
  // textColorPrimarySelected: {},
  // textColorPrimaryDisabled: {},
  // textColorSecondary: {},
  // textColorSecondarySelected: {},
  // textColorSecondaryDisabled: {},
  // textColorInheritSelected: {},
  // textColorInheritDisabled: {},
  // fullWidth: {},
  // wrapper: {},
  labelContainer: {
    width: '100%',
    padding: 0,
  },
  // label: {},
  // labelWrapped: {},
  iconRoot: { fontSize: '20px' },
});

@ComponentComposer
@withStyles(styles)
class TabBar extends ComponentBase {
  static propTypes = {
    ...ComponentBase.propTypes,
    centered: PropTypes.bool,
    children: PropTypes.node,
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    containerType: PropTypes.oneOf(['default', 'page', 'card']),
    fullWidth: PropTypes.bool,
    /**
     * @ignore
     */
    indicatorClassName: PropTypes.string,
    indicatorColor: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.oneOf(['secondary', 'primary']),
    ]),
    isContentDisabled: PropTypes.bool,
    /**
     * @ignore
     */
    leftIcon: PropTypes.string,
    leftIconButtonVisibility: PropTypes.bool,
    mode: PropTypes.oneOf(['primary', 'secondary']),
    onChange: PropTypes.func,
    onRightIconClick: PropTypes.func,
    rightIconButtonVisibility: PropTypes.bool,
    scrollable: PropTypes.bool,
    scrollButtons: PropTypes.oneOf(['auto', 'on', 'off']),
    style: PropTypes.object,
    tabItems: PropTypes.array,
    TabScrollButton: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    tabTemplateStyle: PropTypes.object,
    textColor: PropTypes.oneOf(['secondary', 'primary', 'inherit']),
    value: PropTypes.any,
  };

  static defaultProps = {
    ...ComponentBase.defaultProps,
    mode: 'primary',
    fullWidth: true,
    isContentDisabled: false,
    value: 0,
    leftIconButtonVisibility: false,
    rightIconButtonVisibility: false,
    disableIcons: false,
    tabItems: [],
  }

  state = {
    value: this.props.value,
    tabItems: this.props.tabItems,
    isScroll: true,
  }

  constructor(props, context) {
    super(props, context);
    this.isClosing = false;
    this.handleChange = this.handleChange.bind(this);
    // this.scrollStateUpdate();
  }

  componentDidMount() {
    super.componentDidMount();
    this.scrollStateUpdate();
  }

  componentDidUpdate(prevProps, prevState) {
    super.componentDidUpdate(prevProps, prevState);
    this.scrollStateUpdate();
  }

  scrollStateUpdate() {
    if (this.tabs) {
      if (this.tabs._reactInternalFiber.child.memoizedState.tabsMeta) {
        const clientWidth = this.tabs._reactInternalFiber.child.memoizedState.tabsMeta.clientWidth;
        const scrollWidth = this.tabs._reactInternalFiber.child.memoizedState.tabsMeta.scrollWidth;
        const scrollLeft = this.tabs._reactInternalFiber.child.memoizedState.tabsMeta.scrollLeft;

        const showRightScroll =
          this.props.context.theme.direction === 'rtl' ? scrollLeft > 0 : scrollWidth > clientWidth;

        this.setState({ isScroll: showRightScroll });
      } else if (this.tabs._reactInternalFiber.child.memoizedState.showLeftScroll && this.tabs._reactInternalFiber.child.memoizedState.showRightScroll) {
        this.setState({ isScroll: this.tabs._reactInternalFiber.child.memoizedState.showRightScroll });
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.value != nextProps.value) {
      this.setState({ value: nextProps.value });
    }
    if (this.state.tabItems != nextProps.tabItems) {
      this.setState({ tabItems: nextProps.tabItems });
    }
  }

  updateBTabBarDynamic(tabItems, value) {
    this.setState({ tabItems, value });
    this.forceUpdate();
  }

  handleChange = (event, value) => {
    // let tabIndex = this.state.tabItems.findIndex((currentValue, index, arr) => currentValue.value == value);
    // if (tabIndex >= 0) {
    //   this.setState({ value });
    // } else {
    //   let v = this.state.tabItems[this.state.tabItems.length - 1].value; // ? this.state.tabItems[tabIndex].value : this.state.tabItems[tabIndex-1].value;
    //   this.setState({ value: v });
    // }
    if (!this.isClosing) {
      this.setState({ value });
      this.props.onChange && this.props.onChange(event, value);
    }
    this.isClosing = false;
    // this.actions && this.actions.updateIndicator();
  };

  handleRightIconClick(value) {
    this.isClosing = true;
    // this.setState({ closeClicked: true });

    // this.debugLog('Kapatılmaya calısılan tab:');
    // this.debugLog(value);
    // var tabs: Object[] = this.state.tabItems;
    // let tabItemIndex = tabs.findIndex((currentValue, index, arr) => currentValue.value == value);
    // let tabItem = tabs.find((currentValue, index, arr) => currentValue.value == value);
    // this.debugLog(value);
    // let newTab;
    // tabs.splice(tabItemIndex, 1);
    // if (tabs.length > 0) {
    //   newTab = tabs[tabItemIndex] ? tabs[tabItemIndex] : tabs[tabItemIndex - 1];
    // }

    // this.setState({
    //   tabItems: tabs,
    //   value: value,
    // });

    const valueOfClosingTab = this.state.mouseOverItem ? this.state.mouseOverItem : value;
    this.props.onRightIconClick && this.props.onRightIconClick(valueOfClosingTab);
    // this.forceUpdate();
  }

  handleLeftIconClick(value) {
    this.props.handleLeftIconClick && this.props.handleLeftIconClick(value);
  }

  handleTabItemChange(value) {
    // this.setState({ value });
    this.props.onChange ? this.props.onChange(event, value) : this.setState({ value });
  }

  getLeftIconButton(isLeftIconButtonVisibile, item) {
    let leftIconButton;
    const iconColor = this.props.mode == 'primary' ? this.props.context.theme.boaPalette.comp500 : this.props.context.theme.boaPalette.pri500;

    const style = {
      paddingLeft: isLeftIconButtonVisibile == 'visible' ? '12px' : '0px',
      paddingRight: isLeftIconButtonVisibile == 'visible' ? '8px' : '0px',
      float: 'left',
      width: isLeftIconButtonVisibile == 'visible' ? '42px' : '24px',
      visibility: isLeftIconButtonVisibile,
    };

    if (this.props.leftIcon && typeof (this.props.leftIcon) === 'string') {
      leftIconButton = (
        <Button
          context={this.props.context}
          type="icon"
          style={style}
          dynamicIcon={item.leftIcon}
          iconProperties={{ nativeColor: iconColor }}
          onClick={this.handleLeftIconClick.bind(this, item.value)} />
      );
    } else if (this.props.leftIcon) {
      leftIconButton = this.props.leftIcon;
    } else {
      leftIconButton = (
        <Button
          context={this.props.context}
          type="icon"
          style={style}
          dynamicIcon={'Home'}
          iconProperties={{ nativeColor: iconColor }}
          onClick={this.handleLeftIconClick.bind(this, item.value)} />
      );
    }

    return leftIconButton;
  }

  getRightIconButton(isRightIconButtonVisibile, item) {
    const { classes } = this.props;
    let rightIconButton;
    const iconColor = this.props.mode == 'primary' ? this.props.context.theme.boaPalette.comp500 : this.props.context.theme.boaPalette.pri500;

    rightIconButton = this.props.rightIconButton ? this.props.rightIconButton : (
      <Button
        context={this.props.context}
        type="icon"
        style={{ float: 'right', width: '24px', height: '24px', marginTop: '12px', verticalAlign: 'middle', visibility: isRightIconButtonVisibile }}
        dynamicIcon={'Close'}
        iconProperties={{ nativeColor: iconColor, classes: { root: classes.iconRoot } }}
        onClick={this.handleRightIconClick.bind(this, item.value)} />
    );

    return rightIconButton;
  }

  getTabLabel(item) {
    const tabIndex = this.props.tabItems.findIndex((currentValue) => currentValue.value == item.value);
    let isRightIconButtonVisibile = 'hidden'; let
      isLeftIconButtonVisibile = 'hidden';
    if (tabIndex > 0) {
      isRightIconButtonVisibile = this.props.rightIconButtonVisibility && (this.props.value == item.value) || (this.state.mouseOverItem == item.value) ? 'visible' : 'hidden';
      // isRightIconButtonVisibile && this.setState({ selected: item.value });
    }
    if (this.props.leftIconButtonVisibility && item.leftIconVisibility) {
      isLeftIconButtonVisibile = 'visible';
    }

    const width = isLeftIconButtonVisibile == 'visible' ? 'calc(100% - 68px)' : 'calc(100% - 48px)';
    const title = Localization.stringUpperCase(item.text);
    const titleStyle = { margin: '0 auto !important', width, height: '48px', display: 'table-cell', verticalAlign: 'middle' };


    let leftIconButton; let
      rightIconButton;
    leftIconButton = this.getLeftIconButton(isLeftIconButtonVisibile, item);
    rightIconButton = this.getRightIconButton(isRightIconButtonVisibile, item);

    return (
      this.props.disableIcons
        ? (<div style={this.props.tabLabelStyle}>{title}</div>)
        : (<div
          style={{
            textAlign: 'center',
            height: '48px',
            direction: this.props.context.localization.isRightToLeft ? 'rtl' : 'ltr',
          }}>
          {leftIconButton}
          {rightIconButton}
          <div style={titleStyle}>
            <div style={{ display: '-webkit-box', webkitLineClamp: '2', webkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</div>
          </div>
        </div>)
    );
  }

  renderTabScrollButton() {
    if (this.props.TabScrollButton) return this.props.TabScrollButton();

    const showAllTabIcon = !this.props.context.localization.isRightToLeft ? <DoubleChevronRight context={this.props.context} style={{ nativeColor: this.props.context.theme.boaPalette.comp500 }} /> : <DoubleChevronLeft context={this.props.context} style={{ nativeColor: this.props.context.theme.boaPalette.comp500 }} />;
    const popoverTabs =
      this.props.tabItems.map((item, i) =>
        <ListItem
          key={i}
          context={this.props.context}
          primaryText={item.text}
          onClick={this.handleTabItemChange.bind(this, item.value)}
        />);

    const iconContainerStyle = this.props.containerType == 'page' ? { paddingTop: '12px' } : {};
    let iconStyle;
    const iconColor = this.props.mode == 'secondary' ? this.props.context.theme.boaPalette.pri500 : this.props.context.theme.boaPalette.comp500;
    iconStyle = Object.assign({}, iconStyle, { color: iconColor });
    return (
      <div style={iconContainerStyle}>
        <IconMenu
          ref={(r) => { this.showAllTaButton = r; }}
          context={this.props.context}
          iconType="custom"
          menuStyle={{ minWidth: '240px', maxWidth: '320px' }}
          customIcon={showAllTabIcon}
          menuItems={popoverTabs}
          iconStyle={iconStyle}
        />
      </div>
    );
  }

  getTabItems() {
    const { classes } = this.props;

    let tabStyle = this.props.containerType == 'page' ? { paddingTop: '12px', height: '60px' } : null;
    tabStyle = this.props.mode == 'secondary' ? Object.assign({}, tabStyle, this.props.style) : this.props.style;

    const tabItems = this.state.tabItems.map((item, i) => {
      return (
        <Tab
          className={this.props.className}
          key={i}
          disabled={item.disabled}
          icon={item.icon}
          value={item.value || i}
          label={this.getTabLabel(item)}
          classes={{
            root: this.props.mode == 'secondary' ? classes.secondary : classes.primary,
            labelContainer: classes.labelContainer,
          }}
          style={tabStyle}
        />
      );
    });
    return tabItems;
  }

  mouseOver(value) {
    // console.log("Mouse out!!!");
    this.setState({ mouseOverItem: value });
  }

  mouseOut() {
    // console.log("Mouse over!!!");
    this.setState({ mouseOverItem: null });
  }

  getTabContents() {
    const tabContents = this.props.tabItems.map((item, i) => {
      let style = {};
      if (this.state.value !== item.value) {
        style = { height: 0, overflow: 'hidden' };
      }
      style = Object.assign({}, this.props.tabTemplateStyle, style);
      return <div key={i} style={style}>{item.content}</div>;
    });
    return tabContents;
  }

  render() {
    const type = this.props.containerType ? this.props.containerType : 'default';
    switch (type) {
      case 'default':
        return this.renderDefault();
      case 'page':
        return this.renderPage();
      case 'card':
        return this.renderCard();
      case 'appbar':
        return this.renderAppBar();
      default:
        return this.renderDefault();
    }
  }

  getBorderBottomStyle() {
    if (this.props.mode == 'secondary') {
      return <style>
        {`
          .b-tab-bar > div > div > div { border-bottom: 1px solid #bdbdbd;}
        `}
      </style>;
    }
  }

  renderDefault() {
    const { classes } = this.props;
    const tabItems = this.getTabItems();

    const tabContents = this.getTabContents();

    let indicatorColor = this.props.indicatorColor;
    if (this.props.mode == 'secondary') {
      indicatorColor = this.props.context.theme.boaPalette.pri500;
    }

    return (
      <div ref={(el) => { this.tabsDiv = el; }}>
        <Tabs
          className={'b-tab-bar'}
          action={(actions) => this.actions = actions}
          ref={(t) => { this.tabs = t; }}
          onChange={this.handleChange}
          style={this.props.style}
          value={this.state.value}
          centered={this.state.isScroll ? false : this.props.centered}
          indicatorColor={indicatorColor}
          scrollable={this.state.isScroll ? this.props.scrollable : false}
          scrollButtons={this.props.scrollButtons}
          TabScrollButton={this.renderTabScrollButton.bind(this)}
          classes={{
            root: this.props.mode == 'primary' ? classes.primary : classes.secondary,
          }}
          isRightScrollActive={this.state.isScroll}>
          {tabItems}
        </Tabs>
        {!this.props.isContentDisabled && tabContents}
        {this.getBorderBottomStyle()}
      </div>);
  }

  renderPage() {
    const { classes } = this.props;
    const tabItems = this.getTabItems();

    const tabContents = this.getTabContents();

    let indicatorColor = this.props.indicatorColor;
    if (this.props.mode == 'secondary') {
      indicatorColor = this.props.context.theme.boaPalette.pri500;
    }
    const tabsStyle = Object.assign({}, this.props.style, { height: '60px' });

    return (
      <div ref={(el) => { this.tabsDiv = el; }}>
        <Tabs
          className={'b-tab-bar'}
          ref={(t) => { this.tabs = t; }}
          onChange={this.handleChange}
          style={tabsStyle}
          value={this.state.value}
          indicatorColor={indicatorColor}
          scrollable
          scrollButtons={this.props.scrollButtons}
          // TabScrollButton={this.renderTabScrollButton.bind(this)}
          classes={{
            root: this.props.mode == 'primary' ? classes.primary : classes.secondary,
          }}
          isRightScrollActive
          isLeftScrollActive>
          {tabItems}
        </Tabs>
        {!this.props.isContentDisabled && tabContents}
        {this.getBorderBottomStyle()}
      </div>);
  }

  renderCard() {
    const { classes } = this.props;
    const tabItems = this.getTabItems();

    const tabContents = this.getTabContents();

    let indicatorColor = this.props.indicatorColor;
    if (this.props.mode == 'secondary') {
      indicatorColor = this.props.context.theme.boaPalette.pri500;
    }

    return (
      <div ref={(el) => { this.tabsDiv = el; }}>
        <Tabs
          className={'b-tab-bar'}
          ref={(t) => { this.tabs = t; }}
          onChange={this.handleChange}
          style={this.props.style}
          value={this.state.value}
          centered={this.props.centered}
          indicatorColor={indicatorColor}
          scrollable
          scrollButtons={'auto'}
          classes={{
            root: this.props.mode == 'primary' ? classes.primary : classes.secondary,
          }}
          isRightScrollActive
          isLeftScrollActive>
          {tabItems}
        </Tabs>
        {!this.props.isContentDisabled && tabContents}
        {this.getBorderBottomStyle()}
      </div>);
  }

  getRightIconButtonForAppBar(isRightIconButtonVisibile, value) {
    const { classes } = this.props;
    let rightIconButton;
    const iconColor = this.props.mode == 'primary' ? this.props.context.theme.boaPalette.comp500 : this.props.context.theme.boaPalette.pri500;

    rightIconButton = this.props.rightIconButton ? this.props.rightIconButton : (
      <Button
        context={this.props.context}
        type="icon"
        style={{ float: 'right', width: '24px', height: '24px', marginTop: '12px', verticalAlign: 'middle', visibility: isRightIconButtonVisibile }}
        dynamicIcon={'Close'}
        iconProperties={{ nativeColor: iconColor, classes: { root: classes.iconRoot } }}
        onClick={this.handleRightIconClick.bind(this, value)} />
    );

    return rightIconButton;
  }

  getTabLabelForAppBar(item) {
    const tabIndex = this.props.tabItems.findIndex((currentValue) => currentValue.value == item.value);
    let isRightIconButtonVisibile = 'hidden'; let
      isLeftIconButtonVisibile = 'hidden';
    if (tabIndex > 0) {
      isRightIconButtonVisibile = this.props.rightIconButtonVisibility && (this.props.value == item.value) || (this.state.mouseOverItem == item.value) ? 'visible' : 'hidden';
      // isRightIconButtonVisibile && this.setState({ selected: item.value });
    }
    if (this.props.leftIconButtonVisibility && item.leftIconVisibility) {
      isLeftIconButtonVisibile = 'visible';
    }

    const width = isLeftIconButtonVisibile == 'visible' ? 'calc(100% - 68px)' : 'calc(100% - 48px)';
    const title = Localization.stringUpperCase(item.text);
    const titleStyle = { margin: '0 auto !important', width, height: '48px', display: 'table-cell', verticalAlign: 'middle' };


    let leftIconButton; let
      rightIconButton;
    leftIconButton = this.getLeftIconButton(isLeftIconButtonVisibile, item);
    rightIconButton = this.getRightIconButtonForAppBar(isRightIconButtonVisibile, item.value);

    return (
      <div
        style={{
          textAlign: 'center',
          height: '48px',
          direction: this.props.context.localization.isRightToLeft ? 'rtl' : 'ltr',
        }}>
        {leftIconButton}
        {rightIconButton}
        <div style={titleStyle}>
          <div style={{ display: '-webkit-box', webkitLineClamp: '2', webkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</div>
        </div>
      </div>);
  }

  renderAppBar() {
    const { classes } = this.props;

    const tabStyle = this.props.containerType == 'page' ? { paddingTop: '12px', height: '60px' } : null;

    const tabItems = this.props.tabItems.map((item, i) => {
      return (
        <Tab
          className={this.props.className}
          key={i}
          disabled={item.disabled}
          icon={item.icon}
          value={item.value || i}
          label={this.getTabLabelForAppBar(item)}
          classes={{
            root: this.props.mode == 'secondary' ? classes.secondary : classes.primary,
            labelContainer: classes.labelContainer,
          }}
          style={tabStyle}
          onMouseOut={() => this.mouseOut()}
          onMouseOver={() => this.mouseOver(item.value)} />
      );
    });

    const tabContents = this.props.tabItems.map((item, i) => {
      let style = {};
      if (this.props.value !== item.value) {
        style = { height: 0, overflow: 'hidden' };
      }
      style = Object.assign({}, this.props.tabTemplateStyle, style);
      return <div key={i} style={style}>{item.content}</div>;
    });

    let indicatorColor = this.props.indicatorColor;
    if (this.props.mode == 'secondary') {
      indicatorColor = this.props.context.theme.boaPalette.pri500;
    }

    return (
      <div ref={(el) => { this.tabsDiv = el; }}>
        <Tabs
          action={(actions) => this.actions = actions}
          ref={(t) => { this.tabs = t; }}
          onChange={this.handleChange}
          style={this.props.style}
          value={this.props.value}
          centered={this.props.centered}
          indicatorColor={indicatorColor}
          scrollable={this.state.isScroll && this.props.scrollable}
          scrollButtons={this.props.scrollButtons}
          TabScrollButton={this.renderTabScrollButton.bind(this)}
          classes={{
            root: this.props.mode == 'primary' ? classes.primary : classes.secondary,
          }}
          isRightScrollActive>
          {tabItems}
        </Tabs>
        {!this.props.isContentDisabled && tabContents}
      </div>);
  }
}

export default TabBar;
