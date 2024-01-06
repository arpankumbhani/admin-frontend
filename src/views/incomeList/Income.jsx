import React, { useCallback, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CCloseButton } from "@coreui/react";
import "..//allFormCss/From.css";

const Income = () => {
  const [showModal, setShowModal] = useState(false);
  // const [selectedDate, setSelectedDate] = useState(null);

  const [incomeData, setIncomeData] = useState({
    clientName: "",
    amount: "",
    dueAmount: "",
    bilDate: new Date(),
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
    bilDate: "",
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
      bilDate: new Date(),
      dueBilDate: new Date(),
      datePicker: "",
      accountName: "",
      bill: null,
    });
    setValidationErrors({ null: true });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === ("bilDate" || "dueBilDate" || "datePicker")) {
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

    if (!incomeData.bilDate) {
      errors.bilDate = "Please Select BilDate Date";
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
      formData.append("bilDate", incomeData.bilDate);
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
        bilDate: new Date(),
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
      rowBilDate: userToEdit.bilDate,
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
      setValidationErrors(errors);
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
            </div>
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>Client Name</th>
                  <th>Amount</th>
                  <th>Due Amount</th>
                  <th>Bil Date</th>
                  <th>Due Bil Date</th>
                  <th>Receive Date</th>
                  <th>Receive Payment Account</th>
                  <th>Bill</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {listData &&
                  listData.user?.map((user) => (
                    <tr key={user._id}>
                      <td>{user.clientName}</td>
                      <td>{user.amount}</td>
                      <td>{user.dueAmount}</td>
                      <td>{user.bilDate && user.bilDate.slice(0, 10)}</td>
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
                    <label htmlFor="bilDate" className="form-label me-4">
                      Select Bill Date:
                    </label>
                    <DatePicker
                      id="bilDate"
                      name="bilDate"
                      className="form-control mt-2 input-bgColor"
                      selected={incomeData.bilDate}
                      onChange={(date) =>
                        handleInputChange({
                          target: { name: "bilDate", value: date },
                        })
                      }
                      dateFormat="dd/MM/yyyy"
                    />
                    {validationErrors.bilDate && (
                      <p className="text-danger">{validationErrors.bilDate}</p>
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
                      onChange={(e) => rowHandleInputChange(e, "rowDueAmount")}
                    />
                    {rowValidationErrors.rowDueAmount && (
                      <p className="text-danger">
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
