import { Controller } from "@johanhalse/musculus";
import flatpickr from "flatpickr";

export default class DatetimeSelectController extends Controller {
  connect() {
    const tmp = flatpickr(this.querySelector("input"), {
      enableTime: true,
      time_24hr: true,
      defaultMinute: 0,
    });
  }
}
