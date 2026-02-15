import React, { useState } from "react";
import axios from "axios";
const Register = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    username: "",
    password: "",
  });

  const [avtar, setAvtar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  //take previous data then overwrite the latest  data
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //create new object using browser constructor
    //to store all the data
    const data = new FormData();

    data.append("username", formData.username);
    data.append("fullname", formData.fullname);
    data.append("email", formData.email);
    data.append("password", formData.password);

    data.append("avtar", avtar);
    data.append("coverImage", coverImage);

    //consolelog all values using foreach
    data.forEach((value, key) => {
      console.log(key, value);
    });

    //backend call here
    try {
      //send data to backend
      const response = await axios.post(
        "http://localhost:8000/api/v1/users/register",
        data
      );

      setFormData({
        fullname: "",
        email: "",
        username: "",
        password: "",
      });

      alert("User Registered Successfully..!!!");
    } catch (error) {
      console.log("Error occured", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-lg bg-[#121212] rounded-2xl p-10 shadow-2xl border border-red-800">
        <h2 className="text-4xl font-bold text-center text-red-600 mb-8">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="fullname"
              placeholder="Full Name"
              required
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-[#1f1f1f] text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-[#1f1f1f] text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600"
            />

            <input
              type="text"
              name="username"
              placeholder="Username"
              required
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-[#1f1f1f] text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-[#1f1f1f] text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Upload Avatar</label>
            <input
              type="file"
              required
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

          <div>
            <label className="block text-gray-300 mb-2">
              Upload Cover Image
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

          <button
            type="submit"
            className="w-full py-3 mt-4 rounded-lg bg-red-700 hover:bg-red-800 text-white font-semibold text-lg transition"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
