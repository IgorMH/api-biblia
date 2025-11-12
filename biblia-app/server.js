const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Token da API - Use uma variável de ambiente no Docker!
// No seu Dockerfile ou Docker Compose, defina API_TOKEN
const API_TOKEN = process.env.API_TOKEN || "";
const API_BASE_URL = "https://www.abibliadigital.com.br/api";

// 1. Servir os arquivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Headers de autorização para a API
const getAuthHeaders = () => {
  if (API_TOKEN) {
    return { Authorization: `Bearer ${API_TOKEN}` };
  }
  return {};
};

// 2. Proxy para a lista de Livros
app.get('/api/livros', async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/books`, {
      headers: getAuthHeaders()
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar livros' });
  }
});

// 3. Proxy para os detalhes do Livro (Capítulos)
app.get('/api/capitulos/:abbrev', async (req, res) => {
  try {
    const { abbrev } = req.params;
    const response = await axios.get(`${API_BASE_URL}/books/${abbrev}`, {
      headers: getAuthHeaders()
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar capítulos' });
  }
});

// 4. Proxy para os Versículos (Capítulo ou Versículo único)
app.get('/api/versiculos/:version/:abbrev/:chapter/:number?', async (req, res) => {
  try {
    const { version, abbrev, chapter, number } = req.params;
    let url = `${API_BASE_URL}/verses/${version}/${abbrev}/${chapter}`;
    if (number) {
      url += `/${number}`;
    }
    
    const response = await axios.get(url, {
      headers: getAuthHeaders()
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar versículos' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});