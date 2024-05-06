import { Controller } from "@johanhalse/musculus";
import Cookies from "js-cookie";

export default class BackToScopeController extends Controller {
  click(e) {
    const url = Cookies.get("return_to_tab");
    if (url) {
      e.preventDefault();
      window.Turbo.visit(e.target.href + "?scope=" + url);
    }
  }
}
