/* eslint-disable
  jsx-a11y/click-events-have-key-events,
  jsx-a11y/tabindex-no-positive,
  jsx-a11y/no-static-element-interactions
*/
import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';
import TextField from '@material-ui/core/TextField';
import Add from '@material-ui/icons/Add';
import Remove from '@material-ui/icons/Remove';
import { ComponentBase } from '@boa/base';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

const Loading = (props) => {
  return (
    <div style={props.style}>
      loading...
    </div>
  );
};

const toggleStyle = {
  color: 'gray',
  display: 'inline-block',
  float: 'left',
};

Loading.propTypes = {
  style: PropTypes.object,
};

const Toggle = (props) => {
  const style = props.style;
  const height = style.height;
  const width = style.width;
  const midHeight = height * 0.5;
  let points = `0,0 0,${height} ${width},${midHeight}`;
  let styleBase = style.base;
  let styleWrapper = style.wrapper;
  if (props.isRightToLeft) {
    styleBase = style.baseRight;
    styleWrapper = style.wrapperRight;
    points = `0,${midHeight} ${width},${height} ${width},0 `;
  }
  return (
    <div style={styleBase}>
      <div style={styleWrapper}>
        <svg height={height} width={width}>
          <polygon
            points={points}
            style={style.arrow}
          />
        </svg>
      </div>
    </div>
  );
};

Toggle.propTypes = {
  isRightToLeft: PropTypes.bool,
  style: PropTypes.object,
};

const styles = () => ({
  container: {
  },
  textField: {
    textAlign: 'center',
    fontSize: '14px',
    height: 21,
    minWidth: '1px',
  },
  menu: {
  },
  numberPadding: { paddingLeft: 16 },
});

@withStyles(styles)
class Header extends ComponentBase {
  static propTypes = {
    ...ComponentBase.propTypes,
    classes: PropTypes.object.isRequired,
    column1: PropTypes.string,
    column2: PropTypes.string,
    column3: PropTypes.string,
    column4: PropTypes.string,
    isRightToLeft: PropTypes.bool,
    onChange: PropTypes.func,
    style: PropTypes.object,
  };

  static defaultProps = {
    ...ComponentBase.defaultProps,
  }

  onTextChanged() {
    this.props.onChange(this);
  }

  render() {
    const nodeStyle = {
      fontWeight: 'normal',
      lineHeight: '21px',
      verticalAlign: 'middle',
      fontSize: '14px',
      width: 'calc(100% + 20px)',
      display: 'flex',
      height: 34,
    };
    const nodeDarkStyle = {
      background: '#FEF9E7',
      color: '#737373',
      fontWeight: 'bold',
      lineHeight: '21px',
      verticalAlign: 'middle',
      fontSize: '14px',
      width: '100%',
      display: 'flex',
      height: 34,
    };

    const inputFrameStyle = {
      display: 'inline-block',
      float: 'right',
      borderLeft: `1px solid ${this.props.context.theme.boaPalette.base200}`,
      borderRight: `1px solid ${this.props.context.theme.boaPalette.base200}`,
      fontSize: '14px',
    };

    const headerInputFrameStyle = {
      display: 'inline-block',
      float: 'right',
      borderLeft: `1px solid ${this.props.context.theme.boaPalette.base200}`,
      borderRight: `1px solid ${this.props.context.theme.boaPalette.base200}`,
      fontSize: '14px',
    };

    const inputinStyle = {
      width: '101px',
      cursor: 'text',
      fontSize: '14px',
      textAlign: 'center',
      minWidth: '1px',
    };

    // ihtiyac olması durumunda daha sonra  dinamik array yapısına  çevrilecek
    const style = this.props.style;
    const styleFontable = this.props.node.children ? nodeDarkStyle : nodeStyle;
    const styleFrame = this.props.node.children ? headerInputFrameStyle : inputFrameStyle;
    const inputClass = classNames(
      this.props.classes.textField,
      {
        [this.props.classes.numberPadding]: this.props.node.type === 'number',
      });

    const treeNode =
      <div style={styleFontable}>
        <div
          ref="clickable"
          onClick={this.props.onClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            flex: 1,
            fontSize: '14px',
            paddingLeft: '10px',
            paddingRight: '10px',
          }}>
          {this.props.node.name}
        </div>

