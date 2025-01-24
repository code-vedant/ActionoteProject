import React, { useRef, useEffect, useState, useMemo } from "react";
import pen from "../../assets/Icons/pen.png";
import eraser from "../../assets/Icons/eraser.png";
import DrawService from "../../Services/draw.service"; // Import the DrawService
import { useSelector } from "react-redux";
import { decrypt, encrypt } from "@/Binders/Encypt";
import { useNavigate, useParams } from "react-router-dom";

function DrawingCanvas() {
  const { id } = useParams();
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(10);
  const [canvasColor, setCanvasColor] = useState("#2e2e2e");
  const [ctx, setCtx] = useState(null);
  const [tool, setTool] = useState("draw");
  const [colorTab, setColorTab] = useState(false);
  const [widthCanvas, setWidthCanvas] = useState("1280px");
  const [heightCanvas, setHeightCanvas] = useState("720px");
  const accessToken = useSelector((state) => state.auth.accessToken);

  const initializeCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
  
      const context = canvas.getContext("2d");
      if (context) {
        context.fillStyle = canvasColor; // Initialize with canvas background color
        context.fillRect(0, 0, canvas.width, canvas.height);
        setCtx(context);
      }
    }
  };
  

  console.log(decrypt(id));

  useEffect(() => {
    initializeCanvas();

    const handleResize = () => initializeCanvas();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const strokeColorChanger = (color) => setStrokeColor(color);

  const handleCanvasColor = (isLight) => setCanvasColor(isLight);

  const getMousePos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
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
  console.log("ID from useParams:", id);


  // const loadDrawing = async () => {
  //   if (ctx && id.trim() !== "startedNewDrawing") {
  //     try {
  //       const res = await DrawService.getDrawingById(decrypt(id), accessToken);
  //       const canvas = canvasRef.current;
  //       const img = new Image();
  //       img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  //       img.src = `data:image/png;base64,${res.data.drawing}`;
  //     } catch (error) {
  //       console.error("Error loading drawing:", error.message);
  //     }
  //   }
  // };
  

  // useEffect(() => {
  //   if (ctx && id.trim() !== "startedNewDrawing") {
  //     loadDrawing();
  //   }
  // }, [id, ctx]);
  

  const saveDrawing = async () => {
    const canvas = canvasRef.current;
    const context = ctx;

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempContext = tempCanvas.getContext("2d");

    tempContext.fillStyle = canvasColor;
    tempContext.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    tempContext.drawImage(canvas, 0, 0);

    const dataURL = tempCanvas.toDataURL("image/png");

    const drawingData = {
      drawing: dataURL,
    };
    try {
      const res = await DrawService.saveDrawing(drawingData, accessToken);
      alert("Drawing saved successfully");
      navigate(`/dashboard/draw/${encrypt(res.data._id)}`);
    } catch (error) {
      console.error("Error saving drawing:", error);
    }
  };

  const updateDrawing = async () => {
    const canvas = canvasRef.current;
    const context = ctx;

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempContext = tempCanvas.getContext("2d");

    tempContext.fillStyle = canvasColor;
    tempContext.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    tempContext.drawImage(canvas, 0, 0);

    const dataURL = tempCanvas.toDataURL("image/png");

    const drawingData = {
      drawId: decrypt(id),
      drawing: dataURL,
    };
    console.log(drawingData);

    try {
      await DrawService.updateDrawing(drawingData, accessToken);
      alert("Drawing updated successfully");
    } catch (error) {
      console.error("Error saving drawing:", error);
    }
  };

  const savePNG = () => {
    const canvas = canvasRef.current;
    const context = ctx;

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempContext = tempCanvas.getContext("2d");

    tempContext.fillStyle = canvasColor;
    tempContext.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    tempContext.drawImage(canvas, 0, 0);

    const dataURL = tempCanvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "drawing.png";
    link.click();
  };

  const deleteDrawing = async () => {
    try {
      const res = await DrawService.deleteDrawingById(decrypt(id), accessToken);
      navigate("/dashboard/draw");
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="min-w-full flex flex-col items-center pt-7 min-h-screen relative">
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        style={{
          backgroundColor: canvasColor,
          width: widthCanvas,
          height: heightCanvas,
        }}
      />
      <div className="absolute flex flex-col bg-gray-200 shadow-lg justify-start py-3 shadow-gray-600 top-1/2 right-8 -translate-x-1/2 -translate-y-1/2 z-50 w-12 h-fit items-center gap-2 px-5 rounded-full">
        <div className="bgColorSelector border-[1px] border-[#39a2ff] px-4 w-full h-fit py-2 rounded-md flex flex-col items-center gap-2">
          <button
            onClick={() => {
              setWidthCanvas("1080px");
              setHeightCanvas("600px");
            }}
            className="w-6 h-4 bg-[#1d1d1d] rounded-md"
          ></button>
          <button
            onClick={() => {
              setWidthCanvas("480px");
              setHeightCanvas("600px");
            }}
            className="w-4 h-6 bg-[#1d1d1d] rounded-md"
          ></button>
          <button
            onClick={() => {
              setWidthCanvas("512px");
              setHeightCanvas("512px");
            }}
            className="w-5 h-5 bg-[#1d1d1d] rounded-md"
          ></button>
        </div>
        <div className="bgColorSelector border-[1px] border-[#39a2ff] h-fit w-full px-4 py-2 rounded-md flex flex-col items-center gap-2">
          <input
            type="color"
            className="w-8 h-8 rounded-xl p-0 appearance-none cursor-pointer border-none"
            style={{ background: "none", outline: "none" }}
            onChange={(e) => handleCanvasColor(e.target.value)}
          />

          <button
            onClick={() => handleCanvasColor("#2e2e2e")}
            className="w-6 h-6 bg-[#2e2e2e] rounded-md"
          ></button>
          <button
            onClick={() => handleCanvasColor("#f0f0f0")}
            className="w-6 h-6 bg-[#f0f0f0] border-[1px] border-black rounded-md"
          ></button>
        </div>

        <div className="toolSelector relative h-fit w-full px-4 py-2 flex flex-col items-center gap-2">
          <button
            className={`h-8 w-8 aspect-square rounded-md border-[1px] border-[#39a2ff] flex justify-center items-center 
              ${tool === "draw" ? "bg-[#39a2ff]" : "bg-slate-500"}`}
            onClick={() => {
              setTool("draw");
              setColorTab((prev) => !prev);
            }}
          >
            <img src={pen} alt="Draw Tool" className="w-6 h-6" />
          </button>
          {colorTab && (
            <div className="absolute top-5 right-0 -translate-x-12 bg-[#f7f8f9] dark:bg-[#4c4c4c] p-3 rounded w-36 shadow-lg flex flex-col items-center gap-2">
              <input
                type="range"
                min="1"
                max="50"
                value={strokeWidth}
                onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
                className="w-20"
              />
              <input
                type="color"
                className="w-8 h-8 rounded-xl p-0 appearance-none cursor-pointer border-none"
                style={{ background: "none", outline: "none" }}
                onChange={(e) => strokeColorChanger(e.target.value)}
              />
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => strokeColorChanger("#000000")}
                  className="w-6 h-6 bg-black rounded-full"
                ></button>
                <button
                  onClick={() => strokeColorChanger("#facc11")}
                  className="w-6 h-6 bg-yellow-400 rounded-full"
                ></button>
                <button
                  onClick={() => strokeColorChanger("#dc2626")}
                  className="w-6 h-6 bg-red-600 rounded-full"
                ></button>
                <button
                  onClick={() => strokeColorChanger("#143cbb")}
                  className="w-6 h-6 bg-blue-800 rounded-full"
                ></button>
                <button
                  onClick={() => strokeColorChanger("#4ade80")}
                  className="w-6 h-6 bg-green-400 rounded-full"
                ></button>
                <button
                  onClick={() => strokeColorChanger("#a855f7")}
                  className="w-6 h-6 bg-purple-500 rounded-full"
                ></button>
                <button
                  onClick={() => strokeColorChanger("#f43f5e")}
                  className="w-6 h-6 bg-rose-500 rounded-full"
                ></button>
                <button
                  onClick={() => strokeColorChanger("#0ea5e9")}
                  className="w-6 h-6 bg-sky-500 rounded-full"
                ></button>
                <button
                  onClick={() => strokeColorChanger("#fde047")}
                  className="w-6 h-6 bg-yellow-300 rounded-full"
                ></button>
                <button
                  onClick={() => strokeColorChanger("#ef4444")}
                  className="w-6 h-6 bg-red-500 rounded-full"
                ></button>
                <button
                  onClick={() => strokeColorChanger("#9ca3af")}
                  className="w-6 h-6 bg-gray-400 rounded-full"
                ></button>
                <button
                  onClick={() => strokeColorChanger("#14b8a6")}
                  className="w-6 h-6 bg-teal-500 rounded-full"
                ></button>
                <button
                  onClick={() => strokeColorChanger("#f97316")}
                  className="w-6 h-6 bg-orange-500 rounded-full"
                ></button>
                <button
                  onClick={() => strokeColorChanger("#9333ea")}
                  className="w-6 h-6 bg-indigo-600 rounded-full"
                ></button>
                <button
                  onClick={() => strokeColorChanger("#34d399")}
                  className="w-6 h-6 bg-emerald-400 rounded-full"
                ></button>
                <button
                  onClick={() => strokeColorChanger("#34d348")}
                  className="w-6 h-6 bg-[#34d348] rounded-full"
                ></button>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => setTool("erase")}
          className={`h-8 w-8  aspect-square rounded-md border-[1px] border-[#39a2ff] flex justify-center items-center 
          ${tool === "erase" ? "bg-[#39a2ff]" : "bg-slate-500"}`}
        >
          <img src={eraser} alt="Draw Tool" className="w-6 h-6" />
        </button>
        <button
          onClick={id !== "startedNewDrawing" ? updateDrawing : saveDrawing}
          className="bg-[#39a2ff] font-light aspect-square py-2 rounded-full text-white"
        >
          {id !== "startedNewDrawing" ? <h2 className="text-xs px-1">Update</h2> : "Save"}
        </button>
        <button
          onClick={savePNG}
          className="border-[3px] border-[#39a2ff] font-bold aspect-square py-1 text-xs px-1 rounded-full text-[#39a2ff]"
        >
          .png
        </button>

        {id !== "startedNewDrawing" && (
          <button
            onClick={deleteDrawing}
            className="border-[3px] border-red-500 font-bold aspect-square py-1 text-xs  rounded-full text-red-500 hover:bg-red-500 hover:text-white"
          >
            delete
          </button>
        )}
      </div>
    </div>
  );
}

export default DrawingCanvas;
