import { Column, Entity } from 'typeorm';
import { AbstractEntity } from './abstract.entity';

@Entity({ name: 'external_providers' })
export class ExternalProviders extends AbstractEntity<ExternalProviders> {
  @Column({ name: 'ws_endpoint', nullable: false, type: 'text' })
  wsEndpoint?: string;

  @Column({ name: 'provider_name', nullable: true, type: 'text' })
  providerName?: string;
}
