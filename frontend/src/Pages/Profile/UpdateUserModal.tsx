import { useState } from "react";
import { User } from "../../Interfaces/User";
import { Input } from "../../Components/Input/Input";
import { post } from "../../utils/requests/post";
import { put } from "../../utils/requests/put";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { addUser } from "../../Redux/user/userSlice";
import { toast } from "react-toastify";

interface UpdateUserModalProps {
  user: User;
}

export const UpdateUserModal = (props: UpdateUserModalProps) => {
  const { user } = props;

  const token = useAppSelector((state) => state.token);

  const dispatch = useAppDispatch();

  const [username, setUsername] = useState(user.username);
  const [firstname, setFirstName] = useState(user.firstname);
  const [lastname, setLastName] = useState(user.lastname);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const handleUpdateUser = async () => {
    const body = {
      username,
      firstname,
      lastname,
      email,
      password: "",
    };

    if (password.length > 0) {
      if (password !== passwordConfirmation) {
        toast.error("Passwords don't match");
        return;
      }

      body.password = password;
    }

    const response = await put(`users/${user.id}`, JSON.stringify(body), token);

    dispatch(addUser(response));

    if (response.id) {
      toast.success("User updated");
    }
  };

  return (
    <div className="">
      <h2 className="font-bold text-3xl">Update user modal</h2>

      <div className="flex gap-4">
        <Input
          type="text"
          placeholder="Pseudo"
          value={username}
          onChange={(e) => setUsername(e)}
        />

        <Input
          type="text"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e)}
        />
      </div>

      <div className="flex gap-4">
        <Input
          type="text"
          placeholder="Prénom"
          value={firstname}
          onChange={(e) => setFirstName(e)}
        />

        <Input
          type="text"
          placeholder="Nom"
          value={lastname}
          onChange={(e) => setLastName(e)}
        />
      </div>

      <div className="flex gap-4">
        <Input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e)}
        />

        <Input
          type="password"
          placeholder="Confirmation mot de passe"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e)}
        />
      </div>

      <button
        className="bg-darkBlue-gray text-white py-2 px-4 rounded-3xl mt-8 hover:bg-darkBlue hover:text-white transition duration-200"
        onClick={handleUpdateUser}
      >
        Enregistrer
      </button>
    </div>
  );
};
