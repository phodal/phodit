import React, {Component} from 'react';
import cx from 'classnames';
import Tree from "react-ui-tree";

class App extends Component {
  state = {
    path: null,
    active: null,
    tree: {}
  };

  diffTree(originTree, newTree) {
    if (originTree.hasOwnProperty('collapsed')) {
      if (newTree.module === originTree.module) {
        newTree.collapsed = originTree.collapsed;
      }

      if (originTree.children && newTree.children) {
        for (let originIndex in originTree.children) {
          for (let newIndex in newTree.children) {
            if (originTree.children[originIndex].module === newTree.children[newIndex].module) {
              newTree.children[newIndex].collapsed = originTree.children[originIndex].collapsed;
            }

            this.diffTree(originTree.children, newTree.children);
          }
        }
      }
    }

    return newTree;
  }

  componentDidMount() {
    let that = this;
    window.document.addEventListener('phodit.tree.open', function(data) {
      let parsedData = JSON.parse(data.detail);

      that.setState({
        path: parsedData.path,
        tree: parsedData.tree
      });

      that.getTreeData();
    });
  }

  renderNode = node => {
    return (
      <span className={cx('node', {'is-active': node === this.state.active})}
            onClick={this.onClickNode.bind(null, node)}
            onContextMenu={this.onContextMenuClick.bind(null, node)}>
        {node.module}
      </span>
    );
  };

  onClickNode = node => {
    this.setState({
      active: node
    });

    if (!node.leaf) {
      return;
    }

    const event = new CustomEvent('tree.pub.open', {
      detail: JSON.stringify(node)
    });
    window.document.dispatchEvent(event);
  };

  onContextMenuClick = node => {
    const event = new CustomEvent('tree.right.click', {
      detail: JSON.stringify(node)
    });
    window.document.dispatchEvent(event);
  };

  handleChange = tree => {
    this.setState({
      tree: tree
    });
    this.storageTreeData()
  };

  storageTreeData() {
    localStorage.setItem(this.state.path, JSON.stringify(this.state.tree));
  }

  getTreeData() {
    const data = localStorage.getItem(this.state.path);
    if (!data) return;

    try {
      const parsedData = JSON.parse(data);
      let diffedTree = this.diffTree(parsedData, this.state.tree);

      this.setState({
        tree: diffedTree
      });
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    return (
      <div className="App">
        <div className="tree">
          <Tree
            paddingLeft={10}
            tree={this.state.tree}
            onChange={this.handleChange}
            renderNode={this.renderNode}
          />
        </div>
      </div>
    );
  }
}

export default App;
