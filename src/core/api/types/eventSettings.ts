/** PATCH /api/events/:id/settings */
export type EventSettingsPatchBody = {
  show_guest_list: boolean;
};

export type EventSettingsPatchData = {
  show_guest_list: boolean;
};

export type EventSettingsPatchResponse = {
  data: EventSettingsPatchData;
  status: boolean;
  errors: unknown;
  error: string | null;
};
