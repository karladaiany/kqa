export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, OrganizationId'
  );

  // Responder ao preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Apenas permitir POST (GraphQL usa POST)
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Fazer a requisição para a API real do Artia
    const response = await fetch('https://app.artia.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: req.headers.authorization || '',
        OrganizationId: req.headers.organizationid || '',
      },
      body: JSON.stringify(req.body),
    });

    // Obter a resposta da API
    const data = await response.json();

    // Retornar a resposta com o status code correto
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Erro no proxy para Artia:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: error.message,
    });
  }
}
