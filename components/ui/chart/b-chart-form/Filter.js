import React from 'react'; 
import PropTypes from 'prop-types';
import { getModule } from 'b-dynamic-components';
import BProgress from 'b-progress';
import Paper from '@material-ui/core/Paper';
import Container from './Container';
import Row from './Row';
import Col from './Col';

import { BComponent } from 'b-component';
// import { BThemeProvider } from 'b-component';
import { BComboBox } from 'b-combo-box';
// import { Divider } from '@material-ui/core';

export default class Filter extends BComponent {

  static propTypes = {
    components: PropTypes.any,
    tags: PropTypes.array,
    selectedTagChanged: PropTypes.func,
    onDynamicParameterChanged: PropTypes.func
  }

  constructor(props, context) {
    super(props, context);
    this.onSelect = this.onSelect.bind(this);
    this.selectedIndexes = [-1];
    this.selectedTags = [];
    this.snaps = [];
    this.dataSource = this.getTagDataSource();
  }

  getTagDataSource() {
    var dataSource = [];
    var selectedIndexes = [];
    for (var index = 0; index < this.props.tags.length; index++) {
      var tag = this.props.tags[index];
      dataSource.push({
        text: tag,
        value: index
      });
      selectedIndexes.push(index);
    }
    this.selectedIndexes = selectedIndexes;
    this.selectedTags = this.props.tags ? this.props.tags : [];
    return dataSource;
  }

  getColumns() {
    var columns = [
      {
        key: 'text',
        name: 'Etiket',
        'width': 140
      }
    ];
    return columns;
  }

  getSelectedTags() {
    return this.selectedTags;
  }

  onSelect(index, items) {
    var tags = [];
    this.selectedIndexes = [];
    for (var tindx = 0; tindx < items.length; tindx++) {
      tags.push(items[tindx].text);
      this.selectedIndexes.push(items[tindx].value);
    }
    this.selectedTags = tags;
    if (this.props.selectedTagChanged)
      this.props.selectedTagChanged(tags);

  }

  getSnapshot() {
    return {
      snaps: this.snaps,
      selectedTags: this.selectedTags
    };
  }

  setSnapshot(snapshot) {
    let { snaps, selectedTags } = snapshot;
    this.snaps = snaps;
    this.selectedTags = selectedTags;
  }

  getFilterValues() {
    var parameters = {};
    Object.keys(this.snaps).forEach((key: string) => {
      if (this.snaps[key].getInstance().getValue) {
        parameters[key.toString()] = this.snaps[key].getInstance().getValue();
      }
    });
    return parameters;
  }

  render() {

    let copySelectedIndexes = Object.assign([], this.selectedIndexes);

    if (!this.dataSource || this.dataSource.length == 0) {
      this.dataSource = this.getTagDataSource();
    }

    if (!this.props.components) {
      return (
        <Paper>
          <BProgress />
        </Paper>
      );
    }
    else {
      return (
        <Paper>
          <Container>
            <Row style={{ padding: 5 }}>
              {
                this.props.components.map((child: any) => {
                  let childProps = { ...child.props };
                  var DynamicComponent = getModule(child.props.packageName);
                  return (
                    <Col xs={12} sm={6} md={4} lg={4}>
                      <DynamicComponent
                        {...childProps}
                        onChangeSync={this.props.onDynamicParameterChanged}
                        ref={(r: any) => this.snaps[child.key] = r}
                        context={this.props.context}
                        key={child.key}>
                      </DynamicComponent>
                    </Col>
                  );
                }
                )
              }
              {
                ((this.props.tags && this.props.tags.length > 0) &&
                  <Col xs={12} sm={6} md={4} lg={4}>
                    <BComboBox
                      context={this.props.context}
                      ref={r => this.combo = r}
                      labelText={this.getMessage('BOAOne', 'Labels')}
                      dataSource={this.dataSource}
                      columns={this.getColumns()}
                      displayMemberPath='text'
                      valueMemberPath='value'
                      multiColumn={false}
                      multiSelect={true}
                      onSelect={this.onSelect}
                      value={copySelectedIndexes}>
                    </BComboBox>
                  </Col>
                )
              }
            </Row>
          </Container>
        </Paper>);
    }
  }
}

