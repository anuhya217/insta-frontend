import React, { useState } from "react";
import { addMockPost } from "../data/mockData";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  // handle image selection + preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!image) {
      alert("Please select an image to upload!");
      return;
    }

    // create new post
    const newPost = {
      id: Date.now(),
      username: "you",
      userAvatar: "/images/anu1.jpg", // default avatar
      imageUrl: preview,
      location: "Your Location",
      likes: 0,
      caption: caption,
      timeAgo: "Just now",
      comments: [],
    };

    // Add new post to mock data
    addMockPost(newPost);

    // Reset form
    setCaption("");
    setImage(null);
    setPreview(null);

    // Redirect to home page
    navigate("/home");
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-xl font-semibold mb-4 dark:text-white text-center">
        Create a New Post
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Image Upload */}
        <div className="border-2 border-dashed border-gray-400 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
          <label className="cursor-pointer block">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-64 object-cover rounded-lg"
              />
            ) : (
              <div className="text-gray-500 dark:text-gray-300">
                <p className="mb-2">📷 Click to upload an image</p>
                <p className="text-xs">(JPEG, PNG up to 5MB)</p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Caption */}
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Write a caption..."
          className="w-full border rounded-lg p-2 dark:bg-gray-800 dark:text-white"
          rows="3"
        />

        {/* Buttons */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => navigate("/home")}
            className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
          >
            Share
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
