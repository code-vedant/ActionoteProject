import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

function PrevDrawsCard({ project }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (project.drawing) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      img.src = `data:image/png;base64,${project.drawing}`;
    }
  }, [project.drawing]);

  return (
    <div className="prevProjectCard w-[98vw] lg:w-[30vw] bg-[#2d2d2d] h-fit rounded-lg shadow-md">
      <Link className="w-full p-4 rounded-lg shadow-md h-fit" to={`${project?._id}`}>
      <div className="projectCardImage">
        <canvas
          ref={canvasRef}
          width="300"
          height="200"
          className="border border-gray-300 rounded"
        ></canvas>
      </div>
      <div className="projectCardDetails mt-4">
        <h2 className="text-xl font-bold">{project.title}</h2>
        <p className="text-gray-500 text-sm">
          Created At: {new Date(project.createdAt).toLocaleDateString()}
        </p>
      </div></Link>
    </div>
  );
}

export default PrevDrawsCard;
