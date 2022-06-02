import { Module } from '@nestjs/common';
import { PersistencyModule } from '../persistency/persistency.module';
import { PaginationService } from './pagination.service';

@Module({
  imports: [PersistencyModule],
  providers: [PaginationService],
})
export class PaginationModule {}
