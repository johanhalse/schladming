// import "trix";
import "@hotwired/turbo-rails";
// import "@rails/actiontext";
// import "chartkick/chart.js";
import { Application } from "@johanhalse/musculus";

import AdminTabController from "./controllers/admin_tab_controller";
import AdminCleaveController from "./controllers/admin_cleave_controller";
import ClickableRowController from "./controllers/clickable_row_controller";
import DatetimeSelectController from "./controllers/datetime_select_controller";
import ImagePreviewController from "./controllers/image_preview_controller";
import SlugonatorController from "./controllers/slugonator_controller";
import SelectAllController from "./controllers/select_all_controller";

Application.register(AdminTabController);
Application.register(AdminCleaveController);
Application.register(ClickableRowController);
Application.register(DatetimeSelectController);
Application.register(ImagePreviewController);
Application.register(SlugonatorController);
Application.register(SelectAllController);
Application.start();
