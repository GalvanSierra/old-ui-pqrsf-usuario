import { useEffect, useState } from "react";
import api from "../service/api";

export function useOptions(url) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoading(true);
        await api
          .get("/referencias" + url)
          .then((response) => response.data)
          .then((data) => setData(data))
          .catch((error) => setError(error.message))
          .finally(() => setLoading(false));
      } catch (error) {
        console.error(error);
      }
    };

    fetchOptions();
  }, [url]);

  return { data, loading, error };
}
