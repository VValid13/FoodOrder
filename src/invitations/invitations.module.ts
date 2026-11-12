import { Module } from '@nestjs/common';
import { hashTokenHelper } from '../_utils/helpers/hash-token.helper.js';
import { ContactsModule } from '../contacts/contacts.module.js';
import { RestaurantsModule } from '../restaurants/restaurants.module.js';
import { SessionsModule } from '../sessions/sessions.module.js';
import { InvitationsExceptions } from './_utils/exceptions/invitations.exceptions.js';
import { InvitationGuard } from './_utils/guards/invitation.guard.js';
import { InvitationMapper } from './_utils/mappers/invitation.mapper.js';
import { InvitationsController } from './invitations.controller.js';
import { InvitationsRepository } from './invitations.repository.js';
import { InvitationsService } from './invitations.service.js';
import { MyInvitationController } from './my-invitation.controller.js';
import { MyInvitationsController } from './my-invitations.controller.js';
import { PublicLinksController } from './public-links.controller.js';

@Module({
  imports: [SessionsModule, ContactsModule, RestaurantsModule],
  controllers: [
    InvitationsController,
    MyInvitationController,
    MyInvitationsController,
    PublicLinksController,
  ],
  providers: [
    InvitationsService,
    InvitationsRepository,
    InvitationMapper,
    InvitationsExceptions,
    InvitationGuard,
    hashTokenHelper,
  ],
})
export class InvitationsModule {}
