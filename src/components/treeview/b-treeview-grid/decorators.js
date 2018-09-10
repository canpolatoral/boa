import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';
import TextField from '@material-ui/core/TextField';
import Add from '@material-ui/icons/Add';
import Remove from '@material-ui/icons/Remove';
import { BComponent } from 'b-component';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

const Loading = (props) => {
  return (
    <div style={props.style}>
      loading...
    </div>
  );
};

let toggleStyle = {
  color: 'gray',
  display: 'inline-block',
  float: 'left',
};

Loading.propTypes = {
  style: PropTypes.object
};

const Toggle = (props) => {
  const style = props.style;
  const height = style.height;
  const width = style.width;
  let midHeight = height * 0.5;
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
  style: PropTypes.object,
  isRightToLeft: PropTypes.bool,
};

const styles = () => ({
  container: {
  },
  textField: {
    textAlign: 'center',
    fontSize: '14px',
    height: 21,
    minWidth: '1px'
  },
  menu: {
  },
  numberPadding: { paddingLeft: 16 }
});

@withStyles(styles)
class Header extends BComponent {
  static propTypes = {
    ...BComponent.propTypes,
    style: PropTypes.object,
    isRightToLeft: PropTypes.bool,
    onChange: PropTypes.func,
    column1: PropTypes.string,
    column2: PropTypes.string,
    column3: PropTypes.string,
    column4: PropTypes.string,
    classes: PropTypes.object.isRequired
  };

  static defaultProps = {
    ...BComponent.defaultProps
  }

  constructor(props, context) {
    super(props, context);
  }


  onTextChanged() {
    this.props.onChange(this);
  }

