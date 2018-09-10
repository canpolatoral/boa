import React from 'react';
import { BComponent, BComponentComposer, BAppProvider } from 'b-component';
import { getTheme } from 'b-theme';
import { BRadioButton } from 'b-radio-button';
import { BCard } from 'b-card';
import { BGridList } from 'b-grid-list';
import { BBaseForm } from 'b-base-form';
import { BCriteriaPanel } from 'b-criteria-panel';
import { BDivider } from 'b-divider';
import { BPopover } from 'b-popover';
import { BDialogHelper } from 'b-dialog-box';
import { BButton } from 'b-button';
import { BListItem } from 'b-list-item';
import { BComponentPropertiesPanel } from './component-properties-panel';
import { BToolkitComponentsPanel } from './components-panel';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    paddingVertical: 0,
    width: '100%',
    backgroundColor: theme.boaPalette.paper,
  }
});
@BComponentComposer
@withStyles(styles)
export class BToolkit extends BComponent {
  static propTypes = {
    ...BComponent.propTypes,
    selectedItems: PropTypes.array,
  }
  static defaultProps = {
    selectedItems: null,
    isSingleElement: true,
  }

  state = {
    resourceInfo: {
      'id': 934,
      'name': 'Toolkit',
      'description': 'Toolkit',
      'resourceActionList': [
        {
          'resourceId': 934,
          'actionId': 11,
          'actionType': 1,
          'name': 'TAMAM',
          'commandName': 'Ok',
          'groupName': '',
          'description': 'Ok',
          'iconPath': 'Save',
          'isVirtual': false,
          'isAssignable': true,
          'hasAccounting': false,
          'hasSlip': false,
          'hasCommission': false,
          'hasWorkflow': false,
          'sortId': 1,
          'systemDate': '0001-01-01T00:00:00Z',
          'hasAuthorization': false,
          'hasTellerTransaction': false,
          'hasRevokableTransaction': false,
          'hasFutureDated': false,
          'isOne': false,
          'isSelected': false,
          'isSelectable': true
        },
      ],
    },
    selectedTheme: 'winter',
    leftPaneExpanded: true,
    rightPanelExpanded: true,
    context: {
      theme: getTheme({ themeName: 'winter' }),
      localization: { isRightToLeft: false },
      platform: BComponent.Platforms.TABLET
    },
    anchorEl: null,
    SelectedItems: null,
    selectedItemIndex: 0,
  };

  constructor(props, context) {
    super(props, context);
  }

