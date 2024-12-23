import React from 'react';
import pen from "../../assets/Icons/pen.png";
import PrevDrawsCard from './PrevDrawsCard';
import { Link } from 'react-router-dom';

function DrawHome() {
  const previousProjects = [
    { title: 'Project 1', link: '/dashboard/draw/1' },
    { title: 'Project 2', link: '/dashboard/draw/2' },
    { title: 'Project 3', link: '/dashboard/draw/3' },
    // Add more projects here
  ];

  return (
    <section className="w-full h-full flex flex-col justify-start items-start p-4">
      <div className="new border-b border-b-[#39a2ff] pb-4 pl-10 w-full">
        <h1 className="text-4xl font-bold text-[#39a2ff]">Welcome to Actionote x Draw</h1>
        <Link to={"/dashboard/draw/new"} className='w-32 h-32 mt-4 flex justify-center items-center rounded-md bg-slate-200'>
          <img src={pen} className='w-2/3 h-2/3' alt="draw" />
        </Link>
      </div>
      <div className="prevProjects mt-6">
        <h1 className="text-2xl font-bold text-[#39a2ff]">Previous Projects</h1>
        <div className="containers">
          {previousProjects.length === 0 ? (
            <p>No previous projects available.</p>
          ) : (
            previousProjects.map((project) => (
              <PrevDrawsCard key={project.title} project={project} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default DrawHome;