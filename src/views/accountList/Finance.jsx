import React, { useCallback, useEffect, useState } from "react";
// import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CCloseButton } from "@coreui/react";
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
                  <th>Account Name</th>
                  <th>Initial Balance</th>
                  <th>Account Number</th>
                  <th>Branch Code</th>
                  <th>Bank Branch</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {listData &&
                  listData.user?.map((user) => (
                    <tr key={user._id}>
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
                      maxLength="15"
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
