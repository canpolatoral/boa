import React from 'react'; import PropTypes from 'prop-types';
import { BComponent, BComponentComposer } from 'b-component';
import { BLabel } from 'b-label';
import { BButton } from 'b-button';
import { BFlexPanel } from 'b-flex-panel';

@BComponentComposer
export class BDataGridHeader extends BComponent {

  static propTypes = {
    ...BComponent.propTypes,
    show: PropTypes.bool,
    title: PropTypes.string,
    showTitle: PropTypes.bool,
    context: PropTypes.any,
    showGrouping: PropTypes.bool,
    showFiltering: PropTypes.bool,
    showMoreOptions: PropTypes.bool,
    showAdd: PropTypes.bool,
    showDivit: PropTypes.bool,
    disabledDivit: PropTypes.bool,
    showDelete: PropTypes.bool,
    disabledDelete: PropTypes.bool,
    columns: PropTypes.any,
    onToggleFilter: PropTypes.func,
    onToggleGrouping: PropTypes.func,
    onToggleMoreOptions: PropTypes.func,
    onToggleAdd: PropTypes.func,
    onToggleDivit: PropTypes.func,
    onToggleDelete: PropTypes.func,
    numberOfRows: PropTypes.number,
    enableFilter: PropTypes.bool,
    disabled: PropTypes.bool,
    groupingOptions: PropTypes.shape({
      groupBy: PropTypes.array.isRequired,
      onColumnGroupAdded: PropTypes.func.isRequired,
      onColumnGroupDeleted: PropTypes.func.isRequired
    }),
    isGrouping: PropTypes.bool,
    isFilter: PropTypes.bool,
  }

  static defaultProps = {
    ...BComponent.defaultProps,
    isGrouping: false,
    isFilter: false
  }

  
  state = {
    groupingEnabled: false,
    disabled: false,
    isFilter: this.props.isFilter,
    isGrouping:this.props.isGrouping,
  };

  constructor(props, context) {
    super(props, context);
    this.onToggleFilter = this.onToggleFilter.bind(this);
    this.onToggleGrouping = this.onToggleGrouping.bind(this);
    this.onToggleMoreOptions = this.onToggleMoreOptions.bind(this);
    this.onToggleDivit = this.onToggleDivit.bind(this);
    this.onToggleDelete = this.onToggleDelete.bind(this);
    this.onToggleAdd = this.onToggleAdd.bind(this);
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.disabled !== this.props.disabled) {
      this.setState({
        disabled: nextProps.disabled
      });
    }

