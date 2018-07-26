import React, {Component} from 'react';
import cx from 'classnames';
import Tree from "react-ui-tree";

class App extends Component {
  state = {
    active: null,
    tree: {"children":[{"children":[{"filename":"/Users/phodal/write/aofe/.idea/aofe.iml","leaf":true,"module":"aofe.iml"},{"children":[],"collapsed":true,"filename":"/Users/phodal/write/aofe/.idea/inspectionProfiles","module":"inspectionProfiles"},{"filename":"/Users/phodal/write/aofe/.idea/modules.xml","leaf":true,"module":"modules.xml"},{"filename":"/Users/phodal/write/aofe/.idea/vcs.xml","leaf":true,"module":"vcs.xml"},{"filename":"/Users/phodal/write/aofe/.idea/workspace.xml","leaf":true,"module":"workspace.xml"}],"collapsed":true,"filename":"/Users/phodal/write/aofe/.idea","module":".idea"},{"filename":"/Users/phodal/write/aofe/LICENSE","leaf":true,"module":"LICENSE"},{"filename":"/Users/phodal/write/aofe/Makefile","leaf":true,"module":"Makefile"},{"filename":"/Users/phodal/write/aofe/README.md","leaf":true,"module":"README.md"},{"children":[{"filename":"/Users/phodal/write/aofe/build/author.html","leaf":true,"module":"author.html"},{"filename":"/Users/phodal/write/aofe/build/head.html","leaf":true,"module":"head.html"},{"filename":"/Users/phodal/write/aofe/build/metadata.xml","leaf":true,"module":"metadata.xml"},{"filename":"/Users/phodal/write/aofe/build/share.html","leaf":true,"module":"share.html"},{"filename":"/Users/phodal/write/aofe/build/stats.html","leaf":true,"module":"stats.html"},{"filename":"/Users/phodal/write/aofe/build/title.txt","leaf":true,"module":"title.txt"}],"collapsed":true,"filename":"/Users/phodal/write/aofe/build","module":"build"},{"children":[{"filename":"/Users/phodal/write/aofe/chapters/00-prelude.md","leaf":true,"module":"00-prelude.md"},{"filename":"/Users/phodal/write/aofe/chapters/01-basic-workflow.md","leaf":true,"module":"01-basic-workflow.md"},{"filename":"/Users/phodal/write/aofe/chapters/02-build.md","leaf":true,"module":"02-build.md"},{"filename":"/Users/phodal/write/aofe/chapters/03-mono.md","leaf":true,"module":"03-mono.md"},{"filename":"/Users/phodal/write/aofe/chapters/04-mvc.md","leaf":true,"module":"04-mvc.md"},{"filename":"/Users/phodal/write/aofe/chapters/05-components.md","leaf":true,"module":"05-components.md"},{"filename":"/Users/phodal/write/aofe/chapters/06-api-manage.md","leaf":true,"module":"06-api-manage.md"},{"filename":"/Users/phodal/write/aofe/chapters/07-contract.md","leaf":true,"module":"07-contract.md"},{"filename":"/Users/phodal/write/aofe/chapters/08-bff.md","leaf":true,"module":"08-bff.md"},{"filename":"/Users/phodal/write/aofe/chapters/09-pub-sub.md","leaf":true,"module":"09-pub-sub.md"},{"filename":"/Users/phodal/write/aofe/chapters/10-route-micro.md","leaf":true,"module":"10-route-micro.md"},{"filename":"/Users/phodal/write/aofe/chapters/11-indep-app.md","leaf":true,"module":"11-indep-app.md"},{"filename":"/Users/phodal/write/aofe/chapters/12-half-mfe.md","leaf":true,"module":"12-half-mfe.md"},{"filename":"/Users/phodal/write/aofe/chapters/13-mfe.md","leaf":true,"module":"13-mfe.md"}],"collapsed":true,"filename":"/Users/phodal/write/aofe/chapters","module":"chapters"},{"children":[{"filename":"/Users/phodal/write/aofe/css/vendor.css","leaf":true,"module":"vendor.css"}],"collapsed":true,"filename":"/Users/phodal/write/aofe/css","module":"css"},{"filename":"/Users/phodal/write/aofe/ebook.md","leaf":true,"module":"ebook.md"},{"filename":"/Users/phodal/write/aofe/epub.css","leaf":true,"module":"epub.css"},{"children":[{"children":[{"filename":"/Users/phodal/write/aofe/images/ch01/basic-workflow.png","leaf":true,"module":"basic-workflow.png"},{"filename":"/Users/phodal/write/aofe/images/ch01/build-workflow.png","leaf":true,"module":"build-workflow.png"}],"collapsed":true,"filename":"/Users/phodal/write/aofe/images/ch01","module":"ch01"}],"collapsed":true,"filename":"/Users/phodal/write/aofe/images","module":"images"},{"children":[{"filename":"/Users/phodal/write/aofe/img/cover.jpg","leaf":true,"module":"cover.jpg"},{"filename":"/Users/phodal/write/aofe/img/favicon.ico","leaf":true,"module":"favicon.ico"}],"collapsed":true,"filename":"/Users/phodal/write/aofe/img","module":"img"},{"filename":"/Users/phodal/write/aofe/index.html","leaf":true,"module":"index.html"},{"filename":"/Users/phodal/write/aofe/init.sh","leaf":true,"module":"init.sh"},{"filename":"/Users/phodal/write/aofe/listings-setup.tex","leaf":true,"module":"listings-setup.tex"},{"filename":"/Users/phodal/write/aofe/style.css","leaf":true,"module":"style.css"},{"children":[{"filename":"/Users/phodal/write/aofe/template/template.tex","leaf":true,"module":"template.tex"}],"collapsed":true,"filename":"/Users/phodal/write/aofe/template","module":"template"}],"collapsed":true,"filename":"/Users/phodal/write/aofe","module":"aofe"}
  };

  componentDidMount() {
    let that = this;
    window.document.addEventListener('phodit.tree.open', function(data) {
      that.setState({
        tree: JSON.parse(data.detail)
      });
    });
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

    if (!node.leaf) {
      return;
    }

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
