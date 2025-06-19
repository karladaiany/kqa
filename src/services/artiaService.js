import {
  ApolloClient,
  InMemoryCache,
  gql,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import {
  FORM_FIELD_TO_HASH,
  DEFAULT_ARTIA_VALUES,
  ACTIVITY_TYPE_TO_FOLDER_TYPE_ID,
} from '../constants/artiaFieldHashes';
// Utilitários de debug removidos - usando validação simples inline
// Importações de utilitários removidas - problemas resolvidos

// Configuração do Apollo Client para o Artia
const httpLink = createHttpLink({
  uri:
    process.env.NODE_ENV === 'development'
      ? '/api/artia/graphql' // URL do proxy em desenvolvimento
      : 'https://app.artia.com/graphql', // URL real da API GraphQL do Artia em produção
});

// Link de autenticação
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('artia_token');

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
      OrganizationId: DEFAULT_ARTIA_VALUES.ORGANIZATION_ID.toString(), // Header obrigatório para criar atividades
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  // Adicionar configurações para debugging
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

// Mutation real para autenticação no Artia
const AUTHENTICATION_BY_EMAIL = gql`
  mutation AuthenticationByEmail($email: String!, $password: String!) {
    authenticationByEmail(email: $email, password: $password) {
      token
    }
  }
`;

// Mutation para criar atividade no Artia - Versão sem customField para teste
const CREATE_ACTIVITY_SIMPLE = gql`
  mutation createActivity(
    $title: String!
    $folderId: Int!
    $accountId: Int!
    $folderTypeId: Int!
    $description: String
    $createdBy: String!
    $priority: Int
    $estimatedEffort: Float
  ) {
    createActivity(
      title: $title
      folderId: $folderId
      accountId: $accountId
      folderTypeId: $folderTypeId
      description: $description
      createdBy: $createdBy
      priority: $priority
      estimatedEffort: $estimatedEffort
    ) {
      id
      uid
      title
      description
      status
      priority
      estimatedEffort
      createdAt
    }
  }
`;

// Mutation completa para criar atividade no Artia - com campos customizados
// Tipo correto descoberto: OrganizationCustomFieldsInput!
const CREATE_ACTIVITY = gql`
  mutation createActivity(
    $title: String!
    $folderId: Int!
    $accountId: Int!
    $folderTypeId: Int!
    $description: String
    $createdBy: String!
    $priority: Int
    $estimatedEffort: Float
    $customField: [OrganizationCustomFieldsInput!]
  ) {
    createActivity(
      title: $title
      folderId: $folderId
      accountId: $accountId
      folderTypeId: $folderTypeId
      description: $description
      createdBy: $createdBy
      priority: $priority
      estimatedEffort: $estimatedEffort
      customField: $customField
    ) {
      id
      uid
      title
      description
      status
      priority
      estimatedEffort
      createdAt
      responsible {
        id
        name
        email
      }
      customColumns
    }
  }
`;

/**
 * Serviço para integração com a API do Artia
 */
export class ArtiaService {
  /**
   * Testa a autenticação no Artia com logs detalhados
   * @param {string} email - Email do usuário
   * @param {string} password - Senha do usuário
   * @returns {Promise<Object>} Dados de autenticação e logs
   */
  static async testAuthentication(email, password) {
    try {
      const result = await client.mutate({
        mutation: AUTHENTICATION_BY_EMAIL,
        variables: {
          email,
          password,
        },
        fetchPolicy: 'no-cache',
      });

      // Verificar se o token está presente
      const token = result.data?.authenticationByEmail?.token;
      if (token) {
        // Salvar token no localStorage
        localStorage.setItem('artia_token', token);

        return {
          success: true,
          token,
          message: 'Autenticação realizada com sucesso',
          timestamp: new Date().toISOString(),
        };
      } else {
        throw new Error('Token não encontrado na resposta da API');
      }
    } catch (error) {
      // Log apenas erros críticos
      if (error.networkError?.statusCode === 500) {
        console.error('[Artia] Erro interno do servidor:', error.message);
      }

      throw new Error(`Falha na autenticação: ${error.message}`);
    }
  }

  /**
   * Autentica o usuário no Artia (versão otimizada para produção)
   * @param {string} email - Email do usuário
   * @param {string} password - Senha do usuário
   * @returns {Promise<Object>} Dados de autenticação
   */
  static async authenticate(email, password) {
    try {
      const { data } = await client.mutate({
        mutation: AUTHENTICATION_BY_EMAIL,
        variables: {
          email,
          password,
        },
      });

      if (data.authenticationByEmail.token) {
        localStorage.setItem('artia_token', data.authenticationByEmail.token);
      }

      return data.authenticationByEmail;
    } catch (error) {
      console.error('Erro na autenticação:', error);
      throw new Error('Falha na autenticação. Verifique suas credenciais.');
    }
  }

  /**
   * Verifica se existe um token válido
   * @returns {boolean} Se há token armazenado e não expirado
   */
  static hasValidToken() {
    const token = localStorage.getItem('artia_token');
    if (!token) return false;

    try {
      // Decodificar JWT para verificar expiração
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);

      // Token válido verificado

      return payload.exp > currentTime;
    } catch (error) {
      console.error('❌ Erro ao verificar token:', error);
      return false;
    }
  }

  /**
   * Garante que temos um token válido, renovando se necessário
   */
  static async ensureValidToken(email, password) {
    // Verificar se há token e se é válido
    const currentToken = localStorage.getItem('artia_token');
    if (currentToken && this.hasValidToken()) {
      return currentToken;
    }

    // Limpar token inválido
    if (currentToken) {
      localStorage.removeItem('artia_token');
    }

    try {
      const result = await this.authenticate(email, password);
      return result.token;
    } catch (error) {
      console.error('[Artia] Erro ao renovar token:', error.message);
      throw new Error('Falha na autenticação automática: ' + error.message);
    }
  }

  /**
   * Obtém o token atual
   * @returns {string|null} Token armazenado
   */
  static getCurrentToken() {
    return localStorage.getItem('artia_token');
  }

  /**
   * Cria uma atividade simples (sem campos customizados) para teste
   * @param {Object} activityData - Dados da atividade do formulário
   * @param {string} generatedDescription - Descrição gerada pela função de copiar
   * @returns {Promise<Object>} Atividade criada
   */
  static async createSimpleActivity(activityData, generatedDescription = '') {
    try {
      // Garantir token válido automaticamente
      await this.ensureValidToken(activityData.login, activityData.senha);

      // Prepara os dados básicos para envio
      const variables = {
        title: activityData.titulo || '',
        folderId:
          parseInt(activityData.folderId) ||
          parseInt(DEFAULT_ARTIA_VALUES.DEFAULT_FOLDER_ID),
        accountId:
          parseInt(activityData.accountId) ||
          parseInt(DEFAULT_ARTIA_VALUES.DEFAULT_ACCOUNT_ID),
        folderTypeId:
          ACTIVITY_TYPE_TO_FOLDER_TYPE_ID[activityData.tipo] ||
          DEFAULT_ARTIA_VALUES.FOLDER_TYPE_ID_DEPLOY,
        createdBy: activityData.login,
        description:
          generatedDescription ||
          `Atividade criada via KQA - ${activityData.tipo}`,
        priority:
          parseInt(activityData.prioridade) || DEFAULT_ARTIA_VALUES.PRIORITY,
        estimatedEffort:
          parseInt(activityData.esforcoEstimado) ||
          DEFAULT_ARTIA_VALUES.ESTIMATED_EFFORT,
      };

      const response = await client.mutate({
        mutation: CREATE_ACTIVITY_SIMPLE,
        variables,
      });

      // Verificar se há erros GraphQL
      if (response.errors && response.errors.length > 0) {
        const errorMessages = response.errors
          .map(err => err.message)
          .join(', ');
        throw new Error(`Erro GraphQL: ${errorMessages}`);
      }

      if (response.data && response.data.createActivity) {
        return response.data.createActivity;
      } else if (response.data) {
        return {
          id: response.data.id || 'ID_NAO_ENCONTRADO',
          title: variables.title,
          ...response.data,
        };
      } else {
        return {
          id: 'CRIADO_SEM_ID',
          title: variables.title,
          status: 'created',
        };
      }
    } catch (error) {
      console.error('❌ Erro ao criar atividade simples:', error);
      throw new Error(`Falha ao criar atividade simples: ${error.message}`);
    }
  }

  /**
   * Cria uma nova atividade no Artia
   * @param {Object} activityData - Dados da atividade do formulário
   * @param {string} generatedDescription - Descrição gerada pela função de copiar
   * @returns {Promise<Object>} Atividade criada
   */
  static async createActivity(activityData, generatedDescription = '') {
    try {
      // Garantir token válido automaticamente
      await this.ensureValidToken(activityData.login, activityData.senha);

      // Prepara os dados para envio
      const variables = this.prepareActivityVariables(
        activityData,
        generatedDescription
      );

      const response = await client.mutate({
        mutation: CREATE_ACTIVITY,
        variables,
      });

      // Verificar se há erros GraphQL
      if (response.errors && response.errors.length > 0) {
        const errorMessages = response.errors
          .map(err => err.message)
          .join(', ');
        throw new Error(`Erro GraphQL: ${errorMessages}`);
      }

      // Verificar diferentes formatos de resposta
      if (response.data && response.data.createActivity) {
        return response.data.createActivity;
      } else if (response.data) {
        const activityData = response.data;
        return {
          id: activityData.id || 'ID_NAO_ENCONTRADO',
          title: variables.title,
          ...activityData,
        };
      } else {
        return {
          id: 'CRIADO_SEM_ID',
          title: variables.title,
          status: 'created',
        };
      }
    } catch (error) {
      // Se for erro de token expirado, tentar renovar uma vez
      if (
        error.message.includes('expirou') ||
        error.message.includes('expired') ||
        error.message.includes('401') ||
        error.message.includes('500')
      ) {
        localStorage.removeItem('artia_token');

        try {
          await this.ensureValidToken(activityData.login, activityData.senha);

          // Tentar novamente com token renovado
          const variables = this.prepareActivityVariables(
            activityData,
            generatedDescription
          );

          const retryResponse = await client.mutate({
            mutation: CREATE_ACTIVITY,
            variables,
          });

          // Verificar diferentes formatos de resposta no retry
          if (retryResponse.data && retryResponse.data.createActivity) {
            return retryResponse.data.createActivity;
          } else if (retryResponse.data) {
            const activityData = retryResponse.data;
            return {
              id: activityData.id || 'ID_NAO_ENCONTRADO_RETRY',
              title: variables.title,
              ...activityData,
            };
          } else {
            return {
              id: 'CRIADO_SEM_ID_RETRY',
              title: variables.title,
              status: 'created',
            };
          }
        } catch (retryError) {
          console.error('[Artia] Erro após renovação:', retryError.message);
          throw new Error(
            `Falha ao criar atividade após renovação: ${retryError.message}`
          );
        }
      }

      console.error('[Artia] Erro ao criar atividade:', error.message);
      throw new Error(`Falha ao criar atividade: ${error.message}`);
    }
  }

  /**
   * Prepara as variáveis da atividade para o formato esperado pela API GraphQL
   * @param {Object} formData - Dados do formulário
   * @param {string} generatedDescription - Descrição gerada pela função de copiar
   * @returns {Object} Variáveis formatadas para a mutation
   */
  static prepareActivityVariables(formData, generatedDescription = '') {
    const { login, senha, ...activityData } = formData;

    // Campos básicos obrigatórios
    const variables = {
      title: activityData.titulo || '',
      folderId:
        parseInt(activityData.folderId) ||
        parseInt(DEFAULT_ARTIA_VALUES.DEFAULT_FOLDER_ID),
      accountId:
        parseInt(activityData.accountId) ||
        parseInt(DEFAULT_ARTIA_VALUES.DEFAULT_ACCOUNT_ID),
      folderTypeId:
        ACTIVITY_TYPE_TO_FOLDER_TYPE_ID[activityData.tipo] ||
        DEFAULT_ARTIA_VALUES.FOLDER_TYPE_ID_DEPLOY,
      createdBy: formData.login,
      description:
        generatedDescription ||
        `Atividade criada via KQA - ${activityData.tipo}`,
      priority:
        parseInt(activityData.prioridade) || DEFAULT_ARTIA_VALUES.PRIORITY,
      estimatedEffort:
        parseInt(activityData.esforcoEstimado) ||
        DEFAULT_ARTIA_VALUES.ESTIMATED_EFFORT,
      customField: [],
    };

    // Preparando campos customizados

    // Montar campos customizados - garantir que apenas campos com valor sejam enviados
    const customFields = [];

    // Lista de campos que devem ser processados como customFields
    const customFieldNames = [
      'urgencia',
      'plataforma',
      'funcionalidade',
      'subFuncionalidade',
      'criticidade',
      'dificuldadeLocalizacao',
      'causaDemanda',
      'garantia',
      'ticketMovidesk',
      'cliente',
      'idOrganizacao',
      'email',
      'tipoCliente',
    ];

    // Iterar sobre os campos customizados definidos
    customFieldNames.forEach(fieldName => {
      const value = activityData[fieldName];
      const hashField = FORM_FIELD_TO_HASH[fieldName];

      // Validação simples inline
      const hasValidHash = hashField && hashField !== '';
      const hasValidValue =
        value && String(value).trim() !== '' && String(value).trim() !== '.';

      if (hasValidHash && hasValidValue) {
        customFields.push({
          hashField,
          value: String(value).trim(),
        });
      }
    });

    // Definir campos customizados finais
    variables.customField = customFields;

    return variables;
  }

  /**
   * Busca os tipos de atividade disponíveis
   * @returns {Promise<Array>} Lista de tipos de atividade
   * @todo Implementar após definir query correta
   */
  static async getActivityTypes() {
    // TODO: Implementar busca de tipos de atividade
    return [];
  }

  /**
   * Retorna o cliente Apollo para uso em testes
   * @returns {ApolloClient} Cliente Apollo configurado
   */
  static getClient() {
    return client;
  }

  /**
   * Limpa dados de autenticação
   */
  static logout() {
    localStorage.removeItem('artia_token');
  }
}

export default ArtiaService;
