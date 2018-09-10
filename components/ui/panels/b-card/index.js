import React from 'react';
import PropTypes from 'prop-types';
import {Card, CardMedia, CardContent, CardHeader } from '@material-ui/core';
import { BComponent } from 'b-component';
import { BComponentComposer } from 'b-component';
import { BGridSection } from 'b-grid-section';
import { BGridRow } from 'b-grid-row';
import { BCardHeader } from 'b-card-header';
import { BButton } from 'b-button';
import merge from 'lodash/merge';
import Collapse from '@material-ui/core/Collapse';
import { Delete, Create } from '@material-ui/icons';

@BComponentComposer
export class BCard extends BComponent {
  static propTypes = {
    /*
    * BComponentPropTypes
    */
    ...BComponent.PropTypes,
    /**
     * disable or not for child elements.
     */
    disabled: PropTypes.bool,
    /**
     * Padding of card content.
     */
    padding: PropTypes.number,
    /**
     * Column index in BCardSection.
     */
    column: PropTypes.number,
    /**
     * Can be used to render elements inside the Card.
     */
    children: PropTypes.node,
    /**
     * Override the inline-styles of the container element.
     */
    containerStyle: PropTypes.object,
    /**
     * If true, this card component is expandable. Can be set on any child of the `Card` component.
     */
    expandable: PropTypes.bool,
    /**
     * Whether this card is expanded.
     * If `true` or `false` the component is controlled.
     * if `null` the component is uncontrolled.
     */
    expanded: PropTypes.bool,
    /**
     * Whether this card is initially expanded.
     */
    initiallyExpanded: PropTypes.bool,
    /**
     * Callback function fired when the `expandable` state of the card has changed.
     *
     * @param {boolean} newExpandedState Represents the new `expanded` state of the card.
     */
    onExpandChange: PropTypes.func,
    /**
     * Override the inline-styles of the root element.
     */
    style: PropTypes.object,
    /**
     * Default behaviour on card, children are align in grid layout. This prop provides prevent it. Default False.
     */
    disableGridBehaviour: PropTypes.bool,
    /**
     * Alignment mode of cards; it provides multi-column, single-column and mobile modes for cards. Default ContentAlignMode.MULTI.
     */
    contentAlignMode: PropTypes.oneOf([1, 2, 3]),
    title: PropTypes.string,
    isTitleVisible: PropTypes.bool,
    
    actionList: PropTypes.array,
    headerContent: PropTypes.any,
    hasMedia: PropTypes.any,
    cardTitle: PropTypes.string,
    cardSubtitle: PropTypes.string,
    cardTitleElement: PropTypes.node,
    cardText: PropTypes.string,
    mediaImage: PropTypes.string,
    mediaOverlayTitle: PropTypes.string,
    mediaOverlaySubtitle: PropTypes.string,
    mobileSortOrder: PropTypes.number,
    titleContent: PropTypes.any,
    /*
    Works counter to showAddButton. If wanted to customize the button in card header, should use actionHeaderContent
    If showAddButton true, actionHeaderContent is ignored.
    */
    actionHeaderContent: PropTypes.any,
    isExpandableButtonVisible: PropTypes.bool,
    /**
     * Default false.
     * If true, shows Add button in card component. Also, if true actionHeaderContent is ignored .
     */
    showAddButton: PropTypes.bool,

    /**
     * If true, shows Delete button in card component. Default false
     */
    showDeleteButton: PropTypes.bool,
    /**
     * If true, shows Edit button in card component. Default false
     */
    showEditButton: PropTypes.bool,
    /**
     * If true, shows History button in card component. Default false
     */
    showHistoryButton: PropTypes.bool,
    /**
     * If true, shows disabled Add button in card component. Default false
     */
    addButtonDisabled: PropTypes.bool,
    /**
     * If true, shows disabled History button in card component. Default false
     */
    historyButtonDisabled: PropTypes.bool,
    /**
     * Callback function fired when the Add Button clicked.
     */
    onAddClicked: PropTypes.func,
    /**
     * Callback function fired when the Edit Button clicked.
     */
    onEditClicked: PropTypes.func,
    /**
     * Callback function fired when the Delete Button clicked.
     */
    onDeleteClicked: PropTypes.func,
    /**
     * Callback function fired when the History Button clicked.
     */
    onHistoryClicked: PropTypes.func,
    /*
    if null edit button will appear with icon.
    Else, it appears with editButtonText
    */
    editButtonText: PropTypes.string,
    onClickTitle: PropTypes.func,
    onClickCard: PropTypes.func,
    onMouseDownCard: PropTypes.func,
  };

