import { encrypt } from "@/Binders/Encypt";
import React, { useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";

function PrevDrawsCard({ project }) {
  const canvasRef = useRef(null);

  const bgColor = useMemo(() => {
    const bgColors = [
      "#b4d9ff",
      "#e1c8ff",
      "#c8ffd9",
      "#ffb3b3",
      "#fff0c7",
      "#ffd8b3",
      "#c1e0ff",
      "#e1f2d9",
      "#fff0b3",
      "#cceeff",
    ];
    return bgColors[Math.floor(Math.random() * bgColors.length)];
  }, []);

  useEffect(() => {
    if (project?.drawing) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      img.src = `data:image/png;base64,${project.drawing}`;
    }
  }, [project?.drawing]);

  const encryptedId = encrypt(project?._id);

  return (
    <div
      className="prevProjectCard relative w-[98vw] lg:w-[30vw] h-fit rounded-lg shadow-md"
      style={{ backgroundColor: bgColor }}
    >
      <Link
        className="block p-2 w-full rounded-lg"
        to={project?._id ? `${encryptedId}` : "new"}
      >
        <div className="projectCardImage w-full h-fit">
          <canvas
            ref={canvasRef}
            width={300}
            height={200}
            className="w-full h-full border border-gray-300 rounded"
          ></canvas>
        </div>
        <div className="absolute bottom-2 right-2 text-xs text-gray-500 opacity-0 hover:opacity-100 transition-opacity duration-300">
          Created at:{" "}
          {project?.createdAt
            ? new Date(project.createdAt).toLocaleDateString()
            : "N/A"}
        </div>
      </Link>
    </div>
  );
}

export default PrevDrawsCard;