import Tagify from "@yaireo/tagify";
import { Controller } from "@johanhalse/musculus";

export default class TagFieldController extends Controller {
  connect() {
    this.tagify = new Tagify(this.querySelector("textarea"), this.opticons());
  }

  opticons() {
    const options = JSON.parse(this.dataset["tagify"] || "{}");
    return Object.assign({ originalInputValueFormat: this.mapValue }, options);
  }

  mapValue(valuesArr) {
    return valuesArr.map(item => item.value).join(',');
  }
}
