// Serviço de API para comunicação com o backend

const API_URL = 'http://localhost:3000'; // Substitua pela URL da sua API Mock

export const fetchCourses = async (filters = {}) => {
  try {
    // Construir a query string com os filtros
    const queryParams = new URLSearchParams();
    
    if (filters.modalidade) queryParams.append('modalidade', filters.modalidade);
    if (filters.periodo) queryParams.append('periodo', filters.periodo);
    if (filters.local) queryParams.append('local', filters.local);
    if (filters.dataInicio) queryParams.append('dataInicio', filters.dataInicio);
    if (filters.nomeCurso) queryParams.append('nomeCurso', filters.nomeCurso);
    
    const queryString = queryParams.toString();
    const url = `${API_URL}/cursos${queryString ? `?${queryString}` : ''}`;
    
    console.log('Filtrando cursos com URL:', url); // Log para depuração
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Erro ao carregar cursos: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar cursos:', error);
    throw error;
  }
};

export const submitInscription = async (courseId, inscriptionData) => {
  try {
    const response = await fetch(`${API_URL}/inscricoes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cursoId: courseId,
        ...inscriptionData
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Erro ao submeter inscrição: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erro ao submeter inscrição:', error);
    throw error;
  }
};