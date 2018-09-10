import _ from 'lodash';

/**
 * Index dosyasında da kullanıldığından
 * @param {*} nodes
 * @param {*} doJop
 */
export const treeForEach = (nodes, doJop) => {
  (nodes || []).forEach(node => {
    doJop && doJop(node);
    if ((node.children || []).length > 0) {
      treeForEach(node.children, doJop);
    }
  });
};

/**
 * Index dosyasında da kullanıldığından
 * @param {*} list
 */
export const sortByNumber = list => {
  list = list || [];
  list.forEach(item => {
    if (item.children) {
      item.children = sortByNumber(item.children);
    }
  });
  return _.sortBy(_.sortBy(list, 'channelId'), 'sortId');
};

/**
 * Index dosyasında da kullanıldığından
 * @param {*} list
 */
export const sortByName = list => {
  list = list || [];
  list.forEach(item => {
    if (item.children) {
      item.children = sortByName(item.children);
    }
  });
  return _.sortBy(list, 'name');
};
