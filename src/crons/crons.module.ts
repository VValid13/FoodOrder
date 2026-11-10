import { Module } from '@nestjs/common';
import { SessionsModule } from '../sessions/sessions.module.js';
import { CronsService } from './crons.service.js';

@Module({
  imports: [SessionsModule],
  providers: [CronsService],
})
export class CronsModule {}
