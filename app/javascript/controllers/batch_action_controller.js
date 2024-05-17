import { Controller } from "@johanhalse/musculus";

export default class BatchActionController extends Controller {
  static targets = ["actionbar", "all", "checkbox"];

  checkbox(e) {
    if(this.checkboxTargets.some(this.isChecked)) {
      this.showActions();
    }
    else {
      this.hideActions();
    }
  }

  isChecked(checkbox) {
    return checkbox.checked;
  }

  showActions() {
    this.actionbarTarget.classList.remove("hidden");
    this.allTarget.checked = true;
  }

  hideActions() {
    this.actionbarTarget.classList.add("hidden");
    this.allTarget.checked = false;
  }
}
