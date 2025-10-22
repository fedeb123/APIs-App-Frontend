import { useEffect, useState } from "react";

const apiUrl = import.meta.env.VITE_APP_API_URL;

export default function useFetch(location, method, data = null, token = null, refresh = false) {
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const options = {
    method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };

  if (data) options.body = JSON.stringify(data);
  if (token) options.headers.Authorization = `Bearer ${token}`;

  const url = `${apiUrl}/${location}`;

  useEffect(() => {
    let isActive = true; // previene actualizaciones dobles

    setLoading(true);

    if ((method === "POST" || method === "PUT") && !data) {
      setLoading(false);
      return;
    }

    if (!location) {
      setLoading(false);
      return;
    }

    fetch(url, options)
      .then((res) =>
        res
          .text()
          .then((text) => {
            let json;
            try {
              json = text ? JSON.parse(text) : null;
            } catch {
              json = { message: text || res.statusText };
            }
            return { res, json };
          })
      )
        .then(({ res, json }) => {
            if (!isActive) return;

            if (!res.ok) {
                setResponse(null);
                setError({
                status: res.status,
                body: json?.error || json?.message || res.statusText,
                });
            } else {
                setError(null);
                setResponse(json);
            }
        })
      .catch((err) => {
        if (!isActive) return;
        setError(err);
      })
      .finally(() => {
        if (isActive) setLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [location, token, JSON.stringify(data), refresh]);

  return { response, loading, error };
}
