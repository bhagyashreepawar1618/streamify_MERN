import { useContext, useState, createContext } from "react";
import axios from "axios";
//create context here
const UserContext = createContext();
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [anotherUserDetails, setAnotherUserDeatils] = useState(null);
  const token = localStorage.getItem("accessToken");

  //get user profile
  const getAnotherUserDetails = async (username) => {
    console.log(username);
    console.log("tokennn=", token);

    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/users/another-user/${username}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("response from backend is =", response.data.data);
    console.log("id of user=", response.data.data._id);

    console.log("username=", response.data.data.username);
    const details = {
      fullname: response.data.data.fullname,
      avtar: response.data.data.avtar,
      coverImage: response.data.data.coverImage,
      username: response.data.data.username,
      email: response.data.data.email,
      subscribers: response.data.data.subscribersCount,
      following: response.data.data.channelsSubscribedToCount,
      _id: response.data.data._id,
      isSubscribed: response.data.data.isSubscribed,
    };

    console.log("details=", details);
    setAnotherUserDeatils(details);
  };
  const value = {
    user,
    setUser,
    anotherUserDetails,
    setAnotherUserDeatils,
    getAnotherUserDetails,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

//create hook
export const useUser = () => {
  return useContext(UserContext);
};
