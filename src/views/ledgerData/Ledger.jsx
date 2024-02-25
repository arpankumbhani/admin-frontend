import React, { useCallback, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "..//allFormCss/From.css";
import { saveAs } from "file-saver";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Ledger = () => {
  const [dateState, setDateState] = useState({
    fromDate: new Date(),
    toDate: new Date(),
    clientName: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // console.log(`Setting ${name} to:`, value);

    if (name === ("fromDate" || "toDate")) {
      setDateState((prevData) => ({
        ...prevData,
        [name]: new Date(value),
      }));
    } else {
      setDateState((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const calculateTotalAmount = () => {
    return sortedData
      .reduce((total, user) => total + parseFloat(user.amount), 0)
      .toFixed(2);
  };

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

      const data = await response.json();

      // Assuming the API response has an array of client names
      const fetchedClientNames = data.clientNames || [];

      setClientNames(fetchedClientNames);
      //   console.log(fetchedClientNames, "ABC");
    } catch (err) {
      console.error("Error during fetching client names:", err);
    }
  }, []);

  const [ledgerData, setLedgerData] = useState([]);

  // console.log(ledgerData, "daytfsy");

  const handleSubmit = () => {
    // console.log(dateState);

    const errors = {};
    if (!dateState.clientName) {
      errors.clientName = "Please Select a Client Name";
    }

    if (Object.keys(errors).length > 0) {
      // Update the validation errors
      setValidationErrors(errors);
      return;
    }

    fetch(`${process.env.REACT_APP_API_URL}Income/getAllLedgerClientName`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fromDate: dateState.fromDate,
        toDate: dateState.toDate,
        clientName: dateState.clientName,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log("API Data:", data.user);
        setLedgerData(data);
        if (data.user && data.user.length > 0) {
          setShowModal(true);
        } else {
          setShowModal(false);
          toast.warn("Client Data not Available", {
            autoClose: 1200,
          });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    ClientDropDownList();
  }, [ClientDropDownList]);

  const [selectAllChecked, setSelectAllChecked] = useState(false);

  const handleSelectAll = () => {
    setSelectAllChecked((prevSelectAllChecked) => !prevSelectAllChecked);
    setSelectedRows(
      selectAllChecked ? [] : ledgerData.user.map((user) => user._id)
    );
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
      "Bill Date",
      "Receive Payment Account",
      "Amount",
    ];

    // Join the custom headers to form the header line
    const header = customHeaders.join(",");
    // console.log(header, "Headerrrrrr");

    const rows = data.map((row) => {
      // Check if paymentMode is Cheque using ternary operator

      const rowData = [
        row._id,
        `"${row.clientName}"`,
        `"${row.billDate.slice(0, 10)}"`,
        `"${row.accountName}"`,
        `"${row.amount}"`,
      ];
      return rowData.join(",");
    });
    // console.log(rows, "rowwwwww");

    return `${header}\n${rows.join("\n")}`;
  };

  // Function to export data as CSV file
  const exportToCSV = () => {
    const selectedData = ledgerData.user.filter((user) =>
      selectedRows.includes(user._id)
    );
    const csvData = convertToCSV(selectedData);
    // console.log(selectedData);
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
  const sortedData = Array.isArray(ledgerData.user)
    ? [...ledgerData.user].sort(compareValues(sortColumn, sortOrder))
    : [];

  const handleSendReport = useCallback(async () => {
    try {
      // Check if sortedData is not empty or null
      if (Array.isArray(sortedData) && sortedData.length > 0) {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}Income/ledgerReportMail`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ sortedData }),
          }
        );
        console.log(sortedData);

        if (!response.ok) {
          toast.error("send Report failed", {
            autoClose: 1000,
          });
          return;
        }

        toast.success("Report Send Successful", {
          autoClose: 1000,
        });
      } else {
        toast.warn("No data available to send report", {
          autoClose: 1000,
        });
      }
    } catch (error) {
      console.error("Error during Sending report:", error);
    }
  }, [sortedData]);

  return (
    <>
      <div>
        <button
          type="button"
          className="btn btn-primary mx-3"
          style={{ float: "right", margin: "5px" }}
          onClick={exportToCSV}
          disabled={selectedRows.length === 0}
        >
          Export to CSV
        </button>
        <div className="ledger-style">
          <div className="modal-header">
            <div className="modal-body">
              <div className="container">
                <div className="row justify-content-around">
                  <div className="col-md-5 col-4">
                    <label htmlFor="fromDate" className="form-label">
                      From Date
                    </label>
                    <DatePicker
                      id="fromDate"
                      name="fromDate"
                      className="form-control mt-1 input-bgColor"
                      selected={dateState.fromDate}
                      onChange={(date) =>
                        handleInputChange({
                          target: { name: "fromDate", value: date },
                        })
                      }
                      dateFormat="dd/MM/yyyy"
                    />
                  </div>

                  <div className="col-md-5 col-4">
                    <label htmlFor="toDate" className="form-label">
                      To Date
                    </label>
                    <DatePicker
                      id="toDate"
                      name="toDate"
                      minDate={dateState.fromDate}
                      className="form-control mt-1 input-bgColor"
                      selected={dateState.toDate}
                      onChange={(date) =>
                        handleInputChange({
                          target: { name: "toDate", value: date },
                        })
                      }
                      dateFormat="dd/MM/yyyy"
                    />
                  </div>
                  <div>
                    <label htmlFor="clientName" className="form-label">
                      Select Client Name
                    </label>
                    <select
                      id="clientName"
                      name="clientName"
                      className="form-control input-bgColor"
                      value={dateState.clientName}
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
                  <div className="text-center mt-2">
                    <button className="btn btn-primary" onClick={handleSubmit}>
                      submit
                    </button>
                  </div>
                  {showModal && (
                    <>
                      <div>
                        <div className="table-responsive">
                          <div className="text-right mb-2"></div>
                          <table className="table table-striped table-bordered">
                            <thead>
                              <tr>
                                <th>
                                  <input
                                    type="checkbox"
                                    className="Checkbox"
                                    onChange={handleSelectAll}
                                    checked={
                                      ledgerData &&
                                      ledgerData.user &&
                                      selectedRows.length ===
                                        ledgerData.user.length &&
                                      ledgerData.user.length > 0
                                    }
                                  />
                                </th>
                                <th
                                  className="pointer"
                                  onClick={() => handleSort("clientName")}
                                >
                                  Client Name
                                  {sortColumn === "clientName" && (
                                    <span>
                                      {sortOrder === "asc" ? " ▲" : " ▼"}
                                    </span>
                                  )}
                                </th>
                                <th
                                  className="pointer"
                                  onClick={() => handleSort("billDate")}
                                >
                                  Bill Date
                                  {sortColumn === "billDate" && (
                                    <span>
                                      {sortOrder === "asc" ? " ▲" : " ▼"}
                                    </span>
                                  )}
                                </th>
                                <th
                                  className="pointer"
                                  onClick={() => handleSort("accountName")}
                                >
                                  Receive Payment Account
                                  {sortColumn === "accountName" && (
                                    <span>
                                      {sortOrder === "asc" ? " ▲" : " ▼"}
                                    </span>
                                  )}
                                </th>
                                <th
                                  className="pointer"
                                  onClick={() => handleSort("amount")}
                                >
                                  Amount
                                  {sortColumn === "amount" && (
                                    <span>
                                      {sortOrder === "asc" ? " ▲" : " ▼"}
                                    </span>
                                  )}
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {/* {console.log(sortedData)} */}
                              {sortedData.map((user) => (
                                <tr key={user._id}>
                                  <td>
                                    <input
                                      type="checkbox"
                                      className="Checkbox"
                                      onChange={() =>
                                        toggleRowSelection(user._id)
                                      }
                                      checked={selectedRows.includes(user._id)}
                                    />
                                  </td>
                                  <td>{user.clientName}</td>
                                  <td>
                                    {user.billDate &&
                                      user.billDate.slice(0, 10)}
                                  </td>
                                  <td>{user.accountName}</td>

                                  <td>{user.amount}</td>
                                </tr>
                              ))}
                              <tr>
                                <td
                                  colSpan="4"
                                  className="text-right font-weight-bold"
                                >
                                  Total Amount:
                                </td>
                                <td>{calculateTotalAmount()}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div>
                        <button
                          type="button"
                          className="btn btn-primary mx-3"
                          style={{ float: "right", margin: "5px" }}
                          onClick={handleSendReport}
                        >
                          Send Report
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />
    </>
  );
};

export default Ledger;
