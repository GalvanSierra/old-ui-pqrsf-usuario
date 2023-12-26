import { useEffect, useState } from "react";
import axios from "axios";

export const useFetch = (url) => {
  const BASE_URL = "http://172.16.1.17:3065/api/v1";

  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        await axios
          .get(BASE_URL + url)
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

    fetchOptions();
  }, [url]);

  return { options, isLoading, error };
};
