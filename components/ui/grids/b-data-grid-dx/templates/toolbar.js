import React from 'react';
import ToolbarMUI from '@material-ui/core/Toolbar';
import { BIconButton } from 'b-icon-button';

export class HeaderBar {


  static generateHeaderBar(grid:any, props: any) {

    const boaPalette=grid.props.context.theme.boaPalette;
    let selectedStye = {
      width: 32,
      height: 32,
      backgroundColor: grid.props.context.theme.boaPalette.pri250,
      borderRadius: 32
    };
    let iconStyle = {
      width: 32,
      height: 32,
      padding: 0
    };

    let floatLeftStyle = {
      float: !grid.props.context.localization.isRightToLeft ? 'left' : 'right',
      marginRight: grid.props.context.localization.isRightToLeft ? 16 : 0,
      marginLeft: grid.props.context.localization.isRightToLeft ? 0 : 16
    };

    let groupingStyle = Object.assign( grid.state.headerBarOptions.showGrouping ? {} : { display: 'none' }, floatLeftStyle);
    let filteringStyle = Object.assign(grid.state.headerBarOptions.showFiltering ? {} : { display: 'none' }, floatLeftStyle);
    let divitStyle = Object.assign(grid.state.headerBarOptions.showDivit ? {} : { display: 'none' }, floatLeftStyle);
    let deleteStyle = Object.assign(grid.state.headerBarOptions.showDelete ? {} : { display: 'none' }, floatLeftStyle);
    let addStyle = Object.assign(grid.state.headerBarOptions.showAdd ? {} : { display: 'none' }, floatLeftStyle);
    let moreOptionsStyle = Object.assign(grid.state.headerBarOptions.showMoreOptions ? {} : { display: 'none' }, floatLeftStyle);

    return (
      <div >
        <ToolbarMUI
          {...props}
          >

          <div
            style={{
              flex: 1,
              float: !grid.props.context.localization.isRightToLeft ? 'left' : 'right',
              fontSize: '16px', color: boaPalette.base400

            }} >
            {grid.state.headerBarOptions.title}
          </div>
          <div style={groupingStyle}>
            <div style={grid.state.checkedGrouping ? selectedStye : null} >
              <BIconButton context={grid.props.context}
                style={iconStyle}
                dynamicIcon='Sort'
                disabled={grid.state.disabled}
                iconProperties={{ nativeColor: boaPalette.pri500 }}
                onClick={()=>{
                  grid.onToggleGrouping();
                }}
                tooltip={grid.state.checkedGrouping ? 'Gruplamayı kaldır' : 'Grupla'}
              />
            </div>
          </div>
          <div style={filteringStyle}>
            <div style={grid.state.checkedFiltering ? selectedStye : null} >
              <BIconButton context={grid.props.context}
                style={iconStyle}
                dynamicIcon='FilterList'
                disabled={grid.state.disabled}
                iconProperties={{ nativeColor: boaPalette.pri500 }}
                onClick={ ()=>{
                  grid.onToggleFilter();
                }}
                tooltip={grid.state.checkedFiltering ? 'Filtrelemeyi kaldır' : 'Filtrele'}
              />
            </div>
          </div>

          <div style={addStyle}>
            <BIconButton context={grid.props.context}
                style={iconStyle}
                dynamicIcon='Add'
                disabled={grid.state.disabled || grid.props.disabledAdd}
                iconProperties={{ nativeColor: boaPalette.pri500 }}
                onClick={ ()=>{
                  grid.onToggleAdd();
                }}

              />
          </div>
          <div style={divitStyle}>
            <BIconButton context={grid.props.context}
              style={iconStyle}
              dynamicIcon='Attachment'
              disabled={grid.state.disabled || grid.props.disabledDivit}
              iconProperties={{ nativeColor: boaPalette.pri500 }}
              onClick={ ()=>{
                grid.onToggleDivit();
              }}
            />
          </div>
          <div style={deleteStyle}>
            <BIconButton context={grid.props.context}
              style={iconStyle}
              dynamicIcon='Delete'
              disabled={grid.state.disabled || grid.props.disabledDelete}
              iconProperties={{ nativeColor: boaPalette.pri500 }}
              onClick={ ()=>{
                grid.onToggleDelete();
              }}
            />
          </div>
          <div style={moreOptionsStyle}>
            <BIconButton context={grid.props.context}
              type="icon"
              style={iconStyle}
              dynamicIcon='MoreVert'
              disabled={grid.state.disabled}
              iconProperties={{ nativeColor: boaPalette.pri500 }}
              onClick={ (e)=>{
                grid.onToggleMoreOptions(e);
              }}
            />
          </div>

        </ToolbarMUI>
        <div style={
        {
          height: 1,
          width: '100%',
          backgroundColor: grid.state.context.theme.boaPalette.base200
        }}></div>
        {
          grid.state.checkedGrouping &&
          <div style={{
            paddingRight:24,
            paddingLeft:24,
            minHeight:48,
            backgroundColor:boaPalette.pri300
          }}>
            <div style={{
              minHeight:48,
              display:'flex',
              position:'relative',
              alignItems:'center'
            }}>
              {props.children}
            </div>

          </div>
        }


      </div>
    );
  }
}

export default HeaderBar;
