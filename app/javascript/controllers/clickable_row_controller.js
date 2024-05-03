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

    const link = e.target.closest("tr").dataset["link"];
    if (e.which == 2 || e.which == 4 || e.metaKey || e.ctrlKey) {
      window.open(link, "_blank");
    }
    else {
      e.preventDefault();
      window.Turbo.visit(link)
    }
  }
}
