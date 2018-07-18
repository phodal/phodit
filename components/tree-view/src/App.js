import React, {Component} from 'react';
import cx from 'classnames';
import Tree from "react-ui-tree";

class App extends Component {
  state = {
    active: null,
    tree: {}
  };

  componentDidMount() {
    var that = this;
    window.document.addEventListener('phodit.tree.open', function(data) {
      that.setState({
        tree: JSON.parse(data.detail)
      })
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

    const event = new CustomEvent('tree.pub.open', {
      detail: JSON.stringify(node)
    });
    window.document.dispatchEvent(event);
  };

  handleChange = tree => {
    this.setState({
      tree: tree
    });
  };

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
