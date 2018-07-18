import React, {Component} from 'react';
import cx from 'classnames';
import Tree from "react-ui-tree";

class App extends Component {
  state = {
    active: null,
    tree: {}
  };

  componentDidMount() {
    window.document.addEventListener('phodit.tree.open', function(data) {
      console.log(data);
    })
  }

  renderNode = node => {
    return (
      <span className={cx('node', {'is-active': node === this.state.active})}
            onClick={this.onClickNode.bind(null, node)}>
        {node.module}
      </span>
    );
  };

  onClickNode = node => {
    this.setState({
      active: node
    });
  };

  handleChange = tree => {
    this.setState({
      tree: tree
    });
  };

  updateTree = () => {
    const {tree} = this.state;
    tree.children.push({module: 'test'});
    this.setState({
      tree: tree
    });
  };

  render() {
    return (
      <div className="App">
        <div className="tree">
          <Tree
            paddingLeft={20}
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
