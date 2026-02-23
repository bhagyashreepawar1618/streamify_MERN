import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../../contexts/User.context";
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
const Home = () => {
  const { user } = useUser();
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState();
  const { getAnotherUserDetails } = useUser({});
  const token = localStorage.getItem("accessToken");

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(120);

  const setwatchedHistory = async (videoid) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/users/set-watched-history/${videoid}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (e) {
      console.log("Error occured while storing watched history..");
    }
  };

  const handleLike = () => {
    setLiked((prev) => {
      setLikeCount((count) => (prev ? count - 1 : count + 1));
      return !prev;
    });
  };

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/videos/get-videos`
        );

        console.log("videos=", response.data.data);
        setVideos(response.data.data);
      } catch (error) {
        console.log("Error fetching videos", error);
      }
    };

    fetchVideos();
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
    <div className="min-h-screen bg-black text-white px-8 py-12">
      <h2 className="text-4xl font-bold text-red-600 mb-12 tracking-wide">
        Latest Videos
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {videos.map((video) => (
          <div
            key={video._id}
            className="group bg-[#111111] rounded-2xl overflow-hidden
                     border border-red-900/20
                     shadow-lg shadow-red-900/10
                     hover:shadow-red-600/40
                     hover:-translate-y-2
                     hover:scale-[1.03]
                     transition-all duration-500"
          >
            {/* Thumbnail */}
            <div className="relative overflow-hidden cursor-pointer">
              <img
                src={video.thumbnail}
                alt="thumbnail"
                className="w-full h-52 object-cover
                         group-hover:scale-110
                         transition-transform duration-500"
                onClick={() => {
                  console.log("videoid=", video.videoFile);
                  setSelectedVideo(video.videoFile);
                  setwatchedHistory(video._id);
                }}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80 pointer-events-none" />
            </div>

            <div className="p-5">
              {/* Title */}
              <h3 className="text-lg font-semibold text-white line-clamp-2 group-hover:text-red-500 transition-colors duration-300">
                {video.title}
              </h3>

              {/* Owner Info */}
              <div className="flex items-start gap-3 mt-4">
                <img
                  src={video.owner?.avtar}
                  alt="avatar"
                  className="w-10 h-10 rounded-full object-cover
                           border border-red-900/40
                           group-hover:border-red-600 transition"
                />

                <div className="flex-1">
                  <Link to="another-user-profile">
                    <p
                      className="text-sm text-gray-300 hover:text-red-500 transition cursor-pointer"
                      onClick={() => {
                        getAnotherUserDetails(video?.owner?.username);
                      }}
                    >
                      {video.owner?.fullname}
                    </p>
                  </Link>

                  {/* Like Section */}
                  <div className="flex items-center gap-4 mt-4">
                    <button
                      onClick={handleLike}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
                      transition-all duration-300
                      ${
                        liked
                          ? "bg-red-600 text-white shadow-md shadow-red-600/50 scale-105"
                          : "bg-gray-800 text-gray-300 hover:bg-red-900/40 hover:text-white"
                      }`}
                    >
                      <FaHeart
                        className={`text-lg ${
                          liked ? "text-white" : "text-red-500"
                        }`}
                      />
                      {liked ? "Liked" : "Like"}
                    </button>

                    <span className="text-gray-400 text-sm tracking-wide">
                      {likeCount} Likes
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50">
          <div
            className="bg-[#111111] p-6 rounded-2xl w-[90%] max-w-4xl relative
                        border border-red-900/30
                        shadow-2xl shadow-red-600/30
                        animate-fadeIn"
          >
            <video
              src={selectedVideo}
              controls
              autoPlay
              className="w-full rounded-xl"
            />

            {/* Like Section */}
            <div className="flex items-center gap-4 mt-6">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium
                transition-all duration-300
                ${
                  liked
                    ? "bg-red-600 text-white shadow-md shadow-red-600/50 scale-105"
                    : "bg-gray-800 text-gray-300 hover:bg-red-900/40 hover:text-white"
                }`}
              >
                <FaHeart
                  className={`text-lg ${liked ? "text-white" : "text-red-500"}`}
                />
                {liked ? "Liked" : "Like"}
              </button>

              <span className="text-gray-400 text-sm">{likeCount} Likes</span>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 bg-red-700 hover:bg-red-800
                       px-4 py-1 rounded-lg text-sm font-semibold transition"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