  static defaultProps = {
    ...BComponent.defaultProps,
    disabled: false,
    expandable: false,
    expanded: true,
    initiallyExpanded: false,
    padding: 24,
    disableGridBehaviour: false,
    contentAlignMode: BComponent.ContentAlignMode.MULTI,
    title: '',
    isTitleVisible: true,
    actionList: null,
    onExpandChange: null,
    headerContent: null,
    hasMedia: false,
    cardTitle: '',
    cardTitleElement: null,
    cardText: '',
    mediaImage: null,
    titleContent: null,
    actionHeaderContent: null,
    isExpandableButtonVisible: true,
    showAddButton: false,
    showDeleteButton: false,
    showEditButton: false,
    showHistoryButton: false,  
  };

  constructor(props, context) {
    super(props, context);
    const {
      expandable,
      expanded,
      padding,
      disabled,
      title,
      isTitleVisible,
      actionList,
      headerContent,
      titleContent,
      actionHeaderContent,
      hasMedia,
      cardTitle,
      cardTitleElement,
      cardText,
      mediaImage
    } = props;
    this.state = {
      expandable: expandable,
      expanded: expanded,
      padding: padding,
      disabled: disabled,
      title: title,
      isTitleVisible: isTitleVisible,
      actionList: actionList,
      headerContent: headerContent,
      titleContent: titleContent,
      actionHeaderContent: actionHeaderContent,
      hasMedia: hasMedia,
      cardTitle: cardTitle,
      cardTitleElement: cardTitleElement,
      cardText: cardText,
      mediaImage: mediaImage,
      textStyle: {
        leftToRight: {
          paddingTop: '0px',
          paddingLeft: '0px',
          paddingRight: '0px',
          paddingBottom: '0px',
          marginbottom: '20px',
          titleColor: this.props.context.theme.boaPalette.base450,
          subtitleColor: this.props.context.theme.boaPalette.base250,
          fontWeight: 400
        },
        rightToLeft: {
          paddingTop: '0px',
          paddingLeft: '0px',
          paddingRight: '0px',
          paddingBottom: '0px',
          marginbottom: '20px',
          'text-align': 'right'
        },
        leftToRightAction: {
          paddingTop: '0px',
          paddingLeft: '0px',
          paddingRight: '0px',
          paddingBottom: '0px',
          marginbottom: '20px',
          titleColor: this.props.context.theme.boaPalette.base450,
          subtitleColor: this.props.context.theme.boaPalette.base250,
          fontWeight: 400
        }
      }
    };
    this.onExpandChange = this.onExpandChange.bind(this);
    this.handleOnAddClicked = this.handleOnAddClicked.bind(this);
    this.handleOnDeleteClicked = this.handleOnDeleteClicked.bind(this);
    this.handleOnEditClicked = this.handleOnEditClicked.bind(this);
    this.handleOnHistoryClicked = this.handleOnHistoryClicked.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    super.componentWillReceiveProps(nextProps);
    const {
      expandable,
      expanded,
      padding,
      disabled,
      title,
      isTitleVisible,
      actionList,
      headerContent,
      titleContent,
      actionHeaderContent,
      hasMedia,
      cardTitle,
      cardText,
      mediaImage,
      cardTitleElement
    } = nextProps;
    this.setState({
      expandable: expandable,
      expanded: expanded,
      padding: padding,
      disabled: disabled,
      title: title,
      isTitleVisible: isTitleVisible,
      actionList: actionList,
      headerContent: headerContent,
      titleContent: titleContent,
      actionHeaderContent: actionHeaderContent,
      hasMedia: hasMedia,
      cardTitle: cardTitle,
      cardTitleElement: cardTitleElement,
      cardText: cardText,
      mediaImage: mediaImage
    });
  }

