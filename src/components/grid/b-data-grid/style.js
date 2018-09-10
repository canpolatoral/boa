import React from 'react';

export class StyleHelper {

  constructor() {

  }

  /**
   * DataGrid Style
   * @param {*} context
   */
  static getDataGridStyle(props: any) {
    return (
      <style>
        {
          /** rtl string */
          props.context.localization.isRightToLeft && this.rtlString()
        }
        {
          /** datagrid style */
          this.createDataGridStyleString(props)
        }
      </style>
    );
  }

  /**
   * create string style
   * @param {*} context
   */
  static createDataGridStyleString(props) {
    let context=props.context;
    return (
      `
      /* Grid Group Header */
      .k-grouping-header {
        background-color: ${context.theme.boaPalette.pri300} !important;
        color: ${context.theme.boaPalette.pri500} !important;
        font-size:12px !important;
        // height:40px !important;
        // line-height:40px !important;
        padding-top:0px !important;
        padding-bottom:0px !important;
        padding-left:24px !important;
        min-height:50px !important;
      }

      .k-group-indicator{
        background-color: ${context.theme.boaPalette.pri350} !important;
        border-color:${context.theme.boaPalette.pri450} !important;
        border-radius:30px !important;
        margin-top:7px !important;
        margin-bottom:7px !important;
        padding-bottom:0px !important;
        padding-top:0px !important;
        height:32px !important;

      }

      .k-grouping-row{
        height:36px !important;
        line-height:36px !important;
        background:red !important;
      }

      /* Grid Column Header Background*/
      .k-header {
        background:white !important;
      }

      /* Group Header Row */
      .k-grouping-row td {
        background:${context.theme.boaPalette.levelBlue200} !important;
      }


      .k-i-collapse:before {
        content:${this.getSvgContent("<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='black' stroke='none'><path d='M19,13H5V11H19V13Z'></path></svg>")} !important;
        width:24px;
        height:24px;
      }

      .k-i-expand:before {
        content:${this.getSvgContent("<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='black' stroke='none'><path d='M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z'></path></svg>")} !important;
        width:24px;
        height:24px;
      }

      .k-i-close:before {
        content:${this.getSvgContent("<svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='black' stroke='none'><path d='M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7,13H17V11H7'></path></svg>")} !important;
        width:18px;
        height:18px;
      }

      .k-i-sort-desc-sm:before {
        content:${this.getSvgContent(`<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='${context.theme.boaPalette.pri500}' stroke='none'><path d='M11,4H13V16L18.5,10.5L19.92,11.92L12,19.84L4.08,11.92L5.5,10.5L11,16V4Z'></path></svg>`)} !important;
        width:16px;
        height:16px;
        margin-top:-2px !important;
      }

      .k-i-sort-asc-sm:before {
        content:${this.getSvgContent(`<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='${context.theme.boaPalette.pri500}' stroke='none'><path d='M13,20H11V8L5.5,13.5L4.08,12.08L12,4.16L19.92,12.08L18.5,13.5L13,8V20Z'></path></svg>`)} !important;
        width:16px;
        height:16px;
        margin-top:-2px !important;
      }

      .k-i-collapse {
        width: 24px !important;
        height: 24px !important;
        // margin-left: 8px !important;
      }

      .k-i-expand {
        width: 24px !important;
        height: 24px !important;
        // margin-left: 8px !important;
      }

      .k-grid .k-hierarchy-cell {
        // padding-left:10px !important;
        border-right:0px !important;
        background:white !important;
      }

      .k-reset{
        // margin-left:0px !important;
      }

      .k-grouping-row p{
        margin-left:0px !important;
      }

      .k-group-indicator .k-button.k-bare{
        margin-left:10px !important;
        margin-right:8px !important;
      }

      .k-group-indicator .k-link .k-icon{
        opacity:1;
      }


      /* Grid Row TD (satır yüksekliğinin 36 px olması için) */
      .k-grid td{
        // padding-bottom: ${(props.selectable=='multiple' || props.selectable=='single' ) ? '5px' :'7px' };
        // padding-top: ${(props.selectable=='multiple' || props.selectable=='single' ) ? '5px' :'7px' };
        padding-left:12px;
        padding-right:12px;
        text-overflow:ellipsis;
        white-space:nowrap;
        overflow:hidden;
        height:36px !important;
        line-height:36px !important;
        padding-bottom:0px !important;
        padding-top:0px !important;
      }

      /* Grid Column Header */
      .k-grid th{
        padding-bottom: 0px !important;
        padding-top: 0px !important;
        height: 36px !important;
        vertical-align: middle !important;
        padding-left:12px !important;
        padding-right:12px !important;
        color: ${context.theme.boaPalette.base500} !important;
        font-size:13px !important;
        font-weight:600 !important;
      }

      /* Grid Column Header 2 */
      .k-grid .k-link {
        color: ${context.theme.boaPalette.base500} !important;
        font-size:13px !important;
        font-weight:600 !important
      }


      /* Grid Row Selected */
      .k-grid tr.k-state-selected{
        background-color:${context.theme.boaPalette.pri250} !important;
        box-shadow:none
      }

      /* Grid Row Hover */
      .k-grid tr:hover{
        background-color:${context.theme.boaPalette.base150} !important;
      }

      /* Grid Row Selected Hover // bu çalışmadı: TODO */
      .k-grid tr.k-state-selected:hover{
        background-color:${context.theme.boaPalette.pri300} !important;
      }

      /* Grid Row Alternate, Zebra */
      .k-grid .k-alt{
        background-color:${context.theme.boaPalette.base100} !important;
      }


      /* Grid Border */
      .k-grid td{
        border-bottom: 1px solid ${context.theme.boaPalette.base200} !important ;
        border-right: 1px solid ${context.theme.boaPalette.base200} !important ;
      }

      /* Grid Agg Footer */
      .k-footer-template td{
        border-bottom: 0px !important ;
        border-right: 0px !important ;
        border-left: 0px !important ;
        background-color:${context.theme.boaPalette.sec250} !important;
        font-weight:bold !important ;
      }

      /* Grid Group Agg Footer */
      .k-group-footer td{
        border-bottom: 0px !important ;
        border-right: 0px !important ;
        border-left: 0px !important ;
        background-color:${context.theme.boaPalette.sec250} !important;
        font-weight:bold !important ;
      }

      /* Grid Border tümünü garanti altına almak için */
      .k-grid tr td, th{
        border-color:${context.theme.boaPalette.base200} !important;
      }

      table {
        font-size:14px !important;
        font-family:'Roboto' !important;
        color: ${context.theme.boaPalette.base450} !important;

      }

      /*Filtre hücresi  */
      .k-filtercell {
        margin-left:-12px !important;
        margin-right:-12px !important;
        margin-top:-5px;
        margin-bottom:-5px;
      }
      `
    );
  }

  static getSvgContent(svg) {
    return `
        url("data:image/svg+xml;utf8,${svg}")
    `;
  }

  static rtlString() {
    return `.k-rtl .k-grid .k-grid-content tbody td:first-child {
    border-right-width: 1px !important;
    border-left-width: 0px !important;
     }
    .k-rtl .k-grid .k-grid-header-locked thead th:last-child {
         border-left-width: 1px !important;
     }
     .k-rtl .k-radio-label {
         padding-right: 0em !important;
     }
     .k-rtl .k-radio:checked+.k-radio-label:after {
         right: 4px !important;;
     }
     .k-rtl .k-checkbox-label {
         padding-right: 0em !important;
     }
     .k-rtl .k-checkbox:checked+.k-checkbox-label:after {
         right: 4px !important;;
     }
    `;
  }
}
export default StyleHelper;
