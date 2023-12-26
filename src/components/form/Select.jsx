/* eslint-disable react/prop-types */
import { useFormContext } from "react-hook-form";

export function Select({ name, required, options, inputProps }) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <>
      <select
        className="input"
        id={name}
        {...register(name, {
          required: {
            value: required,
            message: "campo requerido",
          },
          ...inputProps,
        })}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {errors[name] && <span>{errors[name].message}</span>}
    </>
  );
}
