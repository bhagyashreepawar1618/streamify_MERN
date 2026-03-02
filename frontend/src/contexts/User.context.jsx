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
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/users/another-user/${username}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
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
