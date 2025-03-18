import React from "react";
import { formatDate } from "../utils/helpers";

const CourseCard = ({ course, onInscriptionClick }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          {course.designacao}
        </h3>

        <div className="mb-4">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2">
            {course.modalidade}
          </span>
          <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mr-2">
            {course.periodo}
          </span>
        </div>

        <div className="text-sm text-gray-600 mb-4">
          <p className="mb-1">
            <span className="font-medium">Local:</span>{" "}
            {course.local || "Não informado"}
          </p>
          <p className="mb-1">
            <span className="font-medium">Data de Início:</span>{" "}
            {formatDate(course.inicio_previsto)}
          </p>
          <p className="mb-1">
            <span className="font-medium">Data de Fim:</span>{" "}
            {formatDate(course.fim_previsto)}
          </p>
          <p className="mb-1">
            <span className="font-medium">Código do Curso:</span>{" "}
            {course.curso_numero}
          </p>
          {course.obs && (
            <p className="mb-1">
              <span className="font-medium">Observações:</span> {course.obs}
            </p>
          )}
        </div>

        <div className="mt-4">
          <button
            onClick={() => onInscriptionClick(course)}
            className="bg-iefp-green  bg-iefp-green-hover text-white font-medium py-2 px-4 rounded transition-all cursor-pointer duration-300"
          >
            Inscrever-se
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
