import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import useFetch from "../../customHooks/useFetch";
import Edit from "../edit/edit";
import Pagination from "../pagination/pagination";
import Table from "../table/table";
import { useSnackbar } from "notistack";
import userimg from "../../img/user-gear.png";
import background from "../../img/bg.jpg";
import axios from "axios";
import config from "../../conf/conf";
import { $ } from "react-jquery-plugin";

import "./home.css";

const Home = () => {
  const [users, setUsers] = useState([]);
  const [data] = useFetch("rere", users);
  const [adding, setAdd] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [backupUsers, setBackupUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageLimit, setPageLimit] = useState(0);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState([]);
  const [userToBeUpdated, setUserToBeUpdated] = useState();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const showSnackbar = (msg, variant) => {
    enqueueSnackbar(msg, {
      variant: variant,
      snackbarprops: 'data-role="alert"',
    });
  };

  const Logic = (currentPage) => {
    setCurrentPage(currentPage);
    let record = currentPage * 10;
    let limit = (currentPage + 1) * 10;
    const sliced = allUsers.slice(record, limit);
    setUsers([...sliced]);
  };

  const generateRange = () => {
    let arr = [];
    let limit = Math.round(allUsers.length / 10);
    for (let i = 1; i <= limit; i++) arr.push(i);
    setRange([...arr]);
  };

  const RemoveAllSelected = (data) => {
    const arr = allUsers.filter((user) => {
      if (data.includes(user.id)) {
        RemoveData(user.id);
      }
      return !data.includes(user.id);
    });

    setAllUsers([...arr]);
    showSnackbar("Records Deleted Successfully", "success");
  };

  const RemoveSelected = (id) => {
    const arr = allUsers.filter((user) => {
      if (user.id == id) RemoveData(id);

      return user.id != id;
    });
    setAllUsers([...arr]);

    showSnackbar("Record Deleted Successfully", "success");
  };

  const RemoveData = async (id) => {
    try {
      await axios
        .delete(`${config.backendEndpoint}/users/${id}`)
        .then((response) => {
          console.log(`Deleted post with ID ${id}`);
        });
    } catch (err) {
      showSnackbar("Something went wrong", "error");
    }
  };
  const UpdatePage = (toggleType) => {
    if (toggleType === "INCREMENT" && currentPage !== pageLimit - 1) {
      setCurrentPage(currentPage + 1);
    } else if (toggleType === "Home") setCurrentPage(currentPage - currentPage);
    else if (toggleType === "Last") setCurrentPage(pageLimit - 1);
    else {
      if (currentPage !== 0) setCurrentPage(currentPage - 1);
    }
  };

  const addFormatdata = (id) => {
    setUserToBeUpdated(id);
    $("#editModal").modal("show");
  };

  const updateUserData = (id, name, email, role) => {
    const arr = allUsers.map((user) => {
      if (user.id === id) {
        user.name = name;
        user.email = email;
        user.company.name = role;
      }
      return user;
    });
    setAllUsers([...arr]);
    setBackupUsers([...arr]);

    $("#editModal").modal("hide");
  };

  useEffect(() => {
    setAllUsers([...data]);
    setBackupUsers([...data]);
    Logic(currentPage);
    let limit = Math.round(allUsers.length / 10);
    setPageLimit(limit);
    generateRange();
    setLoading(false);
  }, [data]);

  useEffect(() => {
    Logic(currentPage);
    let limit = Math.round(allUsers.length / 10);
    setPageLimit(limit);
    generateRange();
    setLoading(false);
  }, [allUsers, currentPage]);

  return (
    <>
      {" "}
      <div>
        <nav className="navbar theme navbar-dark">
          <div className="container-fluid header">
            <a className="navbar-brand heading" href="#">
              <span>
                Tacnique&nbsp;
                <img src={userimg} alt="img" />
              </span>
              &nbsp;User Mangement Dashboard
            </a>
          </div>
        </nav>
      </div>
      <div
        className="container mt-5  body "
        style={{ backgroundImage: `url(${background})` }}
      >
        {!loading && allUsers.length === 0 && (
          <div id="no_data">
            <h5 className="text-center">
              No data found
              <span>
                <i className="fa-regular fa-face-sad-tear"></i>
              </span>
            </h5>
          </div>
        )}

        {!loading && allUsers.length > 0 && (
          <div>
            <Table
              users={users}
              RemoveAllSelected={RemoveAllSelected}
              RemoveSelected={RemoveSelected}
              addFormatdata={addFormatdata}
              setAdd={setAdd}
            />

            <Pagination
              currentPage={currentPage}
              range={range}
              Logic={Logic}
              pageLimit={pageLimit}
              UpdatePage={UpdatePage}
            />
          </div>
        )}
        {createPortal(
          <Edit
            id={userToBeUpdated}
            updateUserData={updateUserData}
            adding={adding}
          />,
          document.getElementById("edit-portal")
        )}
      </div>
    </>
  );
};

export default Home;
