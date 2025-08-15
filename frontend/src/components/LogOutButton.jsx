import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { clearUserId } from "../state/UserStates";

const LogOutButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [cookies, setCookie, removeCookie] = useCookies(["authToken"]);
  const logout = () => {
    removeCookie("authToken");
    dispatch(clearUserId());
    navigate("/");
  };
  return (
    <div className="bg-gray-800 p-4 flex items-center justify-between">
      <div className="text-white">CollabDoc</div>
      <button
        className="text-white px-4 py-2 border rounded hover:bg-gray-700"
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
};

export default LogOutButton;
