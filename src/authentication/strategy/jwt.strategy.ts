import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from '../services/authentication.service';
import { UserService } from 'src/user/services/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService, private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) => this.extractTokenFromHeader(request),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.cookie?.split('=') ?? [];
    return type === 'Authentication' ? token : undefined;
  }

  validate({ userId }: TokenPayload) {
    try {
      return this.userService.getById(userId);
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}