  componentWillMount() {
    super.componentWillMount();
    let SelectedItems = [];
    if (this.props.selectedItems) {
      if (Array.isArray(this.props.selectedItems)) {
        SelectedItems = this.props.selectedItems.map(item => ({ item: item.type, viewProps: item.props }));
      }
      else {
        SelectedItems.push({ item: this.props.selectedItems.type, viewProps: this.props.selectedItems.props });
      }
    }

    this.setState({ context: cloneDeep(this.props.context), SelectedItems, selectedTheme: this.props.context.theme.themeName });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.context != nextProps.context)
      this.setState({ context: cloneDeep(nextProps.context) });
  }

  onItemSelect = (SelectedItem) => {
    let SelectedItems = this.state.SelectedItems;
    SelectedItems[this.state.selectedItemIndex] = { item: SelectedItem.component, viewProps: {} };
    this.setState({ SelectedItems: Object.assign([], SelectedItems) });
    this.selectItemIndex(this.state.selectedItemIndex);
  }

  selectItemIndex = (index) => {
    if (index < this.state.SelectedItems.length) {
      this.setState({ selectedItemIndex: index, currentComponent: null });
      setTimeout(() => {
        this.setState({ currentComponent: this.refs['SelectedItem' + index], });
      }, 100);
    } else if (index == this.state.SelectedItems.length) {
      this.setState({ currentComponent: null, selectedItemIndex: index });
    }
  }

  deleteItem = (index) => {
    let SelectedItems = this.state.SelectedItems;
    SelectedItems.splice(index, 1);
    if (SelectedItems.length > 0) {
      let newIndex = index;
      if (index > SelectedItems.length)
        newIndex = SelectedItems.length;
      this.setState({ selectedItemIndex: newIndex, SelectedItems: Object.assign([], SelectedItems) });
      setTimeout(() => {
        this.setState({ currentComponent: this.refs['SelectedItem' + newIndex], });
      }, 100);
    }
    else {
      this.setState({ currentComponent: null, selectedItemIndex: 0, SelectedItems: Object.assign([], SelectedItems) });
    }
  }

  onActionClick = (event) => {
    if (event.commandName == 'Ok') {
      let { SelectedItems, context } = this.state;
      if (SelectedItems) {
        if (SelectedItems.length > 1) {
          let SelectedItemComponents = SelectedItems.map((item, i) => {
            let MyComponent = item.item;
            let viewProps = item.viewProps;
            let SelectedItemComponent = <MyComponent key={i} context={context} {...viewProps} />;
            return SelectedItemComponent;
          });
          BDialogHelper.onClose(SelectedItemComponents);
        }
        else {
          let MyComponent = SelectedItems[0].item;
          let viewProps = SelectedItems[0].viewProps;
          let SelectedItemComponent = <MyComponent context={context} {...viewProps} />;
          BDialogHelper.onClose(SelectedItemComponent);
        }
      }
    }
  }

  changeTheme = (selectedTheme) => {
    let context = this.state.context;
    context.theme = cloneDeep(getTheme({ themeName: selectedTheme || 'winter' }));

    this.setState({ selectedTheme, context: cloneDeep(context), anchorEl: null });
  };

  themePopUp = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  leftPaneExpandedChanged = (isExpanded) => {
    this.setState({ leftPaneExpanded: isExpanded });
    this.baseForm.getInstance().updateRightPane(this.state.rightPanelExpanded);
    this.baseForm.getInstance().updateLeftPane(isExpanded);
  }

  rightPaneExpandedChanged = (isExpanded) => {
    this.setState({ rightPanelExpanded: isExpanded });
    this.baseForm.getInstance().updateLeftPane(this.state.leftPaneExpanded);
    this.baseForm.getInstance().updateRightPane(isExpanded);
  }

  render() {

    let { SelectedItems, anchorEl, currentComponent } = this.state;
    let { context } = this.props;

    let themeItems = [
      { title: 'KT-Green', value: 'kt-green', color: '#006754' },
      { title: 'Violet', value: 'violet', color: '#B618CE' },
      { title: 'Winter', value: 'winter', color: '#1976D2' },
      { title: 'Spring', value: 'spring', color: '#3F51B5' },
      { title: 'Summer', value: 'summer', color: '#D11919' },
      { title: 'Night', value: 'night', color: '#3F51B5' },
    ];

    let leftPaneContent =
      <BCriteriaPanel context={context}
        onExpandChange={this.leftPaneExpandedChanged}
        expanded={this.state.leftPaneExpanded}
        expandable={true}
        header="Bileşenler" >
        <BToolkitComponentsPanel
          context={context}
          onItemSelect={this.onItemSelect}
          width={300}
        />
      </BCriteriaPanel>;

    let selectedThemeItem = themeItems.find(f => f.value === this.state.selectedTheme);

    let rightPaneContent =
      <div style={{ backgroundColor: '#FFF' }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', height: 38, justifyContent: 'center', alignItems: 'center', fontSize: 16, textAlign: 'center', color: context.theme.boaPalette.base400 }}>Properties</div>
          <BDivider style={{ margin: 0 }} context={context} />
        </div>
        <div style={{ paddingLeft: 10, paddingRight: 10, }}>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <div onClick={this.themePopUp} style={{ display: 'flex', paddingTop: 10, backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center' }}>
              <div style={{ height: 36, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 16, textAlign: 'center', color: context.theme.boaPalette.base400 }}>Tema:</div>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginLeft: 10, }} >
                <div style={{ width: 28, height: 24, backgroundColor: selectedThemeItem.color }} />
                <div style={{
                  marginLeft: 12,
                  display: 'flex',
                  alignItems: 'center',
                }}>{selectedThemeItem.title}</div>
              </div>
            </div>
            <BButton type='icon' fontIcon={this.state.context.localization.isRightToLeft ? 'format_textdirection_l_to_r' : 'format_textdirection_r_to_l'} onClick={() => {
              let scontext = this.state.context;
              if (this.state.context.localization.isRightToLeft) {
                scontext.theme.direction = 'ltr';
                scontext.language = 1;
                scontext.localization = { isRightToLeft: false };
              }
              else {
                scontext.theme.direction = 'rtl';
                scontext.language = 5;
                scontext.localization = { isRightToLeft: true };
              }
              this.setState({ context: cloneDeep(scontext) });
            }} />
          </div>
          <BDivider style={{ margin: 0, }} context={context} />
          <BPopover
            context={context}
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            onRequestClose={() => this.setState({ anchorEl: null })}
            open={Boolean(anchorEl)}
          >
            <div style={{ padding: 16, width: 480, }}>
              <BGridList context={context} cellHeight={48} cols={2}>
                {themeItems.map((item, i) =>
                  <div key={i} style={{ display: 'flex', paddingLeft: 16, flexDirection: 'row', alignItems: 'center', }}>
                    <BRadioButton
                      context={context}
                      checked={this.state.selectedTheme === item.value}
                      onChange={() => this.changeTheme(item.value)}
                      value={'' + item.value}
                      content={<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
                        <div style={{ width: 28, height: 24, backgroundColor: item.color }} />
                        <div style={{
                          marginLeft: 12,
                          display: 'flex',
                          alignItems: 'center',
                        }}>{item.title}</div></div>}
                    />
                  </div>
                )}
              </BGridList>
            </div>
          </BPopover>
          {currentComponent ?
            <BComponentPropertiesPanel
              context={context}
              componentRef={currentComponent}
              onPropsChange={(viewProps) => {
                let SelectedItems = this.state.SelectedItems;
                SelectedItems[this.state.selectedItemIndex].viewProps = viewProps;
                this.setState({ SelectedItems: Object.assign([], SelectedItems) });
              }
              }
            />
            : null
          }
        </div>
      </div>
      ;

    let middleContent = <div style={{ padding: 16, overflow: 'scroll', height: '100%', }}>
      {SelectedItems.map((SelectedItem, i) => {
        let SelectedItemComponent = <SelectedItem.item ref={'SelectedItem' + i} context={this.state.context} {...SelectedItem.viewProps} />;
        return <div style={{ marginBottom: 10 }}>
          <BCard context={context}>
            <div>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <div style={{ width: '100%' }}>
                  <BRadioButton
                    context={context}
                    checked={this.state.selectedItemIndex === i}
                    onChange={() => this.selectItemIndex(i)}
                    value={i}
                    content={<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                      }}>{SelectedItem.item.displayName ? SelectedItem.item.displayName : SelectedItem.item.name}</div></div>}
                  />
                </div>
                {this.props.isSingleElement ? null
                  : <div style={{ width: 48, }}>
                    <BButton context={context}
                      type="icon"
                      tooltip="Bileşeni Sil"
                      fontIcon="delete"
                      onClick={() => this.deleteItem(i)}
                    />
                  </div>
                }
              </div>

              <BDivider style={{ margin: 0, marginTop: 10, marginBottom: 0 }} />

              <div dir={this.state.context.localization.isRightToLeft ? 'rtl' : 'ltr'} style={{ marginTop: 10, direction: this.state.context.localization.isRightToLeft ? 'rtl' : 'ltr', }}>
                <BAppProvider context={this.state.context} theme={this.state.context.theme}>
                  {SelectedItemComponent}
                </BAppProvider >
              </div>

            </div>
          </BCard>
        </div>;
      })
      }
      {this.props.isSingleElement ?
        SelectedItems.map((SelectedItem, i) => {
          let SelectedItemComponent = <SelectedItem.item ref={'SelectedSnapshotItem' + i} context={this.state.context} {...SelectedItem.viewProps} />;
          return <BCard
            title='Snapshot Test'
            expandable={true}
            expanded={false}
            context={context}>     {/* SNAPSHOT TEST */}
            <div>
              <div style={{ width: '100%', }} onClick={() => {
                this.refs['SelectedSnapshotItem' + i].getInstance().setSnapshot(this.refs['SelectedItem' + i].getInstance().getSnapshot());
              }}>
                <BListItem context={context} primaryText="Set Snapshot" secondaryText="Yukarıdaki Bileşenin snapshot değerini aşağıdaki bileşene atar" selected />
              </div>
              <div dir={this.state.context.localization.isRightToLeft ? 'rtl' : 'ltr'} style={{ marginTop: 10, direction: this.state.context.localization.isRightToLeft ? 'rtl' : 'ltr', }}>
                <BAppProvider context={this.state.context} theme={this.state.context.theme}>
                  {SelectedItemComponent}
                </BAppProvider >
              </div>
            </div>
          </BCard>;
        })
        : <BCard context={context}>
          <div>
            <div style={{ paddingTop: 10, }}>
              <BRadioButton
                style={{ alignItems: 'center' }}
                context={context}
                checked={this.state.selectedItemIndex === SelectedItems.length}
                onChange={() => this.selectItemIndex(SelectedItems.length)}
                value={SelectedItems.length}
                content={<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}>Yeni Bileşen</div></div>}
              />
            </div>
          </div>
        </BCard>
      }
    </div>;

    return (
      <BBaseForm
        context={context}
        ref={r => this.baseForm = r}
        showLeftPane={true}
        leftPaneContent={leftPaneContent}
        rightPaneContent={currentComponent ? rightPaneContent : null}
        leftPaneWidth={360}
        leftPaneMaxWidth={511}
        rightPaneWidth={360}
        rightPaneMaxWidth={511}
        visibleHelpButton={false}
        visibleInfoButton={false}
        visibleOptionsButton={false}
        resourceInfo={this.props.resourceInfo}
        onActionClick={this.onActionClick}
        onClosing={this.props.onClosing}>
        {middleContent}
      </BBaseForm>
    );
  }
}

export default BToolkit;