import React from "react";
import { mockStories } from "../data/mockData";

const Stories = () => {
  return (
    <div className="flex overflow-x-auto space-x-4 p-3 border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
      {mockStories.map((story) => (
        <div key={story.id} className="flex flex-col items-center text-center">
          <div
            className={`w-16 h-16 rounded-full border-4 ${
              story.hasNewStory ? "border-pink-500" : "border-gray-300"
            } p-[2px]`}
          >
            <img
              src={story.avatar}
              alt={story.username}
              className="rounded-full object-cover w-full h-full"
            />
          </div>
          <p className="text-xs mt-1 dark:text-gray-300">{story.username}</p>
        </div>
      ))}
    </div>
  );
};

export default Stories;
