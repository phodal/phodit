import React, {Component} from 'react';
import cx from 'classnames';
import Tree from "react-ui-tree";
import './App.css';

class App extends Component {
  state = {
    active: null,
    tree: {
      module: 'react-ui-tree',
      children: [
        {
          module: 'dist',
          collapsed: true,
          children: [
            {
              module: 'node.js',
              leaf: true
            },
            {
              module: 'react-ui-tree.css',
              leaf: true
            },
            {
              module: 'react-ui-tree.js',
              leaf: true
            },
            {
              module: 'tree.js',
              leaf: true
            }
          ]
        },
        {
          module: 'example',
          children: [
            {
              module: 'app.js',
              leaf: true
            },
            {
              module: 'app.less',
              leaf: true
            },
            {
              module: 'index.html',
              leaf: true
            }
          ]
        },
        {
          module: 'lib',
          children: [
            {
              module: 'node.js',
              leaf: true
            },
            {
              module: 'react-ui-tree.js',
              leaf: true
            },
            {
              module: 'react-ui-tree.less',
              leaf: true
            },
            {
              module: 'tree.js',
              leaf: true
            }
          ]
        },
        {
          module: '.gitiignore',
          leaf: true
        },
        {
          module: 'index.js',
          leaf: true
        },
        {
          module: 'LICENSE',
          leaf: true
        },
        {
          module: 'Makefile',
          leaf: true
        },
        {
          module: 'package.json',
          leaf: true
        },
        {
          module: 'README.md',
          leaf: true
        },
        {
          module: 'webpack.config.js',
          leaf: true
        }
      ]
    }
  };

  renderNode = node => {
    return (
      <span
        className={cx('node', {
          'is-active': node === this.state.active
        })}
        onClick={this.onClickNode.bind(null, node)}
      >
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
