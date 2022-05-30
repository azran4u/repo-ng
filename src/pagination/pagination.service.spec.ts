import {
  MockData,
  MockPersistencyService,
} from '../persistency/mock.persistency.service';
import { PaginationResult } from '../utils/pagination.result';
import { PaginationService } from './pagination.service';

describe('PaginationService', () => {
  beforeEach(async () => {});

  it('should be defined', async () => {
    const data: MockData[] = [
      {
        id: 'a',
        dv: '1',
        name: '1a',
        isDeleted: false,
      },
      {
        id: 'b',
        dv: '1',
        name: '1b',
        isDeleted: true,
      },
      {
        id: 'c',
        dv: '2',
        name: '2c',
        isDeleted: false,
      },
    ];
    const persistencyService = new MockPersistencyService();
    persistencyService.seed(data);
    const paginationService = new PaginationService(persistencyService);
    const res = await paginationService.replicateEntities(
      { byName: 'a' },
      { dv: '1', id: null },
      1
    );
    expect(res).toEqual({
      updatedEntities: ['a'],
      deletedEntities: [],
      nextCursor: { id: null, dv: '2' },
    } as PaginationResult);
  });
});
