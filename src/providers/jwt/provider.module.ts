import { Global, Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { AuthConfigService } from '@app/configs/auth';

@Global()
@Module({
  imports: [
    NestJwtModule.registerAsync({
      useFactory: (authAppConfigService: AuthConfigService) => ({
        secret: authAppConfigService.jwtSecret,
        signOptions: {
          expiresIn: `${authAppConfigService.jwtExpiration}s`,
        },
      }),
      inject: [AuthConfigService],
    }),
  ],
  exports: [NestJwtModule],
})
export class JwtModule {}
