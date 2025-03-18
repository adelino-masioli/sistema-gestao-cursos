import React, { useEffect, useState } from "react";

const Filters = ({ onFilterChange, courses }) => {
  const [modalidade, setModalidade] = useState("");
  const [periodo, setPeriodo] = useState("");
  const [local, setLocal] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [nomeCurso, setNomeCurso] = useState("");
  const [filteredCount, setFilteredCount] = useState(courses?.length || 0);
  const [appliedFilters, setAppliedFilters] = useState({});

  // Extrair valores únicos dos dados reais
  const getUniqueValues = (field) => {
    if (!courses) return [];
    return [...new Set(courses.map((curso) => curso[field]))]
      .filter(Boolean)
      .sort();
  };

  const modalidades = getUniqueValues("modalidade");
  const periodos = getUniqueValues("periodo");
  const locais = getUniqueValues("local");

  // Formatar data de YYYY-MM-DD para DD-MM-YYYY (formato API)
  const formatDateForAPI = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };

  // Efeito para contar os resultados filtrados localmente
  // Apenas executa quando os filtros são aplicados
  useEffect(() => {
    if (courses) {
      const filteredCursos = courses.filter((course) => {
        return (
          (!appliedFilters.modalidade ||
            course.modalidade === appliedFilters.modalidade) &&
          (!appliedFilters.periodo ||
            course.periodo === appliedFilters.periodo) &&
          (!appliedFilters.local || course.local === appliedFilters.local) &&
          (!appliedFilters.dataInicio ||
            course.inicio_previsto === appliedFilters.dataInicio) &&
          (!appliedFilters.nomeCurso ||
            course.designacao
              .toLowerCase()
              .includes(appliedFilters.nomeCurso.toLowerCase()))
        );
      });

      setFilteredCount(filteredCursos.length);
    }
  }, [courses, appliedFilters]);

  // Função para aplicar os filtros - CORRIGIDA
  const handleApplyFilters = () => {
    const filters = {};

    // Apenas adicionar filtros que possuem valores
    if (modalidade) filters.modalidade = modalidade;
    if (periodo) filters.periodo = periodo;
    if (local) filters.local = local;
    if (dataInicio) filters.dataInicio = formatDateForAPI(dataInicio);
    if (nomeCurso) filters.nomeCurso = nomeCurso;

    // Atualizar os filtros aplicados
    setAppliedFilters(filters);

    // Chamar a função de filtragem passada como prop
    onFilterChange(filters);
  };

  // Limpar todos os filtros
  const handleClearFilters = () => {
    setModalidade("");
    setPeriodo("");
    setLocal("");
    setDataInicio("");
    setNomeCurso("");

    // Limpar os filtros aplicados
    setAppliedFilters({});
    onFilterChange({});
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800">Filtros</h2>
        <span className="text-sm text-gray-600">
          {filteredCount}{" "}
          {filteredCount === 1 ? "curso encontrado" : "cursos encontrados"}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Nome do Curso */}
        <div className="lg:col-span-4">
          <label
            htmlFor="nomeCurso"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nome do Curso
          </label>
          <input
            type="text"
            id="nomeCurso"
            value={nomeCurso}
            onChange={(e) => setNomeCurso(e.target.value)}
            placeholder="Pesquisar por nome do curso..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-200"
          />
        </div>

        {/* Modalidade */}
        <div>
          <label
            htmlFor="modalidade"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Modalidade
          </label>
          <select
            id="modalidade"
            value={modalidade}
            onChange={(e) => setModalidade(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-200"
          >
            <option value="">Todas</option>
            {modalidades.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Período */}
        <div>
          <label
            htmlFor="periodo"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Período
          </label>
          <select
            id="periodo"
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-200"
          >
            <option value="">Todos</option>
            {periodos.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Local */}
        <div>
          <label
            htmlFor="local"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Local
          </label>
          <select
            id="local"
            value={local}
            onChange={(e) => setLocal(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-200"
          >
            <option value="">Todos</option>
            {locais.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Data de Início */}
        <div>
          <label
            htmlFor="dataInicio"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Data de Início
          </label>
          <input
            type="date"
            id="dataInicio"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-200"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          onClick={handleClearFilters}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition-colors duration-300 flex items-center cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          Limpar Filtros
        </button>

        <button
          onClick={handleApplyFilters}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-300 flex items-center cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          Buscar
        </button>
      </div>
    </div>
  );
};

export default Filters;
