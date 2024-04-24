import { Controller } from "@johanhalse/musculus";
import Quill from "quill";

export default class RichTextEditorController extends Controller {
  static targets = ["field"];

  connect() {
    const field = this.fieldTarget;
    this.quill = new Quill(this.querySelector(".quill"), { theme: "snow" });
    this.quill.on("text-change", (delta, oldDelta, source) => {
      this.fieldTarget.value = this.quill.root.innerHTML;
    });
  }

  disconnect() {
    delete this.quill;
  }
}
