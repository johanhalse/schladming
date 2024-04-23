import { Controller } from "@johanhalse/musculus";

export default class AdminTabController extends Controller {
  connect() {
    document.querySelectorAll("admin-tab-controller label").forEach(this.setCurrent.bind(this));
  }

  mark(e) {
    document.querySelectorAll("admin-tab-controller label").forEach(this.unselect);
    this.select(e.target);
  }

  setCurrent(target) {
    const checkbox = document.getElementById(target.getAttribute("for"));

    if (checkbox.checked) {
      this.select(target);
    }
    else {
      this.unselect(target);
    }
  }

  unselect(target) {
    target.classList.add("bg-neutral-200", "hover:bg-neutral-300");
    target.classList.remove("bg-cyan-200");
  }

  select(target) {
    target.classList.remove("bg-neutral-200", "hover:bg-neutral-300");
    target.classList.add("bg-cyan-200");
  }
}