    this.setState({
      isFilter: nextProps.isFilter,
      isGrouping: nextProps.isGrouping
    });
  }

  onToggleFilter(e) {
    this.setState({
      isFilter: !this.state.isFilter
    });
    if (this.props.onToggleFilter) {
      this.props.onToggleFilter(e);
    }
  }

  onToggleMoreOptions(e) {
    if (this.props.onToggleMoreOptions) {
      this.props.onToggleMoreOptions(e);
    }
  }

  onToggleGrouping(e) {
    this.setState({
      isGrouping: !this.state.isGrouping
    });
    if (this.props.onToggleGrouping) {
      this.props.onToggleGrouping(e);
    }
  }

  onToggleDivit(e) {
    if (this.props.onToggleDivit) {
      this.props.onToggleDivit(e);
    }
  }

  onToggleDelete(e) {
    if (this.props.onToggleDelete) {
      this.props.onToggleDelete(e);
    }
  }

  onToggleAdd(e) {
    if (this.props.onToggleAdd) {
      this.props.onToggleAdd(e);
    }
  }

  render() {
    if (this.props.show) {
      let boaPalette = this.props.context.theme.boaPalette;
      let floatLeftStyle = {
        float: !this.props.context.localization.isRightToLeft ? 'left' : 'right',
        marginRight: this.props.context.localization.isRightToLeft ? 16 : 0,
        marginLeft: this.props.context.localization.isRightToLeft ? 0 : 16
      };
      let groupingStyle = Object.assign(this.props.showGrouping ? {} : { display: 'none' }, floatLeftStyle);
      let filteringStyle = Object.assign(this.props.showFiltering ? {} : { display: 'none' }, floatLeftStyle);
      let divitStyle = Object.assign(this.props.showDivit ? {} : { display: 'none' }, floatLeftStyle);
      let deleteStyle = Object.assign(this.props.showDelete ? {} : { display: 'none' }, floatLeftStyle);
      let addStyle = Object.assign(this.props.showAdd ? {} : { display: 'none' }, floatLeftStyle);

      let moreOptionsStyle = Object.assign(this.props.showMoreOptions ? {} : { display: 'none' }, floatLeftStyle);

      let selectedStye = {
        width: 32,
        height: 32,
        backgroundColor: this.props.context.theme.boaPalette.pri250,
        borderRadius: 32
      };
      let iconStyle = {
        width: 32,
        height: 32,
        padding: 0
      };

      let title = this.props.showTitle && this.props.title ? 
        <BLabel context={this.props.context}
        style={{
          flex: 1,
          float: !this.props.context.localization.isRightToLeft ? 'left' : 'right', fontSize: '16px', color: this.props.context.theme.boaPalette.base400
        }} text={this.props.title} /> : null;
      return (
        <div>
          <BFlexPanel direction='horizontal' alignItems='center'
            style={
            {
              height: '48px',
              paddingLeft: !this.props.context.localization.isRightToLeft ? 24 : 0,
              paddingRight: !this.props.context.localization.isRightToLeft ? 0 : 24,
              color: this.props.context.theme.boaPalette.base400
            }}>
            {title}
            <div style={{ float: !this.props.context.localization.isRightToLeft ? 'right' : 'left', marginTop: -6, marginRight: 16 }}>
              <div style={groupingStyle}>
                <div style={this.state.isGrouping ? selectedStye : null} >
                  <BButton context={this.props.context}
                    style={iconStyle}
                    type="icon"
                    dynamicIcon='Sort'
                    disabled={this.state.disabled}
                    iconProperties={{ nativeColor: boaPalette.pri500 }}
                    onClick={this.onToggleGrouping}
                    tooltip={this.state.isGrouping ? 'Gruplamayı kaldır' : 'Grupla'}
                  />
                </div>
              </div>
              <div style={filteringStyle}>
                <div style={this.state.isFilter ? selectedStye : null} >
                  <BButton context={this.props.context}
                    style={iconStyle}
                    type="icon"
                    dynamicIcon='FilterList'
                    disabled={this.state.disabled}
                    iconProperties={{ nativeColor: boaPalette.pri500 }}
                    onClick={this.onToggleFilter}
                    tooltip={this.state.isFilter ? 'Filtrelemeyi kaldır' : 'Filtrele'}
                  />
                </div>
              </div>

              <div style={addStyle}>
                <BButton context={this.props.context}
                  type="icon"
                  style={iconStyle}
                  dynamicIcon='Add'
                  disabled={this.state.disabled || this.props.disabledAdd}
                  iconProperties={{ nativeColor: boaPalette.pri500 }}
                  onClick={this.onToggleAdd}
                />
              </div>

              <div style={divitStyle}>
                <BButton context={this.props.context}
                  type="icon"
                  style={iconStyle}
                  dynamicIcon='Attachment'
                  disabled={this.state.disabled || this.props.disabledDivit}
                  iconProperties={{ nativeColor: boaPalette.pri500 }}
                  onClick={this.onToggleDivit}
                />
              </div>

              <div style={deleteStyle}>
                <BButton context={this.props.context}
                  type="icon"
                  style={iconStyle}
                  dynamicIcon='Delete'
                  disabled={this.state.disabled || this.props.disabledDelete}
                  iconProperties={{ nativeColor: boaPalette.pri500 }}
                  onClick={this.onToggleDelete}
                />
              </div>

              <div style={moreOptionsStyle}>
                <BButton context={this.props.context}
                  type="icon"
                  style={iconStyle}
                  dynamicIcon='MoreVert'
                  disabled={this.state.disabled}
                  iconProperties={{ nativeColor: boaPalette.pri500 }}
                  onClick={this.onToggleMoreOptions}
                />
              </div>
            </div>
          </BFlexPanel>
        </div>);
    }
    return null;
  }
}

export default BDataGridHeader;
