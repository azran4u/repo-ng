import { Lesson } from "./lesson";
import { RabbiEnum } from "./rabi.enum";

export interface Snapshot {
  rabbi: RabbiEnum;
  date: Date;
  lessons: Lesson[];
}
