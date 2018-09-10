import React from 'react';
import PropTypes from 'prop-types';
import Truncate from './Truncate';
import { BComponent, BComponentComposer } from 'b-component';

@BComponentComposer
export class BMoreText extends BComponent {
  static propTypes = {
    text: PropTypes.string.isRequired,
    lines: PropTypes.number.isRequired,
    moreText: PropTypes.string,
    lessText: PropTypes.string,
    style: PropTypes.object,
    trimWhitespace: PropTypes.bool
  };

  static defaultProps = {
    lines: 3,
    moreText: null,
    lessText: null,
    trimWhitespace: false
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      expanded: false,
      truncated: false
    };

    this.handleTruncate = this.handleTruncate.bind(this);
    this.toggleLines = this.toggleLines.bind(this);
  }

  handleTruncate(truncated) {
    if (this.state.truncated !== truncated) {
      this.setState({
        truncated
      });
    }
  }

  toggleLines(event) {
    event.preventDefault();

    this.setState({
      expanded: !this.state.expanded
    });
  }

  render() {
    const { moreText, lessText, lines, style, context } = this.props;
    const { expanded, truncated } = this.state;

    let isRightToLeft = context.localization.isRightToLeft;

    let styleDiv;
    if (!isRightToLeft) {
      styleDiv = { textAlign: 'left' };
    } else {
      styleDiv = { textAlign: 'right' };
    }

    return (
      <div style={Object.assign(styleDiv, style)}>
        <Truncate
          isRightToLeft={isRightToLeft}
          lines={!expanded && lines}
          ellipsis={
            <span>
              ...
              <a href="#" onClick={this.toggleLines}>
                {moreText || this.getMessage('BusinessComponents', 'MuchMore')}
              </a>
            </span>
          }
          onTruncate={this.handleTruncate}
        >
          {this.props.text}
        </Truncate>
        {!truncated &&
          expanded && (
            <span>
              {' '}
              <a href="#" onClick={this.toggleLines}>
                {lessText || this.getMessage('BusinessComponents', 'Lesser')}
              </a>
            </span>
          )}
      </div>
    );
  }
}

export default BMoreText;
