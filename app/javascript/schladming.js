import "@hotwired/turbo-rails";
import { Application } from "@johanhalse/musculus";

import AdminTabController from "./controllers/admin_tab_controller";
import AdminCleaveController from "./controllers/admin_cleave_controller";
import BackToScopeController from "./controllers/back_to_scope_controller";
import BatchActionController from "./controllers/batch_action_controller";
import ClickableRowController from "./controllers/clickable_row_controller";
import DatetimeSelectController from "./controllers/hamburger_menu_controller";
import GeoSearchController from "./controllers/geo_search_controller";
import HamburgerMenuController from "./controllers/datetime_select_controller";
import ImagePreviewController from "./controllers/image_preview_controller";
import RelationSearchController from "./controllers/relation_search_controller";
import RichTextEditorController from "./controllers/rich_text_editor_controller";
import SlugonatorController from "./controllers/slugonator_controller";
import SelectAllController from "./controllers/select_all_controller";
import TagFieldController from "./controllers/tag_field_controller";

Application.register(AdminTabController);
Application.register(AdminCleaveController);
Application.register(BackToScopeController);
Application.register(BatchActionController);
Application.register(ClickableRowController);
Application.register(DatetimeSelectController);
Application.register(GeoSearchController);
Application.register(HamburgerMenuController);
Application.register(ImagePreviewController);
Application.register(RelationSearchController);
Application.register(RichTextEditorController);
Application.register(SlugonatorController);
Application.register(SelectAllController);
Application.register(TagFieldController);
Application.start();
