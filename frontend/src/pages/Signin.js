import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useMutation, useSubscription } from "@apollo/client";
import { setUserId } from "./../state/UserStates.js";
import { LOGIN } from "../queries/User";
import { DOCUMENT_CHANGED_SUBSCRIPTION } from "../queries/Document.js";
import { useCookies } from "react-cookie"; // Import the useCookies hook

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loginMutation] = useMutation(LOGIN);

  const userId = useSelector((state) => state.auth.userId);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [cookies, setCookie] = useCookies(["authToken"]); // Initialize the useCookies hook

  const { data: documentData } = useSubscription(
    DOCUMENT_CHANGED_SUBSCRIPTION,
    {
      variables: { userId: userId },
      skip: !userId,
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await loginMutation({
        variables: {
          email: email,
          password: password,
        },
      });
      dispatch(setUserId(data.login.userId));

      navigate("/home");
      console.log(data);

      // Use setCookie from the useCookies hook to set the cookie
      setCookie("authToken", data.login.token, { path: "/", maxAge: 86400 });
      console.log(cookies.authToken); // Access the cookie value from the cookies object
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="rounded-lg  p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Welcome Back</h1>

        <form
          className="w-full max-w-sm mx-auto"
          onSubmit={() => handleSubmit()}
        >
          <div className="mb-4">
            <input
              className="appearance-none border rounded w-full py-2 px-3 bg-transparent border-0 leading-tight focus:outline-none focus:border-b-0"
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <input
              className="appearance-none border rounded w-full py-2 px-3 bg-transparent border-0 leading-tight focus:outline-none focus:border-b-0"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex flex-col space-y-4 items-center justify-center">
            <button onClick={handleSubmit}>Log in</button>
            <div className="registration__form-separator">
              <span className="registration__form-separator-text">
                <div className="p-3 text-slate-500">or</div>
              </span>
            </div>
            <button
              className="flex items-center border border-transparent bg-white text-black font-bold py-2 px-4 rounded-md drop-shadow-lg hover:bg-slate-100 hover:border hover:filter-none focus:outline-none focus:shadow-outline"
              type="submit"
            >
              <img
                src="https://firebasestorage.googleapis.com/v0/b/graph-networking-app.appspot.com/o/utility%2Fgoogle-icon.svg?alt=media&token=3cf598dd-2cc5-4c83-be58-5e58196b1245"
                alt=""
                style={{
                  maxWidth: "20px",
                  paddingRight: "5px",
                }}
              />
              Google
            </button>
          </div>
          <div className="flex items-center justify-center mt-4">
            <button
              className="text-blue-500 hover:text-blue-700 text-sm font-semibold focus:outline-none"
              type="button"
            >
              Don't have an account? Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signin;
