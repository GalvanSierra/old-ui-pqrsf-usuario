import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useOptions } from "./useOptions";
import { useAuth } from "../hooks/useAuth";

import { SectionPeticionario } from "./form/SectionPeticionario";
import { SectionPaciente } from "./form/SectionPaciente";
import { SectionInformacion } from "./form/SectionInformacion";
import { SectionGestion } from "./form/SectionGestion";

import { CircularProgress } from "@mui/material";

import api from "../service/api";
function Management() {
  const { id } = useParams();
  const navigate = useNavigate();

  const form = useForm();
  const auth = useAuth();
  const { register, setValue, handleSubmit } = form;

  const { options: tipoPeticionOptions } = useOptions("/tipos_peticion");

  const [changes, setChanges] = useState(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [peticionData, setPeticionData] = useState(null);
  const [derechosSelected, setDerechosSelected] = useState([]);
  const [isDisableSection, setIsDisableSection] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (auth.user) {
      setIsDisableSection(true);
    } else {
      setIsDisableSection(false);
    }
  }, [auth.user]);

  useEffect(() => {
    const fetchPeticionData = async () => {
      const peticion = await api
        .get(`/peticiones/${id}`)
        .then((response) => response.data)
        .then((data) => {
          setPeticionData(data);
          return data;
        })
        .catch((error) => {
          console.error("Error:", error);
        });

      setValue("radicado", peticion.radicado);
      setValue("tipoPeticionId", peticion.tipoPeticionId);

      setDerechosSelected(peticion.derechos.map((derecho) => derecho.id));
    };

    fetchPeticionData();
  }, [id, setValue]);

  const returnToDashboard = () => {
    navigate("/dashboard-pqrsf", { replace: true });
  };

  const findChangesToUpdate = (obj1, obj2) => {
    const differences = {};

    // Itera a través de las propiedades de obj1
    for (let key in obj1) {
      if (obj1[key] !== obj2[key] && obj2[key] != undefined && obj2[key] != "")
        differences[key] = obj2[key];
    }

    delete differences.paciente;
    delete differences.peticionario;
    delete differences.derechos;

    return differences;
  };

  const onSubmit = async (data) => {
    const changes = findChangesToUpdate(peticionData, data);

    changes.seGestiono = Boolean(changes.seGestiono);
    changes.seDioRespuesta = Boolean(changes.seDioRespuesta);

    console.log(changes);
    setChanges(changes);
    setIsOpenModal(true);
  };

  const saveChanges = async () => {
    try {
      setLoading(true); // Activar el indicador de carga

      console.log(changes);
      const resultado = await api.patch(`/peticiones/${id}`, changes);
      console.log(resultado);

      await Promise.all(
        derechosSelected.map(async (derecho) => {
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

      console.log("Cambios guardados con éxito");
      setIsOpenModal(false);
      navigate("/dashboard-pqrsf", { replace: true });
    } catch (error) {
      console.error("Error en la solicitud PATCH", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container form-container">
      <h2>Tipo: {peticionData?.tipoPeticion.nombre}</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="input-box form__input">
          <label>Radicado</label>
          <input
            className="input"
            type="number"
            {...register("radicado", { disabled: true })}
          />
        </div>
        <div className="input-box form__input">
          <label>Tipo de solicitud</label>
          <select
            className="input"
            {...register("tipoPeticionId", {
              disabled: true,
            })}
          >
            <option defaultValue={true} hidden={true} value=""></option>
            {tipoPeticionOptions.map(({ id, nombre }) => (
              <option key={id} value={id}>
                {nombre}
              </option>
            ))}
          </select>
        </div>

        <SectionPeticionario
          form={form}
          data={peticionData?.peticionario}
          options={isDisableSection}
        />

        <SectionPaciente
          form={form}
          data={peticionData?.paciente}
          options={isDisableSection}
        />

        <SectionInformacion
          form={form}
          data={peticionData}
          options={isDisableSection}
        />

        <SectionGestion
          form={form}
          data={peticionData}
          derechos={[derechosSelected, setDerechosSelected]}
          options={isDisableSection}
        />

        <div className="form-grid">
          <input
            className="button form__button"
            type="submit"
            value="Guardar"
          />
          <button
            className="button form__button button--red"
            onClick={returnToDashboard}
          >
            Regresar
          </button>
        </div>
      </form>

      {isOpenModal && (
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
                onClick={() => setIsOpenModal(false)}
              >
                Regresar
              </button>
            </div>
            {loading && <CircularProgress />}
          </div>
        </div>
      )}
    </div>
  );
}

export { Management };
