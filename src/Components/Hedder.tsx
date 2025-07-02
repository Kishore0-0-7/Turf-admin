import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

import "./Hedder.css";
import EditIcon from "../assets/Edit.svg";
import Login from "../assets/loginicon.svg";
import logo from "../assets/logo.png";

function Hedder() {
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  
const [dropdownVisible, setDropdownVisible] = useState(false);
const [isEditing, setIsEditing] = useState(false);
const location = useLocation();
const [username, setUsername] = useState(() => {
  return location.state?.username || "User001";
});
const [nameInput, setNameInput] = useState(username);

const toggleDropdown = () => {
  setDropdownVisible((prev) => !prev);
  setIsEditing(false);
};
const handleSave = () => {
  if (nameInput.trim()) {
    setUsername(nameInput.trim());
  }
  setIsEditing(false);
};



  const handleLogout = () => {
    console.log("Logged out");
    setDropdownVisible(false);
    navigate("/login");
  };

 

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownVisible(false);
        setIsEditing(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="nav">
      <img src={logo} alt="Logo" className="logo" />

      <div className="profile-section" ref={dropdownRef}>
        <div className="avatar-circle large" onClick={toggleDropdown}>
          {username?.charAt(0).toUpperCase()}
        </div>

        {dropdownVisible && (
          <div className="dropdown-menu">
            <div className="dropdown-header">
              <div className="avatar-circle">{username.charAt(0)}</div>

              {isEditing ? (
                <div className="edit-name-section">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSave()}
                    className="edit-name-input"
                  />
                  <img
                    src={EditIcon}
                    alt="Save"
                    className="edit-icon"
                    onClick={handleSave}
                    title="Save"
                  />
                </div>
              ) : (
                <div className="name-display">
                  {username}
                  <img
                    src={EditIcon}
                    alt="Edit"
                    className="edit-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditing(true);
                      setNameInput(username);
                    }}
                    title="Edit name"
                  />
                </div>
              )}
            </div>

            <hr className="divider" />

            <div className="logout-btn" onClick={handleLogout}>
              <img src={Login} alt="Logout" className="logout-icon" />
              Log out
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Hedder;
