import React, { useState, useCallback, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Link, useNavigate } from "react-router-dom";
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilLockLocked, cilUser } from "@coreui/icons";
import axios from "axios";

const Login = () => {
  useEffect(() => {
    const registrationSuccess = localStorage.getItem("registrationSuccess");

    if (registrationSuccess) {
      toast.success("Registration successful", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
      });
      localStorage.removeItem("registrationSuccess");
    }
  }, []);

  useEffect(() => {
    window.addEventListener("popstate", (e) => {
      window.history.go(0);
    });
    // console.log(localStorage.getItem("token"));
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, [localStorage]);

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const getAuth = useCallback(
    async (dataa) => {
      try {
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}auth/login`,
          dataa,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const { token } = res.data;

        // Set the token in local storage
        localStorage.setItem("token", token);
        localStorage.setItem("LoginSuccess", "true");
        navigate("/");

        // Set a timer to remove the token after 1 hour (3600 seconds)
        setTimeout(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("LoginSuccess");
          // You might want to redirect the user to the login page or take some other action
          navigate("/login");
        }, 5 * 60 * 60 * 1000); // 1 hour in milliseconds
      } catch (error) {
        toast.error("Please Enter valid data", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 1000,
        });
        console.log(error);
      }
    },
    [navigate]
  );

  // const getAuth = useCallback(async (dataa) => {
  //   const result = await axios(`${process.env.REACT_APP_API_URL}auth/login`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     data: dataa,
  //   })
  //     .then((res) => {
  //       localStorage.setItem("token", res.data.token);
  //       localStorage.setItem("LoginSuccess", "true");
  //       navigate("/");
  //       setTimeout(() => {
  //         localStorage.removeItem("token");
  //         localStorage.removeItem("LoginSuccess");
  //         // You might want to redirect the user to the login page or take some other action
  //         navigate("/login");
  //       }, 3600000); // 1 hour in milliseconds
  //     })
  //     .catch((error) => {
  //       toast.error("Please Enter valid data", {
  //         position: toast.POSITION.TOP_CENTER,
  //         autoClose: 3000,
  //       });
  //       console.log(error);
  //     });
  //   // console.log(result);

  //   if (result?.data && result?.data.token) {
  //   }
  // }, []);

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>Login</h1>
                    <p className="text-medium-emphasis">
                      Sign In to your account
                    </p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Email"
                        autoComplete="email"
                        onChange={(val) => {
                          setData({ ...data, email: val.target.value });
                        }}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        onChange={(val) => {
                          setData({ ...data, password: val.target.value });
                        }}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton
                          color="primary"
                          className="px-4"
                          onClick={() => getAuth(data)}
                        >
                          Login
                        </CButton>
                      </CCol>
                      {/* <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol> */}
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard
                className="text-white bg-primary py-5"
                style={{ width: "44%" }}
              >
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua.
                    </p>
                    <Link to="/register">
                      <CButton
                        color="primary"
                        className="mt-3"
                        active
                        tabIndex={-1}
                      >
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
      <ToastContainer />
    </div>
  );
};

export default Login;
