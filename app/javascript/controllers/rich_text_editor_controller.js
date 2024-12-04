import { Controller } from "@johanhalse/musculus";
import Quill from "quill";
import htmlEditButton from "quill-html-edit-button";

Quill.register("modules/htmlEditButton", htmlEditButton);

export default class RichTextEditorController extends Controller {
  static targets = ["field"];

  connect() {
    const field = this.fieldTarget;
    this.quill = new Quill(this.querySelector(".quill"), { theme: "snow", modules: { htmlEditButton: {} } });
    this.quill.on("text-change", (delta, oldDelta, source) => {
      this.fieldTarget.value = this.quill.root.innerHTML;
    });
  }

  disconnect() {
    delete this.quill;
  }
}
