import { useEffect } from "react";
import useAxios from "./src/hooks/useAxios";

const AxiosExamples = () => {
  // *METODO GET
  //Traer Data
  const {
    data: ejemploData,
    loading: getLoading,
    error: getError,
  } = useAxios("/profile/me"); //URL ejemplo

  //User Data
  const miUsuario = ejemploData;

  // *METODO GET (Posponer)
  //'auto' solo se necesita declarar con metodo "GET"
  //Declarar Axios
  const {
    data: getDataDespues,
    loading: getLoadingDespues,
    error: getErrorDespues,
    request: getRequestDespues,
  } = useAxios("/users", { method: "GET", auto: false });
  //{auto: false} asegura que no se ejectua al montar

  //Traer data despues
  const pedirInfoPaginaEjemplo = async (page, page_size) => {
    try {
      //request devuelve la data obtenida para poder guardar en un variable
      const data = await getRequestDespues({ params: { page, page_size } });

      //usar o set data
    } catch (error) {
      console.error(error);
    }
  };

  // *METODO POST (Posponer)
  //Declarar Axios
  const {
    data: postData,
    loading: postLoading,
    error: postError,
    request: postRequest,
  } = useAxios("/auth/login", { method: "POST" });

  //Usar Post, con body pasado al request
  const loginEjemplo = async (email, password) => {
    try {
      //request devuelve la data obtenida para poder guardar en un variable
      //Se puede pasar a request un nuevo body en el momento
      const data = await postRequest({ body: { email, password } });

      //usar o set data
    } catch (error) {
      console.error(error);
    }
  };

  // *METODO PATCH (Posponer)
  //Este es igual a POST
  //Declarar Axios
  const {
    data: patchData,
    loading: patchLoading,
    error: patchError,
    request: patchRequest,
  } = useAxios("/reports", { method: "PATCH" });

  //Usar PATCH, con body pasado al request
  const editarReporteEjemplo = async (name, email, id) => {
    try {
      //request devuelve la data obtenida para poder guardar en un variable
      //Se puede pasar a request un nuevo body en el momento
      const data = await patchRequest({
        url: `/reports/${id}`,
        body: { name, email },
      });

      //usar o set data
    } catch (error) {
      console.error(error);
    }
  };

  // *METODO DELETE (Posponer)
  //Este es igual a POST
  //Declarar Axios
  const {
    data: deleteData,
    loading: deleteLoading,
    error: deleteError,
    request: deleteRequest,
  } = useAxios("/users", { method: "DELETE" });

  //Usar DELETE, con body pasado al request
  const borrarUsuarioEjemplo = async (id) => {
    try {
      //request devuelve la data obtenida para poder guardar en un variable
      //Se puede pasar a request un nuevo body en el momento
      const data = await deleteRequest({ url: `/users/${id}` });

      //usar o set data
    } catch (error) {
      console.error(error);
    }
  };

  // *Se puede usar variables de loading y error globales para todos los
  // *  useAxios, para poder saber de cualquier error o estado de loading

  //Declarar variables que captan cualquier error o loading, siendo null si no hay
  const error =
    getError || getErrorDespues || postError || patchError || deleteError;
  const loading =
    getLoading ||
    getLoadingDespues ||
    postLoading ||
    patchLoading ||
    deleteLoading;

  //useEffect para ejecutar para cada cambio de error
  useEffect(() => {
    if (error) {
      console.error("Algo salió mal: ", error);
      //Otro error acciones
    }
  }, [error]);
};

export default AxiosExamples;
