import { Controller } from "@johanhalse/musculus";
import flatpickr from "flatpickr";

export default class DateSelectController extends Controller {
  connect() {
    this.picker = flatpickr(this.querySelector("input"), { dateFormat: "Y-m-d" });
  }
}
