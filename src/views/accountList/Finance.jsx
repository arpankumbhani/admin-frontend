import React, { useCallback, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CCloseButton } from "@coreui/react";
import { saveAs } from "file-saver";
import "..//allFormCss/From.css";

const AccountList = () => {
  const [showModal, setShowModal] = useState(false);
  const [accountData, setAccountData] = useState({
    accountName: "",
    initialBalance: "",
    accountNumber: "",
    branchCode: "",
    bankBranch: "",
  });

  //validation errors
  const [validationErrors, setValidationErrors] = useState({
    accountName: "",
    initialBalance: "",
    accountNumber: "",
    branchCode: "",
    bankBranch: "",
  });

  const openModal = () => {
    setSelectedRows([]);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setAccountData({ null: true });
    setValidationErrors({ null: true });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAccountData({
      ...accountData,
      [name]: value,
    });

    // Clear previous validation error
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleRegister = useCallback(async () => {
    // Handle registration logic here

    const errors = {};

    // Basic validation
    if (!accountData.accountName) {
      errors.accountName = "Please enter a AccountName.";
    }

    if (!accountData.initialBalance) {
      errors.initialBalance = "Please a InitialBalance.";
    }

    if (!accountData.accountNumber) {
      errors.accountNumber = "Please enter a AccountNumber.";
    } else if (
      accountData.accountNumber.length > 10 ||
      accountData.accountNumber.length < 10
    ) {
      errors.accountNumber = "Please enter a 10 digit ";
    }

    if (!accountData.branchCode) {
      errors.branchCode = "Please enter a branchCode.";
    }

    if (!accountData.bankBranch) {
      errors.bankBranch = "Please Enter BankBranch";
    }

    if (Object.keys(errors).length > 0) {
      // Update the validation errors
      setValidationErrors(errors);
      return;
    }

    // console.log(accountData);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}balance/createAccount`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(accountData),
        }
      );

      if (!response.ok) {
        toast.error("Account already Created", {
          autoClose: 1000,
        });
        return;
      }

      toast.success("Account Created successful", {
        autoClose: 1000,
      });
      setShowModal(false);
      setAccountData({ null: true });
      getData();
    } catch (error) {
      console.error("Error during Create Account:", error);
    }
  }, [accountData]);

  //   // For simplicity, log the account data for now
  //   console.log("Account Data:", accountData);
  //   closeModal();

  const [listData, setListData] = useState([]);
  const [editedData, setEditedData] = useState({});

  const getData = useCallback(async () => {
    await fetch(`${process.env.REACT_APP_API_URL}balance/getAllList`, {
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
    rowAccountName: "",
    rowInitialBalance: "",
    rowAccountNumber: "",
    rowBranchCode: "",
    rowBankBranch: "",
  });

  const [editFormOpen, setEditFormOpen] = useState(false);

  const handleEdit = (AccountId) => {
    const userToEdit = listData.user.find((user) => user._id === AccountId);

    setEditedData({
      AccountId,
      rowAccountName: userToEdit.accountName,
      rowInitialBalance: userToEdit.initialBalance,
      rowAccountNumber: userToEdit.accountNumber,
      rowBranchCode: userToEdit.branchCode,
      rowBankBranch: userToEdit.bankBranch,
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
    setEditedData({
      ...editedData,
      [key]: e.target.value,
    });
  };

  //save Edit data

  const handleSave = useCallback(async () => {
    const token = localStorage.getItem("token");
    // validation
    const errors = {};

    if (!editedData.rowAccountName) {
      errors.rowAccountName = "Please enter a AccountName.";
    }

    if (!editedData.rowInitialBalance) {
      errors.rowInitialBalance = "Please a InitialBalance.";
    }

    if (!editedData.rowAccountNumber) {
      errors.rowAccountNumber = "Please enter a AccountNumber.";
    } else if (
      editedData.rowAccountNumber.length > 10 ||
      editedData.rowAccountNumber.length < 10
    ) {
      errors.rowAccountNumber = "Please enter a 10 digit ";
    }

    if (!editedData.rowBranchCode) {
      errors.rowBranchCode = "Please enter a branchCode.";
    }

    if (!editedData.rowBankBranch) {
      errors.rowBankBranch = "Please Enter BankBranch";
    }

    if (Object.keys(errors).length > 0) {
      // Update the validation errors
      setRowValidationErrors(errors);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}balance/updateAccount`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
          body: JSON.stringify(editedData),
        }
      );
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

  const handleDelete = useCallback(async (AccountId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}balance/deleteAccount`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
          body: JSON.stringify({ AccountId }),
        }
      );
      // console.log({ AccountId });
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
    const customHeaders = [
      "Id",
      "Account Name",
      "Initial Balance",
      "Account Number",
      "Branch Code",
      "Bank Branch",
    ];

    // Join the custom headers to form the header line
    const header = customHeaders.join(",");
    // console.log(header, "Headerrrrrr");

    const rows = data.map((row) => {
      const rowData = [
        row._id,
        `"${row.accountName}"`,
        `"${row.initialBalance}"`,
        `"${row.accountNumber}"`,
        `"${row.branchCode}"`,
        `"${row.bankBranch}"`,
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
        {!showModal && !editFormOpen && (
          <div className="table-responsive">
            <div className="text-right mb-2">
              <button
                className="btn btn-primary end-1"
                style={{ float: "right", margin: "5px" }}
                onClick={openModal}
              >
                +
              </button>
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
                    style={{ cursor: "pointer" }}
                    onClick={() => handleSort("accountName")}
                  >
                    Account Name
                    {sortColumn === "accountName" && (
                      <span>{sortOrder === "asc" ? " ▲" : " ▼"}</span>
                    )}
                  </th>
                  <th
                    style={{ cursor: "pointer" }}
                    onClick={() => handleSort("initialBalance")}
                  >
                    Initial Balance
                    {sortColumn === "initialBalance" && (
                      <span>{sortOrder === "asc" ? " ▲" : " ▼"}</span>
                    )}
                  </th>
                  <th
                    style={{ cursor: "pointer" }}
                    onClick={() => handleSort("accountNumber")}
                  >
                    Account Number
                    {sortColumn === "accountNumber" && (
                      <span>{sortOrder === "asc" ? " ▲" : " ▼"}</span>
                    )}
                  </th>
                  <th
                    style={{ cursor: "pointer" }}
                    onClick={() => handleSort("branchCode")}
                  >
                    Branch Code
                    {sortColumn === "branchCode" && (
                      <span>{sortOrder === "asc" ? " ▲" : " ▼"}</span>
                    )}
                  </th>
                  <th
                    style={{ cursor: "pointer" }}
                    onClick={() => handleSort("bankBranch")}
                  >
                    Bank Branch
                    {sortColumn === "bankBranch" && (
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
                        onChange={() => toggleRowSelection(user._id)}
                        checked={selectedRows.includes(user._id)}
                      />
                    </td>
                    <td>{user.accountName}</td>
                    <td>{user.initialBalance}</td>
                    <td>{user.accountNumber}</td>
                    <td>{user.branchCode}</td>
                    <td>{user.bankBranch}</td>
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
        {/* Registration Modal */}
        {showModal && (
          <div className="form-style">
            <div className="modal-header">
              <div className="">
                <h5 className="text-center">Create New Account</h5>
              </div>
              <div>
                <CCloseButton onClick={closeModal} />
              </div>
            </div>
            <div className="modal-body">
              {/* Create Account Form */}
              <form>
                <div className="mb-3">
                  <div>
                    <label htmlFor="accountName" className="form-label">
                      Account Name
                    </label>

                    <input
                      type="text"
                      maxLength="15"
                      className="form-control input-bgColor"
                      name="accountName"
                      placeholder="Enter Account Name"
                      value={accountData.accountName}
                      onChange={handleInputChange}
                    />
                    {validationErrors.accountName && (
                      <p className="text-danger">
                        {validationErrors.accountName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="InitialBalance" className="form-label">
                      Initial Balance
                    </label>

                    <input
                      type="Number"
                      className="form-control input-bgColor"
                      name="initialBalance"
                      placeholder="Enter Initial Balance"
                      value={accountData.initialBalance}
                      onChange={handleInputChange}
                    />
                    {validationErrors.initialBalance && (
                      <p className="text-danger">
                        {validationErrors.initialBalance}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="accountNumber" className="form-label">
                      Account Number
                    </label>

                    <input
                      type="number"
                      maxLength="15"
                      className="form-control input-bgColor"
                      name="accountNumber"
                      placeholder="Enter Account Number"
                      value={accountData.accountNumber}
                      onChange={handleInputChange}
                    />
                    {validationErrors.accountNumber && (
                      <p className="text-danger">
                        {validationErrors.accountNumber}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="branchCode" className="form-label">
                      Branch Code
                    </label>

                    <input
                      type="text"
                      maxLength="15"
                      className="form-control input-bgColor"
                      name="branchCode"
                      placeholder="Enter Branch Code"
                      value={accountData.branchCode}
                      onChange={handleInputChange}
                    />
                    {validationErrors.branchCode && (
                      <p className="text-danger">
                        {validationErrors.branchCode}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="bankBranch" className="form-label">
                      Bank Branch
                    </label>

                    <input
                      type="text"
                      maxLength="30"
                      className="form-control input-bgColor"
                      name="bankBranch"
                      placeholder="Enter Bank Branch"
                      value={accountData.bankBranch}
                      onChange={handleInputChange}
                    />
                    {validationErrors.bankBranch && (
                      <p className="text-danger">
                        {validationErrors.bankBranch}
                      </p>
                    )}
                  </div>
                </div>
                {/* Add other form fields similar to the example above */}
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary mx-3"
                onClick={closeModal}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleRegister}
              >
                Create
              </button>
            </div>
          </div>
        )}

        {/* Edit Form */}
        {editFormOpen && (
          <div className="form-style">
            <div className="modal-header">
              <div className="">
                <h5 className="text-center">Update Account</h5>
              </div>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <div>
                    <label htmlFor="rowAccountName" className="form-label">
                      Account Name
                    </label>

                    <input
                      type="text"
                      className="form-control input-bgColor"
                      maxLength="15"
                      value={editedData.rowAccountName}
                      onChange={(e) =>
                        rowHandleInputChange(e, "rowAccountName")
                      }
                    />
                    {rowValidationErrors.rowAccountName && (
                      <p className="text-danger">
                        {rowValidationErrors.rowAccountName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="InitialBalance" className="form-label">
                      Initial Balance
                    </label>

                    <input
                      type="Number"
                      className="form-control input-bgColor"
                      value={editedData.rowInitialBalance}
                      onChange={(e) =>
                        rowHandleInputChange(e, "rowInitialBalance")
                      }
                    />
                    {rowValidationErrors.rowInitialBalance && (
                      <p className="text-danger">
                        {rowValidationErrors.rowInitialBalance}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="accountNumber" className="form-label">
                      Account Number
                    </label>

                    <input
                      type="number"
                      className="form-control input-bgColor"
                      maxLength="20"
                      value={editedData.rowAccountNumber}
                      onChange={(e) =>
                        rowHandleInputChange(e, "rowAccountNumber")
                      }
                    />
                    {rowValidationErrors.rowAccountNumber && (
                      <p className="text-danger">
                        {rowValidationErrors.rowAccountNumber}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="branchCode" className="form-label">
                      Branch Code
                    </label>

                    <input
                      type="text"
                      className="form-control input-bgColor"
                      maxLength="15"
                      value={editedData.rowBranchCode}
                      onChange={(e) => rowHandleInputChange(e, "rowBranchCode")}
                    />
                    {rowValidationErrors.rowBranchCode && (
                      <p className="text-danger">
                        {rowValidationErrors.rowBranchCode}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="bankBranch" className="form-label">
                      Bank Branch
                    </label>

                    <input
                      type="text"
                      className="form-control input-bgColor"
                      maxLength="25"
                      value={editedData.rowBankBranch}
                      onChange={(e) => rowHandleInputChange(e, "rowBankBranch")}
                    />
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
                  onClick={() => handleSave()}
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

export default AccountList;
