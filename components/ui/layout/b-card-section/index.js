import React from 'react'; import PropTypes from 'prop-types';
import { BComponent, BComponentComposer } from 'b-component';

@BComponentComposer
export class BCardSection extends BComponent {

  static propTypes = {
    ...BComponent.propTypes,
    /**
     * disable or not for child elements.
     */
    disabled: PropTypes.bool,
    /**
     * Padding for per card element.
     */
    cardPadding: PropTypes.number,
    /**
     * Padding for all section.
     */
    cardSectionPadding: PropTypes.number,
    /**
     * Max width for full scattered card panel.
     */
    thresholdWidth: PropTypes.number,
    /**
     * Max column count for full scattered card panel.
     */
    thresholdColumnCount: PropTypes.number,
    /**
     * Alignment mode of cards; it provides multi-column, single-column and mobile modes for cards. Default ContentAlignMode.MULTI.
     */
    contentAlignMode: PropTypes.oneOf([1, 2, 3]),
    disableCardWidth: PropTypes.bool,
    cellStyles: PropTypes.array,
    enableSortOnMobile: PropTypes.bool
  };

  static defaultProps = {
    ...BComponent.defaultProps,
    disabled: false,
    cardPadding: 12,
    cardSectionPadding: 12,
    thresholdWidth: 1024,
    thresholdColumnCount: 2,
    contentAlignMode: BComponent.ContentAlignMode.MULTI,
    disableCardWidth: false,
    enableSortOnMobile: false
  };

  constructor(props, context) {
    super(props, context);
    this.state = { disabled: props.disabled };
  }

  componentWillReceiveProps(nextProps) {
    super.componentWillReceiveProps(nextProps);
    if (nextProps.disabled !== this.props.disabled) {
      this.setState({ disabled: nextProps.disabled });
    }
  }

  setDisable(value) {
    this.setState({ disabled: value });
  }

  isSingleColumn() {
    return this.props.contentAlignMode == BComponent.ContentAlignMode.MOBILE || this.props.contentAlignMode == BComponent.ContentAlignMode.SINGLE || this.props.thresholdColumnCount == 1;
  }

  isMobileMode() {
    return this.props.contentAlignMode == BComponent.ContentAlignMode.MOBILE;
  }

  getTableStyle() {
    const isMobileMod = this.isMobileMode();
    return {
      display: 'inline-table',
      border: 'none',
      paddingLeft: isMobileMod ? 0 : this.props.cardSectionPadding,
      paddingTop: this.props.cardSectionPadding,
      paddingRight: isMobileMod ? 0 : this.props.cardSectionPadding,
      paddingBottom: this.props.cardSectionPadding,
      float: !this.props.context.localization.isRightToLeft ? 'left' : 'right'
    };
  }

  getRowStyle() {
    return {
      display: 'table-row'
    };
  }

  getCellStyle() {
    return {
      display: 'table-cell',
      verticalAlign: 'top'
    };
  }

  getCellStyles() {
    if (this.props.thresholdColumnCount == 3 && this.props.cellStyles) {
      return [
        Object.assign(this.props.cellStyles[0] ? this.props.cellStyles[0] : {}, { display: 'table-cell', verticalAlign: 'top' }),
        Object.assign(this.props.cellStyles[1] ? this.props.cellStyles[1] : {}, { display: 'table-cell', verticalAlign: 'top' }),
        Object.assign(this.props.cellStyles[2] ? this.props.cellStyles[2] : {}, { display: 'table-cell', verticalAlign: 'top' }),
      ];
    } else {
      return [{ display: 'table-cell', verticalAlign: 'top' },
      { display: 'table-cell', verticalAlign: 'top' },
      { display: 'table-cell', verticalAlign: 'top' }];
    }
  }

  getCardStyle(isFirstItem) {
    const isMobileMod = this.isMobileMode();
    return {
      display: isFirstItem ? 'inline-block' : 'block',
      paddingLeft: isMobileMod ? 0 : this.props.cardPadding,
      paddingTop: isMobileMod ? 6 : this.props.cardPadding,
      paddingRight: isMobileMod ? 0 : this.props.cardPadding,
      paddingBottom: isMobileMod ? 6 : this.props.cardPadding
    };
  }