  setDisable(value) {
    this.setState({ disabled: value });
  }

  /**
   * Handle function fired when add button is clicked
   * @param {any} e
   */
  handleOnAddClicked() {
    if (this.props.onAddClicked) {
      this.props.onAddClicked();
    }
  }

  /**
   * Handle function fired when delete button is clicked
   * @param {any} e
   */
  handleOnDeleteClicked() {
    if (this.props.onDeleteClicked) {
      this.props.onDeleteClicked();
      // let selectedItem = this.getValue();
      // this.props.onDeleteClicked(selectedItem.index, selectedItem.item);
    }
  }

  /**
   * Handle function fired when edit button is clicked
   * @param {any} e
   */
  handleOnEditClicked() {
    if (this.props.onEditClicked) {
      this.props.onEditClicked();
      /* let selectedItem = this.getValue();
      this.props.onEditClicked(selectedItem.index, selectedItem.item); */
    }
  }

  /**
   * Handle function fired when history button is clicked
   * @param {any} e
   */
  handleOnHistoryClicked() {
    if (this.props.onHistoryClicked) {
      this.props.onHistoryClicked();
      /* let selectedItem = this.getValue();
      this.props.onHistoryClicked(selectedItem && selectedItem.index, selectedItem && selectedItem.item); */
    }
  }

