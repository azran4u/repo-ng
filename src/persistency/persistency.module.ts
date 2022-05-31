import { Module } from '@nestjs/common';
import { MockPersistencyService } from './mock.persistency.service';
import { PersistencyService } from './persistency.service';

@Module({
  providers: [
    {
      provide: PersistencyService,
      useClass: MockPersistencyService,
    },
  ],
  exports: [PersistencyService],
})
export class PersistencyModule {}
