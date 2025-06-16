import {
  ApolloClient,
  InMemoryCache,
  gql,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Configuração do Apollo Client para o Artia
// Substitua pela URL real da API GraphQL do Artia
const httpLink = createHttpLink({
  uri: 'https://api.artia.com/graphql', // URL de exemplo
});

// Link de autenticação
const authLink = setContext((_, { headers }) => {
  // Você pode armazenar o token de autenticação no localStorage ou em outro lugar
  const token = localStorage.getItem('artia_token');

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

// Mutation exemplo para criar atividade
const CREATE_ACTIVITY = gql`
  mutation CreateActivity($input: ActivityInput!) {
    createActivity(input: $input) {
      id
      title
      type
      status
      createdAt
    }
  }
`;

// Mutation exemplo para autenticação
const AUTHENTICATE = gql`
  mutation Authenticate($email: String!, $password: String!) {
    authenticate(email: $email, password: $password) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;

// Query exemplo para buscar tipos de atividade
const GET_ACTIVITY_TYPES = gql`
  query GetActivityTypes {
    activityTypes {
      id
      name
      fields {
        name
        type
        required
        options
      }
    }
  }
`;

/**
 * Serviço para integração com a API do Artia
 */
export class ArtiaService {
  /**
   * Autentica o usuário no Artia
   * @param {string} email - Email do usuário
   * @param {string} password - Senha do usuário
   * @returns {Promise<Object>} Dados de autenticação
   */
  static async authenticate(email, password) {
    try {
      const { data } = await client.mutate({
        mutation: AUTHENTICATE,
        variables: {
          email,
          password,
        },
      });

      if (data.authenticate.token) {
        localStorage.setItem('artia_token', data.authenticate.token);
      }

      return data.authenticate;
    } catch (error) {
      console.error('Erro na autenticação:', error);
      throw new Error('Falha na autenticação. Verifique suas credenciais.');
    }
  }

  /**
   * Cria uma nova atividade no Artia
   * @param {Object} activityData - Dados da atividade
   * @returns {Promise<Object>} Atividade criada
   */
  static async createActivity(activityData) {
    try {
      // Primeiro, autentica se necessário
      if (!localStorage.getItem('artia_token')) {
        await this.authenticate(activityData.login, activityData.senha);
      }

      // Prepara os dados para envio
      const input = this.prepareActivityData(activityData);

      const { data } = await client.mutate({
        mutation: CREATE_ACTIVITY,
        variables: {
          input,
        },
      });

      return data.createActivity;
    } catch (error) {
      console.error('Erro ao criar atividade:', error);

      // Se for erro de autenticação, tentar novamente
      if (
        error.message.includes('authentication') ||
        error.message.includes('unauthorized')
      ) {
        localStorage.removeItem('artia_token');
        return this.createActivity(activityData);
      }

      throw new Error('Falha ao criar atividade. Tente novamente.');
    }
  }

  /**
   * Prepara os dados da atividade para o formato esperado pela API
   * @param {Object} formData - Dados do formulário
   * @returns {Object} Dados formatados
   */
  static prepareActivityData(formData) {
    const { login, senha, ...activityData } = formData;

    // Mapear os campos específicos baseado no tipo
    const customFields = {};

    switch (activityData.tipo) {
      case 'Bug produção':
        customFields.ticketMovidesk = activityData.ticketMovidesk;
        customFields.urgencia = activityData.urgencia;
        customFields.prioridade = activityData.prioridade;
        customFields.plataforma = activityData.plataforma;
        customFields.funcionalidade = activityData.funcionalidade;
        customFields.subFuncionalidade = activityData.subFuncionalidade;
        customFields.cliente = activityData.cliente;
        customFields.idOrganizacao = activityData.idOrganizacao;
        customFields.email = activityData.email;
        customFields.tipoCliente = activityData.tipoCliente;
        customFields.criticidade = activityData.criticidade;
        customFields.dificuldadeLocalizacao =
          activityData.dificuldadeLocalizacao;
        customFields.causaDemanda = activityData.causaDemanda;
        customFields.garantia = activityData.garantia;
        break;

      case 'Bug retrabalho':
        customFields.prioridade = activityData.prioridade;
        customFields.plataforma = activityData.plataforma;
        customFields.funcionalidade = activityData.funcionalidade;
        customFields.subFuncionalidade = activityData.subFuncionalidade;
        customFields.criticidade = activityData.criticidade;
        customFields.dificuldadeLocalizacao =
          activityData.dificuldadeLocalizacao;
        customFields.causaDemanda = activityData.causaDemanda;
        break;

      case 'Deploy':
        // Deploy não tem campos adicionais específicos
        break;
    }

    return {
      title: activityData.titulo,
      type: activityData.tipo,
      customFields,
      // Adicione outros campos conforme necessário
      description: `Atividade criada via KQA - ${activityData.tipo}`,
      priority: customFields.prioridade || 'Medium',
      status: 'New',
    };
  }

  /**
   * Busca os tipos de atividade disponíveis
   * @returns {Promise<Array>} Lista de tipos de atividade
   */
  static async getActivityTypes() {
    try {
      const { data } = await client.query({
        query: GET_ACTIVITY_TYPES,
        fetchPolicy: 'cache-first',
      });

      return data.activityTypes;
    } catch (error) {
      console.error('Erro ao buscar tipos de atividade:', error);
      throw new Error('Falha ao carregar tipos de atividade.');
    }
  }

  /**
   * Limpa dados de autenticação
   */
  static logout() {
    localStorage.removeItem('artia_token');
  }
}

export default ArtiaService;
