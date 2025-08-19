document.addEventListener('DOMContentLoaded', () => {
  const tipoVeiculo = document.getElementById('tipoVeiculo');
  const marca = document.getElementById('marca');
  const modelo = document.getElementById('modelo');
  const btnConsultar = document.getElementById('btnConsultar');
  const loading = document.getElementById('loading');
  const error = document.getElementById('error');
  const resultsSection = document.getElementById('resultsSection');

  const vehicleName = document.getElementById('vehicleName');
  const marcaP = document.getElementById('marcaP');
  const modeloP = document.getElementById('modeloP');
  const anoModeloP = document.getElementById('anoModeloP');
  const combustivelP = document.getElementById('combustivelP');
  const valorFipeP = document.getElementById('valorFipeP');
  const mesReferenciaP = document.getElementById('mesReferenciaP');

  function toggleLoading(show) {
    loading.style.display = show ? 'block' : 'none';
    btnConsultar.disabled = show;
  }

  function showError(msg) {
    error.textContent = msg;
    error.style.display = 'block';
    resultsSection.style.display = 'none';
  }

  function clearError() {
    error.style.display = 'none';
  }

  async function fetchMarcas() {
    try {
      toggleLoading(true);
      clearError();

      const res = await fetch(`https://brasilapi.com.br/api/fipe/marcas/v1/${tipoVeiculo.value}`);
      if (!res.ok) throw new Error('Não foi possível carregar marcas');

      const data = await res.json();
      marca.innerHTML = '<option value="">Selecione a marca</option>';
      data.forEach(item => {
        marca.innerHTML += `<option value="${item.valor}">${item.nome}</option>`;
      });
      marca.disabled = false;
    } catch (err) {
      showError(err.message);
    } finally {
      toggleLoading(false);
    }
  }

  async function fetchModelos() {
    try {
      toggleLoading(true);
      clearError();

      const res = await fetch(`https://brasilapi.com.br/api/fipe/veiculos/v1/${tipoVeiculo.value}/${marca.value}`);
      if (!res.ok) throw new Error('Não foi possível carregar modelos');

      const data = await res.json();
      modelo.innerHTML = '<option value="">Selecione o modelo</option>';
      data.forEach(item => {
        modelo.innerHTML += `<option value="${item.modelo}">${item.modelo}</option>`;
      });
      modelo.disabled = false;
    } catch (err) {
      showError(err.message);
    } finally {
      toggleLoading(false);
    }
  }

  async function consultarPreco() {
    try {
      toggleLoading(true);
      clearError();

      // Aqui não há código FIPE, pois a rota de modelos não fornece. Exibir dados básicos.
      vehicleName.textContent = `${marca.options[marca.selectedIndex].text} ${modelo.value}`;
      marcaP.textContent = marca.options[marca.selectedIndex].text;
      modeloP.textContent = modelo.value;
      resultsSection.style.display = 'block';
    } catch (err) {
      showError(err.message);
    } finally {
      toggleLoading(false);
    }
  }

  tipoVeiculo.addEventListener('change', () => {
    marca.innerHTML = '<option value="">Selecione a marca</option>';
    modelo.innerHTML = '<option value="">Selecione o modelo</option>';
    marca.disabled = true;
    modelo.disabled = true;
    resultsSection.style.display = 'none';
    if (tipoVeiculo.value) fetchMarcas();
  });

  marca.addEventListener('change', () => {
    modelo.innerHTML = '<option value="">Selecione o modelo</option>';
    modelo.disabled = true;
    resultsSection.style.display = 'none';
    if (marca.value) fetchModelos();
  });

  modelo.addEventListener('change', () => {
    btnConsultar.disabled = !modelo.value;
    resultsSection.style.display = 'none';
  });

  btnConsultar.addEventListener('click', consultarPreco);
});