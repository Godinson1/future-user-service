import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Put,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto, IFileDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import JwtAuthGuard from 'src/authentication/guards/jwt-auth.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { UserProfile } from '../entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { getFileName, photoTypeValidator } from 'src/shared/utils';
import { Throttle } from '@nestjs/throttler';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findOne(@CurrentUser() user: UserProfile): UserProfile {
    return user;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Throttle({ default: { limit: 1, ttl: 60 } })
  @Put('/upload-profile-photo')
  @UseInterceptors(FileInterceptor('user-avatar'))
  @UseGuards(JwtAuthGuard)
  updateProfilePhoto(
    @CurrentUser() user: UserProfile,
    @UploadedFile(new ParseFilePipe({ validators: photoTypeValidator.userAvatar }))
    file: Express.Multer.File,
  ): Promise<UserProfile> {
    const key = getFileName(user.firstName, file.mimetype);
    const fileArg: IFileDto = { key, buffer: file.buffer, mimetype: file.mimetype };
    return this.userService.updateProfilePhoto(user, fileArg);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.removeUser(id);
  }
}
