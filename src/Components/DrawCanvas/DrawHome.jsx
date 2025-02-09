import React, { useEffect, useState } from 'react';
import pen from "../../assets/Icons/pen.webp";
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
      <div className="new pb-4 lg:pl-10 w-full">
        <h1 className="text-5xl lg:text-8xl w-full border-b-[3px] border-[#39a2ff] font-light text-[#39a2ff] pb-4">Workspace : Draw : : : Sketch</h1>
        <div className="new group h-[95vw] w-[92vw] lg:h-[20vw] lg:w-[60vh] mt-4 p-2 shadow-md flex items-center justify-center bg-white dark:bg-[#f7f8f9] transition-transform duration-500 hover:bg-white hover:shadow-md hover:scale-105  rounded-lg">
                    <Link
                      to={"/dashboard/draw/startedNewDrawing"}
                      className="hidden lg:w-full h-full lg:flex justify-center items-center bg-transparent"
                    >
                      <img
                        src={pen}
                        className="w-1/5 aspect-square transition-transform duration-500 group-hover:scale-110"
                        alt="add"
                      />
                    </Link>
                    <h3 className='w-full lg:hidden font-light text-center text-[#39a2ff] text-2xl'>
                      For drawing please visit this page on desktop screen 
                    </h3>
                  </div>
      </div>
      <div className="prevProjects mt-6 w-full">
        <h1 className="text-4xl lg:text-6xl w-full border-b-[2px] border-[#39a2ff] font-light text-[#39a2ff] pb-4">Previous Projects</h1>
        <div className="containers w-full flex flex-wrap gap-2 py-2 px-5">
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