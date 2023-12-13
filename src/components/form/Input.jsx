/* eslint-disable react/prop-types */
import { useFormContext } from "react-hook-form";

function Input({
  name,
  type,
  required = false,
  disabled = false,
  inputOptoins,
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <>
      <input
        disabled={disabled}
        type={type}
        id={name}
        {...register(name, {
          required: {
            value: required,
            message: "Campo requerido",
          },
          ...inputOptoins,
        })}
        className="input"
      />
      {errors[name] && <span>{errors[name].message}</span>}
    </>
  );
}

export { Input };
