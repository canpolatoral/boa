export const setSelectedNode = (data, valuePath, value) => {
  if (data[valuePath] === value) {
    return data;
  }
  if (data.children && data.children.length > 0) {
    for (let i = 0; i < data.children.length; i++) {
      const node = setSelectedNode(data.children[i], valuePath, value);
      if (node != null) {
        data.toggled = true;
        return node;
      }
    }
  }
  return null;
};

export const sumNodeHeader = (data, firstNode) => {
  let newData = {};
  const columnsSum = { column1: 0, column2: 0, column3: 0, column4: 0 };
  if (data.children && data.children.length > 0) {
    for (let i = 0; i < data.children.length; i++) {
      const columns = sumNodeHeader(data.children[i], false);
      if (columns) {
        if (columns.column1) {
          columnsSum.column1 = Number(columnsSum.column1) + Number(columns.column1);
        }
        if (columns.column2) {
          columnsSum.column2 = Number(columnsSum.column2) + Number(columns.column2);
        }
        if (columns.column3) {
          columnsSum.column3 = Number(columnsSum.column3) + Number(columns.column3);
        }
        if (columns.column4) {
          columnsSum.column4 = Number(columnsSum.column4) + Number(columns.column4);
        }
      }
    }
    if (!firstNode) {
      newData = Object.assign(data, columnsSum);
    } else {
      newData = data;
    }
    return newData;
  }

  return {
    column1: data.column1,
    column2: data.column2,
    column3: data.column3,
    column4: data.column4,
  };
};


export const findNode = (data, valuePath, value) => {
  if (data[valuePath] === value) {
    return data;
  }
  if (data.children && data.children.length > 0) {
    for (let i = 0; i < data.children.length; i++) {
      const node = findNode(data.children[i], valuePath, value);
      if (node != null) {
        return node;
      }
    }
  }
  return null;
};


export const collapseAll = (data) => {
  if (data.toggled === true) {
    data.toggled = false;
  }
  if (data.children && data.children.length > 0) {
    for (let i = 0; i < data.children.length; i++) {
      const node = collapseAll(data.children[i]);
      if (node != null) {
        return node;
      }
    }
  }
  return null;
};

export const expandAll = (data) => {
  data.toggled = true;
  if (data.children && data.children.length > 0) {
    for (let i = 0; i < data.children.length; i++) {
      const node = expandAll(data.children[i]);
      if (node != null) {
        return node;
      }
    }
  }
  return null;
};

export const handleOnToggleItems = (node, toggled) => {
  if (this.selectedNode) {
    this.selectedNode.active = false;
  }
  if (this.state.cursor) {
    this.state.cursor.active = false;
  }
  node.active = true;
  if (node.children) {
    node.toggled = toggled;
  }
  this.selectedNode = node;
  this.setState({ cursor: Object.assign({}, node) });
  if (this.props.onToggle) {
    this.props.onToggle(node, toggled);
  }
};

export const unSelectAll = (data) => {
  data.active = false;
  if (data.children && data.children.length > 0) {
    for (let i = 0; i < data.children.length; i++) {
      const node = unSelectAll(data.children[i]);
      if (node != null) {
        return node;
      }
    }
  }
  return null;
};
