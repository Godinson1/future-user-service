import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Response } from 'express';
import { CurrentUser } from '../../decorators/current-user.decorator';
import JwtAuthGuard from '../guards/jwt-auth.guard';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { UserProfile } from '../../user/entities/user.entity';
import { AuthenticationService } from '../services/authentication.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { HashingAlgorithm } from 'src/user/entities/hashing_algorithm.entity';
import { UserDto } from 'future-connectors';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthenticationService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @CurrentUser() user: UserProfile,
    @Res({ passthrough: true }) response: Response,
  ): Promise<Response> {
    await this.authService.login(user, response);
    return response.send(user);
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response): Promise<Response> {
    this.authService.logout(response);
    return response.send({ message: 'Logged out successfully!' });
  }

  @Post('register')
  async register(
    @Body() request: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<Response> {
    const user = await this.authService.createUser(request, response);
    this.eventEmitter.emit(
      'user.created',
      this.authService.generateUserCreatedNotificationArg(user),
    );
    return response.send(user);
  }

  @Post('hash-algorithm')
  sethashingAlgorithm(@Body() request: { name: string }): Promise<HashingAlgorithm> {
    return this.authService.setHashingAlgorithm(request.name);
  }

  @Get('hash-algorithm')
  gethashingAlgorithm(@Body() request: { name: string }): Promise<HashingAlgorithm> {
    return this.authService.getHashingAlgorithm(request.name);
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern('authenticate')
  async validateUser(@CurrentUser() user: UserProfile): Promise<UserDto> {
    return this.authService.authUserResponse(user);
  }
}
