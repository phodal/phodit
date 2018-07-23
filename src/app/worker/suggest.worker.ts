const blogpostData = require('../../assets/data/output.json');

let lunr = require('lunr');
let dataWithIndex: any[] = [];
let lunrIdx: any;

lunrIdx = lunr(function () {
  this.field('title', {boost: 10});
  this.field('content');

  for (let item of blogpostData) {
    this.add(item);
    dataWithIndex[item.id] = item;
  }
});

export class SuggestWorker {
  search(arg: string) {
    let searchResults = lunrIdx.search(arg);
    let response = [];

    for (let result of searchResults) {
      let blogpost = dataWithIndex[result.ref];
      response.push({
        text: `[${blogpost.title}](https://www.phodal.com/blog/${blogpost.slug})`,
        displayText: blogpost.title
      })
    }

    return response;
  }
}

