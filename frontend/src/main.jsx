import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/main/Layout.jsx";
import Home from "./components/main/Home.jsx";
import Login from "./components/main/Login.jsx";
import Register from "./components/main/Register.jsx";
import ProfileHome from "./components/profile/ProfileHome.jsx";
import ProfileLayout from "./components/profile/Profile.layout.jsx";
import { UserProvider } from "./contexts/User.context.jsx";
import UpdateProfile from "./components/profile/UpdateProfile.jsx";
import WatchHistory from "./components/profile/WatchHistory.jsx";
import ChangePassword from "./components/profile/ChangePassword.jsx";
import UploadVideo from "./components/videos/UploadVideo.jsx";
import AnotherUserProfile from "./components/anotheruser/AnotherUserProfile.jsx";

const route = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "another-user-profile",
        element: <AnotherUserProfile />,
      },
      {
        path: "profile",
        element: <ProfileLayout />,
        children: [
          {
            index: true,
            element: <ProfileHome />,
          },
          {
            path: "update-profile",
            element: <UpdateProfile />,
          },
          {
            path: "watch-history",
            element: <WatchHistory />,
          },
          {
            path: "change-password",
            element: <ChangePassword />,
          },
          {
            path: "upload-video",
            element: <UploadVideo />,
          },
        ],
      },
    ],
  },
]);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <RouterProvider router={route} />
    </UserProvider>
  </StrictMode>
);
