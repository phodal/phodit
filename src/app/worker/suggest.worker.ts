const blogpostData = require("../../assets/data/output.json");

const lunr = require("lunr");
const dataWithIndex: any[] = [];
let lunrIdx: any;

lunrIdx = lunr(function() {
  this.field("title", {boost: 10});
  this.field("content");

  for (const item of blogpostData) {
    this.add(item);
    dataWithIndex[item.id] = item;
  }
});

export class SuggestWorker {
  public search(arg: string) {
    const searchResults = lunrIdx.search(arg);
    const response = [];

    for (const result of searchResults) {
      const blogpost = dataWithIndex[result.ref];
      response.push({
        text: `[${blogpost.title}](https://www.phodal.com/blog/${blogpost.slug})`,
        displayText: blogpost.title,
      });
    }

    return response;
  }
}

