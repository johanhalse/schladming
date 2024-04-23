import { Controller } from "@johanhalse/musculus";

export default class SlugonatorController extends Controller {
  static targets = ["slug"];

  onChange(e) {
    this.slugTarget.value = this.slugonate(e.target.value);
  }

  slugonate(str) {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replaceAll(/[\u0300-\u036f]/g, "")
      .replaceAll(/[.,!@#$%^&*()]/g, "")
      .replaceAll(" ", "-");
  }
}
