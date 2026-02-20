import { useContext, useState, createContext } from "react";

//create context here
const UserContext = createContext();
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [anotherUserDetails, setAnotherUserDeatils] = useState(null);
  const value = {
    user,
    setUser,
    anotherUserDetails,
    setAnotherUserDeatils,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

//create hook
export const useUser = () => {
  return useContext(UserContext);
};
