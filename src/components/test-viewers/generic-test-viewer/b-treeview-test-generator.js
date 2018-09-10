import React from 'react';
import BTreeView from 'b-treeview';
import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';
import { Tabs, Tab } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

import doc from '../../treeview/b-treeview/docs/content.json';
import sampleData from '../../treeview/b-treeview/data/sampleData';

export class BTreeViewTestGenerator {
  initialize(self) {
    this.self = self;
    if (!self.state) {
      self.state = {};
    }
    self.state = {
      data: [],
      selectedNode: null,
      filterText: '',
      caseSensitive: false,
      exactMatch: false,
      includeAncestors: true,
      includeDescendants: true,
      canCheckChildsByParent: true,
      showIcons: true,
      isCheckable: true,
      isMultiSelect: true,
      selectable: true,
      isLeafCheckable: false,
      expandAll: false,
      showSearch: true,
      dataSize: 10000,
      eventList: [],
      selectedTabIndex: 0,
      renderCount: 0,
      selectedNodeId: 2,
      showFooter: true,
      isSingleCheckable: false
    };
  }
  eventList = [];
  handleTabChange = (event, value) => {
    this.self.setState({ selectedTabIndex: value });
  };

  getEventList(eventName) {
    this.eventList.push(eventName);
    return this.eventList;
  }

  changeCheckedState = key => event => {
    const checked = event.target.checked;

    this.self.setState(
      {
        [key]: checked
      },
      () => {
        this.treeView.filterTree();
      }
    );
  };

  changePropCheckedState = key => event => {
    const checked = event.target.checked;
    this.self.setState({
      [key]: checked
    });
  };

  handleOnTextChange = name => event => {
    this.self.setState({
      [name]: event.target.value
    });
  };

  onSelectNode = node => {
    if (node) {
      this.self.setState({
        renderCount: this.self.state.renderCount + 1,
        selectedNode: node,
        selectedNodeId: node.id,
        eventList: this.getEventList('onSelectNode(node) => ' + (node && node.name))
      });
    }
  };

  onCheckNode(node, checked) {
    this.self.setState({
      renderCount: this.self.state.renderCount + 1,
      selectedNode: node,
      selectedNodeId: node.id,
      checked: checked,
      eventList: this.getEventList('onCheckNode(node, checked) => ' + (node && node.name) + ' - ' + checked.toString())
    });
  }

