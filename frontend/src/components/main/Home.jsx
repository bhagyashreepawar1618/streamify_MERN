import { useEffect, useState } from "react";
import axios from "axios";
import ShowVideo from "../videos/ShowVideo";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/videos/get-videos"
        );

        console.log("videos response=", response.data.data);

        setVideos(response.data.data);
      } catch (error) {
        console.log("Error fetching videos", error);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <h2 className="text-3xl font-bold text-red-600 mb-8">Latest Videos</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {videos.map((video) => (
          <div
            key={video._id}
            className="bg-[#121212] rounded-xl overflow-hidden shadow-lg border border-red-900/30 hover:scale-105 transition"
          >
            {/* Thumbnail */}
            <img
              src={video.thumbnail}
              alt="thumbnail"
              className="w-full h-48 object-cover"
              onClick={() => setSelectedVideo(video.videoFile)}
            />

            <div className="p-4">
              {/* Title */}
              <h3 className="text-lg font-semibold text-white line-clamp-2">
                {video.title}
              </h3>

              {/* Owner Info */}
              <div className="flex items-center gap-3 mt-3">
                <img
                  src={video.owner?.avtar}
                  alt="avatar"
                  className="w-8 h-8 rounded-full object-cover"
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

      {selectedVideo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-[#121212] p-6 rounded-xl w-[90%] max-w-3xl relative">
            <video
              src={selectedVideo}
              controls
              autoPlay
              className="w-full rounded-lg"
            />

            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-3 right-3 bg-red-700 px-3 py-1 rounded-lg"
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
