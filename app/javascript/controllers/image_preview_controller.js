import { Controller } from "@johanhalse/musculus";

export default class ImagePreviewController extends Controller {
  static targets = ["container"];

  preview(e) {
    const file = e.currentTarget.files[0];
    if (!file.type.startsWith("image/")) {
      return;
    }

    const img = this.imageElement(file);

    this.containerTarget.innerHTML = "";
    this.containerTarget.appendChild(img);
    this.generatePreview(file, img);
  }

  generatePreview(file, img) {
    const reader = new FileReader();
    reader.onload = (function (aImg) {
      return function (e) {
        aImg.src = e.target.result;
      };
    })(img);
    reader.readAsDataURL(file);
  }

  imageElement(file) {
    const img = document.createElement("img");
    img.file = file;

    return img;
  }
}
