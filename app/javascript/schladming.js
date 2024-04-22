// import "trix";
import "@hotwired/turbo-rails";
// import "@rails/actiontext";
// import "chartkick/chart.js";
import { Application } from "@johanhalse/musculus";

import ClickableRowController from "./controllers/clickable_row_controller";

Application.register(ClickableRowController);
Application.start();
