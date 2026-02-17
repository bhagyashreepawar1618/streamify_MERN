import { Outlet } from "react-router-dom";
import ProfileHeader from "./ProfileHeader.jsx";
function ProfileLayout() {
  return (
    <>
      <ProfileHeader />
      <Outlet />
    </>
  );
}

export default ProfileLayout;
