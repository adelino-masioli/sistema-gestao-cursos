import React, { useEffect, useState } from "react";
import CourseCard from "./CourseCard";

const CourseList = ({ courses, isLoading, error, onInscriptionClick }) => {
  // Estado para controlar quantos cursos mostrar
  const [visibleCourses, setVisibleCourses] = useState([]);
  // Quantos cursos mostrar de cada vez
  const coursesPerPage = 6;
  // Estado para rastrear a página atual
  const [currentPage, setCurrentPage] = useState(1);
  // Estado para verificar se há mais cursos para carregar
  const [hasMore, setHasMore] = useState(false);

  // Atualiza os cursos visíveis quando o array de cursos mudar
  useEffect(() => {
    if (courses && courses.length > 0) {
      setVisibleCourses(courses.slice(0, coursesPerPage));
      setHasMore(courses.length > coursesPerPage);
      setCurrentPage(1);
    } else {
      setVisibleCourses([]);
      setHasMore(false);
    }
  }, [courses]);

  // Função para carregar mais cursos
  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    const newVisibleCourses = courses.slice(0, nextPage * coursesPerPage);

    setVisibleCourses(newVisibleCourses);
    setCurrentPage(nextPage);
    setHasMore(newVisibleCourses.length < courses.length);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 font-medium">
          Erro ao carregar cursos. Por favor, tente novamente.
        </p>
        <p className="text-gray-600 text-sm mt-2">{error.message}</p>
      </div>
    );
  }

  if (!courses || courses.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 font-medium">
          Nenhum curso encontrado com os filtros aplicados.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleCourses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            onInscriptionClick={onInscriptionClick}
          />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleLoadMore}
            className="button-iefp-green-load-more"
          >
            <span>Carregar mais cursos</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      )}

      {visibleCourses.length > 0 && (
        <div className="text-center text-gray-500 text-sm">
          Mostrando {visibleCourses.length} de {courses.length} cursos
        </div>
      )}
    </div>
  );
};

export default CourseList;
