import React, { useState } from "react";
import AddMGTab from "./AddMGTab"; // Add Goals form
import AddTodoTab from "./AddTodoTab"; // Add ToDo form

function TabNavigation() {
  const [activeTab, setActiveTab] = useState("addTodo");

  const renderActiveTab = () => {
    switch (activeTab) {
      case "addTodo":
        return <AddTodoTab />;
      case "addGoals":
        return <AddMGTab />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full p-4 bg-white shadow-xl dark:bg-[#282828]">
      {/* Tab Navigation */}
      <div className="flex justify-center mb-2 border-b-2 border-gray-300 dark:border-gray-600">
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "addTodo"
              ? "border-b-4 border-[#39a2ff] text-[#39a2ff]"
              : "text-gray-500 hover:text-[#39a2ff]"
          }`}
          onClick={() => setActiveTab("addTodo")}
        >
          Add ToDo
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "addGoals"
              ? "border-b-4 border-[#39a2ff] text-[#39a2ff]"
              : "text-gray-500 hover:text-[#39a2ff]"
          }`}
          onClick={() => setActiveTab("addGoals")}
        >
          Add Goals
        </button>
      </div>

      {/* Render Active Tab */}
      <div className="w-full h-full">{renderActiveTab()}</div>
    </div>
  );
}

export default TabNavigation;