  render() {
    const _children = this.getChildren();

    var headerChild = null;
    var hasHeader =
      this.state.expandable ||
      this.state.headerContent ||
      this.state.titleContent ||
      this.state.actionHeaderContent ||
      this.props.showAddButton ||
      (this.state.title && this.state.isTitleVisible) ||
      (this.state.actionList && this.state.actionList.length > 0);

    if (hasHeader) {
      headerChild = this.renderHeader();
    }

    var mediaChild = null;
    var titleChild = null;
    var textChild = null;
    if (this.props.hasMedia) {
      mediaChild = this.renderMedia();
      titleChild = this.renderTitle();
      textChild = this.renderText();
    }

    let content = null;
    /* Card default behaviour. */
    if (this.props.disableGridBehaviour) {
      const children = _children[0].value;

      // let renderingChildren = children;
      // if (this.props.showAddButton || this.props.showHistoryButton || this.props.showEditButton || this.props.showDeleteButton)
      //   renderingChildren = merge(renderingChildren, this.renderActionPanel());

      content = this.state.expandable ? (
        <Collapse context={this.props.context} in={this.state.expanded} timeout="auto">
          {children}
          {actionButtonsIncluded && this.renderActionPanel()}
        </Collapse>
      ) : (
        <div>
          {children}
          {actionButtonsIncluded && this.renderActionPanel()}
        </div>
      );

      return (
        <Card 
          onMouseDown={this.props.onMouseDownCard}
          onClick={this.props.onClickCard}
          context={this.props.context}
          containerStyle={this.props.containerStyle}
          style={this.props.style}
          expandable={this.state.expandable}
          expanded={this.state.expanded}
          initiallyExpanded={this.props.initiallyExpanded}
          onClick={this.props.onCardClick}
        >
          {headerChild}
          {content}
        </Card>
      );
    }

    // Burada api market card bileşeni yazılacak
    else if (this.props.hasMedia) {
      // let contentStyle = { padding: this.props.padding, paddingTop: hasHeader ? 0 : this.props.padding };
      // const renderChildren = this.getRowsByChildren(_children);
      content = this.state.expandable ? (
        <Collapse context={this.props.context} in={this.state.expanded} timeout="auto">
          {textChild}
        </Collapse>
      ) : (
        { textChild }
      );

      return (
        <Card 
          onMouseDown={this.props.onMouseDownCard}
          onClick={this.props.onClickCard}
          context={this.props.context}
          containerStyle={this.props.containerStyle}
          style={this.props.style}
          expandable={this.state.expandable}
          expanded={this.state.expanded}
          initiallyExpanded={this.props.initiallyExpanded}
        >
          {mediaChild}
          {titleChild}
          {textChild}
        </Card>
      );
    }

    const renderChildren = this.getRowsByChildren(_children);
    var actionButtonsIncluded: boolean =
      this.props.showAddButton || this.props.showHistoryButton || this.props.showEditButton || this.props.showDeleteButton;

    let style = this.props.context.localization.isRightToLeft
      ? merge({}, this.state.textStyle.leftToRight, this.state.textStyle.rightToLeft)
      : actionButtonsIncluded
        ? this.state.textStyle.leftToRightAction
        : this.state.textStyle.leftToRight;

    if (this.props.style) style = { ...style, ...this.props.style };

    // let renderingChildren = renderChildren;
    // if (actionButtonsIncluded)
    //   renderingChildren = merge(renderingChildren, this.renderActionPanel());

    // padding from top and bottom is removed in case header and footer is available respectively.
    let cardContentStyle = {
      paddingTop: 12,
      paddingBottom: 12
    };
    if (hasHeader) Object.assign(cardContentStyle, { paddingTop: 0 });
    if (actionButtonsIncluded) Object.assign(cardContentStyle, { paddingBottom: 0 });

    if (this.props.style) {
      let s = this.props.style;
      cardContentStyle.padding = s.padding ? 0 : cardContentStyle.padding;
      cardContentStyle.paddingLeft = s.paddingLeft ? 0 : cardContentStyle.paddingLeft;
      cardContentStyle.paddingRight = s.paddingRight ? 0 : cardContentStyle.paddingRight;
      cardContentStyle.paddingTop = s.paddingTop ? 0 : cardContentStyle.paddingTop;
      cardContentStyle.paddingBottom = s.paddingBottom ? 0 : cardContentStyle.paddingBottom;
      if (cardContentStyle.padding === undefined) {
        delete cardContentStyle.padding;
      }
    }

    content = this.state.expandable ? (
      <Collapse context={this.props.context} in={this.state.expanded} timeout="auto">
        <CardContent context={this.props.context} style={cardContentStyle}>
          <BGridSection context={this.props.context} disabled={this.state.disabled} contentAlignMode={this.props.contentAlignMode}>
            {renderChildren}
          </BGridSection>
        </CardContent>
        {actionButtonsIncluded && this.renderActionPanel()}
      </Collapse>
    ) : (
      <div /* style={style} */ expandable={this.state.expandable}>
        <CardContent context={this.props.context} style={cardContentStyle}>
          <BGridSection context={this.props.context} disabled={this.state.disabled} contentAlignMode={this.props.contentAlignMode}>
            {renderChildren}
          </BGridSection>
        </CardContent>
        {actionButtonsIncluded && this.renderActionPanel()}
      </div>
    );

    return (
      <Card 
        onMouseDown={this.props.onMouseDownCard}
        onClick={this.props.onClickCard}
        style={style}
        context={this.props.context}
        expandable={this.state.expandable}
        expanded={this.state.expanded}
        initiallyExpanded={this.props.initiallyExpanded}
      >
        {headerChild}
        {content}
      </Card>
    );
  }

