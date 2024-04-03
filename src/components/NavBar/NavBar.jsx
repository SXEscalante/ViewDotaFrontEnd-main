import React from "react";
import { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

import "./NavBar.css";
import AuthContext from "../../context/AuthContext";
import NavBarDropdown from "../NavBarDropdown/NavBarDropdown";

const Navbar = () => {
  const { logoutUser, user } = useContext(AuthContext);
  const [username] = useAuth();
  const navigate = useNavigate();

  return (
    <div className="navBar">
      <ul>
        <li className="brand">
          <Link to="/" style={{ textDecoration: "none", color: "#f6d0d1" }}>
            <b>ViewDota</b>
          </Link>
        </li>
        <li>
          {user ? (
            <NavBarDropdown username={username} logoutUser={logoutUser} />
          ) : (
            <button onClick={() => navigate("/login")}>Login</button>
          )}
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
