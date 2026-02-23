import { Link } from "react-router-dom";
import { useUser } from "../../contexts/User.context";
import { useEffect, useState } from "react";
import axios from "axios";
function WatchHistory() {
  const { user } = useUser();
  const [watchedHistoryVideos, setwatchedHistoryVideos] = useState([]);

  useEffect(() => {
    const getWatchHistory = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/users/watch-history`,
          {
            withCredentials: true,
          }
        );
        setwatchedHistoryVideos(response.data.data);
      } catch (e) {
        console.log("Error occured while getting watch History", e);
      }
    };

    getWatchHistory();
  }, []);

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
  return (
    <>
      <div className="min-h-screen bg-black px-6 py-10">
        <h2 className="text-3xl font-bold text-red-600 mb-10">Watch History</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {watchedHistoryVideos.map((video) => (
            <div
              key={video._id}
              className="bg-[#121212] rounded-2xl overflow-hidden shadow-lg 
                   border border-red-900/20 
                   hover:scale-105 hover:shadow-red-900/40 
                   transition-all duration-300 cursor-pointer"
            >
              {/* Thumbnail */}
              <div className="relative">
                <img
                  src={video.thumbnail}
                  alt="thumbnail"
                  className="w-full h-48 object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white line-clamp-2">
                  {video.title}
                </h3>

                <div className="flex items-center gap-3 mt-4">
                  <img
                    src={video.owner?.avtar}
                    alt="avatar"
                    className="w-9 h-9 rounded-full object-cover border border-gray-600"
                  />
                  <div>
                    <p className="text-sm text-gray-300">
                      {video.owner?.fullname}
                    </p>
                    <p className="text-xs text-gray-500">{video.views} views</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default WatchHistory;
