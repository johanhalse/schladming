import { Controller } from "@johanhalse/musculus";
import debounce from "debounce";

export default class RelationSearchController extends Controller {
  static targets = ["field", "visibleField", "results"];
  static values = { model: String };

  connect() {
    this.debouncedFetchData = debounce(this.fetchData.bind(this), 500);
  }

  change(e) {
    this.debouncedFetchData(e.target.value);
  }

  fetchData(text, update) {
    fetch("/admin/relations" + "?" + new URLSearchParams({ m: this.modelValue, q: text }))
      .then((response) => response.text())
      .then((response) => this.display(response));
  }

  display(response) {
    this.resultsTarget.innerHTML = response;
    this.bindNewActions(this.resultsTarget);
  }

  bindNewActions(el) {
    const actionElements = Array.from(el.querySelectorAll("[data-action]"));
    const actions = actionElements.flatMap(this.parseAction.bind(this));
    actions.forEach(this.bindAction.bind(this));
  }

  select(e) {
    const item = e.currentTarget;
    this.visibleFieldTarget.value = item.getAttribute("name");
    this.fieldTarget.value = item.id;
    this.resultsTarget.innerHTML = "";
  }
}
