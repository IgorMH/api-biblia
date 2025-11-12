document.addEventListener('DOMContentLoaded', () => {
  // Pega todos os elementos do HTML
  const versionSelect = document.getElementById('version-select');
  const livroSelect = document.getElementById('livro-select');
  const capituloSelect = document.getElementById('capitulo-select');
  const versiculoInput = document.getElementById('versiculo-input');
  const buscarBtn = document.getElementById('buscar-btn');
  const resultadoDiv = document.getElementById('resultado');

  // Função para popular o seletor de livros
  async function carregarLivros() {
    try {
      // Pede ao NOSSO backend, que pedirá à API
      const response = await fetch('/api/livros'); 
      const livros = await response.json();
      
      livroSelect.innerHTML = '<option value="">Selecione um livro...</option>'; // Limpa
      livros.forEach(livro => {
        const option = document.createElement('option');
        option.value = livro.abbrev.pt;
        option.textContent = livro.name;
        livroSelect.appendChild(option);
      });
      livroSelect.disabled = false;
    } catch (error) {
      livroSelect.innerHTML = '<option>Erro ao carregar</option>';
    }
  }

  // Função para popular o seletor de capítulos
  async function carregarCapitulos(abbrev) {
    if (!abbrev) {
      capituloSelect.innerHTML = '<option>Selecione um livro...</option>';
      capituloSelect.disabled = true;
      return;
    }
    
    try {
      capituloSelect.innerHTML = '<option>Carregando...</option>';
      capituloSelect.disabled = true;

      const response = await fetch(`/api/capitulos/${abbrev}`);
      const data = await response.json();
      
      capituloSelect.innerHTML = ''; // Limpa
      for (let i = 1; i <= data.chapters; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `Capítulo ${i}`;
        capituloSelect.appendChild(option);
      }
      capituloSelect.disabled = false;
    } catch (error) {
      capituloSelect.innerHTML = '<option>Erro</option>';
    }
  }

  // Função para buscar o versículo/capítulo
  async function buscar() {
    const version = versionSelect.value;
    const abbrev = livroSelect.value;
    const chapter = capituloSelect.value;
    const number = versiculoInput.value;

    if (!version || !abbrev || !chapter) {
      resultadoDiv.innerHTML = '<p class="erro">Por favor, selecione Versão, Livro e Capítulo.</p>';
      return;
    }

    resultadoDiv.innerHTML = '<p>Buscando...</p>';

    try {
      let url = `/api/versiculos/${version}/${abbrev}/${chapter}`;
      if (number) {
        url += `/${number}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();

      // Renderiza o resultado
      let html = '';
      if (number) {
        // Versículo único
        html = `<h3>${data.book.name} ${data.chapter}:${data.number}</h3><p>${data.text}</p>`;
      } else {
        // Capítulo inteiro
        html = `<h3>${data.book.name}, Capítulo ${data.chapter.number}</h3>`;
        data.verses.forEach(verse => {
          html += `<p><strong>${verse.number}.</strong> ${verse.text}</p>`;
        });
      }
      resultadoDiv.innerHTML = html;

    } catch (error) {
      resultadoDiv.innerHTML = '<p class="erro">Erro ao buscar dados. Verifique a seleção.</p>';
    }
  }

  // --- Event Listeners ---

  // 1. Carrega os livros quando a página abre
  carregarLivros();

  // 2. Carrega os capítulos quando um livro é selecionado
  livroSelect.addEventListener('change', () => {
    carregarCapitulos(livroSelect.value);
  });

  // 3. Busca quando o botão é clicado
  buscarBtn.addEventListener('click', buscar);
});