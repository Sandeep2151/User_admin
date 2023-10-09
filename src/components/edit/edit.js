import { useState } from "react";
import CustomInput from "../customInput/customInput";
import "./edit.css";
import background from "../../img/bg.jpg";
import axios from "axios";
import config from "../../conf/conf";
import { useSnackbar } from "notistack";
const Edit = ({ id, updateUserData, adding }) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const showSnackbar = (msg, variant) => {
    enqueueSnackbar(msg, {
      variant: variant,
      snackbarprops: 'data-role="alert"',
    });
  };

  const [error, setError] = useState({
    name: "",
    email: "",
    role: "",
  });

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    role: "",
  });

  const doeFormHasError = () => {
    let msg = "";
    let field = "";
    let filter =
      /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    let error = false;
    if (userData.name.trim().length < 3) {
      error = true;
      field = "name";
      msg = "Name must be at least 3 characters long";
      setError((prev) => ({
        email: "",
        role: "",
        [field]: msg,
      }));
    } else if (!filter.test(userData.email)) {
      error = true;
      field = "email";
      msg = "Please enter a valid email address";
      setError((prev) => ({
        name: "",
        role: "",
        [field]: msg,
      }));
    } else if (userData.role.trim().length === 0) {
      error = true;
      field = "role";
      msg = "Please enter the Company name";
      setError((prev) => ({
        name: "",
        email: "",
        [field]: msg,
      }));
    } else {
      error = false;
    }

    if (!error) {
      setError((prev) => ({
        name: "",
        email: "",
        role: "",
      }));
    }

    return error;
  };

  const onChangeHandler = (event) => {
    const field = event.target.name;
    const value = event.target.value;
    setUserData((data) => ({
      ...data,
      [field]: value,
    }));
  };

  const Add = async () => {
    if (doeFormHasError()) {
      return false;
    }
    try {
      await axios
        .post(`${config.backendEndpoint}/users/`, {
          id: id,
          name: "sandeep",

          email: "askjangid1111@ghmaj",

          company: {
            name: "dkjskjdkdksd",
          },
        })
        .then((data) => {
          console.log(data);
          showSnackbar(
            `Record Added Successfully of ${userData.name}`,
            "success"
          );
        })
        .catch((err) => {
          console.log(err);
          showSnackbar("Network Error", "error");
        });
    } catch (err) {
      console.log(err);
      showSnackbar("Something went wrong", "error");
    }

    updateUserData(id, userData.name, userData.email, userData.role);

    setUserData((prev) => ({
      name: "",
      email: "",
      role: "",
    }));

    setError((prev) => ({
      name: "",
      email: "",
      role: "",
    }));
  };
  //updating the list
  const updateDetails = async () => {
    if (doeFormHasError()) {
      return false;
    }

    try {
      await axios({
        method: "put",
        url: `${config.backendEndpoint}/users/${id}`,
        data: {
          id: id,
          name: userData.name,

          email: userData.email,

          company: {
            name: userData.role,
          },
        },
      });
      await axios.get(`${config.backendEndpoint}/users`).then((data) => {
        console.log(data.data);
      });
      showSnackbar(
        `Record Updated Successfully of ${userData.name}`,
        "success"
      );
    } catch (err) {
      showSnackbar("Something went wrong", "error");
    }
    updateUserData(id, userData.name, userData.email, userData.role);

    setUserData((prev) => ({
      name: "",
      email: "",
      role: "",
    }));

    setError((prev) => ({
      name: "",
      email: "",
      role: "",
    }));
  };

  return (
    <section id="edit">
      <div
        className="modal fade"
        id="editModal"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="editModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog  modal-fullscreen">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="editModalLabel">
                Edit/Add User Details
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div
              className="modal-body"
              style={{ backgroundImage: `url(${background})` }}
            >
              <div className="container">
                <div className="row justify-content-center">
                  <div className="col-xl-10 col-lg-10 col-md-10 col-sm-12 col-12">
                    <CustomInput
                      label="New Name"
                      type="text"
                      classes={
                        error.name.trim().length > 0 ? "error" : "success"
                      }
                      name="name"
                      value={userData.name}
                      error={error.name}
                      onChangeHandler={onChangeHandler}
                    />

                    <CustomInput
                      label="New Email"
                      type="email"
                      classes={
                        error.email.trim().length > 0 ? "error" : "success"
                      }
                      name="email"
                      value={userData.email}
                      error={error.email}
                      onChangeHandler={onChangeHandler}
                    />

                    <CustomInput
                      label="New Company Name"
                      type="text"
                      classes={
                        error.role.trim().length > 0 ? "error" : "success"
                      }
                      name="role"
                      value={userData.role}
                      error={error.role}
                      onChangeHandler={onChangeHandler}
                    />
                    <div className="form-btn">
                      {!adding ? (
                        <button
                          type="button"
                          className="btn theme text-light full-width"
                          onClick={updateDetails}
                        >
                          Update Data
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn theme text-light full-width"
                          onClick={Add}
                        >
                          Add Data
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Edit;
