/* eslint-disable react/prop-types */
import { useFormContext } from "react-hook-form";

function InputText({ name, label, className, ...rest }) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        {...register(name, rest)}
        {...rest}
        className={className}
      />
      {errors[name] && <span>{errors[name].message}</span>}
    </div>
  );
}

export { InputText };
