import axios from "axios";
import { useUser } from "../../contexts/User.context.jsx";
import { useEffect, useState } from "react";
const AnotherUserProfile = () => {
  //we've set data into user after login
  const { anotherUserDetails, getAnotherUserDetails } = useUser();
  const [selectedVideo, setselectedVideo] = useState();
  const [uservideos, setUserVideos] = useState([]);
  const [isSubscribed, setIsSubscribed] = useState();
  const token = localStorage.getItem("accessToken");
  useEffect(() => {
    console.log("token is=", token);
    if (anotherUserDetails?.isSubscribed !== undefined) {
      setIsSubscribed(anotherUserDetails.isSubscribed);
    }
    if (!anotherUserDetails?._id) return;

    console.log("an user id=", anotherUserDetails?._id);

    //backend call
    const getuservideos = async () => {
      try {
        console.log("an user id from try block=", anotherUserDetails._id);
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/videos/get-another-user-videos/${anotherUserDetails?._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("another user vdos response", response);

        setUserVideos(response.data.data);
      } catch (e) {
        console.log("Error occured while getting user videos", e);
      }
    };

    getuservideos();
  }, [anotherUserDetails]);

  //function to set subscription details
  const setSubcriber = async (channelId) => {
    setIsSubscribed((prev) => !prev);
    //backend call here
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/subscription/set-subscription-details`,
        {
          channelId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await getAnotherUserDetails(anotherUserDetails.username);
    } catch (e) {
      console.log("Error occured While getting Subscription details", e);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Cover Section */}
      <div className="relative w-full h-64 md:h-80">
        <img
          src={anotherUserDetails?.coverImage}
          alt="cover"
          className="w-full h-full object-cover opacity-80"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black"></div>

        {/* Profile Image */}
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
          <img
            src={anotherUserDetails?.avtar}
            alt="avatar"
            className="w-32 h-32 rounded-full border-4 border-red-600 object-cover shadow-xl"
          />
        </div>
      </div>

      {/* User Info Section */}
      <div className="mt-20 text-center px-4">
        <h2 className="text-3xl font-bold text-red-600">
          {anotherUserDetails?.fullname}
        </h2>

        <p className="text-gray-400 mt-2">@{anotherUserDetails?.username}</p>

        <p className="text-gray-500 mt-1">{anotherUserDetails?.email}</p>

        {/* Stats Section (optional YouTube vibe) */}
        <div className="flex justify-center gap-10 mt-8">
          <div className="text-center">
            <p className="text-xl font-semibold text-white">
              {uservideos?.length}
            </p>
            <p className="text-gray-400 text-sm">Videos</p>
          </div>

          <div className="text-center">
            <p className="text-xl font-semibold text-white">
              {anotherUserDetails?.subscribers || 0}
            </p>
            <p className="text-gray-400 text-sm">Subscribers</p>
          </div>

          <div className="text-center">
            <p className="text-xl font-semibold text-white">
              {anotherUserDetails?.following || 0}
            </p>
            <p className="text-gray-400 text-sm">Following</p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={() => setSubcriber(anotherUserDetails?._id)}
          className={`px-5 py-2 rounded-lg font-semibold text-white cursor-pointer mt-2
            ${
              isSubscribed
                ? "bg-gray-600 hover:bg-gray-700"
                : "bg-red-700 hover:bg-red-800"
            }
          `}
        >
          {isSubscribed ? "Subscribed" : "Subscribe"}
        </button>
      </div>

      {/* user videos */}
      <div className="max-w-6xl mx-auto mt-12 px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {uservideos?.map((video) => (
          <div key={video?._id} className="bg-[#121212] p-4 rounded-xl">
            <img
              src={video?.thumbnail}
              alt="thumbnail"
              className="w-full h-40 object-cover rounded-lg"
              onClick={() => {
                setselectedVideo(video?.videoFile);
              }}
            />
            <p>{video?.title}</p>
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
    </div>
  );
};
export default AnotherUserProfile;
