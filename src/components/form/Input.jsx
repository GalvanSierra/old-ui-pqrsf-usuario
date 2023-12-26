/* eslint-disable react/prop-types */
import { useFormContext } from "react-hook-form";

export function Input({ type, name, required, inputProps }) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <>
      <input
        className="input"
        type={type}
        id={name}
        {...register(name, {
          required: {
            value: required,
            message: "campo requerido",
          },
          ...inputProps,
        })}
      />
      {errors[name] && <span>{errors[name].message}</span>}
    </>
  );
}