  renderHeader() { 
    return !this.state.expanded ? (
      <BCardHeader
        context={this.props.context}
        title={this.state.title}
        onClickTitle={this.props.onClickTitle}
        style={this.props.titleStyle}
        isTitleVisible={this.state.isTitleVisible}
        onExpandChange={this.onExpandChange}
        isExpandable={this.state.expandable}
        isExpanded={this.state.expanded}
        actionList={this.state.actionList}
        headerContent={this.state.headerContent}
        titleContent={this.state.titleContent}
        actionHeaderContent={
          this.props.showAddButton ? (
            <BButton
              context={this.props.context}
              type="flat"
              text={this.props.addButtonText || this.getMessage('BusinessComponents', 'Add')}
              colorType="primary"
              disabled={this.props.addButtonDisabled}
              iconProperties={{
                marginRight: '8px',
                marginLeft: '8px',
                minWidth: '24px',
                color: this.props.context.theme.boaPalette.pri500
              }}
              style={{ marginRight: '8px', marginLeft: '8px', minWidth: '24px', color: this.props.context.theme.boaPalette.pri500 }}
              onClick={this.handleOnAddClicked}
            />
          ) : (
            this.state.actionHeaderContent
          )
        }
        isExpandableButtonVisible={this.props.isExpandableButtonVisible}
      />
    ) : (
      <BCardHeader
        context={this.props.context}
        title={this.state.title}
        onClickTitle={this.props.onClickTitle}
        style={this.props.titleStyle}
        isTitleVisible={this.state.isTitleVisible}
        onExpandChange={this.onExpandChange}
        isExpandable={this.state.expandable}
        isExpanded={this.state.expanded}
        actionList={this.state.actionList}
        headerContent={this.state.headerContent}
        titleContent={this.state.titleContent}
        actionHeaderContent={this.props.showAddButton ? null : this.state.actionHeaderContent}
        isExpandableButtonVisible={this.props.isExpandableButtonVisible}
      />
    );
  }

  renderMedia() {
    return (
      <CardMedia
        context={this.props.context}
        overlay={
          this.props.mediaOverlayTitle ? (
            <CardHeader context={this.props.context} title={this.props.mediaOverlayTitle} subheader={this.props.mediaOverlaySubtitle} />
          ) : null
        }
      >
        <img src={this.props.mediaImage} alt="" />
      </CardMedia>
    );
  }

  renderTitle() {
    return (
      <CardHeader
        context={this.props.context}
        title={this.props.cardTitle}
        subheader={this.props.cardSubtitle}
        style={{ padding: '24px 24px 0px' }}
      >
        {this.props.cardTitleElement}
      </CardHeader>
    );
  }

  renderText() {
    const textStyle = {
      leftToRight: {
        padding: '12px 24px 12px',
        titleColor: this.props.context.theme.boaPalette.base350,
        subtitleColor: this.props.context.theme.boaPalette.base250,
        fontWeight: 400
      },
      rightToLeft: {
        padding: '12px 24px 12px',
        'text-align': 'right'
      }
    };

    let style = this.props.context.localization.isRightToLeft
      ? merge({}, textStyle.leftToRight, textStyle.rightToLeft)
      : textStyle.leftToRight;

    return (
      <CardContent style={style} context={this.props.context}>
        {this.props.cardText}
      </CardContent>
    );
  }

  renderActionPanel() {
    let context = this.props.context;
    let actionPanelStyle = Object.assign(
      { minHeight: 52, paddingLeft: 16, paddingRight: 16 },
      this.props.context.deviceSize < BComponent.Sizes.MEDIUM ? { paddingLeft: 8, paddingRight: 8 } : {}
    );

    return (
      <div style={actionPanelStyle}>
        {this.props.showHistoryButton && (
          <div className="historyButtonWrap" style={{ float: 'left', lineHeight: '48px' }}>
            <BButton
              context={context}
              type="flat"
              text={this.props.historyButtonText || this.getMessage('BOA', 'History')}
              colorType="primary"
              disabled={this.props.historyButtonDisabled}
              onClick={this.handleOnHistoryClicked}
              iconStyle={{ width: '24px', height: '24px' }}
              iconProperties={{ minWidth: '24px', width: '24px', height: '24px' }}
              style={{ minWidth: '70px', width: '70px', verticalAlign: 'middle', color: this.props.context.theme.boaPalette.pri500 }}
            />
          </div>
        )}
        <div className="actionButtonWrap" style={{ float: 'right', display: 'inline-block' }}>
          {/* // Yukardaki ekle butonu ile bunu aynı çalışacak şekilde yapmalı.  */}
          {this.props.showAddButton &&
            (this.props.actionHeaderContent && this.state.expanded) && (
              <BButton
                context={context}
                type="flat"
                text={this.props.addButtonText || this.getMessage('BusinessComponents', 'Add')}
                colorType="primary"
                disabled={this.props.addButtonDisabled}
                fullWidth={false}
                style={{
                  minWidth: '70px',
                  marginLeft: '2px',
                  width: '70px',
                  verticalAlign: 'middle',
                  color: this.props.context.theme.boaPalette.pri500
                }}
                onClick={this.handleOnAddClicked}
              />
            )}
          {this.props.showDeleteButton && (
            <BButton
              context={context}
              type="icon"
              fullWidth={false}
              icon={<Delete />}
              disabled={this.state.disabledDeleteAction}
              onClick={this.handleOnDeleteClicked}
              style={{
                minWidth: '24px',
                width: '48px',
                marginLeft: '2px',
                verticalAlign: 'middle',
                color: this.props.context.theme.boaPalette.pri500
              }}
            />
          )}
          {this.props.showEditButton && (
            <BButton
              context={context}
              type={this.props.editButtonText ? 'flat' : 'icon'}
              fullWidth={false}
              icon={this.props.editButtonText ? undefined : <Create />}
              disabled={this.state.disabledEditAction}
              text={this.props.editButtonText ? this.props.editButtonText : undefined}
              onClick={this.handleOnEditClicked}
              style={{
                marginLeft: '2px',
                minWidth: '24px',
                width: this.props.editButtonText ? '70px' : '48px',
                verticalAlign: 'middle',
                color: this.props.context.theme.boaPalette.pri500
              }}
            />
          )}
        </div>
      </div>
    );
  }

