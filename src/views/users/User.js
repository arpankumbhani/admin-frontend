import React, { useCallback, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { saveAs } from "file-saver";

// import axios from "axios";

const UserTable = () => {
  const [userData, setUserData] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [editedData, setEditedData] = useState({});

  const isEmailValid = (email) => {
    // Regular expression for a basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);
  };

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}auth/all`, {
      headers: {
        authorization: token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log("API Data:", data.user);
        setUserData(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const [validationErrors, setValidationErrors] = useState({
    username: "",
    email: "",
    phone: "",
    role: "",
  });

  const handleEdit = (userId) => {
    setEditMode(userId);

    const userToEdit = userData.user.find((user) => user._id === userId);

    setEditedData({
      userId,
      username: userToEdit.username,
      email: userToEdit.email,
      phone: userToEdit.phone,
      role: userToEdit.role,
    });
  };

  // console.log();

  const handleInputChange = (e, key) => {
    setEditedData({
      ...editedData,
      [key]: e.target.value,
    });
  };

  const handleSave = useCallback(async () => {
    const token = localStorage.getItem("token");
    // validation
    const errors = {};
    if (!editedData.username) {
      errors.username = "Please enter a username.";
    }
    if (!editedData.email) {
      errors.email = "Please enter an email address.";
    } else if (!isEmailValid(editedData.email)) {
      errors.email = "Please enter a valid email address.";
    }
    if (!editedData.phone) {
      errors.phone = "Please enter a phone number.";
    } else if (editedData.phone.length > 10 || editedData.phone.length < 10) {
      errors.phone = "Please enter a 10 digit ";
    }
    if (Object.keys(errors).length > 0) {
      // Update the validation errors
      setValidationErrors(errors);
      return;
    }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}auth/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
          body: JSON.stringify(editedData),
        }
      );
      // console.log("Saving edited data:", editedData.email);

      setEditMode(null);
      fetch(`${process.env.REACT_APP_API_URL}auth/all`, {
        headers: {
          authorization: token,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          // console.log("API Data:", data.user);
          setUserData(data);
        })
        .catch((error) => console.error("Error fetching data:", error));
      if (!response.ok) {
        console.error(
          "Error get not response:",
          response.status,
          response.statusText
        );
        return;
      }
    } catch (err) {
      console.error("Error during updating:", err);
    }
  }, [editedData]);

  //delete user

  const handleDelete = useCallback(async (userId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}auth/delete`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
          body: JSON.stringify({ userId }),
        }
      );
      // console.log({ userId });
      if (response.ok) {
        // Notify user of successful deletion
        toast.success("User deleted successfully");
        // Refetch data after deletion
        fetch(`${process.env.REACT_APP_API_URL}auth/all`, {
          headers: {
            authorization: token,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            setUserData(data);
          })
          .catch((error) => console.error("Error fetching data:", error));
      } else {
        // Notify user of deletion failure
        toast.error("Error deleting user");
      }
    } catch (err) {
      console.error("Error during deletion:", err);
    }
  }, []);

  const handleSelectAll = () => {
    if (userData && userData.user && userData.user.length > 0) {
      if (selectedRows.length === userData.user.length) {
        // If all rows are currently selected, unselect all
        setSelectedRows([]);
      } else {
        // Otherwise, select all rows
        setSelectedRows(userData.user.map((user) => user._id));
      }
    }
  };

  // State to keep track of selected rows
  const [selectedRows, setSelectedRows] = useState([]);

  // Toggle checkbox selection for a row
  const toggleRowSelection = (AccountId) => {
    if (selectedRows.includes(AccountId)) {
      setSelectedRows((prevSelectedRows) =>
        prevSelectedRows.filter((id) => id !== AccountId)
      );
    } else {
      setSelectedRows((prevSelectedRows) => [...prevSelectedRows, AccountId]);
    }
  };

  const convertToCSV = (data) => {
    // Extract only the first six columns from the header
    const customHeaders = ["Id", "Username", "Email", "Phone Number", "Role"];

    // Join the custom headers to form the header line
    const header = customHeaders.join(",");
    // console.log(header, "Headerrrrrr");

    const rows = data.map((row) => {
      let roleDetails;
      if (row.role === "1") {
        roleDetails = `"Admin"`;
      } else if (row.role === "2") {
        roleDetails = `"Employee"`;
      } else {
        roleDetails = `"HR"`;
      }
      const rowData = [
        row._id,
        `"${row.username}"`,
        `"${row.email}"`,
        `"${row.phone}"`,
        roleDetails,
      ];
      return rowData.join(",");
    });
    // console.log(rows, "rowwwwww");

    return `${header}\n${rows.join("\n")}`;
  };

  // Function to export data as CSV file
  const exportToCSV = () => {
    const selectedData = userData.user.filter((user) =>
      selectedRows.includes(user._id)
    );
    const csvData = convertToCSV(selectedData);
    // console.log(userData.user);
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "account_data.csv");
    setSelectedRows([]);
  };

  return (
    <div className="table-responsive">
      <button
        type="button"
        className="btn btn-primary mx-3 mb-2"
        style={{ float: "right", margin: "5px" }}
        disabled={selectedRows.length === 0}
        onClick={exportToCSV}
      >
        Export to CSV
      </button>
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                className="Checkbox"
                onChange={handleSelectAll}
                checked={
                  userData &&
                  userData.user &&
                  selectedRows.length === userData.user.length &&
                  userData.user.length > 0
                }
              />
            </th>
            <th>Username</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {userData &&
            userData.user?.map((user) => (
              <tr key={user._id}>
                <td>
                  <input
                    type="checkbox"
                    className="Checkbox"
                    onChange={() => toggleRowSelection(user._id)}
                    checked={selectedRows.includes(user._id)}
                  />
                </td>
                <td>
                  {editMode === user._id ? (
                    <input
                      type="text"
                      maxLength="15"
                      value={editedData.username}
                      onChange={(e) => handleInputChange(e, "username")}
                    />
                  ) : (
                    user.username
                  )}
                  {editMode === user._id
                    ? validationErrors.username && (
                        <p className="text-danger">
                          {validationErrors.username}
                        </p>
                      )
                    : false}
                </td>
                <td>
                  {editMode === user._id ? (
                    <input
                      type="email"
                      value={editedData.email}
                      onChange={(e) => handleInputChange(e, "email")}
                    />
                  ) : (
                    user.email
                  )}{" "}
                  {editMode === user._id
                    ? validationErrors.email && (
                        <p className="text-danger">{validationErrors.email}</p>
                      )
                    : false}
                </td>
                <td>
                  {editMode === user._id ? (
                    <input
                      type="number"
                      value={editedData.phone}
                      onChange={(e) => handleInputChange(e, "phone")}
                    />
                  ) : (
                    user.phone
                  )}
                  {editMode === user._id
                    ? validationErrors.phone && (
                        <p className="text-danger">{validationErrors.phone}</p>
                      )
                    : false}
                </td>
                <td>
                  {editMode === user._id ? (
                    <select
                      value={editedData.role}
                      onChange={(e) => handleInputChange(e, "role")}
                    >
                      <option value="1">Admin</option>
                      <option value="2">Employee</option>
                      <option value="3">HR</option>
                    </select>
                  ) : user.role === "1" ? (
                    "Admin"
                  ) : user.role === "2" ? (
                    "Employee"
                  ) : user.role === "3" ? (
                    "HR"
                  ) : (
                    "Unknown Role"
                  )}
                </td>
                <td>
                  {editMode === user._id ? (
                    <>
                      <button
                        className="btn btn-success"
                        onClick={() => handleSave()}
                      >
                        Save
                      </button>
                      <button
                        className="ms-3 btn btn-danger"
                        onClick={() => setEditMode(null)}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleEdit(user._id)}
                      >
                        Edit
                      </button>
                      <button
                        className="ms-3 btn btn-danger"
                        onClick={() => handleDelete(user._id)}
                      >
                        delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
};

export default UserTable;
