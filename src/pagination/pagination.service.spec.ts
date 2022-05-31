import { Test } from '@nestjs/testing';
import { AppConfigModule } from '../config';
import {
  MockData,
  MockPersistencyService,
} from '../persistency/mock.persistency.service';
import { PersistencyModule } from '../persistency/persistency.module';
import { PersistencyService } from '../persistency/persistency.service';
import { Cursor } from '../utils/cursor';
import { QueryFilters } from '../utils/query.filters';
import { replicationClient } from '../utils/replication.client';
import { PaginationService } from './pagination.service';

describe('PaginationService', () => {
  let paginationService: PaginationService;
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

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppConfigModule, PersistencyModule],
      providers: [PaginationService],
    })
      .overrideProvider(PersistencyService)
      .useClass(MockPersistencyService)
      .compile();

    const persistencyService = moduleRef.get<PersistencyService>(
      PersistencyService
    ) as MockPersistencyService;

    paginationService = moduleRef.get<PaginationService>(PaginationService);

    persistencyService.seed(data);
  });

  it('basic w/o filter', async () => {
    const filter: QueryFilters = {};
    const initialCursor: Cursor = { dv: '1', id: null };
    const pageSize = 1;

    const result = await replicationClient(
      initialCursor,
      filter,
      pageSize,
      paginationService
    );

    expect(result).toEqual(['a', 'c']);
  });

  it('basic with filter', async () => {
    const filter: QueryFilters = { byName: 'a' };
    const initialCursor: Cursor = { dv: '1', id: null };
    const pageSize = 1;

    const result = await replicationClient(
      initialCursor,
      filter,
      pageSize,
      paginationService
    );

    expect(result).toEqual(['a']);
  });

  it('start with higher cursor', async () => {
    const filter: QueryFilters = {};
    const initialCursor: Cursor = { dv: '2', id: null };
    const pageSize = 1;

    const result = await replicationClient(
      initialCursor,
      filter,
      pageSize,
      paginationService
    );

    expect(result).toEqual(['c']);
  });

  it('start with out of range cursor', async () => {
    const filter: QueryFilters = {};
    const initialCursor: Cursor = { dv: '3', id: null };
    const pageSize = 1;

    const result = await replicationClient(
      initialCursor,
      filter,
      pageSize,
      paginationService
    );

    expect(result).toEqual([]);
  });

  it('null cursor', async () => {
    const filter: QueryFilters = {};
    const initialCursor: Cursor = { dv: null, id: null };
    const pageSize = 1;

    const result = await replicationClient(
      initialCursor,
      filter,
      pageSize,
      paginationService
    );

    expect(result).toEqual(['a', 'c']);
  });
});
