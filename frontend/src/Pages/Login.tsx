import { useEffect, useState } from "react";
import { Input } from "../Components/Input/Input";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { login } from "../Redux/token/tokenSlice";
import { post } from "../utils/requests/post";
import { get } from "../utils/requests/get";
import { addUser } from "../Redux/user/userSlice";
import { Button } from "../Components/Button/Button";
import { ToastContainer, toast } from "react-toastify";
import { socket } from "../socket";
import { Loader } from "../Components/Loader/Loader";

export const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
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
      setLoading(false);
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

        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      toast.error(`${error}`);
      return;
    }
  };

  const checkValidForm = () => {
    return email.length > 0 && password.length > 0;
  };

  useEffect(() => {
    document.title = "Hackmapa - Login";
  }, []);

  return (
    <div className="flex flex-col h-screen sm:flex-row justify-center items-center bg-login bg-no-repeat bg-cover">
      <div className="flex flex-col w-1/5 h-4/5 bg-darkBlue-dark">
        <div className="flex flex-col flex-grow py-10 m-3 overflow-auto rounded-3xl">
          <div className="flex-grow">
            <div className="flex justify-center">
              <img
                src={`${process.env.REACT_APP_PUBLIC_URL}/logo.svg`}
                alt="logo_hackmapa"
                className="h-44"
              />
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
              <>
                {loading ? (
                  <div className="flex justify-center mt-4">
                    <Loader />
                  </div>
                ) : (
                  <Button
                    className={
                      "mt-4 " +
                      (checkValidForm()
                        ? "bg-primary hover:bg-primary-dark border-primary transition duration-100 ease-in-out"
                        : "bg-primary-light border-primary-light")
                    }
                    disabled={!checkValidForm() || loading}
                    text="Login"
                    onClick={handleSubmit}
                  />
                )}
              </>
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
