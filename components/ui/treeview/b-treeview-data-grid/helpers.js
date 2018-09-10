export const setSelectedNode = (data, valuePath, value) => {
  if (data[valuePath] == value) {
    return data;
  }
  if (data.children && data.children.length > 0) {
    for (let i = 0; i < data.children.length; i++) {
      let node = setSelectedNode(data.children[i], valuePath, value);
      if (node != null) {
        data.toggled = true;
        return node;
      }
    }
  }
};

export const findNode = (data, valuePath, value) => {
  if (data[valuePath] == value) {
    return data;
  }
  if (data.children && data.children.length > 0) {
    for (let i = 0; i < data.children.length; i++) {
      let node = findNode(data.children[i], valuePath, value);
      if (node != null) {
        return node;
      }
    }
  }
};

export const collapseAll = (data) => {
  if (data.toggled == true) {
    data.toggled = false;
  }
  if (data.children && data.children.length > 0) {
    for (let i = 0; i < data.children.length; i++) {
      let node = collapseAll(data.children[i]);
      if (node != null) {
        return node;
      }
    }
  }
};

export const expandAll = (data) => {
  data.toggled = true;
  if (data.children && data.children.length > 0) {
    for (let i = 0; i < data.children.length; i++) {
      let node = expandAll(data.children[i]);
      if (node != null) {
        return node;
      }
    }
  }
};

export const unSelectAll = (data) => {
  data.active = false;
  if (data.children && data.children.length > 0) {
    for (let i = 0; i < data.children.length; i++) {
      let node = unSelectAll(data.children[i]);
      if (node != null) {
        return node;
      }
    }
  }
};