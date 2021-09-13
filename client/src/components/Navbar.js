import React, { useContext, useRef, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../App";
import M from "materialize-css";
const NavBar = () => {
  const searchModal = useRef(null);
  const [search, setSearch] = useState("");
  const [userDetails, setUserDetails] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  useEffect(() => {
    M.Modal.init(searchModal.current);
  }, []);
  const renderList = () => {
    if (state) {
      return [
        <li key="1">
          <div className="srch" ref={searchModal}>
            <input
              type="text"
              placeholder="Search blog"
              value={search}
              onChange={(e) => fetchUsers(e.target.value)}
            />
            <ul className="collection">
              {userDetails.map((item) => {
                return (
                  <Link
                    to={
                      item._id !== state._id
                        ? "/profile/" + item._id
                        : "/profile"
                    }
                    onClick={() => {
                      setSearch("");
                    }}
                  >
                    <li className="collection-item">{item.email}</li>
                  </Link>
                );
              })}
            </ul>
            <button
              className="modal-close waves-effect waves-green btn-flat"
              onClick={() => setUserDetails([])}
            >
              Clear
            </button>
          </div>
        </li>,
        <li key="2">
          <Link to="/">Home</Link>
        </li>,

        <li key="3">
          <Link to="/myBlogs">My Blogs</Link>
        </li>,
        <li key="4">
          <Link to="/myfollowingpost">My Followings</Link>
        </li>,

        <li key="5" className="prfl">
          <Link to="/profile">
            {state ? (
              <img className="pfl_pic" src={state.pic}></img>
            ) : (
              <img className="pfl_pic"></img>
            )}

            <span className="profile">My Profile</span>
          </Link>
          <div className="menudropdn">
            <ul>
              <li>
                <Link to="/">Setting</Link>
              </li>
              <li>
                <Link to="/reset">Change password</Link>
              </li>
              <li>
                <a
                  onClick={() => {
                    localStorage.clear();
                    dispatch({ type: "CLEAR" });
                    history.push("/signin");
                  }}
                >
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </li>,
      ];
    } else {
      return [
        <li key="6">
          <Link to="/signin">Signin</Link>
        </li>,
        <li key="7">
          <Link to="/signup">Signup</Link>
        </li>,
      ];
    }
  };

  const fetchUsers = (query) => {
    setSearch(query);
    fetch("/search-users", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
      }),
    })
      .then((res) => res.json())
      .then((results) => {
        setUserDetails(results.user);
      });
  };
  return (
    <header className="mainheader">
      <div className="logo">
        <Link to={state ? "/" : "/signin"} className="brand-logo left">
          My Blog
        </Link>
      </div>

      <div className="rightpnl">
        <ul>{renderList()}</ul>
      </div>
    </header>
  );
};

export default NavBar;
