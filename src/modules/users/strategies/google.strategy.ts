import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { User, UserRole, UserStatus } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';

/**
 * Estratégia Google OAuth2 para autenticação
 */
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private configService: ConfigService,
    private userRepository: UserRepository,
  ) {
    super({
      clientID: configService.get<string>('oauth.google.clientId'),
      clientSecret: configService.get<string>('oauth.google.clientSecret'),
      callbackURL: configService.get<string>('oauth.google.callbackUrl'),
      scope: ['email', 'profile'],
    });
  }

  /**
   * Valida o perfil do usuário retornado pelo Google
   * 
   * @param accessToken Token de acesso do Google
   * @param refreshToken Token de atualização do Google
   * @param profile Perfil do usuário no Google
   * @returns Promise<any> Dados do usuário autenticado
   */
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ) {
    const { id, name, emails, photos } = profile;
    
    // Busca usuário existente pelo email do Google
    const email = emails && emails.length > 0 ? emails[0].value : null;
    
    if (!email) {
      throw new Error('Email não encontrado no perfil do Google');
    }
    
    let user = await this.userRepository.findByEmail(email);
    
    // Se não existir, cria um novo usuário
    if (!user) {
      // Criamos um novo usuário diretamente com a entidade User
      const newUser = new User();
      newUser.email = email;
      newUser.firstName = name?.givenName || '';
      newUser.lastName = name?.familyName || '';
      newUser.profilePicture = photos && photos.length > 0 ? photos[0].value : null;
      newUser.status = UserStatus.ACTIVE; // Já ativamos o usuário, pois o email foi verificado pelo Google
      newUser.role = UserRole.USER;
      newUser.googleId = id;
      newUser.emailVerified = true;
      
      user = await this.userRepository.save(newUser);
    } 
    // Se existir, mas não tiver googleId, atualiza
    else if (!user.googleId) {
      user.googleId = id;
      await this.userRepository.save(user);
    }
    
    return user;
  }
} 