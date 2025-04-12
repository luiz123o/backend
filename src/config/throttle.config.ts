export default () => ({
  throttle: {
    ttl: 60, // Janela de tempo em segundos
    limit: 10, // Número máximo de requisições na janela de tempo
  },
}); 