import { Base } from "./base.model";

export class DndMap extends Base{
  name        = '' as string;
  description = '' as string;
  imageUrl    = '' as string;
  pinIds      = [] as string[];
}
