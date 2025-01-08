import React, { useRef, useEffect, useState } from "react";
import pen from "../../assets/Icons/pen.png";
import eraser from "../../assets/Icons/eraser.png";
import DrawService from "@/Services/draw.service";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

function DrawingCanvas() {
  const { id } = useParams();
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(10);
  const [canvasColor, setCanvasColor] = useState(true);
  const [ctx, setCtx] = useState(null);
  const [tool, setTool] = useState("draw");
  const [currentDrawing, setCurrentDrawing] = useState(null);
  const navigate = useNavigate();
  const accessToken = useSelector((state) => state.auth.accessToken);

  const colorPicker = (clr) => {
    setStrokeColor(clr);
  };


  const initializeCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      const context = canvas.getContext("2d");
      setCtx(context);

      // Render the drawing if it exists
      if (currentDrawing?.drawing) {
        const img = new Image();
        img.src = `data:image/png;base64,${currentDrawing.drawing}`;
        img.onload = () => {
          context.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
      } else {
        context.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  useEffect(() => {
    const loadDrawing = async () => {
      if (id !== "new") {
        try {
          const response = await DrawService.getDrawingById(id, accessToken);
          const drawingData = response.data;
          setCurrentDrawing(drawingData);
        } catch (error) {
          console.error("Error fetching drawing:", error);
          alert("Failed to load the drawing. Please try again.");
        }
      } else {
        setCurrentDrawing(null);
      }
    };

    loadDrawing();
  }, [id]);

  useEffect(() => {
    initializeCanvas();

    const handleResize = () => initializeCanvas();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [currentDrawing]);

  const getMousePos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const startDrawing = (e) => {
    if (!ctx) return;
    const { x, y } = getMousePos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing || !ctx) return;
    const { x, y } = getMousePos(e);

    if (tool === "draw") {
      ctx.lineTo(x, y);
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth;
      ctx.lineCap = "round";
      ctx.stroke();
    } else if (tool === "erase") {
      ctx.clearRect(
        x - strokeWidth / 2,
        y - strokeWidth / 2,
        strokeWidth,
        strokeWidth
      );
    }
  };

  const stopDrawing = () => {
    if (!ctx) return;
    ctx.closePath();
    setIsDrawing(false);
  };

  const saveOrUpdateDrawing = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
  
    const canvasData = canvas.toDataURL("image/png");
  
    const title = currentDrawing?.title || prompt("Enter a title for your project:");
  
    if (!title) {
      alert("Title is required.");
      return;
    }
  
    const data = {
      title : title,
      drawing: canvasData,
    };
  
    const updateData = {
      drawId: currentDrawing?._id || null,
      title,
      drawing: canvasData,
    };
  
    console.log(data);
  
    if (id === "new") {
      try {
        const response = await DrawService.saveDrawing(data, accessToken);
        alert("Drawing saved successfully!");
        setCurrentDrawing(response.data);
        navigate(`/dashboard/draw/${response.data._id}`);
      } catch (error) {
        console.error("Error saving drawing:", error.data);
        console.log("Failed to save the drawing. Please try again.");
      }
    } else {
      try {
        await DrawService.updateDrawing(updateData, accessToken);
        alert("Drawing updated successfully!");
      } catch (error) {
        console.error("Error updating drawing:", error);
        alert("Failed to update the drawing. Please try again.");
      }
    }
  };
  
  

  const deleteDrawing = async () => {
    try {
      await DrawService.deleteDrawingById(currentDrawing?._id, accessToken);
      alert("Drawing deleted successfully!");
      setCurrentDrawing(null);
      navigate("/dashboard/draw")
    } catch (error) {
      console.error("Error deleting drawing:", error);
      alert("Failed to delete the drawing. Please try again.");
    }
  };

  return (
    <div className="w-full flex flex-col items-center pt-3 bg-blue-400 h-screen overflow-hidden relative">
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        style={{
          backgroundColor: canvasColor ? "#f0f0f0" : "#2e2e2e",
          width: "90vw",
          height: "80vh",
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
          borderRadius: "10px",
        }}
      />
      <div className="flex flex-wrap w-[90vw] h-18 items-center justify-center gap-2 md:gap-20">
        <div className="bgColorSelector w-fit h-9 lg:h-10 flex items-center bg-[#39a2ff] rounded-2xl px-2 gap-2">
          <button
            onClick={() => setCanvasColor(false)}
            className="w-8 h-8 bg-[#2e2e2e] rounded-full"
          ></button>
          <button
            onClick={() => setCanvasColor(true)}
            className="w-8 h-8 bg-[#f0f0f0] rounded-full"
          ></button>
        </div>
        <div className="bgColorSelector w-fit h-9 lg:h-10 flex items-center bg-[#39a2ff] rounded-2xl px-2 gap-2">
          <button
            onClick={() => colorPicker("#000000")}
            className="w-8 h-8 bg-[#000000] rounded-full"
          ></button>
          <button
            onClick={() => colorPicker("#ff0000")}
            className="w-8 h-8 bg-[#ff0000] rounded-full"
          ></button>
          <button
            onClick={() => colorPicker("#ffff00")}
            className="w-8 h-8 bg-[#ffFF00] rounded-full"
          ></button>
          <button
            onClick={() => colorPicker("#0000ff")}
            className="w-8 h-8 bg-[#0000FF] rounded-full"
          ></button>
          <button
            onClick={() => colorPicker("#00ff00")}
            className="w-8 h-8 bg-[#00ff00] rounded-full"
          ></button>
        </div>
        <div className="toolSelector w-fit  h-9 lg:h-10 flex items-center bg-[#39a2ff] rounded-2xl px-2 gap-2">
          <button
            className="w-8 h-8 rounded-full flex items-center justify-center object-contain bg-sky-blue"
            onClick={() => setTool("draw")}
          >
            <img className="w-2/3 h-2/3" src={pen} alt="" />
          </button>
          <input
            type="range"
            min="1"
            max="50"
            value={strokeWidth}
            onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
            className="w-20"
          />
          <button
            className="w-8 h-8 rounded-full flex items-center justify-center object-contain bg-sky-blue"
            onClick={() => setTool("erase")}
          >
            <img className="w-2/3 h-2/3" src={eraser} alt="" />
          </button>
        </div>
        <div className="flex gap-1">
          <button
            onClick={saveOrUpdateDrawing}
            className="bg-sky-blue px-4 h-9 lg:h-10 rounded text-white"
          >
            Save
          </button>
          <button
            onClick={() => deleteDrawing()}
            className="bg-sky-blue px-4 h-9 lg:h-10 rounded text-white"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DrawingCanvas;