  generate(context, self) {
    return [
      {
        text: 'BTreeView',
        component: (
          <div className="container-fluid">
            <div className="row">
              <div className="col-xs-6">
                <h4>Some Props</h4>
                <div className="row">
                  <div className="col-xs-4">
                    <div className="checkbox" style={{ margin: '5px 0' }}>
                      <label>
                        <input
                          type="checkbox"
                          name="isCheckable"
                          checked={self.state.isCheckable}
                          onChange={this.changePropCheckedState('isCheckable')}
                        />
                        Is Checkable
                      </label>
                    </div>
                  </div>
                  <div className="col-xs-4">
                    <div className="checkbox" style={{ margin: '5px 0' }}>
                      <label>
                        <input
                          type="checkbox"
                          name="isMultiSelect"
                          checked={self.state.isMultiSelect}
                          onChange={this.changePropCheckedState('isMultiSelect')}
                        />
                        Is Multi Select
                      </label>
                    </div>
                  </div>
                  <div className="col-xs-4">
                    <div className="checkbox" style={{ margin: '5px 0' }}>
                      <label>
                        <input
                          type="checkbox"
                          name="isLeafCheckable"
                          disabled={!self.state.isCheckable}
                          checked={self.state.isLeafCheckable}
                          onChange={this.changePropCheckedState('isLeafCheckable')}
                        />
                        Is Leaf Checkable
                      </label>
                    </div>
                  </div>
                  <div className="col-xs-4">
                    <div className="checkbox" style={{ margin: '5px 0' }}>
                      <label>
                        <input
                          type="checkbox"
                          name="showIcons"
                          checked={self.state.showIcons}
                          onChange={this.changePropCheckedState('showIcons')}
                        />
                        Show Icons
                      </label>
                    </div>
                  </div>
                  <div className="col-xs-4">
                    <div className="checkbox" style={{ margin: '5px 0' }}>
                      <label>
                        <input
                          type="checkbox"
                          name="expandAll"
                          checked={self.state.expandAll}
                          onChange={this.changePropCheckedState('expandAll')}
                        />
                        Expand All
                      </label>
                    </div>
                  </div>
                  <div className="col-xs-4">
                    <div className="checkbox" style={{ margin: '5px 0' }}>
                      <label>
                        <input
                          type="checkbox"
                          name="showSearch"
                          checked={self.state.showSearch}
                          onChange={this.changePropCheckedState('showSearch')}
                        />
                        Show Search
                      </label>
                    </div>
                  </div>
                  <div className="col-xs-4">
                    <div className="checkbox" style={{ margin: '5px 0' }}>
                      <label>
                        <input
                          type="checkbox"
                          name="canCheckChildsByParent"
                          checked={self.state.canCheckChildsByParent}
                          disabled={!self.state.isCheckable}
                          onChange={this.changePropCheckedState('canCheckChildsByParent')}
                        />
                        Can Check Childs By Parent
                      </label>
                    </div>
                  </div>
                  <div className="col-xs-4">
                    <div className="checkbox" style={{ margin: '5px 0' }}>
                      <label>
                        <input
                          type="checkbox"
                          name="showFooter"
                          checked={self.state.showFooter}
                          disabled={!self.state.isCheckable}
                          onChange={this.changePropCheckedState('showFooter')}
                        />
                        Show Footer
                      </label>
                    </div>
                  </div>
                  <div className="col-xs-4">
                    <div className="checkbox" style={{ margin: '5px 0' }}>
                      <label>
                        <input
                          type="checkbox"
                          name="showFooter"
                          checked={self.state.isSingleCheckable}
                          disabled={!self.state.isCheckable}
                          onChange={this.changePropCheckedState('isSingleCheckable')}
                        />
                        Is Single Checkable
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xs-6">
                <h4>
                  Example Component <br /> <span style={{ opacity: '0.7', fontSize: '14px' }}>BResourceBrowser</span>{' '}
                </h4>
              </div>
            </div>
            <div className="row">
              <div className="col-xs-6">
                <h4>Search Props</h4>
                <div className="row">
                  <div className="col-xs-6">
                    <div className="checkbox" style={{ margin: '5px 0' }}>
                      <label>
                        <input
                          type="checkbox"
                          name="case-sensitive"
                          checked={self.state.caseSensitive}
                          onChange={this.changeCheckedState('caseSensitive')}
                        />
                        Case-sensitive
                      </label>
                    </div>
                  </div>
                  <div className="col-xs-6">
                    <div className="checkbox" style={{ margin: '5px 0' }}>
                      <label>
                        <input
                          type="checkbox"
                          name="exact-match"
                          checked={self.state.exactMatch}
                          onChange={this.changeCheckedState('exactMatch')}
                        />
                        Exact match
                      </label>
                    </div>
                  </div>
                  <div className="col-xs-6">
                    <div className="checkbox" style={{ margin: '5px 0' }}>
                      <label>
                        <input
                          type="checkbox"
                          name="include-ancestors"
                          checked={self.state.includeAncestors}
                          onChange={this.changeCheckedState('includeAncestors')}
                        />
                        Include ancestors
                      </label>
                    </div>
                  </div>
                  <div className="col-xs-6">
                    <div className="checkbox" style={{ margin: '5px 0' }}>
                      <label>
                        <input
                          type="checkbox"
                          name="include-descendants"
                          checked={self.state.includeDescendants}
                          onChange={this.changeCheckedState('includeDescendants')}
                        />
                        Include descendants
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-xs-6">
                <br />
                <BTreeView
                  context={context}
                  ref={r => (this.treeView = r)}
                  data={sampleData}
                  expandAll={self.state.expandAll}
                  selectable={self.state.selectable}
                  selectedNode={self.state.selectedNode}
                  height={400}
                  showIcons={self.state.showIcons}
                  isCheckable={self.state.isCheckable}
                  isMultiSelect={self.state.isMultiSelect}
                  isLeafCheckable={self.state.isLeafCheckable}
                  onSelectNode={this.onSelectNode}
                  canCheckChildsByParent={self.state.canCheckChildsByParent}
                  selectedNodeId={self.state.selectedNodeId}
                  showFooter={self.state.showFooter}
                  isSingleCheckable={self.state.isSingleCheckable}
                  onCheckNode={(node, checked) => {
                    this.onCheckNode(node, checked);
                  }}
                  rowHeight={40}
                  caseSensitive={self.state.caseSensitive}
                  exactMatch={self.state.exactMatch}
                  includeAncestors={self.state.includeAncestors}
                  includeDescendants={self.state.includeDescendants}
                  showSearch={self.state.showSearch}
                />
              </div>
              <div className="col-xs-6">
                <br />
                <Paper>
                  <Tabs value={self.state.selectedTabIndex} onChange={this.handleTabChange} indicatorColor="primary" textColor="primary">
                    <Tab label="Selected Node" />
                    <Tab label="Event Handler" />
                    <Tab label="Data Attributes" />
                  </Tabs>
                </Paper>
                {self.state.selectedTabIndex === 0 && (
                  <Typography component="div">
                    <Preview node={self.state.selectedNode} />
                  </Typography>
                )}
                {self.state.selectedTabIndex === 1 && (
                  <Typography component="div">
                    <EventPreview eventList={self.state.eventList} />
                  </Typography>
                )}
                {self.state.selectedTabIndex === 2 && (
                  <Typography component="div">
                    <DataAttributesPreview />
                  </Typography>
                )}
              </div>
            </div>
          </div>
        )
      }
    ];
  }
}
export default BTreeViewTestGenerator;