        <div style={styleFrame}>
          <TextField
            style={inputinStyle}
            value={this.props.node.column1}
            disabled={!this.props.node.editableColumn1}
            maxLenght={this.props.node.columnsMaxLenght}
            type={this.props.node.type ? this.props.node.type : 'text'}
            onChange={(value) => {
              if (!this.props.node.children) {
                if (this.props.node.type === 'number') {
                  this.props.node.column1 = value.target.valueAsNumber;
                } else {
                  this.props.node.column1 = value.target.value;
                }
                this.setState({ node: Object.assign({}, this.props.node) });
                if (this.props.onChange) {
                  this.props.onChange(this.props.name, this.props.node);
                }
              }
            }}
            InputProps={{
              tabIndex: '1',
              classes: {
                input: inputClass,
              },
            }}
          />
        </div>

        <div style={styleFrame}>
          <TextField
            style={inputinStyle}
            tabIndex="2"
            value={this.props.node.column2}
            type={this.props.node.type ? this.props.node.type : 'text'}
            disabled={!this.props.node.editableColumn2}
            maxLenght={this.props.node.columnsMaxLenght}
            onChange={(value) => {
              if (!this.props.node.children) {
                if (this.props.node.type === 'number') {
                  this.props.node.column2 = value.target.valueAsNumber;
                } else {
                  this.props.node.column2 = value.target.value;
                }
                this.setState({ node: Object.assign({}, this.props.node) });
                if (this.props.onChange) {
                  this.props.onChange(this.props.name, this.props.node);
                }
              }
            }}
            InputProps={{
              classes: {
                input: inputClass,
              },
              tabIndex: '2',
            }
            }
          />
        </div>

        <div style={styleFrame}>
          <TextField
            style={inputinStyle}
            value={this.props.node.column3}
            type={this.props.node.type ? this.props.node.type : 'text'}
            disabled={!this.props.node.editableColumn3}
            maxLenght={this.props.node.columnsMaxLenght}
            onChange={(value) => {
              if (!this.props.node.children) {
                if (this.props.node.type === 'number') {
                  this.props.node.column3 = value.target.valueAsNumber;
                } else {
                  this.props.node.column3 = value.target.value;
                }
                this.setState({ node: Object.assign({}, this.props.node) });
                if (this.props.onChange) {
                  this.props.onChange(this.props.name, this.props.node);
                }
              }
            }}
            InputProps={{
              classes: {
                input: inputClass,
              },
              tabIndex: '3',
            }}
          />
        </div>


        <div style={styleFrame}>
          <TextField
            tabIndex="4"
            style={inputinStyle}
            type={this.props.node.type ? this.props.node.type : 'text'}
            disabled={!this.props.node.editableColumn4}
            value={this.props.node.column4}
            maxLenght={this.props.node.columnsMaxLenght}
            onChange={(value) => {
              if (!this.props.node.children) {
                if (this.props.node.type === 'number') {
                  this.props.node.column4 = value.target.valueAsNumber;
                } else {
                  this.props.node.column4 = value.target.value;
                }
                this.setState({ node: Object.assign({}, this.props.node) });
                if (this.props.onChange) {
                  this.props.onChange(this.props.name, this.props.node);
                }
              }
            }}
            InputProps={{
              classes: {
                input: inputClass,
              },
              tabIndex: '4',
            }}

          />
        </div>


      </div>;
    return (
      <div style={style.base}>
        {treeNode}
      </div>
    );
  }
}

@Radium
class Container extends ComponentBase {
  static propTypes = {
    animations: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.bool,
    ]).isRequired,
    decorators: PropTypes.object.isRequired,
    isRightToLeft: PropTypes.bool,
    node: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,
    style: PropTypes.object.isRequired,
    terminal: PropTypes.bool.isRequired,
  };

  render() {
    const isRightToLeft = this.props.isRightToLeft;
    const theme = this.props.context.theme;
    const iconStyle = {
      width: 31,
      height: 34,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderRight: isRightToLeft ? null : `1px solid ${theme.boaPalette.base200}`,
      borderLeft: isRightToLeft ? `1px solid ${theme.boaPalette.base200}` : null,
    };

    const { style, terminal, onClick, node, context } = this.props;
    const content =
      <div style={{
        display: 'flex',
        alignItems: 'center',
        borderBottom: !terminal && node.toggled ? `1px solid ${theme.boaPalette.base200}` : null,
      }}>
        {!terminal && (
          <div
            onClick={this.props.onClick}
            style={iconStyle}>{this.renderToggle(node.toggled)}
          </div>
        )}
        <Header
          context={context}
          node={node}
          style={style.header}
          onClick={onClick}
          isRightToLeft={this.props.isRightToLeft}
          onChange={this.props.onChange}
        />
      </div>;

    return (
      <div
        style={style.container}>
        {content}
      </div>
    );
  }

  // eslint-disable-next-line
  renderToggle(toggled) {
    return !toggled ? <Add style={toggleStyle} /> : <Remove style={toggleStyle} />;
  }
}

export default {
  Loading,
  Toggle,
  Header,
  Container,
};
