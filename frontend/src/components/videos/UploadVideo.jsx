import axios from "axios";
import { useState } from "react";

const UploadVideo = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // backend call here
    const videoData = new FormData();

    videoData.append("title", formData.title);
    videoData.append("description", formData.description);
    videoData.append("videoFile", videoFile);
    videoData.append("thumbnail", thumbnail);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/videos/upload-video",
        videoData,
        {
          withCredentials: true,
        }
      );

      alert("Video uploaded Successfully.!!");
    } catch (e) {
      console.log("Error Occured while uploading vedio ", e);
    }

    setFormData({
      title: "",
      description: "",
    });

    setThumbnail(null);
    setVideoFile(null);
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-[#121212] border border-red-900/40 rounded-2xl p-10 shadow-2xl">
        <h2 className="text-3xl font-bold text-red-600 text-center mb-8">
          Upload Video
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-gray-300 mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter video title"
              className="w-full px-4 py-3 rounded-lg bg-[#1f1f1f] border border-gray-700 focus:ring-2 focus:ring-red-600 outline-none"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-300 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Enter video description"
              className="w-full px-4 py-3 rounded-lg bg-[#1f1f1f] border border-gray-700 focus:ring-2 focus:ring-red-600 outline-none resize-none"
              required
            />
          </div>

          {/* Video Upload */}
          <div>
            <label className="block text-gray-300 mb-2">Upload Video</label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files[0])}
              className="block w-full text-gray-300
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-lg file:border-0
                         file:text-sm file:font-semibold
                         file:bg-red-700 file:text-white
                         hover:file:bg-red-800"
              required
            />
          </div>

          {/* Thumbnail Upload */}
          <div>
            <label className="block text-gray-300 mb-2">Upload Thumbnail</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnail(e.target.files[0])}
              className="block w-full text-gray-300
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-lg file:border-0
                         file:text-sm file:font-semibold
                         file:bg-red-700 file:text-white
                         hover:file:bg-red-800"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 mt-4 bg-red-700 hover:bg-red-800 
                       transition-all duration-200 
                       rounded-lg font-semibold text-lg 
                       active:scale-95"
          >
            Publish Video
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadVideo;
