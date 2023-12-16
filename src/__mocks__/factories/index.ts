import { Chance } from 'chance';
import { Factory } from 'rosie';
import { UserProfile } from 'src/user/entities/user.entity';

const chance = new Chance();

export const userFactory = new Factory<UserProfile>()
  .attr('id', () => chance.guid({ version: 4 }))
  .attr('username', () => chance.name())
  .attr('email', () => chance.email())
  .attr('phoneNumber', () => chance.phone())
  .attr('createdAt', () => new Date())
  .attr('updatedAt', () => new Date());
