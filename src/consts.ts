export const enum StateType {
  Downloading = 'downloading',
  Seeding = 'seeding',
  Completed = 'completed',
  Resumed = 'resumed',
  Paused = 'pasued',
  Active = 'active',
  Inactive = 'inactive',
  Errored = 'errored',
}

export const AllStateTypes = [
  StateType.Downloading,
  StateType.Seeding,
  StateType.Completed,
  StateType.Resumed,
  StateType.Paused,
  StateType.Active,
  StateType.Inactive,
  StateType.Errored,
];
