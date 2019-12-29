import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.scss";

const Navbar = props => {
  const handleSearch = e => {
    e.preventDefault();
  };
  return (
    <nav
      className="navbar navbar-fixed navbar-expand-lg navbar-dark bg-dark sticky"
      data-spy="affix"
      data-offset-top="197"
    >
      <a className="navbar-brand" href="#">
        Street<strong>Hack</strong>
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">
          <li
            className={
              props.active == "challenges" ? "nav-item active" : "nav-tem"
            }
          >
            <Link className="nav-link" to="/dashboard">
              Challenges <span className="sr-only">(current)</span>
            </Link>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              Blog
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              Forum
            </a>
          </li>
          <li className="nav-item dropdown">
            <a
              className="nav-link"
              href="#"
              id="navbarDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Recruiters
            </a>
            <div
              className="dropdown-menu nav-item"
              aria-labelledby="navbarDropdown"
            >
              <a className="dropdown-item nav-link" href="#">
                Universities
              </a>
              <a className="dropdown-item nav-link" href="#">
                Companies
              </a>
            </div>
          </li>
        </ul>
        <form className="form-inline mr-auto" onSubmit={handleSearch}>
          <div className="input-group input-group-sm">
            <input
              className="form-control "
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <div className="input-group-append">
              <span className="input-group-text" id="searchButton">
                <i className="fas fa-search" />
              </span>
            </div>
          </div>
        </form>
        <ul className="navbar-nav ml-auto mr-0">
          {props.user.name ? (
            <li className="nav-item dropdown user-dropdown pd-3">
              <a
                className="nav-link active"
                href="#"
                id="userDropdown"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                {props.user && props.user.name ? (
                  <span>
                    <i className="fas fa-user" />
                    &nbsp;&nbsp;
                    {props.user.name}
                  </span>
                ) : (
                  <i className="fas fa-cog fa-spin" />
                )}
              </a>
              <div
                className="dropdown-menu user-dropdown-menu nav-item"
                aria-labelledby="navbarDropdown"
              >
                <Link
                  className="dropdown-item user-dropdown-item nav-link"
                  to={`/profile/${props.user._id}`}
                >
                  Profile
                </Link>
                <a
                  className="dropdown-item user-dropdown-item nav-link"
                  onClick={() => {
                    localStorage.clear();
                    window.location.href = "/api/users/logout";
                  }}
                >
                  Logout
                </a>
              </div>
            </li>
          ) : (
            <React.Fragment>
              <li className="nav-item mr-2">
                <a href="/login" className="nav-link">
                  Login
                </a>
              </li>
              <li className="nav-item mr-2">
                <a href="/register" className="btn btn-light">
                  Register
                </a>
              </li>
            </React.Fragment>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
