import { useContext } from "react";
import { UserContext } from "../UserContext";

const Profile = () => {

  const { user, setUser } = useContext(UserContext)
  return (
    <div className="medium-container">
      <div className="section bg-light-grey">
        <h1>Profiel</h1>
        <label>Naam:</label>
        <p>{user.fullName} </p>
        <label>Email:</label>
        <p>{user.email}</p>
      </div>

    </div>

  );
};

export default Profile;