import React, { useState } from "react";
import { submitInscription } from "../services/api";
import { validateEmail, validatePhone } from "../utils/helpers";

const InscriptionForm = ({ course, onClose, onSuccess }) => {
  // Estado inicial do formulário
  const initialFormState = {
    nome: "",
    email: "",
    telefone: "",
    dataNascimento: "",
    documento: "",
    numeroDocumento: "",
    observacoes: "",
  };

  // Estados do formulário
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState(null); // 'success', 'error' ou null

  // Campos obrigatórios
  const requiredFields = [
    "nome",
    "email",
    "telefone",
    "dataNascimento",
    "documento",
    "numeroDocumento",
  ];

  // Função para atualizar o estado do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpar erro do campo que está sendo alterado
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  // Validar formulário
  const validateForm = () => {
    const newErrors = {};

    // Validar campos obrigatórios
    requiredFields.forEach((field) => {
      if (!formData[field] || formData[field].trim() === "") {
        newErrors[field] = "Este campo é obrigatório";
      }
    });

    // Validar email
    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = "Email inválido";
    }

    // Validar telefone
    if (formData.telefone && !validatePhone(formData.telefone)) {
      newErrors.telefone = "Número de telefone inválido";
    }

    // Verificar data de nascimento (idade mínima de 18 anos)
    if (formData.dataNascimento) {
      const today = new Date();
      const birthDate = new Date(formData.dataNascimento);
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        const isAdult = age - 1 >= 18;
        if (!isAdult) {
          newErrors.dataNascimento = "É necessário ter pelo menos 18 anos";
        }
      } else {
        const isAdult = age >= 18;
        if (!isAdult) {
          newErrors.dataNascimento = "É necessário ter pelo menos 18 anos";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submeter formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar formulário antes de submeter
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setFormStatus(null);

    try {
      await submitInscription(course.id, formData);

      setFormStatus("success");
      setFormData(initialFormState);

      // Chamar função de sucesso após um tempo para permitir que o usuário veja a mensagem
      setTimeout(() => {
        if (onSuccess) onSuccess();
        if (onClose) onClose();
      }, 2000);
    } catch (error) {
      console.error("Erro ao submeter inscrição:", error);
      setFormStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Informações do curso */}
      <div className="bg-green-50 p-4 rounded-md mb-6">
        <h3 className="font-medium text-green-800 mb-2">
          Informações do curso
        </h3>
        <p>
          <span className="font-medium">Curso:</span>{" "}
          {course.designacao || "Não informado"}
        </p>
        <p>
          <span className="font-medium">Modalidade:</span> {course.modalidade}
        </p>
        <p>
          <span className="font-medium">Local:</span> {course.local}
        </p>
      </div>

      {/* Nome completo */}
      <div>
        <label
          htmlFor="nome"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Nome completo *
        </label>
        <input
          type="text"
          id="nome"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          placeholder="Informe o seu nome completo"
          className={`w-full border ${
            errors.nome ? "border-red-500" : "border-gray-300"
          } rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        {errors.nome && (
          <p className="mt-1 text-sm text-red-600">{errors.nome}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Email *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="email@email.pt"
          className={`w-full border ${
            errors.email ? "border-red-500" : "border-gray-300"
          } rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      {/* Telefone */}
      <div>
        <label
          htmlFor="telefone"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Telefone *
        </label>
        <input
          type="tel"
          id="telefone"
          name="telefone"
          value={formData.telefone}
          onChange={handleChange}
          placeholder="912345678"
          className={`w-full border ${
            errors.telefone ? "border-red-500" : "border-gray-300"
          } rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        {errors.telefone && (
          <p className="mt-1 text-sm text-red-600">{errors.telefone}</p>
        )}
      </div>

      {/* Data de Nascimento */}
      <div>
        <label
          htmlFor="dataNascimento"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Data de Nascimento *
        </label>
        <input
          type="date"
          id="dataNascimento"
          name="dataNascimento"
          value={formData.dataNascimento}
          onChange={handleChange}
          className={`w-full border ${
            errors.dataNascimento ? "border-red-500" : "border-gray-300"
          } rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        {errors.dataNascimento && (
          <p className="mt-1 text-sm text-red-600">{errors.dataNascimento}</p>
        )}
      </div>

      {/* Documento de Identificação */}
      <div>
        <label
          htmlFor="documento"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Tipo de Documento *
        </label>
        <select
          id="documento"
          name="documento"
          value={formData.documento}
          onChange={handleChange}
          className={`w-full border ${
            errors.documento ? "border-red-500" : "border-gray-300"
          } rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
        >
          <option value="">Selecione</option>
          <option value="BI/CC">BI/CC</option>
          <option value="Passaporte">Passaporte</option>
          <option value="Outro">Outro</option>
        </select>
        {errors.documento && (
          <p className="mt-1 text-sm text-red-600">{errors.documento}</p>
        )}
      </div>

      {/* Número do Documento */}
      <div>
        <label
          htmlFor="numeroDocumento"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Número do Documento *
        </label>
        <input
          type="text"
          id="numeroDocumento"
          name="numeroDocumento"
          value={formData.numeroDocumento}
          onChange={handleChange}
          placeholder="Informe o número do documento"
          className={`w-full border ${
            errors.numeroDocumento ? "border-red-500" : "border-gray-300"
          } rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        {errors.numeroDocumento && (
          <p className="mt-1 text-sm text-red-600">{errors.numeroDocumento}</p>
        )}
      </div>

      {/* Observações */}
      <div>
        <label
          htmlFor="observacoes"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Observações
        </label>
        <textarea
          id="observacoes"
          name="observacoes"
          value={formData.observacoes}
          onChange={handleChange}
          placeholder="Insira observações"
          rows={3}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Mensagens de status */}
      {formStatus === "success" && (
        <div className="bg-green-50 text-green-800 p-4 rounded-md">
          Inscrição submetida com sucesso!
        </div>
      )}

      {formStatus === "error" && (
        <div className="bg-red-50 text-red-800 p-4 rounded-md">
          Ocorreu um erro ao submeter a inscrição. Por favor, tente novamente.
        </div>
      )}

      {/* Botões */}
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition-colors duration-300 cursor-pointer"
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="bg-iefp-green  bg-iefp-green-hover text-white font-medium py-2 px-4 rounded transition-all cursor-pointer duration-300"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Enviando...
            </span>
          ) : (
            "Submeter Inscrição"
          )}
        </button>
      </div>
    </form>
  );
};

export default InscriptionForm;
