import { Controller } from "@johanhalse/musculus";
import debounce from "debounce";

export default class GeoSearchController extends Controller {
  static targets = ["field", "visibleField", "results"];
  static values = { model: String };

  connect() {
    this.debouncedFetchData = debounce(this.fetchData.bind(this), 500);
  }

  change(e) {
    this.debouncedFetchData(e.target.value);
  }

  fetchData(text, update) {
    fetch("https://nominatim.openstreetmap.org/search?" + new URLSearchParams({ q: text, format: "jsonv2" }))
      .then((response) => response.json())
      .then((response) => this.display(response));
  }

  buildMarkup(response) {
    return response.map(function(location) {
      return `
        <div>
          <span
            class="block p-2 cursor-pointer hover:bg-neutral-100"
            name="${location.name}"
            id="${location.place_id}"
            data-action="click->geo-search#select"
          >${location.display_name}</span>
        </div>`
    }).join("");
  }

  display(response) {
    console.log(this.buildMarkup(response), this.resultsTarget);
    this.resultsTarget.innerHTML = this.buildMarkup(response);
    this.bindNewActions(this.resultsTarget);
  }

  bindNewActions(el) {
    const actionElements = Array.from(el.querySelectorAll("[data-action]"));
    const actions = actionElements.flatMap(this.parseAction.bind(this));
    actions.forEach(this.bindAction.bind(this));
  }

  select(e) {
    const item = e.currentTarget;
    console.log(item);
    this.visibleFieldTarget.value = item.getAttribute("name");
    this.fieldTarget.value = item.id;
    this.resultsTarget.innerHTML = "";
  }
}
