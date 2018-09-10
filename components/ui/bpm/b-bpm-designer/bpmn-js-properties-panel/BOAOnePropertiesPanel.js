import React from 'react';
import BTabBar from 'b-tab-bar';
import { BComponent } from 'b-component';
var flattenDeep = require('lodash/flattenDeep'),
  indexBy = require('lodash/keyBy'),
  map = require('lodash/map');

export class BOAOnePropertiesPanel extends BComponent {
  static propTypes = {};

  static defaultProps = {};

  state = {
    tabItems: [],
    componentprop: []
  };

  components = {};
  propertiesProvider = {};
  eventBus = {};
  modeling = {};
  config = {};
  current = {};

  constructor(props, context) {
    super(props, context);
    this.handleChangeTab = this.handleChangeTab.bind(this);
  }

  create(element) {
    var tabs = this.propertiesProvider.getTabs(element);

    let tabItems = [];
    let tabIndex = 0;

    tabs.forEach(tab => {
      if (!tab.id) {
        throw new Error('tab must have an id');
      }
      var tabVisible = false;
      var tabGroupNode = [];
      var groups = tab.groups;

      groups.forEach(group => {
        if (!group.id) {
          throw new Error('group must have an id');
        }

        var groupVisible = false;
        var groupNode = [];

        group.entries.forEach(entry => {
          if (React.isValidElement(entry.html)) {
            var entryVisible = this.isEntryVisible(entry);
            groupVisible = groupVisible || entryVisible;

            if (entryVisible) {
              groupNode.push(entry.html);
              if ((this.state.componentprop.filter(item => item.id == element.id)).length == 0) {
                var tmpcomponentprop = [];
                Object.assign(tmpcomponentprop, this.state.componentprop);
                tmpcomponentprop.push({ id: element.id, property: {} });
                this.setState({ componentprop: tmpcomponentprop });
              }

            }
          }
        });

        if (groupVisible && groupNode.length > 0) {
          tabGroupNode.push(groupNode);
        }

        groupVisible = groupVisible && this.isGroupVisible(group, element, groupNode);
        tabVisible = tabVisible || groupVisible;
      });
      // tabvisiable hangi componenette hangi tabların gözüküceğini gösterir.Örn AccountingProps.js dosyasında startta
      // accountting tabının gözükme olayını create kısmı kendi handle eder.
      if (tabVisible) {
        tabItems.push({
          text: tab.label,
          value: tabIndex++,
          content: <div style={{ padding: '15px' }}> {tabGroupNode} </div>
        });
      }
    });

    var entries = this.extractEntries(tabs);
    var groups = this.extractGroups(tabs);

    this.current = {
      tabs: tabs,
      groups: groups,
      entries: entries,
      element: element
    };

    this.setState({ tabItems: [] }); // önce temizle (tab barın bir bug ı)
    this.setState({ tabItems: tabItems });

    this.update(this.current);
  }

  update(current) {
    var element = current.element;
    var tabs = current.tabs;

    tabs.forEach(tab => {
      tab.groups.forEach(group => {
        group.entries.forEach(entry => {
          if (entry.component) {
            entry.onChange = ((e, value, resource, element) => {

              console.log(value);
              console.log(e);
              console.log(resource);
              console.log(element);
              var tmpcomponentprop = [];
              Object.assign(tmpcomponentprop, this.state.componentprop);
              var component = (tmpcomponentprop.filter(item => item.id == element.id));
              if (component.length > 0) {
                component[0].property[resource.id] = value;

              }

              this.setState({ componentprop: tmpcomponentprop });
            });

            console.log('girdi');

            var component = (this.state.componentprop.filter(item => item.id == element.id));
            if (component.length > 0) {

              console.log(entry.id);
              console.log(component[0].property[entry.id]);

              entry.setValue(component[0].property[entry.id] ? component[0].property[entry.id] : '');
              //  entry.component.getInstance().setValue(component[0].property[entry.id] ? component[0].property[entry.id] : '');

              if (entry.id == 'id') {


                entry.component.getInstance().setValue(component[0].property[entry.id] ? component[0].property[entry.id] : element.id);
                element.businessObject.id
                  = component[0].property[entry.id] ? component[0].property[entry.id] : element.businessObject.id;
              }

            }
            //     console.log(entry.component);
            // console.log(entry.component.getInstance().getValue());
            //      console.log();
          }


        });
      });
    });

    // this.setState({ tabItems: tabItems });
  }

  isEntryVisible(entry) {
    return this.eventBus.fire('propertiesPanel.isEntryVisible', {
      entry: entry,
      element: this.element
    });
  }

  isGroupVisible(group, element, groupNode) {
    if (typeof group.enabled === 'function') {
      return group.enabled(element, groupNode);
    } else {
      return true;
    }
  }

  isTabVisible(tab, element) {
    if (typeof tab.enabled === 'function') {
      return tab.enabled(element);
    } else {
      return true;
    }
  }

  /**
   * Return a mapping of { id: entry } for all entries in the given groups in the given tabs.
   *
   * @param {Object} tabs
   * @return {Object}
   */
  extractEntries(tabs) {
    return indexBy(flattenDeep(map(flattenDeep(map(tabs, 'groups')), 'entries')), 'id');
  }

  /**
   * Return a mapping of { id: group } for all groups in the given tabs.
   *
   * @param {Object} tabs
   * @return {Object}
   */
  extractGroups(tabs) {
    return indexBy(flattenDeep(map(tabs, 'groups')), 'id');
  }

  handleChangeTab(event, value) {
    this.setState({ currentTab: value });
  }

  render() {
    return <BTabBar context={this.props.context} ref={r => (this.tabBar = r)} tabItems={this.state.tabItems} value={this.state.currentTab} onChange={this.handleChangeTab} />;
  }
}

export default BOAOnePropertiesPanel;
