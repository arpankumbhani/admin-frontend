import React, { useCallback, useEffect, useState } from "react";
// import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { CCloseButton } from "@coreui/react";
import "..//allFormCss/From.css";
import { saveAs } from "file-saver";

const ExpenseList = () => {
  const [showModal, setShowModal] = useState(false);
  var [expenseData, setExpenseData] = useState({
    expenseName: "",
    expenseAmount: "",
    paymentDate: new Date(),
    paymentMode: "",
    chequeDetails: {
      chequeNo: "",
      bankName: "",
      chequeType: "",
    },
    accountName: "",
  });

  //validation errors
  const [validationErrors, setValidationErrors] = useState({
    expenseName: "",
    expenseAmount: "",
  });

  const [rowValidationErrors, setRowValidationErrors] = useState({
    rowExpenseName: "",
    rowExpenseAmount: "",
    rowPaymentDate: "",
    rowPaymentMode: "",
  });

  const [chequeValidationErrors, setChequeValidationErrors] = useState({
    chequeDetails: {
      chequeNo: "",
      bankName: "",
      chequeType: "",
    },
  });
  const [rowChequeValidationErrors, setRowChequeValidationErrors] = useState({
    chequeDetails: {
      chequeNo: "",
      bankName: "",
      chequeType: "",
    },
  });

  const [chequeDetailsArray, setChequeDetailsArray] = useState([]);
  const [rowChequeDetailsArray, setRowChequeDetailsArray] = useState([]);

  const openModal = () => {
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setExpenseData({
      expenseName: "",
      expenseAmount: "",
      paymentDate: new Date(),
      paymentMode: "",
      chequeDetails: {
        chequeNo: "",
        bankName: "",
        chequeType: "",
      },
      accountName: "",
    });
    setValidationErrors({ null: true });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "paymentMode") {
      // If the payment mode is changed, reset the cheque details
      if (value === "Cheque") {
        setExpenseData((prevData) => ({
          ...prevData,
          paymentMode: value,
          accountName: "",
        }));
      } else if (value === "accountName") {
        setExpenseData((prevData) => ({
          ...prevData,
          paymentMode: value,

          chequeDetails: {
            chequeNo: "",
            bankName: "",
            chequeType: "",
          },
        }));
      } else {
        setExpenseData((prevData) => ({
          ...prevData,
          paymentMode: value,
          chequeDetails: {
            chequeNo: "",
            bankName: "",
            chequeType: "",
          },
          accountName: "",
        }));
      }
    } else {
      setExpenseData((prevData) => ({
        ...prevData,
        [name]: name === "datePicker" ? new Date(value) : value,
      }));
      console.log(new Date(value));
    }

    // Clear previous validation error
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleChequeInputChange = (e) => {
    const { name, value } = e.target;
    setExpenseData({
      ...expenseData,
      chequeDetails: {
        ...expenseData.chequeDetails,
        [name]: value,
      },
    });

    setChequeValidationErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };
  const rowHandleChequeInputChange = (e, key) => {
    const { name, value } = e.target;
    setEditedData({
      ...editedData,
      rowChequeDetails: {
        ...editedData.rowChequeDetails,
        [key]: value,
      },
    });

    setRowChequeValidationErrors((prevErrors) => ({
      ...prevErrors,
      [key]: "",
    }));
  };

  const handleChequeSubmit = () => {
    // Validate the cheque details if needed

    const chequeDetailsErrors = {};

    if (!expenseData.chequeDetails.chequeNo) {
      chequeDetailsErrors.chequeNo = "Please Enter a Cheque Number ";
    }

    if (!expenseData.chequeDetails.bankName) {
      chequeDetailsErrors.bankName = "Please Enter a Bank Number";
    }

    if (!expenseData.chequeDetails.chequeType) {
      chequeDetailsErrors.chequeType = "Please Select a Cheque Type";
    }

    if (Object.keys(chequeDetailsErrors).length > 0) {
      // Update the validation chequeDetailsErrors
      setChequeValidationErrors(chequeDetailsErrors);
      return;
    }

    // Add the current cheque details to the array
    setChequeDetailsArray((prevArray) => [
      ...prevArray,
      expenseData.chequeDetails,
    ]);

    setShow(false);
  };

  const rowHandleChequeSubmit = () => {
    // Validate the cheque details if needed
    const chequeDetailsErrors = {};

    if (!editedData.rowChequeDetails.rowChequeNo) {
      chequeDetailsErrors.rowChequeNo = "Please Enter a Cheque Number ";
    }

    if (!editedData.rowChequeDetails.rowBankName) {
      chequeDetailsErrors.rowBankName = "Please Enter a Bank Number";
    }

    if (!editedData.rowChequeDetails.rowChequeType) {
      chequeDetailsErrors.rowChequeType = "Please Select a Cheque Type";
    }

    if (Object.keys(chequeDetailsErrors).length > 0) {
      // Update the validation chequeDetailsErrors
      setRowChequeValidationErrors(chequeDetailsErrors);
      return;
    }

    // Add the current cheque details to the array
    setRowChequeDetailsArray((prevArray) => [
      ...prevArray,
      editedData.chequeDetails,
    ]);

    setShow(false);
  };

  const handleRegister = () => {
    if (expenseData.paymentMode === "Account") {
      RemoveExpenseToAccount(
        expenseData.accountName,
        expenseData.expenseAmount
      );
    }
    handleNewRegister();
  };

  const handleNewRegister = useCallback(async () => {
    // Basic validation

    const errors = {};
    if (!expenseData.expenseName) {
      errors.expenseName = "Please Enter Expense Name";
    }
    if (!expenseData.expenseAmount) {
      errors.expenseAmount = "Please Enter Expense Amount";
    }

    if (!expenseData.paymentDate) {
      errors.paymentDate = "Please Select Date";
    }

    if (!expenseData.paymentMode) {
      errors.paymentMode = "Please Select Payment Mode";
    }

    if (Object.keys(errors).length > 0) {
      // Update the validation errors
      setValidationErrors(errors);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}Expense/createExpenseAccount`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(expenseData),
        }
      );
      console.log(expenseData.paymentDate, "appi");

      if (!response.ok) {
        toast.error("Account already Created", {
          autoClose: 1000,
        });
        return;
      }

      toast.success("Account Created successful", {
        autoClose: 1000,
      });
      // Optionally, clear the form
      setExpenseData({
        expenseName: "",
        expenseAmount: "",
        paymentDate: "",
        paymentMode: "",
        chequeDetails: {
          chequeNo: "",
          bankName: "",
          chequeType: "",
        },
        accountName: "",
      });
      setChequeDetailsArray([]);
      setShowModal(false);
      getData();
    } catch (error) {
      console.error("Error during Create Account:", error);
    }
  }, [expenseData]);

  // console.log(expenseData);

  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    setChequeValidationErrors({ null: true });
    setRowChequeValidationErrors({ null: true });
  };

  const handleShow = () => setShow(true);

  const [accountNames, setAccountNumbers] = useState([]);
  // const [selectedAccount, setSelectedAccount] = useState("");

  const AccountDropDownList = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}balance/getAccountNumberList`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        // Handle error if needed
        console.error("Error fetching account numbers");
        return;
      }

      const data = await response.json();
      // Assuming the API response has an array of account numbers
      const fetchedAccountNumbers = data.accountName || [];

      setAccountNumbers(fetchedAccountNumbers);
      //   console.log(fetchedAccountNumbers, "abc");
    } catch (err) {
      console.error("Error during fetching account numbers:", err);
    }
  }, []);

  const [listData, setListData] = useState([]);
  const [editedData, setEditedData] = useState({});

  const getData = useCallback(async () => {
    await fetch(`${process.env.REACT_APP_API_URL}Expense/getAllExpenseList`, {
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

  const [editFormOpen, setEditFormOpen] = useState(false);

  const closeEditForm = () => {
    //  setRowValidationErrors({ null: true });
    setEditFormOpen(false);
  };

  function handleEdit(ExpenseId) {
    const userToEdit = listData.user.find((user) => user._id === ExpenseId);
    // console.log(userToEdit);

    setEditedData({
      ExpenseId,
      rowExpenseName: userToEdit.expenseName,
      rowExpenseAmount: userToEdit.expenseAmount,
      rowPaymentDate: userToEdit.paymentDate,
      rowPaymentMode: userToEdit.paymentMode,
      rowChequeDetails: {
        rowChequeNo: userToEdit.chequeDetails.chequeNo,
        rowBankName: userToEdit.chequeDetails.bankName,
        rowChequeType: userToEdit.chequeDetails.chequeType,
      },
      rowAccountName: userToEdit.accountName,
    });

    // Open the edit form
    setEditFormOpen(true);
  }

  // console.log(editedData.rowChequeDetails);

  const rowHandleInputChange = (e, key) => {
    const { name, value } = e.target;

    if (name === "rowPaymentMode") {
      // If the payment mode is changed, reset the cheque details
      if (value === "Cheque") {
        setEditedData((prevData) => ({
          ...prevData,
          rowPaymentMode: value,
          rowAccountName: "",
        }));
      } else if (value === "Account") {
        setEditedData((prevData) => ({
          ...prevData,
          rowPaymentMode: value,

          rowChequeDetails: {
            rowChequeNo: "",
            rowBankName: "",
            rowChequeType: "",
          },
        }));
      } else {
        setEditedData((prevData) => ({
          ...prevData,
          rowPaymentMode: value,
          rowChequeDetails: {
            rowChequeNo: "",
            rowBankName: "",
            rowChequeType: "",
          },
          rowAccountName: "",
        }));
      }
    } else {
      setEditedData((prevData) => ({
        ...prevData,
        [key]:
          key === "rowPaymentDate" ? new Date(e.target.value) : e.target.value,
      }));
    }
    // Clear previous validation error
    setRowValidationErrors((prevErrors) => ({
      ...prevErrors,
      [key]: "",
    }));
  };

  // console.log(editedData);

  const handleSave = useCallback(async () => {
    const errors = {};

    if (!editedData.rowExpenseName) {
      errors.rowExpenseName = "Please Enter Expense Name";
    }
    if (!editedData.rowExpenseAmount) {
      errors.rowExpenseAmount = "Please Enter Expense Amount";
    }

    if (Object.keys(errors).length > 0) {
      // Update the validation errors
      setRowValidationErrors(errors);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}Expense/updateIncomeAccount`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedData),
        }
      );
      // console.log(editedData, "API");

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
  }, [editedData, getData, setEditFormOpen]);

  const handleDelete = useCallback(async (ExpenseId) => {
    // const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}Expense/deleteExpenseAccount`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            // authorization: token,
          },
          body: JSON.stringify({ ExpenseId }),
        }
      );
      // console.log({ ExpenseId });
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

  const RemoveExpenseToAccount = useCallback(
    async (accountName, expenseAmount) => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}balance/removeExpenseToAccount`,

          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ accountName, expenseAmount }),
          }
        );

        if (!response.ok) {
          console.error("Error removing expense from account");
          return;
        }

        getData();
        // Handle success if needed
        console.log("Expense removed successfully from account");
      } catch (err) {
        console.error("Error during removing expense from account:", err);
      }
    },
    [getData]
  );

  useEffect(() => {
    AccountDropDownList();
    getData();
  }, [AccountDropDownList, getData]);

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
  const toggleRowSelection = (ExpenseId) => {
    if (selectedRows.includes(ExpenseId)) {
      setSelectedRows((prevSelectedRows) =>
        prevSelectedRows.filter((id) => id !== ExpenseId)
      );
    } else {
      setSelectedRows((prevSelectedRows) => [...prevSelectedRows, ExpenseId]);
    }
  };

  const convertToCSV = (data) => {
    // Extract only the first six columns from the header
    const customHeaders = [
      "Id",
      "Expense Name",
      "Expense Amount",
      "Payment Date",
      "Payment Mode",
      "Cheque details",
    ];

    // Join the custom headers to form the header line
    const header = customHeaders.join(",");
    // console.log(header, "Headerrrrrr");

    const rows = data.map((row) => {
      let chequeDetailsString = "";

      // Check if paymentMode is Cheque
      if (row.paymentMode === "Cheque") {
        chequeDetailsString = `"${JSON.stringify(row.chequeDetails)}"`;
      }

      const rowData = [
        row._id,
        `"${row.expenseName}"`,
        `"${row.expenseAmount}"`,
        `"${row.paymentDate.slice(0, 10)}"`,
        `"${row.paymentMode}"`,
        chequeDetailsString,
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
    console.log(selectedData);
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
                className="btn btn-primary"
                style={{ float: "right", margin: "5px" }}
                onClick={openModal}
              >
                +
              </button>
              <button
                className="btn btn-primary mx-3"
                style={{ float: "right", margin: "5px" }}
                type="button"
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
                    onClick={() => handleSort("expenseName")}
                  >
                    Expense Name
                    {sortColumn === "expenseName" && (
                      <span>{sortOrder === "asc" ? " ▲" : " ▼"}</span>
                    )}
                  </th>
                  <th
                    className="pointer"
                    onClick={() => handleSort("expenseAmount")}
                  >
                    Expense Amount
                    {sortColumn === "expenseAmount" && (
                      <span>{sortOrder === "asc" ? " ▲" : " ▼"}</span>
                    )}
                  </th>
                  <th
                    className="pointer"
                    onClick={() => handleSort("paymentDate")}
                  >
                    Payment Date
                    {sortColumn === "paymentDate" && (
                      <span>{sortOrder === "asc" ? " ▲" : " ▼"}</span>
                    )}
                  </th>
                  <th
                    className="pointer"
                    onClick={() => handleSort("paymentMode")}
                  >
                    Payment Mode
                    {sortColumn === "paymentMode" && (
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
                        className="Checkbox"
                        onChange={() => toggleRowSelection(user._id)}
                        checked={selectedRows.includes(user._id)}
                      />
                    </td>
                    <td>{user.expenseName}</td>
                    <td>{user.expenseAmount}</td>
                    <td>{user.paymentDate.slice(0, 10)}</td>
                    <td>{user.paymentMode}</td>
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
                <h5 className="text-center">Create Expense Account</h5>
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
                    <label htmlFor="expenseName" className="form-label">
                      Expense Name
                    </label>

                    <input
                      type="text"
                      maxLength="25"
                      className="form-control input-bgColor"
                      name="expenseName"
                      placeholder="Enter Expense Name"
                      value={expenseData.expenseName}
                      onChange={handleInputChange}
                    />
                    {validationErrors.expenseName && (
                      <p className="text-danger">
                        {validationErrors.expenseName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="expenseAmount" className="form-label">
                      Expense Amount
                    </label>

                    <input
                      type="Number"
                      maxLength="10"
                      className="form-control input-bgColor"
                      name="expenseAmount"
                      placeholder="Enter Expense Name"
                      value={expenseData.expenseAmount}
                      onChange={handleInputChange}
                    />
                    {validationErrors.expenseAmount && (
                      <p className="text-danger">
                        {validationErrors.expenseAmount}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="paymentDate" className="form-label">
                      Payment Date:
                    </label>
                    <DatePicker
                      id="paymentDate"
                      name="paymentDate"
                      className="form-control  mt-2 input-bgColor"
                      selected={expenseData.paymentDate}
                      onChange={(date) =>
                        handleInputChange({
                          target: { name: "paymentDate", value: date },
                        })
                      }
                      dateFormat="dd/MM/yyyy"
                    />
                    {validationErrors.paymentDate && (
                      <p className="text-danger">
                        {validationErrors.paymentDate}
                      </p>
                    )}
                  </div>

                  <div>
                    <div>
                      <label htmlFor="paymentMode" className="form-label">
                        Payment Mode
                      </label>
                      <div>
                        <div onClick={handleShow}>
                          <label className="form-check">
                            <input
                              type="radio"
                              value="Cheque"
                              checked={expenseData.paymentMode === "Cheque"}
                              onChange={() =>
                                handleInputChange({
                                  target: {
                                    name: "paymentMode",
                                    value: "Cheque",
                                  },
                                })
                              }
                            />
                            Cheque
                          </label>
                        </div>
                        <label className="form-check">
                          <input
                            type="radio"
                            value="Cash"
                            checked={expenseData.paymentMode === "Cash"}
                            onChange={() =>
                              handleInputChange({
                                target: { name: "paymentMode", value: "Cash" },
                              })
                            }
                          />
                          Cash
                        </label>
                        <label className="form-check">
                          <input
                            type="radio"
                            value="Account"
                            checked={expenseData.paymentMode === "Account"}
                            onChange={() =>
                              handleInputChange({
                                target: {
                                  name: "paymentMode",
                                  value: "Account",
                                },
                              })
                            }
                          />
                          Account
                        </label>
                      </div>

                      {validationErrors.paymentMode && (
                        <p className="text-danger">
                          {validationErrors.paymentMode}
                        </p>
                      )}

                      {expenseData.paymentMode === "Account" && (
                        <div>
                          <div>
                            <label htmlFor="accountName" className="form-label">
                              Receive Payment Account
                            </label>
                            <select
                              id="accountName"
                              name="accountName"
                              className="form-control"
                              value={expenseData.accountName}
                              onChange={handleInputChange}
                            >
                              <option value="" disabled>
                                ---Select Account Names---
                              </option>
                              {accountNames.map((accountName) => (
                                <option key={accountName} value={accountName}>
                                  {accountName}
                                </option>
                              ))}
                            </select>
                            {expenseData.paymentMode === "Account" &&
                              !expenseData.accountName && (
                                <p className="text-danger">
                                  Please Select an Account
                                </p>
                              )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton className="popup-form-style">
                      <Modal.Title>Cheque Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="popup-form-style">
                      <div>
                        <div>
                          <label htmlFor="chequeNo" className="form-label">
                            Cheque No
                          </label>
                          <input
                            type="text"
                            maxLength="20"
                            className="form-control input-bgColor"
                            name="chequeNo"
                            placeholder="Enter Cheque No"
                            value={expenseData.chequeDetails.chequeNo}
                            onChange={handleChequeInputChange}
                          />
                          {chequeValidationErrors.chequeNo && (
                            <p className="text-danger">
                              {chequeValidationErrors.chequeNo}
                            </p>
                          )}
                        </div>
                        <div>
                          <label htmlFor="bankName" className="form-label">
                            Bank Name
                          </label>
                          <input
                            type="text"
                            maxLength="25"
                            className="form-control input-bgColor"
                            name="bankName"
                            placeholder="Enter Bank Name"
                            value={expenseData.chequeDetails.bankName}
                            onChange={handleChequeInputChange}
                          />
                          {chequeValidationErrors.bankName && (
                            <p className="text-danger">
                              {chequeValidationErrors.bankName}
                            </p>
                          )}
                        </div>
                        <div>
                          <label htmlFor="checkType" className="form-label">
                            Check Type
                          </label>
                          <label className="form-check">
                            <input
                              type="radio"
                              value="Self"
                              checked={
                                expenseData.chequeDetails.chequeType === "Self"
                              }
                              onChange={() =>
                                handleChequeInputChange({
                                  target: {
                                    name: "chequeType",
                                    value: "Self",
                                  },
                                })
                              }
                            />
                            Self
                          </label>
                          <label className="form-check">
                            <input
                              type="radio"
                              value="A/C"
                              checked={
                                expenseData.chequeDetails.chequeType === "A/C"
                              }
                              onChange={() =>
                                handleChequeInputChange({
                                  target: {
                                    name: "chequeType",
                                    value: "A/C",
                                  },
                                })
                              }
                            />
                            A/C
                          </label>
                          {chequeValidationErrors.chequeType && (
                            <p className="text-danger">
                              {chequeValidationErrors.chequeType}
                            </p>
                          )}
                        </div>
                      </div>
                    </Modal.Body>
                    <Modal.Footer className="popup-form-style">
                      <Button variant="secondary" onClick={handleClose}>
                        Close
                      </Button>
                      <Button variant="primary" onClick={handleChequeSubmit}>
                        Save
                      </Button>
                    </Modal.Footer>
                  </Modal>

                  {/* cheque details */}
                  {/* {expenseData.paymentMode === "Cheque" && ( */}

                  {/* )} */}
                </div>
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
                    <label htmlFor="rowExpenseName" className="form-label">
                      Expense Name
                    </label>

                    <input
                      type="text"
                      maxLength="25"
                      className="form-control input-bgColor"
                      value={editedData.rowExpenseName}
                      onChange={(e) =>
                        rowHandleInputChange(e, "rowExpenseName")
                      }
                    />
                    {rowValidationErrors.rowExpenseName && (
                      <p className="text-danger">
                        {rowValidationErrors.rowExpenseName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="rowExpenseAmount" className="form-label">
                      Expense Amount
                    </label>

                    <input
                      type="Number"
                      maxLength="10"
                      className="form-control input-bgColor"
                      value={editedData.rowExpenseAmount}
                      onChange={(e) =>
                        rowHandleInputChange(e, "rowExpenseAmount")
                      }
                    />
                    {rowValidationErrors.rowExpenseAmount && (
                      <p className="text-danger">
                        {rowValidationErrors.rowExpenseAmount}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="rowPaymentDate" className="form-label">
                      Payment Date:
                    </label>
                    <DatePicker
                      id="rowPaymentDate"
                      name="rowPaymentDate"
                      className="form-control mt-2 input-bgColor"
                      selected={new Date(editedData.rowPaymentDate)}
                      onChange={(date) =>
                        rowHandleInputChange(
                          {
                            target: {
                              name: "rowPaymentDate",
                              value: date,
                            },
                          },
                          "rowPaymentDate"
                        )
                      }
                      dateFormat="dd/MM/yyyy"
                    />
                  </div>

                  <div>
                    <label htmlFor="rowPaymentMode" className="form-label">
                      Payment Mode
                    </label>
                    <div>
                      <div onClick={handleShow}>
                        <label className="form-check">
                          <input
                            type="radio"
                            value="Cheque"
                            checked={editedData.rowPaymentMode === "Cheque"}
                            onChange={() =>
                              rowHandleInputChange(
                                {
                                  target: {
                                    name: "rowPaymentMode",
                                    value: "Cheque",
                                  },
                                },
                                "Cheque"
                              )
                            }
                          />
                          Cheque
                        </label>
                      </div>
                    </div>
                    <label className="form-check">
                      <input
                        type="radio"
                        value="Cash"
                        checked={editedData.rowPaymentMode === "Cash"}
                        onChange={() =>
                          rowHandleInputChange(
                            {
                              target: {
                                name: "rowPaymentMode",
                                value: "Cash",
                              },
                            },
                            "Cash"
                          )
                        }
                      />
                      Cash
                    </label>
                    <label className="form-check">
                      <input
                        type="radio"
                        value="Account"
                        checked={editedData.rowPaymentMode === "Account"}
                        onChange={() =>
                          rowHandleInputChange(
                            {
                              target: {
                                name: "rowPaymentMode",
                                value: "Account",
                              },
                            },
                            "Account"
                          )
                        }
                      />
                      Account
                    </label>
                  </div>
                  {editedData.rowPaymentMode === "Account" && (
                    <div>
                      <div>
                        <label htmlFor="rowAccountName" className="form-label">
                          Receive Payment Account
                        </label>
                        <select
                          id="rowAccountName"
                          name="rowAccountName"
                          className="form-control"
                          value={editedData.rowAccountName}
                          onChange={(e) =>
                            rowHandleInputChange(e, "rowAccountName")
                          }
                        >
                          <option value="" disabled>
                            ---Select Account Names---
                          </option>
                          {accountNames.map((accountName) => (
                            <option key={accountName} value={accountName}>
                              {accountName}
                            </option>
                          ))}
                        </select>
                        {editedData.rowPaymentMode === "Account" &&
                          !editedData.rowAccountName && (
                            <p className="text-danger">
                              Please Select an Account
                            </p>
                          )}
                      </div>
                    </div>
                  )}
                </div>

                <Modal show={show} onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>Cheque Details</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <div>
                      <div>
                        <label htmlFor="rowChequeNo" className="form-label">
                          Cheque No
                        </label>
                        <input
                          type="text"
                          maxLength="20"
                          className="form-control"
                          name="rowChequeNo"
                          placeholder="Enter Cheque No"
                          value={editedData.rowChequeDetails.rowChequeNo}
                          onChange={(e) =>
                            rowHandleChequeInputChange(e, "rowChequeNo")
                          }
                        />
                        {rowChequeValidationErrors.rowChequeNo && (
                          <p className="text-danger">
                            {rowChequeValidationErrors.rowChequeNo}
                          </p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="bankName" className="form-label">
                          Bank Name
                        </label>
                        <input
                          type="text"
                          maxLength="25"
                          className="form-control"
                          name="rowBankName"
                          placeholder="Enter Bank Name"
                          value={editedData.rowChequeDetails.rowBankName}
                          onChange={(e) =>
                            rowHandleChequeInputChange(e, "rowBankName")
                          }
                        />
                        {rowChequeValidationErrors.rowBankName && (
                          <p className="text-danger">
                            {rowChequeValidationErrors.rowBankName}
                          </p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="checkType" className="form-label">
                          Check Type
                        </label>
                        <label className="form-check">
                          <input
                            type="radio"
                            value="Self"
                            checked={
                              editedData.rowChequeDetails.rowChequeType ===
                              "Self"
                            }
                            onChange={() =>
                              rowHandleChequeInputChange(
                                {
                                  target: {
                                    name: "chequeType",
                                    value: "Self",
                                  },
                                },
                                "rowChequeType"
                              )
                            }
                          />
                          Self
                        </label>
                        <label className="form-check">
                          <input
                            type="radio"
                            value="A/C"
                            checked={
                              editedData.rowChequeDetails.rowChequeType ===
                              "A/C"
                            }
                            onChange={() =>
                              rowHandleChequeInputChange(
                                {
                                  target: {
                                    name: "chequeType",
                                    value: "A/C",
                                  },
                                },
                                "rowChequeType"
                              )
                            }
                          />
                          A/C
                        </label>
                        {rowChequeValidationErrors.rowChequeType && (
                          <p className="text-danger">
                            {rowChequeValidationErrors.rowChequeType}
                          </p>
                        )}
                      </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                      Close
                    </Button>
                    <Button variant="primary" onClick={rowHandleChequeSubmit}>
                      Save
                    </Button>
                  </Modal.Footer>
                </Modal>
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

export default ExpenseList;
