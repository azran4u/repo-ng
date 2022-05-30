import { Module } from '@nestjs/common';
import { MockPersistencyService } from './mock.persistency.service';

@Module({
  providers: [MockPersistencyService],
  exports: [MockPersistencyService],
})
export class PersistencyModule {}
