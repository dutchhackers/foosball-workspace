export enum Callback {
  FOOSBALL_MATCH = 'foosball_match',
  UPDATE_ME = 'update_me',
}

export interface IOptions {
  options: IOption[];
}

export interface IOption {
  label: string;
  value: string;
}
