import { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import axios from "axios";
import config from "../conf/conf";

const useFetch = (url, newdata) => {
  const [data, PutData] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const showSnackBar = (msg, variant) => {
    enqueueSnackbar(msg, {
      variant: variant,
      snackbarprops: 'data-role="alert"',
    });
  };

  const GetData = async () => {
    try {
      await axios
        .get(`${config.backendEndpoint}/users`)
        .then((data) => {
          PutData(data.data);
          console.log(data.data);
        })
        .catch((err) => {
          showSnackBar("Network Error", "error");
        });
    } catch (err) {
      showSnackBar("Something went wrong", "error");
    }
  };

  useEffect(() => {
    GetData();
  }, [url]);

  return [data];
};

export default useFetch;
