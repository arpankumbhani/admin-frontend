import React, { useCallback, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import { CCloseButton } from "@coreui/react";
import { saveAs } from "file-saver";
import "..//allFormCss/From.css";

const Product = () => {
  const [showModal, setShowModal] = useState(false);
  // const [selectedDate, setSelectedDate] = useState(null);

  const [productData, setProductData] = useState({
    dish: "",
    imgdata: null,
    address: "",
    somedata: "",
    price: "",
    rating: "",
    // quty: "",
  });

  //validation errors
  const [validationErrors, setValidationErrors] = useState({
    dish: "",
    imgdata: null,
    address: "",
    somedata: "",
    price: "",
    rating: "",
    // quty: "",
  });

  const openModal = () => {
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setProductData({
      dish: "",
      imgdata: null,
      address: "",
      somedata: "",
      price: "",
      rating: "",
      // quty: "",
    });
    setValidationErrors({ null: true });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "imgdata") {
      setProductData((prevData) => ({
        ...prevData,
        [name]: e.target.files[0],
      }));
    } else {
      setProductData((prevData) => ({
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

  const handleAddProduct = useCallback(async () => {
    // console.log("hdjh");

    // Basic validation
    const errors = {};
    if (!productData.dish) {
      errors.dish = "Please Select a Client Name";
    }

    if (!productData.address) {
      errors.address = "Please enter a address.";
    }

    if (!productData.somedata) {
      errors.somedata = "Please enter someData";
    }

    if (!productData.price) {
      errors.price = "Please Enter price";
    }
    if (!productData.rating) {
      errors.rating = "Please enter Rating";
    }

    // if (!productData.quty) {
    //   errors.quty = "Please Enter quantity";
    // }

    if (Object.keys(errors).length > 0) {
      // Update the validation errors
      setValidationErrors(errors);
      return;
    }
    try {
      const formData = new FormData();
      formData.append("dish", productData.dish);
      formData.append("address", productData.address);
      formData.append("somedata", productData.somedata);
      formData.append("price", productData.price);
      formData.append("rating", productData.rating);
      // formData.append("quty", productData.quty);
      if (productData.imgdata) {
        formData.append("imgdata", productData.imgdata);
      } else {
        console.log(productData.imgdata, "img not Avalable");
      }

      const response = await fetch(
        // `${process.env.REACT_APP_API_URL}Product/addProduct`,
        `http://localhost:2000/api/Product/addProduct`,
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
      setProductData({
        dish: "",
        imgdata: null,
        address: "",
        somedata: "",
        price: "",
        rating: "",
        // quty: "",
      });
      getData();
    } catch (error) {
      console.error("Error during Create Account:", error);
    }
  }, [productData]);

  //get all data

  const [listData, setListData] = useState([]);
  //   console.log(listData);
  const [editedData, setEditedData] = useState({});

  // get Product Data

  const getData = useCallback(async () => {
    await fetch(`http://localhost:2000/api/Product/getAllProduct`, {
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

  const [rowValidationErrors, setRowValidationErrors] = useState({
    rowDish: "",
    rowImgdata: null,
    rowAddress: "",
    rowSomedata: "",
    rowPrice: "",
    rowRating: "",
    rowQuty: "",
  });
  const [showFileInput, setShowFileInput] = useState(false);
  const [editFormOpen, setEditFormOpen] = useState(false);

  const handleEdit = (ProductId) => {
    const userToEdit = listData.user.find((user) => user._id === ProductId);
    // console.log(userToEdit);
    setEditedData({
      ProductId,
      rowDish: userToEdit.dish,
      rowImgdata: userToEdit.imgdata,
      rowAddress: userToEdit.address,
      rowSomedata: userToEdit.somedata,
      rowPrice: userToEdit.price,
      rowRating: userToEdit.rating,
      // rowQuty: userToEdit.quty,
    });
    setShowFileInput(true);

    setEditFormOpen(true);
  };

  const closeEditForm = () => {
    setRowValidationErrors({ null: true });
    setEditFormOpen(false);
  };

  const rowHandleInputChange = (e, key) => {
    if (key === "imgdata") {
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
  const handleUpdateProduct = useCallback(async () => {
    //  const token = localStorage.getItem("token");
    // validation
    const errors = {};

    if (!editedData.rowDish) {
      errors.rowDish = "Please enter a Dish Name";
    }
    if (!editedData.rowAddress) {
      errors.rowAddress = "Please enter a Address";
    }
    if (!editedData.rowSomedata) {
      errors.rowSomedata = "Please enter a Some data ";
    }
    if (!editedData.rowPrice) {
      errors.rowPrice = "Please enter a Price";
    }
    if (!editedData.rowRating) {
      errors.rowRating = "Please enter a Rating";
    }
    if (!editedData.rowQuty) {
      errors.rowQuty = "Please enter a Quantity";
    }

    if (Object.keys(errors).length > 0) {
      // Update the validation errors
      setRowValidationErrors(errors);
      return;
    }
    try {
      const UpformData = new FormData();
      UpformData.append("ProductId", editedData.ProductId);
      UpformData.append("rowDish", editedData.rowDish);
      UpformData.append("rowAddress", editedData.rowAddress);
      UpformData.append("rowSomedata", editedData.rowSomedata);
      UpformData.append("rowPrice", editedData.rowPrice);
      UpformData.append("rowRating", editedData.rowRating);
      // UpformData.append("rowQuty", editedData.rowQuty);
      if (editedData.imgdata) {
        UpformData.append("imgdata", editedData.imgdata);
      }
      const response = await fetch(
        `http://localhost:2000/api/Product/updateProductData`,
        {
          method: "PUT",
          headers: {
            // "Content-Type": "application/json",
            //  authorization: token,
          },
          body: UpformData,
        }
      );
      // console.log(UpformData.ProductId);

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

  //   delete data

  const handleDelete = useCallback(async (ProductId) => {
    try {
      const response = await fetch(
        `http://localhost:2000/api/Product/deleteProductItem`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ProductId }),
        }
      );
      // console.log({ ProductId });
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
  }, [getData]);

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
  const toggleRowSelection = (ProductId) => {
    if (selectedRows.includes(ProductId)) {
      setSelectedRows((prevSelectedRows) =>
        prevSelectedRows.filter((id) => id !== ProductId)
      );
    } else {
      setSelectedRows((prevSelectedRows) => [...prevSelectedRows, ProductId]);
    }
  };

  const convertToCSV = (data) => {
    // Extract only the first six columns from the header
    const customHeaders = [
      "Id",
      "dish",
      "imgdata",
      "address",
      "somedata",
      "price",
      "rating",
      // "quty",
    ];

    // Join the custom headers to form the header line
    const header = customHeaders.join(",");
    // console.log(header, "Headerrrrrr");

    const rows = data.map((row) => {
      // Check if paymentMode is Cheque using ternary operator

      const rowData = [
        row._id,
        `"${row.dish}"`,
        `"${row.address}"`,
        `"${row.somedata}"`,
        `"${row.price}"`,
        `"${row.rating}"`,
        // `"${row.quty}"`,
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
                  <th className="pointer" onClick={() => handleSort("dish")}>
                    Dish Name
                    {sortColumn === "dish" && (
                      <span>{sortOrder === "asc" ? " ▲" : " ▼"}</span>
                    )}
                  </th>
                  <th className="pointer" onClick={() => handleSort("address")}>
                    Address
                    {sortColumn === "address" && (
                      <span>{sortOrder === "asc" ? " ▲" : " ▼"}</span>
                    )}
                  </th>
                  <th
                    className="pointer"
                    onClick={() => handleSort("somedata")}
                  >
                    Some Data
                    {sortColumn === "somedata" && (
                      <span>{sortOrder === "asc" ? " ▲" : " ▼"}</span>
                    )}
                  </th>
                  <th className="pointer" onClick={() => handleSort("price")}>
                    Price
                    {sortColumn === "price" && (
                      <span>{sortOrder === "asc" ? " ▲" : " ▼"}</span>
                    )}
                  </th>
                  <th className="pointer" onClick={() => handleSort("rating")}>
                    Rating
                    {sortColumn === "rating" && (
                      <span>{sortOrder === "asc" ? " ▲" : " ▼"}</span>
                    )}
                  </th>
                  {/* <th className="pointer" onClick={() => handleSort("quty")}>
                    Quantity
                    {sortColumn === "quty" && (
                      <span>{sortOrder === "asc" ? " ▲" : " ▼"}</span>
                    )}
                  </th> */}
                  <th> imgdata</th>
                  <th> Action</th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((user) => (
                  <tr key={user._id}>
                    <td>
                      {/* {console.log(sortedData)} */}
                      <input
                        type="checkbox"
                        className="Checkbox"
                        onChange={() => toggleRowSelection(user._id)}
                        checked={selectedRows.includes(user._id)}
                      />
                    </td>
                    <td>{user.dish}</td>
                    <td>{user.address}</td>
                    <td>{user.somedata}</td>
                    <td>{parseFloat(user.price).toLocaleString()}</td>
                    <td>{user.rating}</td>
                    {/* <td>{user.quty}</td> */}
                    <td>
                      <span>
                        {user.imgdata && (
                          <>
                            <div className="">
                              <img
                                src={`http://localhost:2000/${user.imgdata}`}
                                className="Img"
                                alt=""
                              />
                            </div>
                          </>
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
              <h5 className="modal-title">Product Data</h5>
              <div>
                <CCloseButton onClick={closeModal} />
              </div>
            </div>
            <div className="modal-body">
              {/* Create Account Form */}
              <form>
                <div className="mb-3">
                  <div>
                    <label htmlFor="dish" className="form-label">
                      Dish Name
                    </label>
                    <input
                      type="text"
                      maxLength="30"
                      className="form-control input-bgColor"
                      name="dish"
                      placeholder="Enter Dish Name"
                      value={productData.dish}
                      onChange={handleInputChange}
                    />
                    {validationErrors.dish && (
                      <p className="text-danger">{validationErrors.dish}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="imgdata" className="form-label">
                      Add Image
                    </label>

                    <input
                      type="file"
                      className="form-control input-bgColor"
                      name="imgdata"
                      // value={clientData.imgdata}
                      onChange={handleInputChange}
                    />
                    {validationErrors.imgdata && (
                      <p className="text-danger">{validationErrors.imgdata}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="address" className="form-label">
                      Address
                    </label>
                    <input
                      type="text"
                      maxLength="30"
                      className="form-control input-bgColor"
                      name="address"
                      placeholder="Enter Address"
                      value={productData.address}
                      onChange={handleInputChange}
                    />
                    {validationErrors.address && (
                      <p className="text-danger">{validationErrors.address}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="somedata" className="form-label">
                      Some data
                    </label>
                    <input
                      type="text"
                      maxLength="40"
                      className="form-control input-bgColor"
                      name="somedata"
                      placeholder="Enter Some data"
                      value={productData.somedata}
                      onChange={handleInputChange}
                    />
                    {validationErrors.somedata && (
                      <p className="text-danger">{validationErrors.somedata}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="price" className="form-label">
                      Price
                    </label>
                    <input
                      type="number"
                      name="price"
                      className="form-control input-bgColor"
                      id="price"
                      placeholder="Enter Price"
                      value={productData.price}
                      onChange={handleInputChange}
                      required
                    />
                    {validationErrors.price && (
                      <p className="text-danger">{validationErrors.price}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="rating" className="form-label">
                      Rating
                    </label>
                    <input
                      type="number"
                      name="rating"
                      className="form-control input-bgColor"
                      placeholder="Enter Ratting"
                      id="rating"
                      value={productData.rating}
                      onChange={handleInputChange}
                      required
                    />
                    {validationErrors.rating && (
                      <p className="text-danger">{validationErrors.rating}</p>
                    )}
                  </div>
                  {/* <div>
                    <label htmlFor="quty" className="form-label">
                      Quantity
                    </label>
                    <input
                      type="number"
                      name="quty"
                      className="form-control input-bgColor"
                      placeholder="Enter Quantity"
                      id="quty"
                      value={productData.quty}
                      onChange={handleInputChange}
                      required
                    />
                    {validationErrors.quty && (
                      <p className="text-danger">{validationErrors.quty}</p>
                    )}
                  </div> */}
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
                onClick={handleAddProduct}
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
                <h5 className="text-center">Update Product</h5>
              </div>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <div>
                    <label htmlFor="rowDish" className="form-label">
                      Dish Name
                    </label>

                    <input
                      type="text"
                      className="form-control input-bgColor"
                      maxLength="30"
                      value={editedData.rowDish}
                      onChange={(e) => rowHandleInputChange(e, "rowDish")}
                    />
                    {rowValidationErrors.rowDish && (
                      <p className="text-danger">
                        {rowValidationErrors.rowDish}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="imgdata" className="form-label">
                      Update Bill
                    </label>

                    <input
                      className="form-control input-bgColor"
                      type="file"
                      name="imgdata"
                      onChange={(e) => {
                        rowHandleInputChange(e, "imgdata");
                      }}
                    />

                    {showFileInput && rowValidationErrors.imgdata && (
                      <p className="text-danger">
                        {rowValidationErrors.imgdata}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="rowAddress" className="form-label">
                      Address
                    </label>

                    <input
                      type="text"
                      className="form-control input-bgColor"
                      maxLength="30"
                      value={editedData.rowAddress}
                      onChange={(e) => rowHandleInputChange(e, "rowAddress")}
                    />
                    {rowValidationErrors.rowAddress && (
                      <p className="text-danger">
                        {rowValidationErrors.rowAddress}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="rowSomedata" className="form-label">
                      Some Data
                    </label>

                    <input
                      type="text"
                      className="form-control input-bgColor"
                      maxLength="30"
                      value={editedData.rowSomedata}
                      onChange={(e) => rowHandleInputChange(e, "rowSomedata")}
                    />
                    {rowValidationErrors.rowSomedata && (
                      <p className="text-danger">
                        {rowValidationErrors.rowSomedata}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="rowPrice" className="form-label">
                      Price
                    </label>
                    <input
                      type="number"
                      name="rowPrice"
                      className="form-control input-bgColor"
                      id="rowPrice"
                      value={editedData.rowPrice}
                      onChange={(e) => rowHandleInputChange(e, "rowPrice")}
                    />
                    {rowValidationErrors.rowPrice && (
                      <p className="text-danger">
                        {rowValidationErrors.rowPrice}
                      </p>
                    )}
                  </div>
                  {/* <div>
                    <label htmlFor="rowRating" className="form-label">
                      Rating
                    </label>
                    <input
                      type="number"
                      name="rowRating"
                      className="form-control input-bgColor"
                      id="rowRating"
                      value={editedData.rowRating}
                      onChange={(e) => rowHandleInputChange(e, "rowRating")}
                    />
                    {rowValidationErrors.rowRating && (
                      <p className="text-danger">
                        {rowValidationErrors.rowRating}
                      </p>
                    )}
                  </div> */}
                  <div>
                    <label htmlFor="rowQuty" className="form-label">
                      Quantity
                    </label>
                    <input
                      type="number"
                      name="rowQuty"
                      className="form-control input-bgColor"
                      id="rowQuty"
                      value={editedData.rowQuty}
                      onChange={(e) => rowHandleInputChange(e, "rowQuty")}
                    />
                    {rowValidationErrors.rowQuty && (
                      <p className="text-danger">
                        {rowValidationErrors.rowQuty}
                      </p>
                    )}
                  </div>
                </div>
              </form>
              <>
                <button
                  className="btn btn-success"
                  onClick={() => handleUpdateProduct()}
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

export default Product;
