import * as bcrypt from 'bcrypt';
import { User, UserRole, UserStatus } from './user.entity';

describe('User Entity', () => {
  let user: User;

  beforeEach(() => {
    user = new User();
    user.name = 'Test User';
    user.email = 'test@example.com';
    user.password = 'Password@123';
    user.role = UserRole.USER;
    user.status = UserStatus.ACTIVE;
  });

  describe('hashPassword', () => {
    it('should hash the password on insert', async () => {
      // Mock bcrypt
      const genSaltSpy = jest.spyOn(bcrypt, 'genSalt').mockResolvedValue('salt' as never);
      const hashSpy = jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword' as never);

      // Execute
      await user.hashPassword();

      // Assert
      expect(genSaltSpy).toHaveBeenCalled();
      expect(hashSpy).toHaveBeenCalledWith('Password@123', 'salt');
      expect(user.password).toBe('hashedPassword');
      expect(user.passwordChangedAt).toBeInstanceOf(Date);

      // Cleanup
      genSaltSpy.mockRestore();
      hashSpy.mockRestore();
    });

    it('should not hash the password if it is empty', async () => {
      // Setup
      user.password = '';
      const hashSpy = jest.spyOn(bcrypt, 'hash');

      // Execute
      await user.hashPassword();

      // Assert
      expect(hashSpy).not.toHaveBeenCalled();
      expect(user.passwordChangedAt).toBeUndefined();

      // Cleanup
      hashSpy.mockRestore();
    });
  });

  describe('validatePassword', () => {
    it('should return true for a valid password', async () => {
      // Mock bcrypt
      const compareSpy = jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      // Execute
      const result = await user.validatePassword('Password@123');

      // Assert
      expect(compareSpy).toHaveBeenCalledWith('Password@123', user.password);
      expect(result).toBe(true);

      // Cleanup
      compareSpy.mockRestore();
    });

    it('should return false for an invalid password', async () => {
      // Mock bcrypt
      const compareSpy = jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      // Execute
      const result = await user.validatePassword('WrongPassword');

      // Assert
      expect(compareSpy).toHaveBeenCalledWith('WrongPassword', user.password);
      expect(result).toBe(false);

      // Cleanup
      compareSpy.mockRestore();
    });
  });

  describe('isPasswordResetTokenExpired', () => {
    it('should return true if token is expired', () => {
      // Setup
      const pastDate = new Date();
      pastDate.setHours(pastDate.getHours() - 1); // 1 hour in the past
      user.passwordResetExpires = pastDate;

      // Execute & Assert
      expect(user.isPasswordResetTokenExpired()).toBe(true);
    });

    it('should return false if token is not expired', () => {
      // Setup
      const futureDate = new Date();
      futureDate.setHours(futureDate.getHours() + 1); // 1 hour in the future
      user.passwordResetExpires = futureDate;

      // Execute & Assert
      expect(user.isPasswordResetTokenExpired()).toBe(false);
    });

    it('should return true if passwordResetExpires is null', () => {
      // Setup
      user.passwordResetExpires = null;

      // Execute & Assert
      expect(user.isPasswordResetTokenExpired()).toBe(true);
    });
  });
}); 