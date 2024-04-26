import { Controller } from "@johanhalse/musculus";

export default class HamburgerMenuController extends Controller {
  connect() {
    this.classList.add("cursor-pointer");
  }

  toggle(e) {
    document.getElementById("left-menu").classList.toggle("-translate-x-full");
    document.getElementById("main").classList.toggle("blur-sm");
  }
}
