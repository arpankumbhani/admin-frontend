import React, { useEffect } from "react";
import { AppSidebar, AppHeader, AppContent } from "../components/index";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DefaultLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      window.addEventListener("popstate", (e) => {
        window.history.go(0);
      });
      navigate("/login");
    } else {
      // navigate("/");
      if (localStorage.getItem("LoginSuccess")) {
        toast.success("Login successful", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000,
        });
        localStorage.removeItem("LoginSuccess");
      }
    }
  }, [localStorage]);

  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AppHeader />
        <div className="body flex-grow-1 px-3">
          <AppContent />
        </div>
        {/* <AppFooter /> */}
      </div>
      <ToastContainer />
    </div>
  );
};

export default DefaultLayout;
