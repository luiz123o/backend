export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  environment: process.env.NODE_ENV || 'development',
  
  // Configuração do banco de dados
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'subscription_manager',
    ssl: process.env.DB_SSL === 'true',
  },
  
  // Configuração de JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'sua_jwt_secret_local_muito_secreta',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'sua_jwt_refresh_secret_local_muito_secreta',
    expiration: process.env.JWT_EXPIRATION || '1h',
    refreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d',
  },
  
  // Configuração de email
  email: {
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10) || 587,
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    from: process.env.EMAIL_FROM || 'no-reply@gestorfacil.com',
  },
  
  // Configuração do Frontend
  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:3000',
  },
  
  // Configuração de upload de arquivos
  upload: {
    maxSize: parseInt(process.env.UPLOAD_MAX_SIZE, 10) || 5 * 1024 * 1024, // 5MB
    destination: process.env.UPLOAD_DESTINATION || './uploads',
  },
  
  // Configuração de OAuth2
  oauth: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackUrl: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/auth/google/callback',
    },
    apple: {
      clientId: process.env.APPLE_CLIENT_ID,
      teamId: process.env.APPLE_TEAM_ID,
      keyId: process.env.APPLE_KEY_ID,
      privateKeyPath: process.env.APPLE_PRIVATE_KEY_PATH,
      callbackUrl: process.env.APPLE_CALLBACK_URL || 'http://localhost:3000/api/auth/apple/callback',
    },
  },
}); 