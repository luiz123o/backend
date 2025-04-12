import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-apple';
import { User, UserRole, UserStatus } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';

/**
 * Estratégia Apple OAuth para autenticação
 */
@Injectable()
export class AppleStrategy extends PassportStrategy(Strategy, 'apple') {
  constructor(
    private configService: ConfigService,
    private userRepository: UserRepository,
  ) {
    super({
      clientID: configService.get<string>('oauth.apple.clientId'),
      teamID: configService.get<string>('oauth.apple.teamId'),
      keyID: configService.get<string>('oauth.apple.keyId'),
      privateKeyLocation: configService.get<string>('oauth.apple.privateKeyPath'),
      callbackURL: configService.get<string>('oauth.apple.callbackUrl'),
      passReqToCallback: true,
      scope: ['email', 'name'],
    });
  }

  /**
   * Valida o perfil do usuário retornado pela Apple
   * 
   * @param req Requisição
   * @param accessToken Token de acesso da Apple
   * @param refreshToken Token de atualização da Apple
   * @param idToken Token de ID da Apple
   * @param profile Perfil do usuário na Apple
   * @param done Callback para finalizar a validação
   */
  async validate(
    req,
    accessToken: string,
    refreshToken: string,
    idToken,
    profile: any,
    done,
  ) {
    try {
      // Apple não retorna o email e nome em todas as chamadas, apenas na primeira
      // Se estiverem disponíveis em req.body, usamos esses dados
      const { email, firstName, lastName } = req.body?.user || {};
      const appleId = profile.id || req.body?.user?.id;
      
      if (!appleId) {
        return done(new Error('ID da Apple não encontrado'), null);
      }
      
      // Busca usuário existente pelo Apple ID
      // Usamos findById, mas primeiro precisamos verificar quais usuários têm appleId
      const users = await this.userRepository.findAll({
        search: appleId, // Tentativa de buscar pelo appleId no campo de busca
      });
      
      let user = users[0].find(u => u.appleId === appleId);
      
      // Se não encontrou pelo Apple ID, tenta pelo email
      if (!user && email) {
        const foundUser = await this.userRepository.findByEmail(email);
        if (foundUser) {
          user = foundUser;
        }
      }
      
      // Se não existir, cria um novo usuário
      if (!user) {
        if (!email) {
          return done(new Error('Email não encontrado no perfil da Apple'), null);
        }
        
        // Como não temos um método create explícito, criamos o objeto diretamente
        const newUser = new User();
        newUser.email = email;
        newUser.firstName = firstName || '';
        newUser.lastName = lastName || '';
        newUser.status = UserStatus.ACTIVE; // Já ativamos o usuário, pois o email foi verificado pela Apple
        newUser.role = UserRole.USER;
        newUser.appleId = appleId;
        newUser.emailVerified = true;
        
        user = await this.userRepository.save(newUser);
      } 
      // Se existir, mas não tiver appleId, atualiza
      else if (!user.appleId) {
        user.appleId = appleId;
        await this.userRepository.save(user);
      }
      
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
} 