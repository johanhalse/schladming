import { Controller } from "@johanhalse/musculus";

export default class AdminCleaveController extends Controller {
  connect() {
    const input = this.querySelector("input");

    if (input.autocomplete == "cc-number") {
      this.cc({ target: input });
    }
    else {
      this.cleave({ target: input });
    }
  }

  cleave(e) {
    const amount = parseInt(e.target.value.replaceAll(" ", ""));
    if (isNaN(amount)) {
      return;
    }

    e.target.value = parseInt(amount).toLocaleString("en").replaceAll(",", " ");
  }

  cc(e) {
    const amount = e.target.value.replaceAll(" ", "");
    const result = [];
    for (let i = 0; i < amount.length; i += 4) {
      result.push(amount.slice(i, i + 4));
    }

    e.target.value = result.join(" ");
  }
}
