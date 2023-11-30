import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CFormSelect,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilLockLocked, cilUser, cilPhone, cilContact } from "@coreui/icons";

const isEmailValid = (email) => {
  // Regular expression for a basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(email);
};

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    repeatPassword: "",
    role: "",
  });

  const [validationErrors, setValidationErrors] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    repeatPassword: "",
    role: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Clear previous validation error
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleRegistration = useCallback(async () => {
    const errors = {};

    // Basic validation
    if (!formData.username) {
      errors.username = "Please enter a username.";
    }

    if (!formData.email) {
      errors.email = "Please enter an email address.";
    } else if (!isEmailValid(formData.email)) {
      errors.email = "Please enter a valid email address.";
    }
    if (!formData.phone) {
      errors.phone = "Please enter a phone number.";
    } else if (formData.phone.length > 10 || formData.phone.length < 10) {
      errors.phone = "Please enter a 10 digit ";
    }

    if (!formData.password) {
      errors.password = "Please enter a password.";
    }

    if (!formData.repeatPassword) {
      errors.repeatPassword = "Please repeat the password.";
    }

    // Password match validation
    if (formData.password !== formData.repeatPassword) {
      errors.repeatPassword = "Passwords do not match.";
    }
    if (!formData.role) {
      errors.role = "Please select a role.";
    }

    if (Object.keys(errors).length > 0) {
      // Update the validation errors
      setValidationErrors(errors);
      return;
    }

    // console.log(formData);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        toast.error("User already registered.", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000,
        });
        return;
      }

      // Registration successful, you can redirect or perform other actions
      toast.success("Registration successful", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
      });

      localStorage.setItem("registrationSuccess", "true");
      navigate("/login");
    } catch (error) {
      console.error("Error during registration:", error);
    }
  }, [formData, navigate]);

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm>
                  <h1>Register</h1>
                  {validationErrors.username && (
                    <p className="text-danger">{validationErrors.username}</p>
                  )}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      maxLength="15"
                      placeholder="Username"
                      autoComplete="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                    />
                  </CInputGroup>
                  {validationErrors.email && (
                    <p className="text-danger">{validationErrors.email}</p>
                  )}

                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput
                      type="email"
                      placeholder="Email"
                      autoComplete="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </CInputGroup>
                  {validationErrors.phone && (
                    <p className="text-danger">{validationErrors.phone}</p>
                  )}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilPhone} />
                    </CInputGroupText>
                    <CFormInput
                      maxLength="10"
                      type="number"
                      placeholder="Phone Number"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </CInputGroup>

                  {validationErrors.password && (
                    <p className="text-danger">{validationErrors.password}</p>
                  )}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Password"
                      autoComplete="new-password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                  </CInputGroup>
                  {validationErrors.repeatPassword && (
                    <p className="text-danger">
                      {validationErrors.repeatPassword}
                    </p>
                  )}
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Repeat password"
                      autoComplete="new-password"
                      name="repeatPassword"
                      value={formData.repeatPassword}
                      onChange={handleInputChange}
                    />
                  </CInputGroup>
                  {validationErrors.role && (
                    <p className="text-danger">{validationErrors.role}</p>
                  )}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilContact} />
                    </CInputGroupText>
                    <CFormSelect
                      name="role"
                      onChange={handleInputChange}
                      value={formData.selectedRole}
                    >
                      <option>--Please Select a Role--</option>
                      <option value="1">Admin</option>
                      <option value="2">Employee</option>
                      <option value="3">HR</option>
                    </CFormSelect>
                  </CInputGroup>
                  <div className="d-grid">
                    <CButton color="success" onClick={handleRegistration}>
                      Create Account
                    </CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
      <ToastContainer />
    </div>
  );
};

export default Register;
