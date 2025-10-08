import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim().length > 1) {
      // <-- Here you use the axios.get() call
      const res = await axios.get(`/api/users/search/${value}`);
      setResults(res.data); // Save results in state
    } else {
      setResults([]);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <input
        type="text"
        value={query}
        onChange={handleSearch} // Calls handleSearch on typing
        placeholder="Search users..."
        className="w-full border rounded-md px-3 py-2"
      />

      {results.length > 0 && (
        <div className="absolute bg-white border rounded-md mt-1 w-full shadow-lg z-10">
          {results.map((user) => (
            <div
              key={user._id}
              onClick={() => navigate(`/profile/${user.username}`)}
              className="p-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-2"
            >
              <img
                src={user.avatar ? `http://localhost:5001/${user.avatar}` : "https://via.placeholder.com/40"}
                alt={user.username}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <p className="font-medium">@{user.username}</p>
                <p className="text-sm text-gray-500">{user.displayName}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
