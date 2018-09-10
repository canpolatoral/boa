import React from 'react'; import PropTypes from 'prop-types';
import { BComponent } from 'b-component';
import { BButton } from 'b-button';

const styles = {
  fileInput: {
    width: '1px',
    height: '0px',
    lineHeight: '0px',
    overflow: 'hidden'
  }
};

export class BIconInput extends BComponent {

  static propTypes = {
    as: PropTypes.oneOf(['binary', 'buffer', 'text', 'url']),
    children: PropTypes.any,
    onChange: PropTypes.func,
    id: PropTypes.string,
    multiple: PropTypes.bool,
    titleText: PropTypes.string,
    addButtonText: PropTypes.string,
    clearButtonText: PropTypes.string,
    value: PropTypes.string,
    defaultValue: PropTypes.string,
    detailInfoText1: PropTypes.string,
    detailInfoText2: PropTypes.string,
    maxSize: PropTypes.number,
    style: PropTypes.object
  };

  constructor(props, context) {
    // FileReader compatibility warning.
    super(props, context);
    this.state = { isImageVisible: false };
    this.state.value = props.value ? props.value : null;
  }

  componentWillReceiveProps(nextProps) {
    // null ise kasıtlı siliniyordur, silmeli.
    // undefined ise value geçilmemiştir, değişmemeli.
    // diğer durumlarda prop yada state'ten farklı gelmişse değişmeli.
    if ((nextProps.value === null) || (nextProps.value !== undefined && (nextProps.value !== this.props.value || nextProps.value !== this.state.value))) {
      this.setState({ value: nextProps.value === null ? null : nextProps.value });
    }
  }

  getSizeText(size) {
    var exponent = 'B';
    var value = size;
    if (size >= (1024 * 1024 * 1024)) {
      value = Math.round((value / (1024 * 1024 * 1024)) * 100) / 100;
      exponent = 'GB';
    } else if (size > (1024 * 1024)) {
      value = Math.round((value / (1024 * 1024)) * 100) / 100;
      exponent = 'MB';
    } else if (size > 1024) {
      value = Math.round((value / 1024) * 100) / 100;
      exponent = 'KB';
    }
    return `${value} ${exponent}`;
  }

  clearValue() {
    this._reactFileReaderInput.value = '';
    this.setState({
      file: null,
      value: null,
      message: null,
      clearButtonShow: true
    });
  }

  handleChange = (e) => {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    var image = new Image();
    image.onload = () => {
      if (image.width) {
        reader.readAsDataURL(file);
      } else {
        this.clearValue();
        this.setState({
          file: null,
          value: null,
          message: 'File is invalid format.'
        });
      }
    };
    image.onerror = () => {
      this.clearValue();
      this.setState({
        file: null,
        value: null,
        message: 'File is invalid format.'
      });
    };
    image.src = URL.createObjectURL(file);

    reader.onloadend = () => {
      if (this.props.maxSize && file.size > this.props.maxSize) {
        this.clearValue();
        this.setState({
          file: null,
          value: null,
          message: `File size cannot be larger than ${this.getSizeText(this.props.maxSize)}.`
        });
        return;
      }
      this.setState({
        file: file,
        value: reader.result,
        message: null,
        clearButtonShow: true
      });
    };

    this.props.onChange && this.props.onChange(e);
  };

  triggerInput = e => {
    this._reactFileReaderInput.click(e);
  };

  clearOnClick() {
    this.clearValue();
  }

  getImage() {
    return this.state.value ? this.state.value : this.props.defaultValue;
  }

  setValue(value) {
    this.setState({ value });
  }

  getValue() {
    return this.state.value || null;
  }

  render() {
    const { theme } = this.props.context;
    const { titleText, style } = this.props;

    const inputTitleBlock = {
      height: 30, color: theme.boaPalette.pri500
    };
    const imageButtonBlock = {
      height: 70, width: '100%', display: 'flex'
    };
    const imageBlock = {
      backgroundColor: '#D6D7D9', width: 70, height: 70
    };
    const buttonBlock = {
      padding: 0, paddingTop: 5
    };
    const detailBlock = {
      padding: 0, paddingTop: 10, fontSize: 14,
    };
    const detailInfo = {
      fontSize: 14, display: 'block'
    };
    const iconStyle = {
      width: 70, height: 70, textAlign: 'center'
    };

    const hiddenInputStyle = styles.fileInput;

    return (
      <div style={style}>
        <div style={inputTitleBlock}>{titleText}</div>
        <div style={imageButtonBlock}>
          <div style={imageBlock}>
            <div>
              <img src={this.getImage()} style={iconStyle} />
            </div>
          </div>
          <div style={buttonBlock}>
            <div>
              <input id={this.props.id}
                ref={c => this._reactFileReaderInput = c}
                multiple={this.props.multiple}
                accept="image/*"
                children={undefined} type="file"
                onChange={this.handleChange.bind(this)}
                style={hiddenInputStyle} />
              {this.props.children}
              <BButton context={this.props.context}
                type="flat"
                text={this.props.addButtonText}
                colorType={'primary'}
                textStyle={{ fontWeight: 'bold' }}
                style={{ margin: 5 }}
                onClick={this.triggerInput} />
              <BButton context={this.props.context}
                type="flat"
                text={this.props.clearButtonText}
                colorType={'primary'}
                textStyle={{ fontWeight: 'bold' }}
                style={{ margin: 5 }}
                onClick={this.clearOnClick.bind(this)} />
            </div>
          </div>
        </div>
        <div style={detailBlock}>
          {this.state.message ? <label style={{ ...detailInfo, marginBottom: 10, color: theme.boaPalette.error500 }}>{this.state.message}</label> : null}
          {this.state.file ? <label style={{ ...detailInfo, marginBottom: 10, color: theme.boaPalette.pri500 }}>{this.state.file.name}</label> : null}
          <label style={detailInfo}>{this.props.detailInfoText1}</label>
          <label style={detailInfo}>{this.props.detailInfoText2}</label>
        </div>
      </div>
    );
  }
}

export default BIconInput;
