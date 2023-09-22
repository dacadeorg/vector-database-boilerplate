// file: /hooks/useApi.js
import { useState, useCallback } from "react";

const useApi = () => {
  // Define the state variables for data, error, and loading
  const [data, setData] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // fetch data to make the API call when the payload changes
  const fetchData = useCallback(async (url, method, payload) => {
    if(url === '/api/embed') setUploading(true);
    setLoading(true); // Set loading to true before making the API call
    try {
      // Make the API call using the provided url, method, and payload
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ payload }),
      });

      if (response.status !== 200) {
        // If the response status is not 200, throw an error
        throw (
          response.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }
      const result = await response.json()

      setData(result.data.text); // Set the data state with the API response
      setError(null); // Reset the error state to null
    } catch (error) {
      setError(error); // Set the error state with the caught error
    } finally {
      setLoading(false); // Set loading to false after the API call
      setUploading(false)
    }
  }, []);

  const embedContent = useCallback(async (url, method, payload) => {
      setUploading(true); 
      try {
        const response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ payload }),
        });
  
        if (response.status !== 200) {
          throw (
            response.error ||
            new Error(`Request failed with status ${response.status}`)
          );
        }
        const result = await response.json()
        console.log(result)
      } catch (error) {
        setError(error);
      } finally {
        setUploading(false)
      }
    }, []);

  // Return the data, error, and loading states from the hook
  return { data, error, loading, fetchData, embedContent, uploading, setData };
};

export default useApi;
