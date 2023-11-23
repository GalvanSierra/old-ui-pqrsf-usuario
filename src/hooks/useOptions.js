import { useEffect, useState } from "react";

import api from "../service/api";

const useOptions = (url) => {
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOptions = async () => {
    try {
      await api
        .get("/referencias" + url)
        .then((response) => response.data)
        .then((data) => {
          setOptions(data);
          setIsLoading(false);
        });
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return { options, isLoading, error };
};

export { useOptions };
