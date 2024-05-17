import { Controller } from "@johanhalse/musculus";

export default class SelectAllController extends Controller {
  static targets = ["resource"];

  change(e) {
    const event = new Event("change");
    this.resourceTargets.forEach((target) => target.checked = e.target.checked);
    this.resourceTargets[0].dispatchEvent(event);
  }
}
