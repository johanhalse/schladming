import { Controller } from "@johanhalse/musculus";

export default class LeadEmailSelectController extends Controller {
  connect() {
    this.emailType = this.querySelector("select");
    this.refreshor = this.querySelector("input");
    this.emailType.addEventListener("change", this.onChange.bind(this), false);
  }

  onChange(e) {
    this.refreshor.click();
  }
}