const Preview = props => {
  const { node } = props;

  let obj = {};
  if (node) {
    obj = {
      id: node.id,
      name: node.name,
      detail: node.detail === undefined ? undefined : node.detail,
      isSelected: node.isSelected === undefined ? false : node.isSelected,
      isExpanded: node.isExpanded === undefined ? false : node.isExpanded,
      children: node.children ? node.children.length : 0,
      parent: node.parent ? node.parent.id : null,
      state: node.state
    };
  }

  const innerHTML = JSON.stringify(obj, null, 2)
    .replace(/\n/g, '<br>')
    .replace(/\s/g, '&nbsp;');

  return (
    <div>
      <PreviewContainer dangerouslySetInnerHTML={{ __html: innerHTML }} />
    </div>
  );
};

const EventPreview = props => {
  const innerHTML = JSON.stringify(props.eventList, null, 2)
    .replace(/\n/g, '<br>')
    .replace(/\s/g, '&nbsp;');

  return (
    <div>
      <PreviewContainer dangerouslySetInnerHTML={{ __html: innerHTML }} />
    </div>
  );
};

const DataAttributesPreview = props => {
  const innerHTML = JSON.stringify(doc[2].infoArray, null, 2)
    .replace(/\n/g, '<br>')
    .replace(/\s/g, '&nbsp;');

  return (
    <div>
      <PreviewContainer dangerouslySetInnerHTML={{ __html: innerHTML }} />
    </div>
  );
};

const PreviewContainer = styled.pre`
  font-family: Consolas;
  font-size: 14px;
  font-weight: bold;
  white-space: pre-wrap;
  border: solid 1px #ccc;
  color: #9197a3;
  padding: 20px;
  min-height: 400px;
`;

export const generate = (size = 1000) => {
  const data = [];
  const source =
    '{"id":"<root>","name":"<root>","props":{"droppable":true},"children":[{"id":"alpha","name":"Alpha","props":{"droppable":true}},{"id":"bravo","name":"Bravo","props":{"droppable":true},"children":[{"id":"charlie","name":"Charlie","props":{"droppable":true},"children":[{"id":"delta","name":"Delta","props":{"droppable":true},"children":[{"id":"echo","name":"Echo","props":{"droppable":true}},{"id":"foxtrot","name":"Foxtrot","props":{"droppable":true}}]},{"id":"golf","name":"Golf","props":{"droppable":true}}]},{"id":"hotel","name":"Hotel","props":{"droppable":true},"children":[{"id":"india","name":"India","props":{"droppable":true},"children":[{"id":"juliet","name":"Juliet","props":{"droppable":true}}]}]},{"id":"kilo","name":"Kilo","loadOnDemand":true,"props":{"droppable":true}}]}]}';
  for (let i = 0; i < size; ++i) {
    data.push(JSON.parse(source.replace(/"(id|name)":"([^"]*)"/g, '"$1": "$2.' + i + '"')));
  }
  return data;
};
