import React, { useCallback, useEffect, useState } from "react";
import CourseList from "./components/CourseList";
import Filters from "./components/Filters";
import InscriptionForm from "./components/InscriptionForm";
import Modal from "./components/Modal";
import { fetchCourses } from "./services/api";

function App() {
  // Estados para cursos
  const [allCourses, setAllCourses] = useState([]); // Todos os cursos sem filtro
  const [filteredCourses, setFilteredCourses] = useState([]); // Cursos filtrados
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});

  // Estados para modal de inscrição
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Carregar todos os cursos quando o componente montar
  useEffect(() => {
    const loadCourses = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Buscar todos os cursos sem filtro
        const coursesData = await fetchCourses();
        setAllCourses(coursesData);
        setFilteredCourses(coursesData); // Inicialmente, exibir todos os cursos
      } catch (err) {
        setError(err);
        console.error("Erro ao carregar cursos:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadCourses();
  }, []); // Sem dependência em filters - carregamos todos os cursos uma vez

  // Aplicar filtros localmente quando os filtros mudarem
  useEffect(() => {
    if (allCourses.length === 0) return;

    // Função para aplicar filtros localmente
    const applyFilters = () => {
      const filtered = allCourses.filter((course) => {
        return (
          (!filters.modalidade || course.modalidade === filters.modalidade) &&
          (!filters.periodo || course.periodo === filters.periodo) &&
          (!filters.local || course.local === filters.local) &&
          (!filters.dataInicio ||
            course.inicio_previsto === filters.dataInicio) &&
          (!filters.nomeCurso ||
            course.designacao
              .toLowerCase()
              .includes(filters.nomeCurso.toLowerCase()))
        );
      });

      setFilteredCourses(filtered);
    };

    applyFilters();
  }, [filters, allCourses]);

  // Função para abrir o modal de inscrição
  const handleInscriptionClick = (course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  // Função para fechar o modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Resetar o curso selecionado depois de um pequeno delay
    setTimeout(() => {
      setSelectedCourse(null);
    }, 300);
  };

  // Função para lidar com inscrição bem-sucedida
  const handleInscriptionSuccess = () => {
    // Mostrar mensagem de sucesso
    setSuccessMessage("Inscrição realizada com sucesso!");

    // Limpar mensagem após 5 segundos
    setTimeout(() => {
      setSuccessMessage(null);
    }, 5000);
  };

  // Função para atualizar filtros
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 antialiased">
      <header className="bg-iefp-green text-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Sistema de Gestão de Cursos</h1>
          <p className="mt-2">Encontre e inscreva-se nos cursos disponíveis</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Mensagem de sucesso */}
        {successMessage && (
          <div
            className="mb-6 bg-green-100 border border-green-400 bg-iefp-green px-4 py-3 rounded relative"
            role="alert"
          >
            <span className="block sm:inline">{successMessage}</span>
            <button
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
              onClick={() => setSuccessMessage(null)}
            >
              <svg
                className="h-6 w-6 text-green-500"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        )}

        {/* Filtros */}
        <Filters onFilterChange={handleFilterChange} courses={allCourses} />

        {/* Estatísticas */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">
            Cursos Disponíveis
          </h2>
          {!isLoading && !error && (
            <span className="text-gray-600">
              {filteredCourses.length}{" "}
              {filteredCourses.length === 1
                ? "curso encontrado"
                : "cursos encontrados"}
            </span>
          )}
        </div>

        {/* Lista de Cursos - Agora usando filteredCourses */}
        <CourseList
          courses={filteredCourses}
          isLoading={isLoading}
          error={error}
          onInscriptionClick={handleInscriptionClick}
        />

        {/* Modal de Inscrição */}
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title="Inscrição no Curso"
        >
          {selectedCourse && (
            <InscriptionForm
              course={selectedCourse}
              onClose={handleCloseModal}
              onSuccess={handleInscriptionSuccess}
            />
          )}
        </Modal>
      </main>

      <footer className="bg-gray-800 text-white mt-auto">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center">
            © {new Date().getFullYear()} Sistema de Gestão de Cursos
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
