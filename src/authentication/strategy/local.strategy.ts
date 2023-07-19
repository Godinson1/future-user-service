import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserProfile } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/services/user.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<UserProfile> {
    return this.userService.validateUser(email, password);
  }
}
