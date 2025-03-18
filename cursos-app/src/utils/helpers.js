// Funções auxiliares para o projeto

// Formatar data para exibição
export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  // Verificar se está no formato DD-MM-YYYY
  if (/^\d{2}-\d{2}-\d{4}$/.test(dateString)) {
    // Converter de DD-MM-YYYY para objeto Date
    const [day, month, year] = dateString.split('-');
    const date = new Date(`${year}-${month}-${day}`);
    
    // Verificar se a data é válida
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString('pt-PT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
  }
  
  // Tentar converter diretamente se não estiver no formato esperado
  const date = new Date(dateString);
  if (!isNaN(date.getTime())) {
    return date.toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
  
  // Retornar a string original se não for possível converter
  return dateString;
};

// Validar email
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Validar telefone português
export const validatePhone = (phone) => {
  const regex = /^(9[1236]\d{7}|2\d{8})$/;
  return regex.test(phone);
};

// Validar se todos os campos obrigatórios estão preenchidos
export const validateRequiredFields = (data, requiredFields) => {
  return requiredFields.every(field => data[field] && data[field].trim() !== '');
};