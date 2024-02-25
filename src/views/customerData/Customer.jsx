import React, { useCallback, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { saveAs } from "file-saver";
import "..//allFormCss/From.css";

const Customer = () => {
  const [listData, setListData] = useState([]);
  const [editedData, setEditedData] = useState({});

  const getData = useCallback(async () => {
    await fetch(`http://localhost:4000/api/auth/allCustomer`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log("API Data:", data.user);
        setListData(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [setListData]);

  useEffect(() => {
    getData();
  }, [getData]);

  // console.log(listData);

  //validation
  const [rowValidationErrors, setRowValidationErrors] = useState({
    rowFirstName: "",
    rowLastName: "",
    rowEmail: "",
    rowGender: "",
  });

  const [editFormOpen, setEditFormOpen] = useState(false);

  const handleEdit = (CustomerId) => {
    const userToEdit = listData.user.find((user) => user._id === CustomerId);

    console.log(userToEdit);

    setEditedData({
      CustomerId,
      rowFirstName: userToEdit.FirstName,
      rowLastName: userToEdit.LastName,
      rowEmail: userToEdit.email,
      rowGender: userToEdit.gender,
    });

    // Open the edit form
    setEditFormOpen(true);
  };

  const closeEditForm = () => {
    setRowValidationErrors({ null: true });
    setEditFormOpen(false);
  };
  // console.log(user.rowAccountName);

  const rowHandleInputChange = (e, key) => {
    const { value, type } = e.target;

    if (type === "radio") {
      // Handle radio button separately
      setEditedData({
        ...editedData,
        rowGender: value,
      });
    } else {
      // Handle other input types
      setEditedData({
        ...editedData,
        [key]: e.target.value,
      });
    }
  };

  //save Edit data

  const handleEditCustomerData = useCallback(async () => {
    const token = localStorage.getItem("token");
    // validation
    const errors = {};

    if (!editedData.rowFirstName) {
      errors.rowFirstName = "Please enter a FirstName.";
    }

    if (!editedData.rowLastName) {
      errors.rowLastName = "Please enter a LastName.";
    }

    if (!editedData.rowEmail) {
      errors.rowEmail = "Please enter a email.";
    }

    if (!editedData.rowGender) {
      errors.rowGender = "Please Select gender";
    }

    if (Object.keys(errors).length > 0) {
      // Update the validation errors
      setRowValidationErrors(errors);
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/api/auth/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
        body: JSON.stringify(editedData),
      });
      // console.log(editedData);

      setRowValidationErrors({ null: true });
      setEditFormOpen(false);
      if (!response.ok) {
        toast.error("Account already Created", {
          autoClose: 1000,
        });
        return;
      }
      toast.success("Account Update successful", {
        autoClose: 1000,
      });

      getData();
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
  // console.log(editedData);

  //Delete user

  const handleDelete = useCallback(async (CustomerId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/auth/deleteCustomer`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ CustomerId }),
        }
      );
      // console.log({ CustomerId });
      if (!response.ok) {
        // Notify user of successful deletion
        toast.error("Can't Delete Data", {
          autoClose: 1000,
        });
        return;
      }
      toast.success("User Data Delete successful", {
        autoClose: 1000,
      });

      getData();
    } catch (err) {
      console.error("Error during deletion:", err);
    }
  }, []);

  const handleSelectAll = () => {
    if (listData && listData.user && listData.user.length > 0) {
      if (selectedRows.length === listData.user.length) {
        // If all rows are currently selected, unselect all
        setSelectedRows([]);
      } else {
        // Otherwise, select all rows
        setSelectedRows(listData.user.map((user) => user._id));
      }
    }
  };

  // State to keep track of selected rows
  const [selectedRows, setSelectedRows] = useState([]);

  // Toggle checkbox selection for a row
  const toggleRowSelection = (CustomerId) => {
    if (selectedRows.includes(CustomerId)) {
      setSelectedRows((prevSelectedRows) =>
        prevSelectedRows.filter((id) => id !== CustomerId)
      );
    } else {
      setSelectedRows((prevSelectedRows) => [...prevSelectedRows, CustomerId]);
    }
  };

  const convertToCSV = (data) => {
    // Extract only the first six columns from the header
    const customHeaders = [
      "Id",
      "First Name",
      "Last Balance",
      "Email Number",
      "gender",
    ];

    // Join the custom headers to form the header line
    const header = customHeaders.join(",");
    // console.log(header, "Headerrrrrr");

    const rows = data.map((row) => {
      const rowData = [
        row._id,
        `"${row.FirstName}"`,
        `"${row.LastName}"`,
        `"${row.email}"`,
        `"${row.gender}"`,
      ];
      return rowData.join(",");
    });
    // console.log(rows, "rowwwwww");

    return `${header}\n${rows.join("\n")}`;
  };

  // Function to export data as CSV file
  const exportToCSV = () => {
    const selectedData = listData.user.filter((user) =>
      selectedRows.includes(user._id)
    );
    const csvData = convertToCSV(selectedData);
    // console.log(listData.user);
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "account_data.csv");
    setSelectedRows([]);
  };

  // State for sorting
  const [sortOrder, setSortOrder] = useState("");
  const [sortColumn, setSortColumn] = useState(""); // Default sorting column

  const handleSort = (column) => {
    // Toggle between ascending and descending order
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);
    setSortColumn(column);
  };
  // Function to compare values for sorting
  const compareValues = (key, order = "asc") => {
    return function (a, b) {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        // Property doesn't exist on either object
        return 0;
      }

      const varA = typeof a[key] === "string" ? a[key].toUpperCase() : a[key];
      const varB = typeof b[key] === "string" ? b[key].toUpperCase() : b[key];

      // Handle numeric comparison
      const numericComparison = parseFloat(varB) - parseFloat(varA) || 0;

      // If numericComparison is not 0, return it; otherwise, proceed with string comparison
      if (numericComparison !== 0) {
        return order === "asc" ? numericComparison : numericComparison * -1;
      }

      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }

      return order === "desc" ? comparison * -1 : comparison;
    };
  };

  // Sort the data based on the current sorting column and order
  const sortedData = Array.isArray(listData.user)
    ? [...listData.user].sort(compareValues(sortColumn, sortOrder))
    : [];

  return (
    <>
      <div>
        {!editFormOpen && (
          <div className="table-responsive">
            <div className="text-right mb-2">
              <button
                type="button"
                className="btn btn-primary mx-3"
                style={{ float: "right", margin: "5px" }}
                onClick={exportToCSV}
                disabled={selectedRows.length === 0}
              >
                Export to CSV
              </button>
            </div>
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      name="selectAll"
                      className="Checkbox"
                      onChange={handleSelectAll}
                      checked={
                        listData &&
                        listData.user &&
                        selectedRows.length === listData.user.length &&
                        listData.user.length > 0
                      }
                    />
                  </th>
                  <th
                    className="pointer"
                    onClick={() => handleSort("FirstName")}
                  >
                    First Name
                    {sortColumn === "FirstName" && (
                      <span>{sortOrder === "asc" ? " ▲" : " ▼"}</span>
                    )}
                  </th>
                  <th
                    className="pointer"
                    onClick={() => handleSort("LastName")}
                  >
                    Last Name
                    {sortColumn === "LastName" && (
                      <span>{sortOrder === "asc" ? " ▲" : " ▼"}</span>
                    )}
                  </th>
                  <th className="pointer" onClick={() => handleSort("email")}>
                    Email
                    {sortColumn === "email" && (
                      <span>{sortOrder === "asc" ? " ▲" : " ▼"}</span>
                    )}
                  </th>
                  <th className="pointer" onClick={() => handleSort("gender")}>
                    Gender
                    {sortColumn === "gender" && (
                      <span>{sortOrder === "asc" ? " ▲" : " ▼"}</span>
                    )}
                  </th>

                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <input
                        type="checkbox"
                        name="checkbox"
                        onChange={() => toggleRowSelection(user._id)}
                        checked={selectedRows.includes(user._id)}
                        className="Checkbox"
                      />
                    </td>
                    <td>{user.FirstName}</td>
                    <td>{user.LastName}</td>
                    <td>{user.email}</td>
                    <td>{user.gender}</td>
                    <td>
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
                          Delete
                        </button>
                      </>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Edit Form */}
        {editFormOpen && (
          <div className="form-style">
            <div className="modal-header">
              <div className="">
                <h5 className="text-center">Edit CustomerData</h5>
              </div>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <div>
                    <label htmlFor="rowFirstName" className="form-label">
                      First Name
                    </label>

                    <input
                      type="text"
                      className="form-control input-bgColor"
                      maxLength="15"
                      value={editedData.rowFirstName}
                      onChange={(e) => rowHandleInputChange(e, "rowFirstName")}
                    />
                    {rowValidationErrors.rowFirstName && (
                      <p className="text-danger">
                        {rowValidationErrors.rowFirstName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="LastName" className="form-label">
                      Last Name
                    </label>

                    <input
                      type="text"
                      className="form-control input-bgColor"
                      value={editedData.rowLastName}
                      onChange={(e) => rowHandleInputChange(e, "rowLastName")}
                    />
                    {rowValidationErrors.rowLastName && (
                      <p className="text-danger">
                        {rowValidationErrors.rowLastName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>

                    <input
                      type="email"
                      className="form-control input-bgColor"
                      maxLength="20"
                      value={editedData.rowEmail}
                      onChange={(e) => rowHandleInputChange(e, "rowEmail")}
                    />
                    {rowValidationErrors.rowEmail && (
                      <p className="text-danger">
                        {rowValidationErrors.rowEmail}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="gender" className="form-label">
                      Gender
                    </label>
                    <div>
                      <label className="form-check">
                        <input
                          type="radio"
                          name="gender"
                          value="Male"
                          checked={editedData.rowGender === "Male"}
                          onChange={(e) => rowHandleInputChange(e, "Male")}
                        />
                        Male
                      </label>
                      <label className="form-check">
                        <input
                          type="radio"
                          name="gender"
                          value="Female"
                          checked={editedData.rowGender === "Female"}
                          onChange={(e) => rowHandleInputChange(e, "Female")}
                        />
                        Female
                      </label>
                    </div>
                    {rowValidationErrors.rowBankBranch && (
                      <p className="text-danger">
                        {rowValidationErrors.rowBankBranch}
                      </p>
                    )}
                  </div>
                </div>
              </form>
              <>
                <button
                  className="btn btn-success"
                  onClick={() => handleEditCustomerData()}
                >
                  Save
                </button>
                <button className="ms-3 btn btn-danger" onClick={closeEditForm}>
                  Cancel
                </button>
              </>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </>
  );
};

export default Customer;
