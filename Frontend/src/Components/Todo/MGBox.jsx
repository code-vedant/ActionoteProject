import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ContentBarMG from "./ContentBarMG";
import MonthlyGoalService from "@/Services/monthlyGoal.service";
import down from "../../assets/Icons/down.png";

const useFetchGoals = (month, accessToken) => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchGoals = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await MonthlyGoalService.getGoalsByMonth(month, accessToken);
      console.log(response);
      
      if (response.data && Array.isArray(response.data)) {
        setGoals(response.data);
      } else {
        setGoals([]);
      }
    } catch (err) {
      setError("Connection Error.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, [month]);

  return { goals, loading, error };
};

function MGBox() {
  const getYearMonth = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    return `${year}-${month}`;
  };

  const accessToken = useSelector((state) => state.auth.accessToken);
  const [month, setMonth] = useState(getYearMonth(new Date()));

  const { goals, loading, error } = useFetchGoals(month, accessToken);

  const changeMonth = (increment) => {
    const newDate = new Date(month + "-01");
    newDate.setMonth(newDate.getMonth() + increment);
    setMonth(getYearMonth(newDate));
  };

  const formatMonth = (dateString) => {
    const date = new Date(dateString + "-01");
    const options = { year: "numeric", month: "long" };
    return date.toLocaleDateString("en-US", options);
  };

  return (
    <div className="w-full lg:w-8/12 h-[40vh] lg:h-[85vh] flex flex-col bg-[#fffefe] dark:bg-[#282828] shadow-lg p-4">
      <div className="topTools h-[10%] mb-4 w-full lg:h-[5%] flex justify-between items-center">
        <button
          onClick={() => changeMonth(-1)}
          className="px-2 aspect-square font-normal border-[1px] w-8 h-8 border-[#39a2ff] flex justify-center items-center rounded-full"
        >
          <img src={down} className="w-4/5 h-2/5 rotate-90" alt="" />
        </button>
        <h2 className="text-2xl font-bold text-[#39a2ff]">
          {formatMonth(month)} Goals
        </h2>
        <button
          onClick={() => changeMonth(1)}
          className="px-2 aspect-square font-normal border-[1px] w-8 h-8 border-[#39a2ff] flex justify-center items-center rounded-full"
        >
          <img src={down} className="w-4/5 h-2/5 -rotate-90" alt="" />
        </button>
      </div>
      <div className="flex flex-col w-full h-[90%] justify-start gap-1">
        {loading ? (
          <p className="text-xl font-normal w-full text-center text-[#39a2ff]">
            Loading goals...
          </p>
        ) : error ? (
          <p className="text-xl font-normal text-[#FF6B6B] w-full text-center">
            {error}
          </p>
        ) : goals.length === 0 ? (
          <p className="text-xl font-normal text-[#FF6B6B] w-full text-center">
            No goals for the month..
          </p>
        ) : (
          goals.map((goal) => (
            <ContentBarMG task={goal} key={goal.id} accessToken={accessToken} />
          ))
        )}
      </div>
    </div>
  );
}

export default MGBox;
