import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiLogIn, FiLogOut, FiShoppingCart, FiSun, FiMoon } from "react-icons/fi";

const Navbar = ({ theme = "light", onToggleTheme }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-surface">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <span className="brand-badge">SHOP</span>
          ease
        </Link>
        <div className="d-flex align-items-center gap-2 d-lg-none">
          <button
            type="button"
            className="theme-toggle"
            onClick={onToggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "light" ? <FiMoon /> : <FiSun />}
          </button>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
        </div>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-lg-center">
            {/* <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li> */}
            <li className="nav-item">
              <Link className="nav-link" to="/cart">
                <FiShoppingCart className="me-1" />
                Cart
              </Link>
            </li>
            {isLoggedIn && (
              <li className="nav-item">
                <Link className="nav-link" to="/add_product">
                  Add Product
                </Link>
              </li>
            )}
          </ul>
          <div className="navbar-actions ms-lg-4">
            <button
              type="button"
              className="theme-toggle d-none d-lg-flex"
              onClick={onToggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "light" ? <FiMoon /> : <FiSun />}
            </button>
            {isLoggedIn ? (
              <button
                className="nav-btn nav-btn--ghost"
                onClick={handleLogout}
              >
                <FiLogOut className="me-2" /> Logout
              </button>
            ) : (
              <Link className="nav-btn nav-btn--primary" to="/login">
                <FiLogIn className="me-2" /> Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
