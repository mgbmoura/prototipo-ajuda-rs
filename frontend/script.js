document.addEventListener('DOMContentLoaded', () => {

    
    const db = firebase.firestore();
  
    
    const ajudasCollection = db.collection('ajudas');
  
  

    const form = document.getElementById('ajuda-form');
    const ajudasListDiv = document.getElementById('ajudas-list');
  
  

    async function fetchAndRenderAjudas() {
      try {

        const snapshot = await ajudasCollection.orderBy("timestamp", "desc").get();
        
        ajudasListDiv.innerHTML = ''; 
  
        
        if (snapshot.empty) {
          ajudasListDiv.innerHTML = "<p>Nenhum ponto de ajuda cadastrado ainda. Seja o primeiro!</p>";
          return;
        }
  
        
        snapshot.forEach(doc => {
          const ajuda = doc.data(); 
          const ajudaElement = document.createElement('div');
          ajudaElement.classList.add('ajuda-item');
  
          const tipoClass = ajuda.tipo === 'Precisa de Ajuda' ? 'tipo-precisa' : 'tipo-oferece';
  
          ajudaElement.innerHTML = `
            <h3>${ajuda.nome} <small>(${ajuda.cidade})</small></h3>
            <p class="tipo ${tipoClass}">${ajuda.tipo}</p>
            <p>${ajuda.descricao}</p>
          `;
          ajudasListDiv.appendChild(ajudaElement);
        });
      } catch (error) {
        console.error("Falha ao buscar ajudas:", error);
        ajudasListDiv.innerHTML = "<p>Erro ao carregar os dados. Tente recarregar a página.</p>";
      }
    }
  
  
   
    form.addEventListener('submit', async (event) => {
      event.preventDefault(); 
  
      
      const novaAjuda = {
        nome: document.getElementById('nome').value,
        cidade: document.getElementById('cidade').value,
        tipo: document.getElementById('tipo').value,
        descricao: document.getElementById('descricao').value,
        timestamp: firebase.firestore.FieldValue.serverTimestamp() // Pega a hora exata do servidor do Firebase
      };
  
      try {
        
        await ajudasCollection.add(novaAjuda);
  
        form.reset(); 
        fetchAndRenderAjudas();
      } catch (error) {
        console.error("Falha ao cadastrar ajuda:", error);
        alert("Não foi possível cadastrar o ponto de ajuda. Tente novamente.");
      }
    });
  
  
    
    fetchAndRenderAjudas();
  });