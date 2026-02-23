import { useState } from "react";
import { useUser } from "../../contexts/User.context.jsx";
import { Link } from "react-router-dom";
import axios from "axios";
const UpdateProfile = () => {
  const { user, setUser } = useUser();
  let newavtar;
  let newcover;
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    username: "",
  });

  const [avtar, setAvtar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //backend api call
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/users/update-account`,
        {
          fullname: formData.fullname,
          email: formData.email,
          username: formData.username,
        },
        {
          withCredentials: true,
        }
      );

      //for avatar update
      if (avtar) {
        const avtardata = new FormData();
        avtardata.append("avtar", avtar);

        const newdata = await axios.patch(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/users/avtar-update`,
          avtardata,
          {
            withCredentials: true,
          }
        );

        newavtar = newdata.data.data.avtar;
      }

      //update coverImage
      if (coverImage) {
        const coverdata = new FormData();

        coverdata.append("coverImage", coverImage);

        const newdata = await axios.patch(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/users/coverImage-update`,
          coverdata,
          {
            withCredentials: true,
          }
        );
        newcover = newdata.data.data.coverImage;
      }
    } catch (error) {
      console.log("Error occured while updating user details", error);
    }

    setUser({
      fullname: formData.fullname,
      username: formData.username,
      email: formData.email,
      avtar: newavtar,
      coverImage: newcover,
    });

    alert("User Profile Updated Successfully.!!");
  };

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
    <div className="min-h-screen bg-black flex items-center justify-center px-4 text-white">
      <div className="w-full max-w-2xl bg-[#121212] border border-red-900/40 rounded-2xl p-10 shadow-2xl">
        <h2 className="text-3xl font-bold text-red-600 text-center mb-8">
          Update Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Text Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <input
              type="text"
              name="fullname"
              placeholder="Full Name"
              value={formData.fullname}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-[#1f1f1f] border border-gray-700 focus:ring-2 focus:ring-red-600 outline-none"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-[#1f1f1f] border border-gray-700 focus:ring-2 focus:ring-red-600 outline-none"
            />

            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-[#1f1f1f] border border-gray-700 focus:ring-2 focus:ring-red-600 outline-none md:col-span-2"
            />
          </div>

          {/* Avatar Upload */}
          <div>
            <label className="block text-gray-300 mb-2">Update Avatar</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvtar(e.target.files[0])}
              className="block w-full text-gray-300
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-lg file:border-0
                         file:text-sm file:font-semibold
                         file:bg-red-700 file:text-white
                         hover:file:bg-red-800"
            />
          </div>

          {/* Cover Image Upload */}
          <div>
            <label className="block text-gray-300 mb-2">
              Update Cover Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverImage(e.target.files[0])}
              className="block w-full text-gray-300
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-lg file:border-0
                         file:text-sm file:font-semibold
                         file:bg-red-700 file:text-white
                         hover:file:bg-red-800"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 mt-4 bg-red-700 hover:bg-red-800 transition rounded-lg font-semibold text-lg"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
