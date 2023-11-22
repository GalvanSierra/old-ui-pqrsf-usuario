import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { CircularProgress } from "@mui/material";

import { useOptions } from "./useOptions";
import { SectionPeticionario } from "./form/SectionPeticionario";
import { SectionPaciente } from "./form/SectionPaciente";
import { SectionInformacionPeticion } from "./form/SectionInformacionPeticion";
import { SectionGestion } from "./form/SectionGestion";

import api from "../service/api";

function Write() {
  const form = useForm();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const navigate = useNavigate();

  const { options: tipoPeticionOptions } = useOptions("/tipos_peticion");

  const [derechosSelected, setDerechosSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [peticionWrite, setPeticionWrite] = useState(null);
  const [isOpenModalSuccess, setIsOpenModalSuccess] = useState(false);
  const [identificador, setIdentificador] = useState(false);
  const [isOpenModalConfirm, setIsOpenModalConfirm] = useState(false);

  const REGIMEN_NA = 5;

  const returnToDashboard = () => {
    navigate("/dashboard-pqrsf");
  };
  const onSubmit = async (data) => {
    data.tutela = Boolean(data.tutela);
    data.seGestiono = Boolean(data.seGestiono);
    data.seDioRespuesta = Boolean(data.seDioRespuesta);

    console.log(data);
    if (!data.peticionario?.tipoId) {
      delete data.peticionario;
    }
    if (!data.paciente?.tipoId) {
      delete data.paciente;
    }

    if (data.paciente?.epsId === 15) data.paciente.regimenId = REGIMEN_NA;

    delete data.derechos;

    for (let key in data) {
      if (
        data[key] === "" ||
        data[key] === null ||
        data[key] === undefined ||
        (typeof data[key] === "number" && isNaN(data[key]))
      )
        delete data[key];
    }

    setPeticionWrite(data);
    setIsOpenModalConfirm(true);
  };

  const saveChanges = async () => {
    try {
      setLoading(true); // Activar el indicador de carga

      let id = null;

      await api
        .post("/peticiones", peticionWrite)
        .then((response) => response.data)
        .then((data) => {
          id = data.id;
          setIdentificador(data.id);
          setIsOpenModalSuccess(true);
        })
        .catch((error) => {
          console.error("Error en la solicitud POST", error);
        });

      await Promise.all(
        derechosSelected.map(async (derecho) => {
          console.log(derecho);
          return await api
            .post("/peticiones/add-item", {
              peticionId: id,
              derechoId: derecho,
            })
            .then((response) => {
              console.log("éxito de derecho", response);
            })
            .catch((error) => {
              console.error("Error en la solicitud DERECHO", error);
            });
        })
      );

      setIsOpenModalConfirm(false);
    } catch (error) {
      console.error("Error en la función saveChanges", error);
    } finally {
      setLoading(false); // Desactivar el indicador de carga, ya sea éxito o error
    }
  };

  return (
    <div className="container container-form">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="input-box form__input">
          <label>Tipo de solicitud</label>
          <select
            className="input"
            {...register("tipoPeticionId", {
              valueAsNumber: true,
              required: "Campo requerido",
            })}
          >
            <option defaultValue={true} hidden={true} value=""></option>
            {tipoPeticionOptions.map(({ id, nombre }) => (
              <option key={id} value={id}>
                {nombre}
              </option>
            ))}
          </select>
          {errors.tipoPeticionId && (
            <p role="alert" className="alert">
              {errors.tipoPeticionId.message}
            </p>
          )}
        </div>

        <SectionPeticionario form={form} />

        <SectionPaciente form={form} />

        <SectionInformacionPeticion form={form} />

        <SectionGestion
          form={form}
          derechos={[derechosSelected, setDerechosSelected]}
        />

        <div className="form-grid">
          <input
            className="button form__button"
            type="submit"
            value="Enviar petición"
          />
          <button
            className="button form__button button--red"
            onClick={returnToDashboard}
          >
            Regresar
          </button>
        </div>
      </form>
      {isOpenModalConfirm && (
        <div className="modal-container">
          <div className="modal">
            <p>Desea guardar los cambios realizados</p>
            <div className="modal-grid">
              <button
                className="button form__button"
                onClick={() => saveChanges()}
              >
                Si, guardar
              </button>
              <button
                className="button form__button button--red"
                onClick={() => setIsOpenModalConfirm(false)}
              >
                Regresar
              </button>
            </div>
            {loading && <CircularProgress />}
          </div>
        </div>
      )}
      {isOpenModalSuccess && (
        <div className="modal-container">
          <div className="modal">
            <p>
              Petición guardada exitosamente con identificador {identificador}
            </p>
            <div className="modal-grid">
              <button
                className="button form__button button--red"
                onClick={() => {
                  setIsOpenModalSuccess(false);
                  navigate("/dashboard-pqrsf");
                }}
              >
                Regresar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { Write };
