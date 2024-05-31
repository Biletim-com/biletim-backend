import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class AppleService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private authService: AuthService,
  ) {}

  async loginWithApple(payload: any) {
    if (payload.hasOwnProperty('id_token')) {
      try {
        let email = '';
        let firstName = '';
        let lastName = '';

        // Apple'dan dönen id_token'ı decode et
        const decodedObj: any = this.jwtService.decode(payload.id_token);
        const accountId = decodedObj.sub || '';
        console.info(`Apple Account ID: ${accountId}`);

        // E-posta adresini al
        if (decodedObj.hasOwnProperty('email')) {
          email = decodedObj.email;
          console.info(`Apple Email: ${email}`);
        }

        // Kullanıcı bilgilerini al, sadece ilk seferde gösterilir
        if (payload.hasOwnProperty('user')) {
          const userData = JSON.parse(payload.user);
          if (userData.name) {
            firstName = userData.name.firstName || '';
            lastName = userData.name.lastName || '';
          }
        }

        // Kullanıcıyı e-posta adresiyle bulma
        const user = await this.usersService.findByEmail(email);

        // Eğer kullanıcı yoksa, kayıt ol ve oturum aç
        if (!user) {
          console.log('REGISTER');
          const password: string = uuidv4();

          const signUpResult = await this.authService.signUpWithGoogle({
            email: email,
            password: password,
            name: firstName || 'firstname',
            familyName: lastName || 'lastname',
          });

          return signUpResult;
        } else {
          console.log('LOGIN');
          // Eğer kullanıcı varsa, sadece oturum aç
          const signInResult = await this.authService.signInWithGoogle(
            user.email,
            decodedObj,
          );

          return signInResult;
        }
      } catch (error) {
        console.error('Kimlik doğrulama hatası:', error);
        throw new UnauthorizedException('Unauthorized');
      }
    } else {
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
