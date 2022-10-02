import { Test } from '@nestjs/testing';
import { ApiCoreCommonService } from './api-core-common.service';

describe('ApiCoreCommonService', () => {
  let service: ApiCoreCommonService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ApiCoreCommonService],
    }).compile();

    service = module.get(ApiCoreCommonService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
