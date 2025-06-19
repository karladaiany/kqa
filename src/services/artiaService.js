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

// Mutation alternativa caso a primeira não funcione
const CREATE_ACTIVITY_ALT = gql`
  mutation createActivity(
    $title: String!
    $folderId: Int!
    $accountId: Int!
    $folderTypeId: Int!
    $description: String
    $createdBy: String!
    $priority: Int
    $estimatedEffort: Float
    $customField: [CustomField!]
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
    console.log('🔍 === TESTE DE AUTENTICAÇÃO ARTIA ===');
    console.log('📧 Email:', email);
    console.log(
      '🔗 URL:',
      process.env.NODE_ENV === 'development'
        ? '/api/artia/graphql (via proxy)'
        : 'https://app.artia.com/graphql (direto)'
    );
    console.log('⏰ Timestamp:', new Date().toISOString());

    try {
      console.log('🚀 Enviando requisição...');

      const result = await client.mutate({
        mutation: AUTHENTICATION_BY_EMAIL,
        variables: {
          email,
          password,
        },
        // Forçar não usar cache para teste
        fetchPolicy: 'no-cache',
      });

      console.log('✅ Resposta recebida:');
      console.log('📊 Status da requisição: SUCCESS');
      console.log('📄 Response completo:', result);
      console.log('🎯 Data:', result.data);
      console.log('📝 Extensions:', result.extensions);

      if (result.data?.authenticationByEmail?.token) {
        const token = result.data.authenticationByEmail.token;
        console.log('🔑 Token recebido:', token);
        console.log('📏 Tamanho do token:', token.length);
        console.log(
          '🔤 Primeiros 20 caracteres:',
          token.substring(0, 20) + '...'
        );

        // Salvar token para testes futuros
        localStorage.setItem('artia_token', token);
        console.log('💾 Token salvo no localStorage');

        return {
          success: true,
          token,
          message: 'Autenticação realizada com sucesso!',
          fullResponse: result,
        };
      } else {
        console.log('❌ Token não encontrado na resposta');
        return {
          success: false,
          message: 'Token não retornado pela API',
          fullResponse: result,
        };
      }
    } catch (error) {
      console.log('🚨 === ERRO NA AUTENTICAÇÃO ===');
      console.log('❌ Tipo do erro:', error.constructor.name);
      console.log('📝 Mensagem:', error.message);
      console.log('🔍 Error completo:', error);

      if (error.networkError) {
        console.log('🌐 Network Error:', error.networkError);
        console.log('📊 Status Code:', error.networkError.statusCode);
        console.log('📄 Response Body:', error.networkError.result);

        // Log detalhado do response body se for erro 500
        if (
          error.networkError.statusCode === 500 &&
          error.networkError.result
        ) {
          console.log('🔍 DETALHES DO ERRO 500:');
          console.log(
            '📄 Error completo:',
            JSON.stringify(error.networkError.result, null, 2)
          );

          if (error.networkError.result.error) {
            console.log(
              '❌ Error message:',
              error.networkError.result.error.message
            );
            console.log('💬 Error details:', error.networkError.result.error);
          }

          if (error.networkError.result.data) {
            console.log('📦 Data received:', error.networkError.result.data);
          }
        }
      }

      if (error.graphQLErrors) {
        console.log('📋 GraphQL Errors:', error.graphQLErrors);
        error.graphQLErrors.forEach((gqlError, index) => {
          console.log(`📌 GraphQL Error ${index + 1}:`, gqlError.message);
          console.log('📍 Path:', gqlError.path);
          console.log('📦 Extensions:', gqlError.extensions);
        });
      }

      return {
        success: false,
        message: `Erro na autenticação: ${error.message}`,
        error,
        errorType: error.constructor.name,
      };
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

      console.log('🔍 Verificando token:', {
        exp: payload.exp,
        current: currentTime,
        valid: payload.exp > currentTime,
      });

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
    console.log('🔐 Verificando token...');

    // Verificar se há token e se é válido
    const currentToken = localStorage.getItem('artia_token');
    if (currentToken && this.hasValidToken()) {
      console.log('✅ Token válido encontrado');
      return currentToken;
    }

    console.log(
      '🔄 Token expirado ou inexistente, renovando automaticamente...'
    );

    // Limpar token inválido
    if (currentToken) {
      localStorage.removeItem('artia_token');
      console.log('🗑️ Token inválido removido');
    }

    try {
      console.log('🚀 Iniciando autenticação automática...');
      const result = await this.authenticate(email, password);
      console.log('✅ Token renovado automaticamente com sucesso');
      return result.token;
    } catch (error) {
      console.error('❌ Erro ao renovar token automaticamente:', error);
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
    console.log('🚀 === CRIANDO ATIVIDADE SIMPLES NO ARTIA ===');
    console.log('📋 Dados recebidos:', activityData);

    try {
      // Garantir token válido automaticamente
      console.log('🔐 Verificando autenticação...');
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

      console.log('📦 Variáveis simples preparadas:', variables);

      const response = await client.mutate({
        mutation: CREATE_ACTIVITY_SIMPLE,
        variables,
      });

      console.log('📦 Resposta da API (simples):', response);

      // Verificar se há erros GraphQL (API retorna 200 mesmo com erro)
      if (response.errors && response.errors.length > 0) {
        console.error(
          '❌ Erros GraphQL encontrados (simples):',
          response.errors
        );
        const errorMessages = response.errors
          .map(err => err.message)
          .join(', ');
        throw new Error(`Erro GraphQL (simples): ${errorMessages}`);
      }

      if (response.data && response.data.createActivity) {
        console.log(
          '✅ Atividade simples criada:',
          response.data.createActivity
        );
        return response.data.createActivity;
      } else if (response.data) {
        console.log(
          '✅ Resposta recebida (formato alternativo):',
          response.data
        );
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
    console.log('🚀 === CRIANDO ATIVIDADE NO ARTIA ===');
    console.log('📋 Dados recebidos:', activityData);
    console.log('📄 Descrição gerada:', generatedDescription);

    try {
      // Garantir token válido automaticamente
      console.log('🔐 Verificando autenticação...');
      await this.ensureValidToken(activityData.login, activityData.senha);

      // Prepara os dados para envio
      const variables = this.prepareActivityVariables(
        activityData,
        generatedDescription
      );
      console.log('📦 Variáveis preparadas:', variables);

      const response = await client.mutate({
        mutation: CREATE_ACTIVITY,
        variables,
      });

      console.log('📦 Resposta completa da API:', response);

      // Verificar se há erros GraphQL (API retorna 200 mesmo com erro)
      if (response.errors && response.errors.length > 0) {
        console.error('❌ Erros GraphQL encontrados:', response.errors);

        // LOG DETALHADO DO ERRO PARA DEBUGGING
        response.errors.forEach((error, index) => {
          console.log(`🚨 ERRO ${index + 1} DETALHADO:`);
          console.log('   📝 Mensagem:', error.message);
          console.log('   📍 Path:', error.path);
          console.log('   🔍 Extensions:', error.extensions);
          console.log('   📋 Locations:', error.locations);
          console.log('   🔧 Erro completo:', JSON.stringify(error, null, 2));
        });

        const errorMessages = response.errors
          .map(err => err.message)
          .join(', ');
        throw new Error(`Erro GraphQL: ${errorMessages}`);
      }

      // Verificar diferentes formatos de resposta
      if (response.data && response.data.createActivity) {
        console.log(
          '✅ Atividade criada com sucesso:',
          response.data.createActivity
        );
        return response.data.createActivity;
      } else if (response.data) {
        console.log(
          '✅ Resposta recebida (formato alternativo):',
          response.data
        );
        // Tentar extrair ID de outros campos possíveis
        const activityData = response.data;
        return {
          id: activityData.id || 'ID_NAO_ENCONTRADO',
          title: variables.title,
          ...activityData,
        };
      } else {
        console.log('⚠️ Resposta sem data, mas sem erro - assumindo sucesso');
        return {
          id: 'CRIADO_SEM_ID',
          title: variables.title,
          status: 'created',
        };
      }
    } catch (error) {
      console.error('❌ Erro ao criar atividade:', error);

      // Log detalhado do erro
      if (error.networkError) {
        console.log('🌐 Network Error:', error.networkError);
        if (error.networkError.result) {
          console.log(
            '📄 Error response:',
            JSON.stringify(error.networkError.result, null, 2)
          );
        }
      }

      if (error.graphQLErrors) {
        console.log('📋 GraphQL Errors:', error.graphQLErrors);
      }

      // Se for erro de token expirado, tentar renovar uma vez
      if (
        error.message.includes('expirou') ||
        error.message.includes('expired') ||
        error.message.includes('401') ||
        error.message.includes('500')
      ) {
        console.log('🔄 Token pode ter expirado, tentando renovar...');
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

          console.log('📦 Resposta completa após renovação:', retryResponse);

          // Verificar diferentes formatos de resposta no retry
          if (retryResponse.data && retryResponse.data.createActivity) {
            console.log(
              '✅ Atividade criada com sucesso após renovação:',
              retryResponse.data.createActivity
            );
            return retryResponse.data.createActivity;
          } else if (retryResponse.data) {
            console.log(
              '✅ Resposta recebida após renovação (formato alternativo):',
              retryResponse.data
            );
            const activityData = retryResponse.data;
            return {
              id: activityData.id || 'ID_NAO_ENCONTRADO_RETRY',
              title: variables.title,
              ...activityData,
            };
          } else {
            console.log('⚠️ Resposta sem data após retry - assumindo sucesso');
            return {
              id: 'CRIADO_SEM_ID_RETRY',
              title: variables.title,
              status: 'created',
            };
          }
        } catch (retryError) {
          console.error('❌ Erro mesmo após renovação:', retryError);
          throw new Error(
            `Falha ao criar atividade após renovação: ${retryError.message}`
          );
        }
      }

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

    // Log dos campos customizados
    console.log('🔍 === PREPARANDO CAMPOS CUSTOMIZADOS ===');
    console.log('📊 Dados da atividade:', activityData);

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
        console.log(
          `📝 Adicionando campo customizado: ${fieldName} = "${value}" (hash: ${hashField.substring(0, 10)}...)`
        );

        customFields.push({
          hashField,
          value: String(value).trim(), // Garantir que seja string e sem espaços extras
        });
      } else {
        // Log para campos não adicionados (para debugging)
        if (value && !hasValidHash) {
          console.log(
            `⚠️ Campo ${fieldName} tem valor "${value}" mas não tem hash mapeado`
          );
        } else if (hasValidHash && !hasValidValue) {
          console.log(
            `⚠️ Campo ${fieldName} tem hash mas valor inválido: "${value}" (será excluído da requisição)`
          );
        }
      }
    });

    // Definir campos customizados finais
    variables.customField = customFields;

    // Log detalhado para debug
    console.log('📋 === VARIÁVEIS FINAIS PREPARADAS ===');
    console.log('🏷️  Título:', variables.title);
    console.log('📁 Folder ID:', variables.folderId);
    console.log('🏢 Account ID:', variables.accountId);
    console.log('🔢 Folder Type ID:', variables.folderTypeId);
    console.log('👤 Criado por:', variables.createdBy);
    console.log(
      '📄 Descrição:',
      variables.description.substring(0, 100) + '...'
    );
    console.log('⭐ Prioridade:', variables.priority);
    console.log('⏱️ Esforço:', variables.estimatedEffort);
    console.log(`🔧 Total de campos customizados: ${customFields.length}`);

    if (customFields.length > 0) {
      console.log('📝 Campos customizados:');
      customFields.forEach((field, index) => {
        console.log(
          `   ${index + 1}. Hash: ${field.hashField.substring(0, 20)}... | Valor: "${field.value}"`
        );
      });
    } else {
      console.log('⚠️ Nenhum campo customizado foi adicionado');
    }

    return variables;
  }

  /**
   * Busca os tipos de atividade disponíveis
   * @returns {Promise<Array>} Lista de tipos de atividade
   * @todo Implementar após definir query correta
   */
  static async getActivityTypes() {
    // Implementar na Fase 2 após autenticação funcionar
    console.log('⚠️ getActivityTypes não implementado ainda');
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
