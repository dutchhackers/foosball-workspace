import { DataService } from '@foosball/api/data';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(private readonly data: DataService) {}

  getData(): { message: string } {
    return { message: 'Welcome to foosball-api!' };
  }
}
