import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { useForm } from "react-hook-form";
import CalendarService from "@/Services/calendar.service";
import "react-datepicker/dist/react-datepicker.css";
import PopupHolder from "../Popups/PopupHolder";
import { ClockLoader } from "react-spinners";

function AddEventForm({ accessToken }) {
  const { handleSubmit, register, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const addEvent = async (data) => {
    try {
      setLoading(true);
      const eventData = {
        title: data.title,
        description: data.description,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      };
      const res = await CalendarService.saveEvent(eventData, accessToken);
      console.log("Event added:", res);
      reset();
    } catch (error) {
      console.error("Error adding event:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <PopupHolder>
          <ClockLoader
            color="#39a2ff"
            size={100}
            speedMultiplier={4}
            className="fixed inset-0 z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          />
        </PopupHolder>
      )}
      <div className="w-full h-full bg-[#ffffff] dark:bg-[#282828] shadow-md">
        <h1 className="w-full text-[4vh] text-center text-sky-blue px-7 border-b-2 border-b-sky-blue">
          Add Event
        </h1>
        <form
          onSubmit={handleSubmit(addEvent)}
          className="flex flex-col gap-5 py-5 w-full h-[calc(100%-6.49vh)] px-5"
        >
          <div>
            <label htmlFor="title" className="block mb-1">
              Title:
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="w-full p-2 bg-white border-[1px] dark:border-none dark:bg-[#363636] dark:text-white border-black px-3 rounded-full outline-none "
              {...register("title", { required: true })}
            />
          </div>

          <div className="w-full">
            <label htmlFor="startDate" className="block mb-1">
              Start Date:
            </label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              showTimeSelect
              timeFormat="hh:mm aa"
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="MMMM d, yyyy h:mm aa"
              popperPlacement="bottom-end"
              popperClassName="custom-dropdown"
              className="w-full p-2 bg-white border-[1px] dark:border-none dark:bg-[#363636] dark:text-white border-black px-3 rounded-full outline-none"
            />
          </div>

          <div className="w-full">
            <label htmlFor="endDate" className="block mb-1">
              End Date:
            </label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              showTimeSelect
              timeFormat="hh:mm aa"
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="MMMM d, yyyy h:mm aa"
              popperPlacement="bottom-end"
              popperClassName="custom-dropdown"
              inputClassName="w-full p-2 border rounded"
              style={{ width: "100%" }}
              className="w-full p-2 bg-white border-[1px] dark:border-none dark:bg-[#363636] dark:text-white border-black px-3 rounded-full outline-none"
            />
          </div>

          <div>
            <label htmlFor="description" className="block mb-1">
              Description:
            </label>
            <textarea
              id="description"
              name="description"
              rows="5"
              className="w-full bg-white border-[1px] dark:border-none dark:bg-[#363636] dark:text-white border-black px-3 rounded-xl outline-none "
              {...register("description", { required: true })}
            />
          </div>

          <div className="flex justify-center items-center flex-col gap-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-[#39a2ff] text-white rounded-full hover:bg-blue-500"
            >
              {loading ? "Adding..." : "Add Event"}
            </button>
            <div className="separator border-[1px]  rounded-full border-black dark:border-gray-300 w-10/12"></div>
            <button
              type="button"
              onClick={() => reset()}
              className="w-full px-4 py-2 bg-gray-300 font-light text-black hover:text-white rounded-full hover:bg-red-500"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default AddEventForm;
