import React, { useEffect, useState } from 'react';
import pen from "../../assets/Icons/pen.png";
import PrevDrawsCard from './PrevDrawsCard';
import { Link } from 'react-router-dom';
import DrawService from '@/Services/draw.service';
import { useSelector } from 'react-redux';

function DrawHome() {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const [prevDrawings,setPrevDrawings] = useState([]);

  const fetchDrawings = async () => {
    try {
      const res = await DrawService.getDrawingsForUser(accessToken)
      console.log(res.data);
      setPrevDrawings(res.data);
    } catch (error) {
      console.error(error.message);
      
    }
  }

  useEffect(() =>{
    fetchDrawings();
  },[accessToken])

  const previousProjects = [
  ];

  return (
    <section className="w-full h-full flex flex-col justify-start items-start p-4">
      <div className="new border-b border-b-[#39a2ff] pb-4 pl-10 w-full">
        <h1 className="text-4xl font-bold text-[#39a2ff]">Welcome to Actionote x Draw</h1>
        <Link to={"/dashboard/draw/new"} className='w-32 h-32 mt-4 flex justify-center items-center rounded-md bg-slate-200'>
          <img src={pen} className='w-2/3 h-2/3' alt="draw" />
        </Link>
      </div>
      <div className="prevProjects mt-6 w-full">
        <h1 className="text-2xl font-bold text-[#39a2ff]">Previous Projects</h1>
        <div className="containers w-full flex flex-wrap gap-2 ">
          {prevDrawings.length === 0 ? (
            <p>No previous projects available.</p>
          ) : (
            prevDrawings.map((project) => (
              <PrevDrawsCard key={project._id} project={project} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default DrawHome;