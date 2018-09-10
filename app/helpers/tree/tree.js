/* eslint-disable no-console */
export let TreeModule;

((TreeModule) => {
  class TreeNode {
    constructor(value, properties) {
      this.AddChild = (child) => {
        if (child == null) {
          console.log('Cannot insert null value');
          return;
        }
        if (child.hasParent) {
          console.log('The node already has parent');
          return;
        }
        child.hasParent = true;
        this.children.push(child);
      };
      if (value == null) {
        console.log('Cannot insert null value');
      }
      else {
        this.value = value;
        this.children = [];
        if (properties) {
          this.properties = properties;
        }
      }
    }

    get Value() {
      return this.value;
    }

    set Value(value) {
      this.value = value;
    }

    get Children() {
      return this.children;
    }

    get Properties() {
      return this.properties;
    }

    set Properties(properties) {
      this.properties = properties;
    }

    get ChildrenCount() {
      return this.children.length;
    }

    GetChild(index) {
      return this.children[index];
    }
  }

  TreeModule.TreeNode = TreeNode;

  class Tree {
    constructor(value, children, properties) {
      if (value) {
        this.root = new TreeNode(value, properties);
        if (children && children.length > 0) {
          children.map(this.root.AddChild);
        }
      }
      else {
        console.log('Cannot insert null value');
      }
    }

    get Root() {
      return this.root;
    }

    FindNode(value, root) {
      if (root.Value == value) {
        return root;
      }
      else if (!root.Children) {
        return;
      }
      let result;
      for (let i = 0; i < root.Children.length; i++) {
        result = this.FindNode(value, root.Children[i]);
        if (result && result.Value == value) {
          break;
        }
      }
      if (result && result.Value == value) {
        return result;
      }
    }
  }

  TreeModule.Tree = Tree;
})(TreeModule || (TreeModule = {}));
