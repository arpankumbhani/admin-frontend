import React, { useEffect } from "react";
import { AppSidebar, AppHeader } from "../components/index";
import { useNavigate } from "react-router-dom";

const DefaultLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      window.addEventListener("popstate", (e) => {
        window.history.go(0);
      });
      navigate("/login");
    } else {
      navigate("/");
    }
  }, [localStorage]);

  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AppHeader />
        {/* <div className="body flex-grow-1 px-3">
          <AppContent />
        </div>
        <AppFooter /> */}
      </div>
    </div>
  );
};

export default DefaultLayout;