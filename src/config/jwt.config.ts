export default () => ({
  jwt: {
    secret: process.env.JWT_SECRET || 'secret_key_change_in_production',
    expiresIn: process.env.JWT_EXPIRATION || '1h',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh_secret_key_change_in_production',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
  },
}); 