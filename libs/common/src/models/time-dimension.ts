import { DateTime } from 'luxon';

export class TimeDimension {
  private _date: DateTime;
  constructor(input: string) {
    this._date = DateTime.fromISO(input); // TODO: to be tested
  }

  get isoDate(): string {
    return this._date.toISO();
  }

  get dayKey(): string {
    return this._date.toFormat('YYYY-MM-DD');
  }

  get weekKey(): string {
    return this._date.toFormat('YYYY-WW');
  }

  get monthKey(): string {
    return this._date.toFormat('YYYY-MM');
  }
}
