import { CategoryType } from '../entities/category.entity';

/**
 * Dados de seed para categorias padrão do sistema
 */
export const defaultCategories = [
  {
    name: 'Streaming',
    description: 'Serviços de streaming de vídeo, música e jogos',
    color: '#E50914',
    icon: 'play_circle',
    type: CategoryType.DEFAULT,
    order: 1
  },
  {
    name: 'Software',
    description: 'Assinaturas de software, aplicativos e serviços digitais',
    color: '#0078D7',
    icon: 'computer',
    type: CategoryType.DEFAULT,
    order: 2
  },
  {
    name: 'Delivery',
    description: 'Serviços de entrega e assinaturas de comida',
    color: '#FF9900',
    icon: 'local_shipping',
    type: CategoryType.DEFAULT,
    order: 3
  },
  {
    name: 'Saúde',
    description: 'Academias, planos de saúde e bem-estar',
    color: '#27AE60',
    icon: 'favorite',
    type: CategoryType.DEFAULT,
    order: 4
  },
  {
    name: 'Educação',
    description: 'Cursos, plataformas de ensino e assinaturas educacionais',
    color: '#9B59B6',
    icon: 'school',
    type: CategoryType.DEFAULT,
    order: 5
  },
  {
    name: 'Telecomunicações',
    description: 'Internet, telefone, TV a cabo e serviços de comunicação',
    color: '#3498DB',
    icon: 'wifi',
    type: CategoryType.DEFAULT,
    order: 6
  },
  {
    name: 'Utilidades',
    description: 'Água, luz, gás e outros serviços essenciais',
    color: '#F1C40F',
    icon: 'lightbulb',
    type: CategoryType.DEFAULT,
    order: 7
  },
  {
    name: 'Serviços Financeiros',
    description: 'Bancos, seguros e serviços financeiros',
    color: '#2ECC71',
    icon: 'account_balance',
    type: CategoryType.DEFAULT,
    order: 8
  },
  {
    name: 'Outros',
    description: 'Outras assinaturas que não se encaixam nas categorias anteriores',
    color: '#95A5A6',
    icon: 'more_horiz',
    type: CategoryType.DEFAULT,
    order: 9
  }
]; 