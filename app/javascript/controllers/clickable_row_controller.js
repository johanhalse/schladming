import { Controller } from "@johanhalse/musculus";

export default class ClickableRowController extends Controller {
  connect() {
    this.querySelectorAll("[data-link]").forEach(this.addHoverClasses);
  }

  addHoverClasses(tr) {
    tr.classList.add("cursor-pointer", "hover:bg-neutral-200");
  }

  click(e) {
    if (e.target.tagName == "A" || e.target.tagName == "INPUT") {
      return true;
    }
    e.preventDefault();
    window.Turbo.visit(e.target.closest("tr").dataset["link"])
  }
}
