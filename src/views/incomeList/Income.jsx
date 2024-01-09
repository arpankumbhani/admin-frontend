import React, { useCallback, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CCloseButton } from "@coreui/react";
import { saveAs } from "file-saver";
import "..//allFormCss/From.css";

const Income = () => {
  const [showModal, setShowModal] = useState(false);
  // const [selectedDate, setSelectedDate] = useState(null);

  const [incomeData, setIncomeData] = useState({
    clientName: "",
    amount: "",
    dueAmount: "",
    billDate: new Date(),
    dueBilDate: new Date(),
    datePicker: "",
    accountName: "",
    bill: null,
  });

  //validation errors
  const [validationErrors, setValidationErrors] = useState({
    clientName: "",
    amount: "",
    dueAmount: "",
    billDate: "",
    dueBilDate: "",
    accountName: "",
    bill: "",
  });

  const openModal = () => {
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setIncomeData({
      clientName: "",
      amount: "",
      dueAmount: "",
      billDate: new Date(),
      dueBilDate: new Date(),
      datePicker: "",
      accountName: "",
      bill: null,
    });
    setValidationErrors({ null: true });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === ("billDate" || "dueBilDate" || "datePicker")) {
      setIncomeData((prevData) => ({
        ...prevData,
        [name]: new Date(value),
      }));
    } else if (name === "bill") {
      setIncomeData((prevData) => ({
        ...prevData,
        [name]: e.target.files[0],
      }));
    } else {
      setIncomeData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }

    // Clear previous validation error
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleUpdateAmount = useCallback(async () => {
    // Basic validation
    const errors = {};
    if (!incomeData.clientName) {
      errors.clientName = "Please Select a Client Name";
    }

    if (!incomeData.amount) {
      errors.amount = "Please enter a amount.";
    }

    if (!incomeData.dueAmount) {
      errors.dueAmount = "Please enter a dueAmount.";
    }

    if (!incomeData.billDate) {
      errors.billDate = "Please Select BilDate Date";
    }
    if (!incomeData.dueBilDate) {
      errors.dueBilDate = "Please Select Due BilDate Date";
    }

    if (!incomeData.accountName) {
      errors.accountName = "Please Select a Account number";
    }
    if (!incomeData.bill) {
      errors.bill = "Please Upload a Bill";
    }

    if (Object.keys(errors).length > 0) {
      // Update the validation errors
      setValidationErrors(errors);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("clientName", incomeData.clientName);
      formData.append("amount", incomeData.amount);
      formData.append("dueAmount", incomeData.dueAmount);
      formData.append("billDate", incomeData.billDate);
      formData.append("dueBilDate", incomeData.dueBilDate);
      formData.append("datePicker", incomeData.datePicker);
      formData.append("accountName", incomeData.accountName);
      if (incomeData.bill) {
        formData.append("bill", incomeData.bill);
      } else {
        // console.log("bill not Avalable");
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}Income/createIncomeAccount`,
        {
          method: "POST",
          headers: {
            // "Content-Type": "application/json",
          },
          body: formData,
        }
      );
      // console.log(formData);
      if (!response.ok) {
        toast.error("Failed create Data", {
          autoClose: 1000,
        });
        return;
      }

      toast.success("Account Created successful", {
        autoClose: 1000,
      });
      setShowModal(false);
      setIncomeData({
        clientName: "",
        amount: "",
        dueAmount: "",
        billDate: new Date(),
        dueBilDate: new Date(),
        datePicker: "",
        accountName: "",
        bill: null,
      });
      getData();
      // setAccountData({ null: true });
      UpdateAmount();
    } catch (error) {
      console.error("Error during Create Account:", error);
    }
  }, [incomeData]);

  const [clientNames, setClientNames] = useState([]);

  const ClientDropDownList = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}client/getAllClientName`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      //  setRowValidationErrors({ null: true });
      if (!response.ok) {
        toast.error("You can not add an amount", {
          autoClose: 1000,
        });
        return;
      }

      setShowModal(false);

      const data = await response.json();

      // Assuming the API response has an array of client names
      const fetchedClientNames = data.clientNames || [];

      setClientNames(fetchedClientNames);
      //   console.log(fetchedClientNames, "ABC");
    } catch (err) {
      console.error("Error during fetching client names:", err);
    }
  }, []);

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

  const UpdateAmount = useCallback(async () => {
    const accountName = incomeData.accountName;
    const incomeAmount = incomeData.amount;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}balance/addIncomeToAccount`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ accountName, incomeAmount }),
        }
      );

      if (!response.ok) {
        console.error("Error adding income to account");
        return;
      }

      // Handle success if needed
      // console.log("Income added successfully");
    } catch (err) {
      console.error("Error during adding income to account:", err);
    }
  }, [incomeData]);

  //get all data

  const [listData, setListData] = useState([]);
  const [editedData, setEditedData] = useState({});

  const getData = useCallback(async () => {
    await fetch(
      `${process.env.REACT_APP_API_URL}Income/getAllIncomeAccountList`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        // console.log("API Data:", data.user);
        setListData(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [setListData]);

  const [rowValidationErrors, setRowValidationErrors] = useState({
    rowAmount: "",
    rowDueAmount: "",
  });
  const [showFileInput, setShowFileInput] = useState(false);
  const [editFormOpen, setEditFormOpen] = useState(false);

  const handleEdit = (IncomeId) => {
    const userToEdit = listData.user.find((user) => user._id === IncomeId);
    // console.log(userToEdit);
    setEditedData({
      IncomeId,
      rowClientName: userToEdit.clientName,
      rowAmount: userToEdit.amount,
      rowDueAmount: userToEdit.dueAmount,
      rowBilDate: userToEdit.billDate,
      rowDueBilDate: userToEdit.dueBilDate,
      rowDatePicker: userToEdit.datePicker ?? "",
      rowAccountName: userToEdit.accountName,
      bill: userToEdit.bill,
    });
    setShowFileInput(true);

    setEditFormOpen(true);
  };

  const closeEditForm = () => {
    setRowValidationErrors({ null: true });
    setEditFormOpen(false);
  };

  const rowHandleInputChange = (e, key) => {
    if (key === ("rowBilDate" || "rowDueBilDate" || "rowDatePicker")) {
      setEditedData((prevData) => ({
        ...prevData,
        [key]: new Date(e.target.value),
      }));
    } else if (key === "bill") {
      setEditedData((prevData) => ({
        ...prevData,
        [key]: e.target.files[0],
      }));
    } else {
      setEditedData((prevData) => ({
        ...prevData,
        [key]: e.target.value,
      }));
    }
  };

  //edite data
  const handleSave = useCallback(async () => {
    //  const token = localStorage.getItem("token");
    // validation
    const errors = {};

    if (!editedData.rowAmount) {
      errors.rowAmount = "Please enter a amount.";
    }

    if (!editedData.rowDueAmount) {
      errors.rowDueAmount = "Please enter a dueAmount.";
    }

    if (Object.keys(errors).length > 0) {
      // Update the validation errors
      setRowValidationErrors(errors);
      return;
    }
    try {
      const UpformData = new FormData();
      UpformData.append("IncomeId", editedData.IncomeId);
      UpformData.append("rowClientName", editedData.rowClientName);
      UpformData.append("rowAmount", editedData.rowAmount);
      UpformData.append("rowDueAmount", editedData.rowDueAmount);
      UpformData.append("rowBilDate", editedData.rowBilDate);
      UpformData.append("rowDueBilDate", editedData.rowDueBilDate);
      UpformData.append("rowDatePicker", editedData.rowDatePicker);
      UpformData.append("rowAccountName", editedData.rowAccountName);
      if (editedData.bill) {
        UpformData.append("bill", editedData.bill);
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}Income/updateIncomeAccount`,
        {
          method: "PUT",
          headers: {
            // "Content-Type": "application/json",
            //  authorization: token,
          },
          body: UpformData,
        }
      );
      // console.log(UpformData.IncomeId);

      setRowValidationErrors({ null: true });
      setEditFormOpen(false);
      if (!response.ok) {
        toast.error("Error Editing Data ", {
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

  //delete data
  const handleDelete = useCallback(async (IncomeId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}Income/deleteIncomeAccount`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ IncomeId }),
        }
      );
      // console.log({ IncomeId });
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

  useEffect(() => {
    getData();
    AccountDropDownList();
    ClientDropDownList();
  }, [AccountDropDownList, ClientDropDownList, getData]);

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
  const toggleRowSelection = (ClientId) => {
    if (selectedRows.includes(ClientId)) {
      setSelectedRows((prevSelectedRows) =>
        prevSelectedRows.filter((id) => id !== ClientId)
      );
    } else {
      setSelectedRows((prevSelectedRows) => [...prevSelectedRows, ClientId]);
    }
  };

  const convertToCSV = (data) => {
    // Extract only the first six columns from the header
    const customHeaders = [
      "Id",
      "Client Name",
      "Amount",
      "Due Amount",
      "Bill Date",
      "Due Bill Date",
      "Receive Date",
      "Receive Payment Account",
    ];

    // Join the custom headers to form the header line
    const header = customHeaders.join(",");
    // console.log(header, "Headerrrrrr");

    const rows = data.map((row) => {
      // Check if paymentMode is Cheque using ternary operator
      const date = !row.datePicker ? "" : `"${row.datePicker.slice(0, 10)}"`;

      const rowData = [
        row._id,
        `"${row.clientName}"`,
        `"${row.amount}"`,
        `"${row.dueAmount}"`,
        `"${row.billDate.slice(0, 10)}"`,
        `"${row.dueBilDate.slice(0, 10)}"`,
        date,
        `"${row.accountName}"`,
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
                    onClick={() => handleSort("clientName")}
                  >
                    Client Name
                    {sortColumn === "clientName" && (
                      <span>{sortOrder === "asc" ? " ▲" : " ▼"}</span>
                    )}
                  </th>
                  <th
                    style={{ cursor: "pointer" }}
                    onClick={() => handleSort("amount")}
                  >
                    Amount
                    {sortColumn === "amount" && (
                      <span>{sortOrder === "asc" ? " ▲" : " ▼"}</span>
                    )}
                  </th>
                  <th
                    style={{ cursor: "pointer" }}
                    onClick={() => handleSort("dueAmount")}
                  >
                    Due Amount
                    {sortColumn === "dueAmount" && (
                      <span>{sortOrder === "asc" ? " ▲" : " ▼"}</span>
                    )}
                  </th>
                  <th
                    style={{ cursor: "pointer" }}
                    onClick={() => handleSort("billDate")}
                  >
                    Bill Date
                    {sortColumn === "billDate" && (
                      <span>{sortOrder === "asc" ? " ▲" : " ▼"}</span>
                    )}
                  </th>
                  <th
                    style={{ cursor: "pointer" }}
                    onClick={() => handleSort("dueBilDate")}
                  >
                    Due Bill Date
                    {sortColumn === "dueBilDate" && (
                      <span>{sortOrder === "asc" ? " ▲" : " ▼"}</span>
                    )}
                  </th>
                  <th
                    style={{ cursor: "pointer" }}
                    onClick={() => handleSort("datePicker")}
                  >
                    Receive Date
                    {sortColumn === "datePicker" && (
                      <span>{sortOrder === "asc" ? " ▲" : " ▼"}</span>
                    )}
                  </th>
                  <th
                    style={{ cursor: "pointer" }}
                    onClick={() => handleSort("accountName")}
                  >
                    Receive Payment Account
                    {sortColumn === "accountName" && (
                      <span>{sortOrder === "asc" ? " ▲" : " ▼"}</span>
                    )}
                  </th>

                  <th> Bill</th>
                  <th> Action</th>
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
                    <td>{user.clientName}</td>
                    <td>{user.amount}</td>
                    <td>{user.dueAmount}</td>
                    <td>{user.billDate && user.billDate.slice(0, 10)}</td>
                    <td>{user.dueBilDate && user.dueBilDate.slice(0, 10)}</td>
                    <td>{user.datePicker && user.datePicker.slice(0, 10)}</td>
                    <td>{user.accountName}</td>
                    <td>
                      <span>
                        {user.bill && (
                          <a
                            href={`http://localhost:2000/${user.bill}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Open Bill
                          </a>
                        )}
                      </span>
                    </td>
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
              <h5 className="modal-title">Income Account</h5>
              <div>
                <CCloseButton onClick={closeModal} />
              </div>
            </div>
            <div className="modal-body">
              {/* Create Account Form */}
              <form>
                <div className="mb-3">
                  <div>
                    <label htmlFor="clientName" className="form-label">
                      Select Client Name
                    </label>
                    <select
                      id="clientName"
                      name="clientName"
                      className="form-control input-bgColor"
                      value={incomeData.clientName}
                      onChange={handleInputChange}
                    >
                      <option value="" disabled>
                        ---Select client Name---
                      </option>
                      {clientNames.map((clientName) => (
                        <option key={clientName} value={clientName}>
                          {clientName}
                        </option>
                      ))}
                    </select>
                    {validationErrors.clientName && (
                      <p className="text-danger">
                        {validationErrors.clientName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="amount" className="form-label">
                      Amount
                    </label>
                    <input
                      type="number"
                      name="amount"
                      className="form-control input-bgColor"
                      id="amount"
                      value={incomeData.amount}
                      onChange={handleInputChange}
                      required
                    />
                    {validationErrors.amount && (
                      <p className="text-danger">{validationErrors.amount}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="dueAmount" className="form-label">
                      Due Amount
                    </label>
                    <input
                      type="number"
                      name="dueAmount"
                      className="form-control input-bgColor"
                      id="dueAmount"
                      value={incomeData.dueAmount}
                      onChange={handleInputChange}
                    />
                    {validationErrors.dueAmount && (
                      <p className="text-danger">
                        {validationErrors.dueAmount}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="billDate" className="form-label me-4">
                      Select Bill Date:
                    </label>
                    <DatePicker
                      id="billDate"
                      name="billDate"
                      className="form-control mt-2 input-bgColor"
                      selected={incomeData.billDate}
                      onChange={(date) =>
                        handleInputChange({
                          target: { name: "billDate", value: date },
                        })
                      }
                      dateFormat="dd/MM/yyyy"
                    />
                    {validationErrors.billDate && (
                      <p className="text-danger">{validationErrors.billDate}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="dueBilDate" className="form-label me-1">
                      Select Due Bill Date:
                    </label>
                    <DatePicker
                      id="dueBilDate"
                      name="dueBilDate"
                      className="form-control mt-2 input-bgColor"
                      selected={incomeData.dueBilDate}
                      onChange={(date) =>
                        handleInputChange({
                          target: { name: "dueBilDate", value: date },
                        })
                      }
                      dateFormat="dd/MM/yyyy"
                    />
                    {validationErrors.dueBilDate && (
                      <p className="text-danger">
                        {validationErrors.dueBilDate}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="datePicker" className="form-label me-4">
                      Select Date:
                    </label>
                    <DatePicker
                      id="datePicker"
                      name="datePicker"
                      className="form-control mt-2 input-bgColor"
                      selected={incomeData.datePicker}
                      onChange={(date) =>
                        handleInputChange({
                          target: { name: "datePicker", value: date },
                        })
                      }
                      dateFormat="dd/MM/yyyy"
                    />
                  </div>
                  <div>
                    <label htmlFor="accountName" className="form-label">
                      Receive Payment Account
                    </label>
                    <select
                      id="accountName"
                      name="accountName"
                      className="form-control"
                      value={incomeData.accountName}
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
                    {validationErrors.accountName && (
                      <p className="text-danger">
                        {validationErrors.accountName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="bill" className="form-label">
                      Upload Bill
                    </label>

                    <input
                      type="file"
                      className="form-control input-bgColor"
                      name="bill"
                      // value={clientData.bill}
                      onChange={handleInputChange}
                    />
                    {validationErrors.bill && (
                      <p className="text-danger">{validationErrors.bill}</p>
                    )}
                  </div>
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
                onClick={handleUpdateAmount}
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
                    <label htmlFor="clientName" className="form-label">
                      Select Client Name
                    </label>
                    <select
                      id="rowClientName"
                      name="rowClientName"
                      className="form-control input-bgColor"
                      value={editedData.rowClientName}
                      onChange={(e) => rowHandleInputChange(e, "rowClientName")}
                    >
                      <option value="" disabled>
                        ---Select client Name---
                      </option>
                      {clientNames.map((clientName) => (
                        <option key={clientName} value={clientName}>
                          {clientName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="amount" className="form-label">
                      Amount
                    </label>
                    <input
                      type="number"
                      name="rowAmount"
                      className="form-control input-bgColor"
                      id="rowAmount"
                      value={editedData.rowAmount}
                      onChange={(e) => rowHandleInputChange(e, "rowAmount")}
                    />
                    {rowValidationErrors.rowAmount && (
                      <p className="text-danger">
                        {rowValidationErrors.rowAmount}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="dueAmount" className="form-label">
                      Due Amount
                    </label>
                    <input
                      type="number"
                      name="rowDueAmount"
                      className="form-control input-bgColor"
                      id="rowDueAmount"
                      value={editedData.rowDueAmount}
                      // value={
                      //   editedData.rowDueAmount !== undefined
                      //     ? editedData.rowDueAmount
                      //     : 0
                      // }
                      onChange={(e) => rowHandleInputChange(e, "rowDueAmount")}
                    />
                    {rowValidationErrors.rowDueAmount && (
                      <p className="text-danger">
                        {/* {console.log(rowValidationErrors.rowDueAmount)} */}

                        {rowValidationErrors.rowDueAmount}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="datePicker" className="form-label">
                      Select Bill Date:
                    </label>
                    <DatePicker
                      id="rowBilDate"
                      name="rowBilDate"
                      className="form-control input-bgColor"
                      selected={new Date(editedData.rowBilDate)}
                      onChange={(date) =>
                        rowHandleInputChange(
                          {
                            target: {
                              name: "rowBilDate",
                              value: date,
                            },
                          },
                          "rowBilDate"
                        )
                      }
                      dateFormat="dd/MM/yyyy"
                    />
                  </div>
                  <div>
                    <label htmlFor="datePicker" className="form-label">
                      Select Due Bill Date:
                    </label>
                    <DatePicker
                      id="rowDueBilDate"
                      name="rowDueBilDate"
                      className="form-control input-bgColor"
                      selected={new Date(editedData.rowDueBilDate)}
                      onChange={(date) =>
                        rowHandleInputChange(
                          {
                            target: {
                              name: "rowDueBilDate",
                              value: date,
                            },
                          },
                          "rowDueBilDate"
                        )
                      }
                      dateFormat="dd/MM/yyyy"
                    />
                  </div>
                  <div>
                    <label htmlFor="datePicker" className="form-label">
                      Select Date:
                    </label>
                    <DatePicker
                      id="rowDatePicker"
                      name="rowDatePicker"
                      className="form-control input-bgColor"
                      selected={
                        editedData.rowDatePicker
                          ? new Date(editedData.rowDatePicker)
                          : ""
                      }
                      onChange={(date) =>
                        rowHandleInputChange(
                          {
                            target: {
                              name: "rowDatePicker",
                              value: date,
                            },
                          },
                          "rowDatePicker"
                        )
                      }
                      dateFormat="dd/MM/yyyy"
                    />
                  </div>
                  <div>
                    <label htmlFor="accountName" className="form-label">
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
                        ---Select Account Number---
                      </option>
                      {accountNames.map((accountName) => (
                        <option key={accountName} value={accountName}>
                          {accountName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="bill" className="form-label">
                      Update Bill
                    </label>

                    <input
                      className="form-control input-bgColor"
                      type="file"
                      name="bill"
                      onChange={(e) => {
                        rowHandleInputChange(e, "bill");
                      }}
                    />

                    {showFileInput && rowValidationErrors.bill && (
                      <p className="text-danger">{rowValidationErrors.bill}</p>
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

export default Income;
