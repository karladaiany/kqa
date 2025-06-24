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
  REQUIRED_FIELDS_BY_TYPE,
  ARTIA_FIELD_HASHES,
} from '../constants/artiaFieldHashes';

// Constantes para formatação HTML das atividades do Artia
const FORMATTING_CONSTANTS = {
  // Cores
  PURPLE_COLOR: '#8e44ad',

  // Fontes
  VERDANA_FONT: 'Verdana,Geneva,sans-serif',

  // Espaçamentos
  TAB_SPACING: '&nbsp;&nbsp;&nbsp;&nbsp;',

  // Seções BUG (na ordem correta)
  BUG_SECTIONS: [
    'Incidente identificado',
    'Passo a passo para reprodução',
    'Comportamento esperado',
    'Informações',
    'Evidência',
  ],

  // Labels Deploy (na ordem de aparição)
  DEPLOY_LABELS: [
    'Repositório',
    'Branch principal',
    'PR principal',
    'Feature flag',
    'Runner',
    'Título',
    'Link',
    'PR',
  ],
};

// Configuração do Apollo Client para o Artia
const httpLink = createHttpLink({
  uri: '/api/artia/graphql', // URL do proxy tanto em desenvolvimento quanto em produção
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
    $responsibleId: Int
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
      responsibleId: $responsibleId
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
 * Funções auxiliares para formatação de texto
 */

/**
 * Aplica formatação HTML para seções de BUG identificadas por ::
 * @param {string} text - Texto com seções delimitadas por ::
 * @returns {string} HTML formatado com seções coloridas
 */
function parseBugSections(text) {
  const { PURPLE_COLOR, VERDANA_FONT, TAB_SPACING } = FORMATTING_CONSTANTS;

  // Substituir seções :: Nome da Seção :: por versão formatada
  let formattedText = text.replace(
    /::\s*([^:]+)\s*::/g,
    `<br><span style="color:${PURPLE_COLOR}"><strong>${TAB_SPACING}:: $1 ::</strong></span><br>`
  );

  // Converter quebras de linha restantes
  formattedText = formattedText.replace(/\n/g, '<br>');

  // Reduzir múltiplas quebras de linha para uma única
  formattedText = formattedText.replace(/<br>\s*<br>/g, '<br>');

  // Remover <br> do início (para não ter linha vazia inicial)
  formattedText = formattedText.replace(/^<br>/, '');

  // Envolver tudo com fonte Verdana
  return `<p><span style="font-family:${VERDANA_FONT}">${formattedText}</span></p>`;
}

/**
 * Aplica formatação HTML para atividades de Deploy
 * @param {string} text - Texto com labels seguidos de ':'
 * @param {string} title - Título da atividade
 * @returns {string} HTML formatado para Deploy
 */
function parseDeployContent(text, title = 'Gerar versão para deploy') {
  const { PURPLE_COLOR, VERDANA_FONT, DEPLOY_LABELS } = FORMATTING_CONSTANTS;

  // Título centralizado e colorido com fonte explícita
  let html = `<div style="font-family:${VERDANA_FONT}">`;
  html += `<h3 style="text-align:center; color:${PURPLE_COLOR}; font-family:${VERDANA_FONT};"><strong>${title}</strong></h3>`;

  // Se o texto não contém dados reais do deploy, usar template básico
  if (text.includes('Atividade criada via KQA') || text.trim() === '') {
    html += `<p style="font-family:${VERDANA_FONT};"><strong>Deploy preparado via KQA</strong></p>`;
    html += '</div>';
    return html;
  }

  // Processar linha por linha para aplicar espaçamento correto
  const lines = text.split('\n').filter(line => line.trim() !== '');
  const formattedLines = [];

  lines.forEach((line, index) => {
    // Aplicar formatação de negrito nos labels
    let formattedLine = line;
    DEPLOY_LABELS.forEach(label => {
      const regex = new RegExp(`(${label})\\s*:\\s*`, 'gi');
      formattedLine = formattedLine.replace(regex, `<strong>$1:</strong> `);
    });

    formattedLines.push(formattedLine);

    // Adicionar espaçamento entre grupos relacionados
    const currentLine = line.toLowerCase();
    const nextLine = lines[index + 1]?.toLowerCase() || '';

    // Adicionar linha em branco após PR principal (se não for seguido de Feature flag)
    if (
      currentLine.includes('pr principal') &&
      !nextLine.includes('feature flag')
    ) {
      formattedLines.push('');
    }
    // Adicionar linha em branco após Feature flag
    else if (currentLine.includes('feature flag')) {
      formattedLines.push('');
    }
    // Adicionar linha em branco após Runner
    else if (currentLine.includes('runner')) {
      formattedLines.push('');
    }
    // Adicionar linha em branco após PR (último do grupo Título/Link/PR)
    else if (
      currentLine.includes('pr:') &&
      !currentLine.includes('pr principal')
    ) {
      formattedLines.push('');
    }
  });

  // Converter para HTML com fonte explícita
  const finalContent = formattedLines.join('<br>');
  html += `<p style="font-family:${VERDANA_FONT};">${finalContent}</p>`;
  html += '</div>';

  return html;
}

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

      return payload.exp > currentTime;
    } catch (error) {
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
        description: this.getFormattedDescription(
          activityData,
          generatedDescription
        ),
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
          throw new Error(
            `Falha ao criar atividade após renovação: ${retryError.message}`
          );
        }
      }

      throw new Error(`Falha ao criar atividade: ${error.message}`);
    }
  }

  /**
   * Formata a descrição para atividades do tipo BUG com HTML
   * @param {Object} activityData - Dados da atividade do formulário
   * @param {string} generatedDescription - Descrição gerada pela função de copiar
   * @returns {string} Descrição formatada em HTML
   */
  static formatBugDescription(activityData, generatedDescription = '') {
    const { PURPLE_COLOR, VERDANA_FONT, TAB_SPACING } = FORMATTING_CONSTANTS;

    // Se há uma descrição gerada, aplicar parsing das seções
    if (generatedDescription && generatedDescription.trim() !== '') {
      // Verificar se já contém HTML completo formatado
      if (
        generatedDescription.includes('<') &&
        generatedDescription.includes('>') &&
        generatedDescription.includes('color:#8e44ad')
      ) {
        return generatedDescription;
      }

      // Aplicar parsing das seções identificadas por ::
      return parseBugSections(generatedDescription);
    }

    // Template padrão para BUG (quando não há descrição gerada)
    const bugTemplate = `<p><span style="font-family:${VERDANA_FONT}">
<span style="color:${PURPLE_COLOR}"><strong>${TAB_SPACING}:: Incidente identificado ::</strong></span><br>
${activityData.titulo || 'Incidente reportado via KQA'}<br>
<br>
<span style="color:${PURPLE_COLOR}"><strong>${TAB_SPACING}:: Passo a passo para reprodução ::</strong></span><br>
» Acessar a aplicação<br>
» Reproduzir o comportamento descrito<br>
» Verificar o incidente<br>
<br>
<span style="color:${PURPLE_COLOR}"><strong>${TAB_SPACING}:: Comportamento esperado ::</strong></span><br>
Funcionamento correto da funcionalidade<br>
<br>
<span style="color:${PURPLE_COLOR}"><strong>${TAB_SPACING}:: Informações ::</strong></span><br>
Atividade criada via KQA<br>
<br>
<span style="color:${PURPLE_COLOR}"><strong>${TAB_SPACING}:: Evidência ::</strong></span><br>
Evidência pendente de anexo
</span></p>`;

    return bugTemplate;
  }

  /**
   * Formata a descrição para atividades do tipo Deploy com HTML
   * @param {Object} activityData - Dados da atividade do formulário
   * @param {string} generatedDescription - Descrição gerada pela função de copiar
   * @returns {string} Descrição formatada em HTML
   */
  static formatDeployDescription(activityData, generatedDescription = '') {
    // Se há uma descrição gerada, aplicar parsing dos labels
    if (generatedDescription && generatedDescription.trim() !== '') {
      // Verificar se já contém HTML completo formatado
      if (
        generatedDescription.includes('<h3') &&
        generatedDescription.includes('text-align:center')
      ) {
        return generatedDescription;
      }

      // Aplicar parsing dos labels identificados por ':'
      return parseDeployContent(generatedDescription);
    }

    // Template padrão para Deploy (quando não há descrição gerada)
    const { PURPLE_COLOR, VERDANA_FONT } = FORMATTING_CONSTANTS;

    const deployTemplate = `<div style="font-family:${VERDANA_FONT}">
<h3 style="text-align:center; color:${PURPLE_COLOR}; font-family:${VERDANA_FONT};"><strong>Gerar versão para deploy</strong></h3>

<p style="font-family:${VERDANA_FONT};"><strong>Título:</strong> ${activityData.titulo || 'Deploy preparado via KQA'}<br>
<strong>Criado via KQA</strong></p>
</div>`;

    return deployTemplate;
  }

  /**
   * Converte texto simples para formato HTML de BUG
   * @param {string} text - Texto simples
   * @returns {string} Texto formatado em HTML para BUG
   */
  static convertTextToBugHTML(text) {
    // Aplicar formatação básica HTML
    const formattedText = text
      .replace(/\n/g, '<br>\n')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // **texto** -> <strong>texto</strong>

    return `<p><span style="font-family:Verdana,Geneva,sans-serif">${formattedText}</span></p>`;
  }

  /**
   * Converte texto simples para formato HTML de Deploy
   * @param {string} text - Texto simples
   * @returns {string} Texto formatado em HTML para Deploy
   */
  static convertTextToDeployHTML(text) {
    // Aplicar formatação básica HTML
    const formattedText = text
      .replace(/\n/g, '<br>\n')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // **texto** -> <strong>texto</strong>

    return `<p>${formattedText}</p>`;
  }

  /**
   * Obtém a descrição formatada baseada no tipo de atividade
   * @param {Object} activityData - Dados da atividade
   * @param {string} generatedDescription - Descrição gerada
   * @returns {string} Descrição formatada em HTML
   */
  static getFormattedDescription(activityData, generatedDescription = '') {
    const activityType = activityData.tipo?.toLowerCase();

    // Determinar se é BUG ou Deploy baseado nos valores reais do ACTIVITY_TYPES
    if (
      activityType === 'bug produção' ||
      activityType === 'bug retrabalho' ||
      activityType.includes('bug')
    ) {
      return this.formatBugDescription(activityData, generatedDescription);
    } else if (activityType === 'deploy' || activityType.includes('deploy')) {
      return this.formatDeployDescription(activityData, generatedDescription);
    }

    // Fallback para outros tipos - aplicar formatação básica
    if (generatedDescription && generatedDescription.trim() !== '') {
      if (
        generatedDescription.includes('<') &&
        generatedDescription.includes('>')
      ) {
        return generatedDescription;
      }

      // Converter para HTML básico
      return `<p>${generatedDescription.replace(/\n/g, '<br>\n')}</p>`;
    }

    // Fallback padrão
    return `<p><strong>Atividade criada via KQA - ${activityData.tipo}</strong></p>`;
  }

  /**
   * Prepara as variáveis da atividade para o formato esperado pela API GraphQL
   * Implementa validação inteligente de campos obrigatórios vs opcionais:
   * - Campos obrigatórios: sempre enviados, valor padrão "." se vazio
   * - Campos opcionais: apenas enviados se têm valor real
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
      description: this.getFormattedDescription(
        activityData,
        generatedDescription
      ),
      priority:
        parseInt(activityData.prioridade) || DEFAULT_ARTIA_VALUES.PRIORITY,
      estimatedEffort:
        parseInt(activityData.esforcoEstimado) ||
        DEFAULT_ARTIA_VALUES.ESTIMATED_EFFORT,
      customField: [],
    };

    // Adicionar responsibleId se estiver presente
    if (activityData.responsibleId && activityData.responsibleId !== '') {
      variables.responsibleId = parseInt(activityData.responsibleId);
    }

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

    // Verificar tipo da atividade para campos obrigatórios
    const activityType = activityData.tipo;
    const requiredFields = REQUIRED_FIELDS_BY_TYPE[activityType] || [];

    // Iterar sobre os campos customizados definidos
    customFieldNames.forEach(fieldName => {
      const value = activityData[fieldName];
      const hashField = FORM_FIELD_TO_HASH[fieldName];

      // Validação com consideração de campos obrigatórios
      const hasValidHash = hashField && hashField !== '';

      if (!hasValidHash) return; // Pular se não tem hash válido

      // Determinar se o campo é obrigatório para este tipo de atividade
      const fieldConstantName = Object.keys(ARTIA_FIELD_HASHES).find(
        key => ARTIA_FIELD_HASHES[key] === hashField
      );
      const isRequired = requiredFields.includes(fieldConstantName);

      // Lógica de validação baseada em obrigatoriedade
      let shouldInclude = false;
      let finalValue = '';

      if (isRequired) {
        // Campo obrigatório: sempre incluir, usar valor padrão se vazio
        finalValue =
          value && String(value).trim() !== '' ? String(value).trim() : '.'; // Valor padrão para campos obrigatórios
        shouldInclude = true;
      } else {
        // Campo opcional: incluir apenas se tem valor real
        if (
          value &&
          String(value).trim() !== '' &&
          String(value).trim() !== '.'
        ) {
          finalValue = String(value).trim();
          shouldInclude = true;
        }
      }

      if (shouldInclude) {
        customFields.push({
          hashField,
          value: finalValue,
        });
      }
    });

    // Definir campos customizados finais
    variables.customField = customFields;

    // Log para debug apenas em desenvolvimento local
    if (
      typeof window !== 'undefined' &&
      window.location.hostname === 'localhost'
    ) {
      console.log('🔍 Artia Debug - Campos sendo enviados:');
      console.log('📋 Tipo de atividade:', activityType);
      console.log('✅ Campos obrigatórios:', requiredFields);
      console.log(
        '📤 Custom fields preparados:',
        customFields.map(f => ({
          field: Object.keys(ARTIA_FIELD_HASHES).find(
            k => ARTIA_FIELD_HASHES[k] === f.hashField
          ),
          value: f.value,
          isRequired: requiredFields.includes(
            Object.keys(ARTIA_FIELD_HASHES).find(
              k => ARTIA_FIELD_HASHES[k] === f.hashField
            )
          ),
        }))
      );
    }

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