  getRowsByChildren(children) {
    var visibleChildren = [];
    children.forEach(child => {
      if (child.value) {
        if (child.value.length != 1 || (child.value.length == 1 && child.value[0].props.isVisible != false)) {
          visibleChildren.push(child);
        }
      }
    });

    return visibleChildren.map((child, index) => {
      return (
        <BGridRow
          context={this.props.context}
          key={index}
          columnCount={4 - child.key}
          disabled={this.state.disabled}
          contentAlignMode={this.props.contentAlignMode}
        >
          {child.value}
        </BGridRow>
      );
    });
  }

  getChildren() {
    const childArray = [];
    if (this.props.children) {
      let _childArray = [];
      let tempArray = BComponent.Utils.getCardChildren(this.props.children, this.state.disabled);
      if (this.state.expandable) {
        for (var index = 0; index < tempArray.length; index++) {
          var element = tempArray[index];
          var newProps = { expandable: true };
          var newChild = React.cloneElement(element, newProps);
          _childArray.push(newChild);
        }
      } else {
        _childArray = tempArray;
      }
      React.Children.forEach(_childArray, child => {
        this.addChildren(childArray, child);
      });
    }
    return childArray;
  }

  addChildren(childArray, child) {
    let lastIndex = childArray.length - 1;
    if (childArray.length == 0 || child.props.newLine) {
      childArray.push(this.getNewChildItem(child));
    } else if (childArray[lastIndex].key == child.props.size && childArray[lastIndex].key != undefined) {
      switch (child.props.size) {
        case BComponent.ComponentSize.SMALL:
          if (childArray[lastIndex].value.length < 3) childArray[lastIndex].value.push(child);
          else {
            childArray.push(this.getNewChildItem(child));
          }
          break;
        case BComponent.ComponentSize.MEDIUM:
          if (childArray[lastIndex].value.length < 2) childArray[lastIndex].value.push(child);
          else {
            childArray.push(this.getNewChildItem(child));
          }
          break;
        case BComponent.ComponentSize.LARGE:
          childArray.push(this.getNewChildItem(child));
          break;
        default:
          return;
      }
    } else {
      childArray.push(this.getNewChildItem(child));
    }
  }

  getNewChildItem(child) {
    return { key: child.props.size, value: [child] };
  }

  onExpandChange() {
    let expanded = !this.state.expanded;
    this.setState(prevState => {
      expanded = !prevState.expanded;
      return { expanded: expanded };
    });

    this.props.onExpandChange && this.props.onExpandChange(expanded);
  }
}

export default BCard;
