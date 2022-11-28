import { UserPreview } from "./userPreview.schema";

export type ChatPreview = {
  receiver: UserPreview;
  message: string;
  date: Date;
};
