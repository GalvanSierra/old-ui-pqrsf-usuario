import { useEffect, useState } from "react";

import api from "../service/api";
import { getOptionsAdapter } from "../adapter/getOptionAdapter";

export const useOptionsWithAdapter = (url, adapter = getOptionsAdapter) => {
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        await api
          .get("/referencias" + url)
          .then((response) => response.data)
          .then((data) => adapter(data))
          .then((data) => {
            setOptions(data);
            setIsLoading(false);
          });
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchOptions();
  }, [url]);

  return { options, isLoading, error };
};
