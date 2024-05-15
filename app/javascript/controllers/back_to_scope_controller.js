import { Controller } from "@johanhalse/musculus";
import Cookies from "js-cookie";

export default class BackToScopeController extends Controller {
  click(e) {
    const resource = this.dataset["resource"];
    const url = Cookies.get(`return_to_${resource}_tab`);

    if (url) {
      e.preventDefault();
      window.Turbo.visit(e.target.href + "?scope=" + url);
    }
  }
}
