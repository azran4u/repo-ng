import { Test, TestingModule } from '@nestjs/testing';
import { MockPersistencyService } from './mock.persistency.service';

describe('PersistencyService', () => {
  let service: MockPersistencyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MockPersistencyService],
    }).compile();

    service = module.get<MockPersistencyService>(MockPersistencyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
