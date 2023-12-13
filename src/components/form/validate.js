const emailValidation = {
  required: "Campo requerido",
  pattern: {
    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    message: "Por favor, ingresa un email válida",
  },
};

const required = {
  required: "Campo requerido",
};

export { emailValidation, required };
