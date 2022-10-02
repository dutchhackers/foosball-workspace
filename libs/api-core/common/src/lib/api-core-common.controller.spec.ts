import { Test } from '@nestjs/testing';
import { ApiCoreCommonController } from './api-core-common.controller';
import { ApiCoreCommonService } from './api-core-common.service';

describe('ApiCoreCommonController', () => {
  let controller: ApiCoreCommonController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ApiCoreCommonService],
      controllers: [ApiCoreCommonController],
    }).compile();

    controller = module.get(ApiCoreCommonController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
