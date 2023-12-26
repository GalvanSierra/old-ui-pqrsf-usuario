export const getOptionsAdapter = (options) => {
  const newOptions = options.map((option) => {
    return {
      label: option.nombre,
      value: option.id,
    };
  });

  return newOptions;
};

export const getOptionsLiderAdapter = (options) => {
  const newOptions = options.map((option) => {
    return {
      label: option.cargo,
      value: option.id,
    };
  });

  return newOptions;
};
