import { Controller } from "@johanhalse/musculus";
import Quill from "quill";
import htmlEditButton from "quill-html-edit-button";
import ImageUploader from "../quill.imageuploader.js";
import digitalOceanUploader from "../digital-ocean-uploader.js";

Quill.register("modules/htmlEditButton", htmlEditButton);
Quill.register("modules/imageUploader", ImageUploader);

const toolbarOptions = [
  [{ header: [1, 2, 3, false] }],
  ["bold", "italic"],
  [{ "list": "bullet"}, { "list": "ordered" }],
  ["clean"],
  ["image"],
];

export default class RichTextEditorController extends Controller {
  static targets = ["field"];

  connect() {
    const field = this.fieldTarget;

    this.quill = new Quill(
      this.querySelector(".quill"),
      {
        theme: "snow",
        modules: {
          htmlEditButton: {},
          imageUploader: { upload: digitalOceanUploader.upload.bind(digitalOceanUploader) },
          toolbar: toolbarOptions
        },
      });
    this.quill.on("text-change", (delta, oldDelta, source) => {
      this.fieldTarget.value = this.quill.root.innerHTML;
    });
  }

  disconnect() {
    delete this.quill;
  }
}