  parseChildren() {
    const allCards = this.props.children;
    var leftCards = [];
    var rightCards = [];
    var middleCards = [];
    var itemKeys = 0;

    React.Children.forEach(allCards, (cardItem) => {
      if (cardItem) {
        itemKeys = itemKeys + 1;
        const card = React.cloneElement(
          cardItem,
          {
            key: + '_BCardSectionItem' + itemKeys,
            disabled: this.state.disabled,
            contentAlignMode: this.props.contentAlignMode
          });
        // if (card.type && (card.type.name !== 'BComponentComposer(BCard)' && card.type.name !== 'DragDropContainer'))
        //   throw 'Children must be type of BCard.';
        // else {

        // TODO: Composer sonrası BCard yerine IIBComponent geliyor. Type check düşünülecek.
        if (this.props.thresholdColumnCount == 3) {
          if (!card.props.column || card.props.column == 0)
            !this.props.context.localization.isRightToLeft ? leftCards.push(card) : rightCards.push(card);
          else if (card.props.column == 1)
            middleCards.push(card);
          else if (card.props.column == 2)
            !this.props.context.localization.isRightToLeft ? rightCards.push(card) : leftCards.push(card);
        }
        else {
          if (!card.props.column || card.props.column == 0)
            !this.props.context.localization.isRightToLeft ? leftCards.push(card) : rightCards.push(card);
          else
            !this.props.context.localization.isRightToLeft ? rightCards.push(card) : leftCards.push(card);
        }
        // }
      }
    });

    return { leftCards: leftCards, rightCards: rightCards, middleCards: middleCards };
  }

  createSection(section) {
    // Her threshold için yanyana iki card kabul ediliyor.
    // Her card için maxWidth, section'un sağ+sol marginleri çıkarılarak bulunuyor.
    // Örn: thresholdWidth: 1024, cardSectionPadding:12 => cardMaxWidth: 500
    let isMobileMode = this.isMobileMode();
    var cardMaxWidth = (this.props.thresholdWidth - (this.props.cardSectionPadding * 2)) / this.props.thresholdColumnCount;

    return section.map((item, index) => {
      let cardStyle = this.getCardStyle(index == 0);
      if (!isMobileMode && !this.props.disableCardWidth) {
        cardStyle.maxWidth = cardMaxWidth;
      }
      cardStyle.width = isMobileMode || this.props.disableCardWidth ? '100%' : cardMaxWidth;

      // eğer %100 gibi relative bir uzunluk verilmişse bunu bozan diğer uzunluk değerlerini kaldıralım

      if (cardStyle.width == '100%') {
        delete cardStyle.maxWidth;
      }
      return (<div key={index} style={cardStyle}>{item}</div>);
    });
  }

  render() {
    const isSingleColumn = this.isSingleColumn();
    const cards = this.parseChildren();
    const tableStyle = this.getTableStyle();
    const rowStyle = this.getRowStyle();
    const cellStyle = this.getCellStyle();
    const cellStyles = this.getCellStyles();
    const { isRightToLeft } = this.props.context.localization;

    if (isSingleColumn) {
      if (isRightToLeft) {
        if (this.props.thresholdColumnCount == 3)
          cards.rightCards = cards.rightCards.concat(cards.middleCards);
        cards.rightCards = cards.rightCards.concat(cards.leftCards);
      } else {
        if (this.props.thresholdColumnCount == 3)
          cards.leftCards = cards.leftCards.concat(cards.middleCards);
        cards.leftCards = cards.leftCards.concat(cards.rightCards);
      }
      if (this.props.enableSortOnMobile) {
        cards.leftCards.sort((a, b) => a.props.mobileSortOrder - b.props.mobileSortOrder);
        cards.rightCards.sort((a, b) => a.props.mobileSortOrder - b.props.mobileSortOrder);
        // cards.leftCards.sort((a, b) => a.props.mobileSortOrder > b.props.mobileSortOrder);
        // cards.rightCards.sort((a, b) => a.props.mobileSortOrder > b.props.mobileSortOrder);
      }
    }
    if (isSingleColumn) {
      return (
        <div style={tableStyle}>
          <div style={rowStyle}>
            <div style={cellStyle}>
              {this.createSection(isRightToLeft ? cards.rightCards : cards.leftCards)}
            </div>
          </div>
        </div>
      );
    }
    else if (this.props.thresholdColumnCount == 2) {
      return (
        <div style={tableStyle}>
          <div style={rowStyle}>
            <div style={cellStyle}>
              {this.createSection(cards.leftCards)}
            </div>
            <div style={cellStyle}>
              {this.createSection(cards.rightCards)}
            </div>
          </div>
        </div>
      );
    }
    else if (this.props.thresholdColumnCount == 3) {
      return (
        <div style={tableStyle}>
          <div style={rowStyle}>
            <div style={cellStyles[0]}>
              {this.createSection(cards.leftCards)}
            </div>
            <div style={cellStyles[1]}>
              {this.createSection(cards.middleCards)}
            </div>
            <div style={cellStyles[2]}>
              {this.createSection(cards.rightCards)}
            </div>
          </div>
        </div>
      );
    }
  }
}

export default BCardSection;
