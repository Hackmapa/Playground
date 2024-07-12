import { Input } from "../Components/Input/Input";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../Components/Button/Button";
import { User } from "../Interfaces/User";
import { login } from "../Redux/token/tokenSlice";
import { addUser } from "../Redux/user/userSlice";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { get } from "../utils/requests/get";
import { post } from "../utils/requests/post";
import { ToastContainer, toast } from "react-toastify";
import { socket } from "../socket";

export const Register = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const actualUser = useAppSelector((state) => state.user);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async () => {
    const body = {
      email,
      password,
      username,
      firstname,
      lastname,
    };

    try {
      const data = await post("register", JSON.stringify(body));

      if (data.email) {
        handleLogin(email, password);
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast.error(`${error}`);
      return;
    }
  };

  const handleLogin = async (email: string, password: string) => {
    const body = {
      email,
      password,
    };
    let token = "";

    try {
      const data = await post("login", JSON.stringify(body));

      if (data.token) {
        token = data.token;
        dispatch(login(data.token));
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast.error(`${error}`);
      return;
    }

    try {
      const user: User = await get("users/me", token);
      dispatch(addUser(user));

      if (actualUser.email.length > 0) {
        socket.connect();
        socket.emit("login", actualUser);

        navigate("/");
      } else {
        throw new Error("User Fetch Error");
      }
    } catch (error: any) {
      toast.error(`${error}`);
      return;
    }
  };

  const checkValidForm = () => {
    return (
      password.length > 0 &&
      confirmPassword.length > 0 &&
      email.length > 0 &&
      username.length > 0 &&
      firstname.length > 0 &&
      lastname.length > 0 &&
      password === confirmPassword
    );
  };

  useEffect(() => {
    document.title = "Hackmapa - Register";
  }, []);

  return (
    <div className="flex flex-col h-screen sm:flex-row justify-center items-center bg-login bg-no-repeat bg-cover">
      <div className="flex flex-col w-2/5 h-4/5 bg-darkBlue">
        <div className="flex flex-col flex-grow py-10 m-3 overflow-auto rounded-3xl">
          <div className="flex-grow">
            <div className="flex justify-center">
              <img src="/logo.svg" alt="logo TrainrHub" className="h-44" />
            </div>

            <div className="block w-9/12 mx-auto max-xs:w-3/4 max-lg:w-5/12 max-md:w-6/12 max-sm:w-8/12 margin">
              <div className="flex justify-between gap-3">
                <Input
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={setEmail}
                />
                <Input
                  placeholder="Username"
                  type="text"
                  value={username}
                  onChange={setUsername}
                />
              </div>

              <div className="flex justify-between gap-3">
                <Input
                  placeholder="Firstname"
                  type="text"
                  value={firstname}
                  onChange={setFirstname}
                />
                <Input
                  placeholder="Lastname"
                  type="text"
                  value={lastname}
                  onChange={setLastname}
                />
              </div>

              <div className="flex justify-between gap-3">
                <Input
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={setPassword}
                />
                <Input
                  placeholder="Confirm password"
                  type="password"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                />
              </div>

              <div>
                <Button
                  className={
                    "mt-4 " +
                    (checkValidForm()
                      ? "bg-primary hover:bg-primary-dark border-primary transition duration-100 ease-in-out"
                      : "bg-primary-light border-primary-light")
                  }
                  disabled={!checkValidForm()}
                  text="Register"
                  onClick={handleSubmit}
                />
              </div>
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
              <Link to="/login" className="font-semibold text-primary ">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};