  render() {
    let nodeStyle;
    nodeStyle = {
      fontWeight: 'normal',
      // padding:'3px',
      lineHeight: '21px',
      verticalAlign: 'middle',
      fontSize: '14px',
      width: 'calc(100% + 20px)',
      display: 'flex',
      height: 34,
    };
    let nodeDarkStyle;
    nodeDarkStyle = {
      background: '#FEF9E7',
      color: '#737373',
      fontWeight: 'bold',
      // padding:'3px',
      lineHeight: '21px',
      verticalAlign: 'middle',
      fontSize: '14px',
      width: '100%',
      display: 'flex',
      height: 34,
    };

    let inputFrameStyle;
    inputFrameStyle = {
      display: 'inline-block',
      float: 'right',
      borderLeft: '1px solid ' + this.props.context.theme.boaPalette.base200,
      borderRight: '1px solid ' + this.props.context.theme.boaPalette.base200,
      // height: 34,
      fontSize: '14px',
      // margin: '-2px -2px -2px -2px'
    };

    let headerInputFrameStyle;
    headerInputFrameStyle = {
      display: 'inline-block',
      float: 'right',
      borderLeft: '1px solid ' + this.props.context.theme.boaPalette.base200,
      borderRight: '1px solid ' + this.props.context.theme.boaPalette.base200,
      // height: 34,
      fontSize: '14px',
      //  margin: '-2px -2px -2px -2px'
    };

    let inputinStyle;
    inputinStyle = {
      width: '101px',
      cursor: 'text',
      // height: 21,
      fontSize: '14px',
      textAlign: 'center',
      minWidth: '1px'
      // margin:'0px -2px 0px 0px'
      // marginBottom: '-2px',
      // marginTop: '-2px'
    };


    // ihtiyac olması durumunda daha sonra  dinamik array yapısına  çevrilecek
    const style = this.props.style;
    const styleFontable = this.props.node.children ? nodeDarkStyle : nodeStyle;
    const styleFrame = this.props.node.children ? headerInputFrameStyle : inputFrameStyle;
    let treeNode;
    const inputClass = classNames(
      this.props.classes.textField,
      {
        [this.props.classes.numberPadding]: this.props.node.type == 'number',
      });

    treeNode =
      <div style={styleFontable}>
        <div
          ref="clickable"
          onClick={this.props.onClick}
          style={{ display: 'flex', alignItems: 'center', flex: 1, fontSize: '14px', paddingLeft: '10px', paddingRight: '10px', }} >
          {this.props.node.name}
        </div>

        <div style={styleFrame} >
          <TextField
            style={inputinStyle}
            value={this.props.node.column1}
            disabled={!this.props.node.editableColumn1}
            maxLenght={this.props.node.columnsMaxLenght}
            type={this.props.node.type ? this.props.node.type : 'text'}
            onChange={(value: any) => {
              if (!this.props.node.children) {
                this.props.node.type == 'number' ?
                  this.props.node.column1 = value.target.valueAsNumber : this.props.node.column1 = value.target.value;

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
          ></TextField>
        </div>

        <div style={styleFrame} >
          <TextField
            style={inputinStyle}
            tabIndex='2'
            value={this.props.node.column2}
            type={this.props.node.type ? this.props.node.type : 'text'}
            disabled={!this.props.node.editableColumn2}
            maxLenght={this.props.node.columnsMaxLenght}
            onChange={(value: any) => {
              if (!this.props.node.children) {
                this.props.node.type == 'number' ?
                  this.props.node.column2 = value.target.valueAsNumber : this.props.node.column2 = value.target.value;

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
              tabIndex: '2'
            }
            }
          ></TextField>
        </div>

        <div style={styleFrame} >
          <TextField
            style={inputinStyle}
            value={this.props.node.column3}
            type={this.props.node.type ? this.props.node.type : 'text'}
            disabled={!this.props.node.editableColumn3}
            maxLenght={this.props.node.columnsMaxLenght}
            onChange={(value: any) => {
              if (!this.props.node.children) {
                this.props.node.type == 'number' ?
                  this.props.node.column3 = value.target.valueAsNumber : this.props.node.column3 = value.target.value;

                this.setState({ node: Object.assign({}, this.props.node) });
                if (this.props.onChange) {
                  this.props.onChange(this.props.name, this.props.node);
                }
              }
            }}
            InputProps={{
              classes: {
                input: inputClass,
              }, tabIndex: '3'
            }}
          ></TextField>
        </div>


        <div style={styleFrame} >
          <TextField
            tabIndex='4'
            style={inputinStyle}
            type={this.props.node.type ? this.props.node.type : 'text'}
            disabled={!this.props.node.editableColumn4}
            value={this.props.node.column4}
            maxLenght={this.props.node.columnsMaxLenght}
            onChange={(value: any) => {
              if (!this.props.node.children) {
                this.props.node.type == 'number' ?
                  this.props.node.column4 = value.target.valueAsNumber : this.props.node.column4 = value.target.value;

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
              tabIndex: '4'
            }}

          ></TextField>
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
class Container extends BComponent {

  static propTypes = {
    style: PropTypes.object.isRequired,
    decorators: PropTypes.object.isRequired,
    terminal: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    animations: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.bool
    ]).isRequired,
    node: PropTypes.object.isRequired,
    isRightToLeft: PropTypes.bool
  };

  constructor(props, context) {
    super(props, context);
  }

  render() {
    let iconStyle = {
      width: 31, height: 34, display: 'flex', justifyContent: 'center', alignItems: 'center',
      borderRight: this.props.isRightToLeft ? null : '1px solid ' + this.props.context.theme.boaPalette.base200,
      borderLeft: this.props.isRightToLeft ? '1px solid ' + this.props.context.theme.boaPalette.base200 : null,
    };

    const { style, terminal, onClick, node, context } = this.props;
    let content =
      <div style={{ display: 'flex', alignItems: 'center', borderBottom: !terminal && node.toggled ? '1px solid ' + this.props.context.theme.boaPalette.base200 : null }}>
        {!terminal ? <div onClick={this.props.onClick} style={iconStyle}>{this.renderToggle(node.toggled)}</div> : null}
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

  renderToggle(toggled) {
    return !toggled ? <Add style={toggleStyle} /> : <Remove style={toggleStyle} />;
  }
}

export default {
  Loading,
  Toggle,
  Header,
  Container
};
