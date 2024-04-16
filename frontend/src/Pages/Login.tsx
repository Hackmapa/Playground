import { useState } from "react";
import { Input } from "../Components/Input/Input";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../hooks/hooks";
import { login } from "../Redux/token/tokenSlice";
import { post } from "../utils/requests/post";
import { get } from "../utils/requests/get";
import { addUser } from "../Redux/user/userSlice";
import { Button } from "../Components/Button/Button";
import { ToastContainer, toast } from "react-toastify";
import { socket } from "../socket";

export const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    let token = "";
    try {
      const loginData = await post(
        "login",
        JSON.stringify({ email, password })
      );
      token = loginData.token;

      if (!token) {
        const error = loginData;
        throw new Error(error.message);
      }

      dispatch(login(token));
    } catch (error) {
      toast.error(`${error}`);
      return;
    }

    try {
      const response = await get("users/me", token);
      const user = response;

      if (response.code === 401) {
        throw new Error("User Fetch Error");
      }

      dispatch(addUser(user));

      if (user.email.length > 0) {
        toast.success("Login successful!");

        socket.connect();
        socket.emit("login", user);

        navigate("/");
      }
    } catch (error) {
      toast.error(`${error}`);
      return;
    }
  };

  const checkValidForm = () => {
    return email.length > 0 && password.length > 0;
  };

  return (
    <div className="flex flex-col h-screen sm:flex-row justify-center items-center bg-login bg-no-repeat bg-cover">
      <div className="flex flex-col w-1/5 h-4/5 bg-darkBlue">
        <div className="flex flex-col flex-grow py-10 m-3 overflow-auto rounded-3xl">
          <div className="flex-grow">
            <div className="flex justify-center">
              <img src="/logo.svg" alt="logo TrainrHub" className="h-44" />
            </div>
            <div className="block w-9/12 mx-auto max-xs:w-3/4 max-lg:w-5/12 max-md:w-6/12 max-sm:w-8/12 margin">
              <Input
                placeholder="Email"
                type="email"
                value={email}
                onChange={setEmail}
              />
              <Input
                placeholder="Password"
                type="password"
                value={password}
                onChange={setPassword}
              />
              <Button
                className={
                  "mt-4 " +
                  (checkValidForm()
                    ? "bg-primary hover:bg-primary-dark border-primary transition duration-100 ease-in-out"
                    : "bg-primary-light border-primary-light")
                }
                disabled={!checkValidForm()}
                text="Login"
                onClick={handleSubmit}
              />
            </div>
          </div>

          <div className="mt-4 flex items-center flex-col">
            <div className="flex items-center justify-between mt-4">
              <Link to="/recover" className="font-semibold text-primary ">
                Forgot password?
              </Link>
            </div>
            <p className="text-base text-center text-gray-500">
              No account ?{" "}
              <Link to="/register" className="font-semibold text-primary ">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};