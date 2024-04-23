import { Controller } from "@johanhalse/musculus";

export default class SelectAllController extends Controller {
  static targets = ["resource"];

  change(e) {
    this.resourceTargets.forEach((target) => target.checked = e.target.checked);
  }
}
