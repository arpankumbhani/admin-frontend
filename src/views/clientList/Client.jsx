import React, { useCallback, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CCloseButton } from "@coreui/react";
import "..//allFormCss/From.css";

const ClientList = () => {
  const [showModal, setShowModal] = useState(false);
  const [clientData, setClientData] = useState({
    clientName: "",
    country: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    contract: null,
  });

  // const [contract, setContract] = useState(null);

  //   validation errors
  const [validationErrors, setValidationErrors] = useState({
    clientName: "",
    country: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    contract: null,
  });

  const openModal = () => {
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setClientData({ null: true });
    setValidationErrors({ null: true });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setClientData({
      ...clientData,
      [name]: name === "contract" ? e.target.files[0] : value,
    });

    // Clear previous validation error
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  // const handleFileChange = (e) => {
  //   setClientData({ ...clientData, contract: e.target.files[0] });
  //
  // };

  const handleRegister = useCallback(async () => {
    const errors = {};

    if (!clientData.clientName) {
      errors.clientName = "Please enter a Client Name.";
    }

    if (!clientData.country) {
      errors.country = "Please Enter a Country.";
    }
    if (!clientData.bankName) {
      errors.bankName = "Please Enter a bank name.";
    }

    if (!clientData.accountNumber) {
      errors.accountNumber = "Please enter a AccountNumber.";
    } else if (
      clientData.accountNumber.length > 10 ||
      clientData.accountNumber.length < 10
    ) {
      errors.accountNumber = "Please enter a 10 digit ";
    }

    if (!clientData.ifscCode) {
      errors.ifscCode = "Please enter a ifscCode.";
    }

    if (!clientData.contract) {
      errors.contract = "Please Upload Contract";
    }

    if (Object.keys(errors).length > 0) {
      // Update the validation errors
      setValidationErrors(errors);
      return;
    }

    // console.log(clientData);

    try {
      const formData = new FormData();
      formData.append("clientName", clientData.clientName);
      formData.append("country", clientData.country);
      formData.append("bankName", clientData.bankName);
      formData.append("accountNumber", clientData.accountNumber);
      formData.append("ifscCode", clientData.ifscCode);
      if (clientData.contract) {
        formData.append("contract", clientData.contract);
      } else {
        console.log("contract not Avalable");
      }

      console.log(formData);

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}client/createClientAccount`,
        {
          method: "POST",
          headers: {
            // "Content-Type": "multipart/form-data",
          },
          body: formData,
        }
      );
      console.log(formData);

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
      setClientData({ null: true });
      getData();
    } catch (error) {
      console.error("Error during Create Account:", error);
    }
  }, [clientData]);

  const [listData, setListData] = useState([]);
  const [editedData, setEditedData] = useState({});

  const getData = useCallback(async () => {
    await fetch(`${process.env.REACT_APP_API_URL}client/getAllClintList`, {
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

  const [rowValidationErrors, setRowValidationErrors] = useState({
    rowClientName: "",
    rowCountry: "",
    rowBankName: "",
    rowAccountNumber: "",
    rowIfscCode: "",
    contract: "",
  });

  const [showFileInput, setShowFileInput] = useState(false);
  const [editFormOpen, setEditFormOpen] = useState(false);

  const handleEdit = (ClientId) => {
    const userToEdit = listData.user.find((user) => user._id === ClientId);

    setEditedData({
      ClientId,
      rowClientName: userToEdit.clientName,
      rowCountry: userToEdit.country,
      rowBankName: userToEdit.bankName,
      rowAccountNumber: userToEdit.accountNumber,
      rowIfscCode: userToEdit.ifscCode,
      contract: userToEdit.contract,
    });

    setShowFileInput(true);
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
      [key]: key === "contract" ? e.target.files[0] : e.target.value,
    });
  };

  //save Edit data

  const handleSave = useCallback(async () => {
    // const token = localStorage.getItem("token");
    // validation
    const errors = {};

    if (!editedData.rowClientName) {
      errors.rowClientName = "Please enter a Client Name.";
    }

    if (!editedData.rowCountry) {
      errors.rowCountry = "Please Enter a Country.";
    }
    if (!editedData.rowBankName) {
      errors.rowBankName = "Please Enter a Bank Name.";
    }

    if (!editedData.rowAccountNumber) {
      errors.rowAccountNumber = "Please enter a AccountNumber.";
    } else if (
      editedData.rowAccountNumber.length > 10 ||
      editedData.rowAccountNumber.length < 10
    ) {
      errors.rowAccountNumber = "Please enter a 10 digit ";
    }

    if (!editedData.rowIfscCode) {
      errors.rowIfscCode = "Please enter a ifscCode.";
    }

    if (Object.keys(errors).length > 0) {
      // Update the validation errors
      setRowValidationErrors(errors);
      return;
    }

    try {
      const UpformData = new FormData();
      UpformData.append("ClientId", editedData.ClientId);
      UpformData.append("rowClientName", editedData.rowClientName);
      UpformData.append("rowCountry", editedData.rowCountry);
      UpformData.append("rowBankName", editedData.rowBankName);
      UpformData.append("rowAccountNumber", editedData.rowAccountNumber);
      UpformData.append("rowIfscCode", editedData.rowIfscCode);
      if (editedData.contract) {
        UpformData.append("contract", editedData.contract);
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}client/updateClientAccount`,
        {
          method: "PUT",
          headers: {
            // "Content-Type": "application/json",
            // authorization: token,
            // "Content-Type": "multipart/form-data",
          },
          body: UpformData,
        }
      );
      // console.log(UpformData);

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

  const handleDelete = useCallback(async (ClientId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}client/deleteClientAccount`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
          body: JSON.stringify({ ClientId }),
        }
      );
      // console.log({ ClientId });
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
                  <th>Client Name</th>
                  <th>Country</th>
                  <th>Bank Name</th>
                  <th>Account Number</th>
                  <th>IFSC Code</th>
                  <th>Contract</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {listData &&
                  listData.user?.map((user) => (
                    <tr key={user._id}>
                      <td>{user.clientName}</td>
                      <td>{user.country}</td>
                      <td>{user.bankName}</td>
                      <td>{user.accountNumber}</td>

                      <td>{user.ifscCode}</td>
                      <td>
                        <span>
                          {user.contract && (
                            <a
                              href={`http://localhost:9000/${user.contract}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Open Contract
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
              <h5 className="text-center">Create New ClientAccount</h5>
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
                      Client Name
                    </label>

                    <input
                      type="text"
                      maxLength="15"
                      className="form-control input-bgColor"
                      name="clientName"
                      value={clientData.clientName}
                      onChange={handleInputChange}
                    />
                    {validationErrors.clientName && (
                      <p className="text-danger">
                        {validationErrors.clientName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="InitialBalance" className="form-label">
                      Country
                    </label>

                    <input
                      type="text"
                      maxLength="15"
                      className="form-control input-bgColor"
                      name="country"
                      value={clientData.country}
                      onChange={handleInputChange}
                    />
                    {validationErrors.country && (
                      <p className="text-danger">{validationErrors.country}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="bankName" className="form-label">
                      Bank Name
                    </label>

                    <input
                      type="text"
                      maxLength="30"
                      className="form-control input-bgColor"
                      name="bankName"
                      value={clientData.bankName}
                      onChange={handleInputChange}
                    />
                    {validationErrors.bankName && (
                      <p className="text-danger">{validationErrors.bankName}</p>
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
                      value={clientData.accountNumber}
                      onChange={handleInputChange}
                    />
                    {validationErrors.accountNumber && (
                      <p className="text-danger">
                        {validationErrors.accountNumber}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="ifscCode" className="form-label">
                      IFSC Code
                    </label>

                    <input
                      type="text"
                      maxLength="15"
                      className="form-control input-bgColor"
                      name="ifscCode"
                      value={clientData.ifscCode}
                      onChange={handleInputChange}
                    />
                    {validationErrors.ifscCode && (
                      <p className="text-danger">{validationErrors.ifscCode}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="contract" className="form-label">
                      Contract
                    </label>

                    <input
                      type="file"
                      className="form-control input-bgColor"
                      name="contract"
                      // value={clientData.contract}
                      onChange={handleInputChange}
                    />
                    {validationErrors.contract && (
                      <p className="text-danger">{validationErrors.contract}</p>
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
                    <label htmlFor="clientName" className="form-label">
                      Client Name
                    </label>

                    <input
                      type="text"
                      className="form-control input-bgColor"
                      name="rowClientName"
                      maxLength="15"
                      value={editedData.rowClientName}
                      onChange={(e) => rowHandleInputChange(e, "rowClientName")}
                    />
                    {rowValidationErrors.rowClientName && (
                      <p className="text-danger">
                        {rowValidationErrors.rowClientName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="InitialBalance" className="form-label">
                      Country
                    </label>

                    <input
                      type="text"
                      className="form-control input-bgColor"
                      name="rowCountry"
                      value={editedData.rowCountry}
                      onChange={(e) => rowHandleInputChange(e, "rowCountry")}
                    />
                    {rowValidationErrors.rowCountry && (
                      <p className="text-danger">
                        {rowValidationErrors.rowCountry}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="bankName" className="form-label">
                      Bank Name
                    </label>

                    <input
                      type="text"
                      className="form-control input-bgColor"
                      name="rowBankName"
                      maxLength="30"
                      value={editedData.rowBankName}
                      onChange={(e) => rowHandleInputChange(e, "rowBankName")}
                    />
                    {rowValidationErrors.rowBankName && (
                      <p className="text-danger">
                        {rowValidationErrors.rowBankName}
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
                      name="rowAccountNumber"
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
                    <label htmlFor="ifscCode" className="form-label">
                      IFSC Code
                    </label>

                    <input
                      type="text"
                      className="form-control input-bgColor"
                      name="rowIfscCode"
                      maxLength="15"
                      value={editedData.rowIfscCode}
                      onChange={(e) => rowHandleInputChange(e, "rowIfscCode")}
                    />
                    {rowValidationErrors.rowIfscCode && (
                      <p className="text-danger">
                        {rowValidationErrors.rowIfscCode}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="contract" className="form-label">
                      Contract
                    </label>

                    <input
                      className="form-control input-bgColor"
                      type="file"
                      name="contract"
                      onChange={(e) => {
                        rowHandleInputChange(e, "contract");
                      }}
                    />

                    {showFileInput && rowValidationErrors.contract && (
                      <p className="text-danger">
                        {rowValidationErrors.contract}
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

export default ClientList;
