import { Controller } from "@johanhalse/musculus";
import flatpickr from "flatpickr";

export default class DatetimeSelectController extends Controller {
  connect() {
    const defaults = { enableTime: true, time_24hr: true, defaultMinute: 0 }
    const tmp = flatpickr(this.querySelector("input"), Object.assign(defaults, this.appendage()));
  }

  appendage() {
    return this.dataset["inline"] ? { inline: true } : {};
  }
}
