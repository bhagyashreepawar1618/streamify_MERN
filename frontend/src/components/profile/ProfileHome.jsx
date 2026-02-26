import axios from "axios";
import { useUser } from "../../contexts/User.context.jsx";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
const Profile = () => {
  //we've set data into user after login
  const { user } = useUser();
  const token = localStorage.getItem("accessToken");
  const [selectedVideo, setselectedVideo] = useState();
  const [uservideos, setUserVideos] = useState([]);

  const deletevideo = async (videoToBedeleted) => {
    //backend api call
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/videos/delete-video/${videoToBedeleted}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("video deleted successfully");
      setUserVideos((prev) =>
        prev.filter((video) => video._id !== videoToBedeleted)
      );
    } catch (e) {
      console.log("Error Occured while deleting Video..", e);
    }
  };

  useEffect(() => {
    //backend call

    const getuservideos = async () => {
      console.log("response of user=", user);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/videos/get-user-videos`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserVideos(response.data.data);
        console.log("data=", response.data.data);
      } catch (e) {
        console.log("Error occured while getting user videos", e);
      }
    };

    getuservideos();
  }, [user]);

  const handleLogout = async () => {
    //backend call
    await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/users/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("User has been log out successfully..!!");
  };

  //if user is not logged in
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
        <div className="bg-[#121212] border border-red-900/40 rounded-2xl p-10 text-center shadow-xl max-w-md w-full">
          <h2 className="text-3xl font-bold text-red-600 mb-4">
            Access Denied
          </h2>

          <p className="text-gray-400 mb-6">
            Please login first to view your profile.
          </p>

          <Link
            to="/login"
            className="inline-block px-6 py-3 bg-red-700 hover:bg-red-800 transition rounded-lg font-semibold"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  //if user is looged in
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Cover Section */}
      <div className="relative w-full h-64 md:h-80">
        <img
          src={user.coverImage}
          alt="cover"
          className="w-full h-full object-cover opacity-80"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black"></div>

        {/* Profile Image */}
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
          <img
            src={user.avtar}
            alt="avatar"
            className="w-32 h-32 rounded-full border-4 border-red-600 object-cover shadow-xl"
          />
        </div>
      </div>

      {/* User Info Section */}
      <div className="mt-20 text-center px-4">
        <h2 className="text-3xl font-bold text-red-600">{user.fullname}</h2>

        <p className="text-gray-400 mt-2">@{user.username}</p>

        <p className="text-gray-500 mt-1">{user.email}</p>

        {/* Stats Section (optional YouTube vibe) */}
        <div className="flex justify-center gap-10 mt-8">
          <div className="text-center">
            <p className="text-xl font-semibold text-white">
              {uservideos.length}
            </p>
            <p className="text-gray-400 text-sm">Videos</p>
          </div>

          <div className="text-center">
            <p className="text-xl font-semibold text-white">
              {user.subscribers || 0}
            </p>
            <p className="text-gray-400 text-sm">Subscribers</p>
          </div>

          <div className="text-center">
            <p className="text-xl font-semibold text-white">
              {user.following || 0}
            </p>
            <p className="text-gray-400 text-sm">Following</p>
          </div>
        </div>
      </div>

      {/* video upload button  */}
      <div className="flex justify-center gap-2">
        <Link to="upload-video">
          <button
            className="px-5 py-2 bg-red-700 hover:bg-red-800 
                    rounded-lg font-semibold text-white cursor-pointer mt-2"
          >
            Upload videos
          </button>
        </Link>
      </div>

      {/* user videos */}
      <div className="max-w-6xl mx-auto mt-12 px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {uservideos.map((video) => (
          <div key={video._id} className="bg-[#121212] p-4 rounded-xl">
            <img
              src={video.thumbnail}
              alt="thumbnail"
              className="w-full h-40 object-cover rounded-lg"
              onClick={() => {
                setselectedVideo(video.videoFile);
              }}
            />
            <div className="flex items-center justify-between mt-3">
              <h3 className="mt-3 text-white font-semibold">{video.title}</h3>
              <button
                className="px-5 py-2 bg-red-700 hover:bg-red-800 
                    rounded-lg font-semibold text-white cursor-pointer"
                onClick={() => {
                  deletevideo(video._id);
                }}
              >
                Delete Video
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* conditional rendering..  */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-5xl bg-[#121212] rounded-2xl shadow-2xl border border-red-900/30 flex flex-col items-center">
            {/* Close Button - Always Visible */}
            <button
              onClick={() => setselectedVideo(null)}
              className="absolute -top-4 -right-4 z-50
                   w-10 h-10 rounded-full
                   bg-red-600 hover:bg-red-700
                   text-white text-xl font-bold
                   flex items-center justify-center
                   shadow-lg shadow-red-600/40
                   transition duration-300 hover:scale-110"
            >
              ✕
            </button>

            {/* Video Wrapper */}
            <div className="w-full flex items-center justify-center bg-black rounded-2xl overflow-hidden">
              <video
                src={selectedVideo}
                controls
                autoPlay
                className="max-h-[80vh] w-auto max-w-full object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {/*LOGOUT BUTTON */}
      <div className="flex justify-center">
        <button
          onClick={handleLogout}
          className="px-5 py-2 bg-red-700 hover:bg-red-800 
                    rounded-lg font-semibold text-white cursor-pointer"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
