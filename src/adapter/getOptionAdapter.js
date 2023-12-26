export const getOptionAdapter = (options) => {
  const newOptions = options.map((option) => {
    return {
      label: option.nombre,
      value: option.id,
    };
  });

  return newOptions;
};
