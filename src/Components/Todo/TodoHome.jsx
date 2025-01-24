import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PopupHolder from "../Popups/PopupHolder";
import AddTodoForm from "./AddTodoForm";
import AddMonthlyGoalForm from "./AddMontlyGoals";
import { Helmet } from "react-helmet";
import TabNavigation from "./TagNavigation";
import TodoBox from "./TodoBox";
import MGBox from "./MGBox";

const TodoPage = () => {
  const [todoPopup, setTodoPopup] = useState(false);
  const [mntPopup, setMntPopup] = useState(false);
  const accessToken = useSelector((state) => state.auth.accessToken);
   const tags = useSelector((state)=> state.tags.tags)

  const handleTodoPopup = () => setTodoPopup(!todoPopup);

  const handleMntPopup = () => setMntPopup(!mntPopup);

  return (
    <>
      <Helmet>
        <title>Your Todo | Monthly Goals | Actionote</title>
        <meta
          name="description"
          content="Your daily to-do list, monthly goals, and more!"
        />
      </Helmet>

      <div className="h-full w-full flex flex-col justify-start items-start">
        {todoPopup && (
          <PopupHolder>
            <AddTodoForm
              accessToken={accessToken}
              handleTodoPopup={handleTodoPopup}
            />
          </PopupHolder>
        )}
        {mntPopup && (
          <PopupHolder>
            <AddMonthlyGoalForm
              accessToken={accessToken}
              handleMntPopup={handleMntPopup}
            />
          </PopupHolder>
        )}

        <div className="w-full py-5 lg:py-0 px-5 lg:hidden lg:px-52 flex justify-between items-center h-[5%]">
          <button
            onClick={handleTodoPopup}
            className="px-5 py-2 font-light text-white rounded-full shadow"
            style={{
              backgroundImage: "linear-gradient(to right, #39a2ff, #0077ff)",
            }}
          >
            Add Todo
          </button>
          <button
            onClick={handleMntPopup}
            className="px-5 py-2 font-light text-white rounded-full shadow"
            style={{
              backgroundImage: "linear-gradient(to right, #39a2ff, #0077ff)",
            }}
          >
            Add Goal
          </button>
        </div>

        <div className="h-full w-full flex flex-col lg:flex-row justify-start items-start gap-2 lg:gap-5 py-5 px-5 lg:px-20">
          <MGBox />
          <TodoBox />

          <div className="w-none hidden lg:w-6/12 h-[85vh] lg:flex flex-col gap-[1vh]">
            <TabNavigation />
          </div>
        </div>
      </div>
    </>
  );
};

export default TodoPage;
