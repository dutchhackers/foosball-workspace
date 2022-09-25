import { Injectable } from '@nestjs/common';

@Injectable()
export class PlayerService {
  test() {
    return [1, 2, 3];
  }
}
