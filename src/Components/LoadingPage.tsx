import React from "react";
import "./LoadingPage.css";
import football from "../assets/football.png"; // ✅ Your football image

const LoadingPage: React.FC = () => {
  return (
    <div className="loader-container">
      <img src={football} alt="Loading football" className="loading-image" />
      <p>Loading...</p>
    </div>
  );
};

export default LoadingPage;
