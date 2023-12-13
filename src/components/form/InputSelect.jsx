/* eslint-disable react/prop-types */
import { useFormContext } from "react-hook-form";

function InputSelect({ name, options, inputOptions }) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <>
      <select className="input" {...register(name, inputOptions)}>
        <option defaultValue={true} hidden={true} value=""></option>
        {options.map(({ id, nombre }) => (
          <option key={id} value={id}>
            {nombre}
          </option>
        ))}
      </select>
      {errors[name] && (
        <p role="alert" className="alert">
          {errors[name].message}
        </p>
      )}
    </>
  );
}

export { InputSelect };
