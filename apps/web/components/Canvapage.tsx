"use client"
import { Canvas, Circle, FabricObject, Group, IText, Line, PencilBrush, Rect, Triangle } from 'fabric'
import React, { useEffect, useRef, useState } from 'react'
import { FaRegSquare, FaRegCircle, FaRegDotCircle, FaPencilAlt, FaEraser, FaFont, FaComment, FaArrowRight } from "react-icons/fa";
import { handleArrow, handleCircle,  handleEraser, handlePencil, handleRectangle, handleText } from '../hooks/function';
import { useSocket } from '../hooks/useSocket';

const Canvapage = () => {
  const Canvaref = useRef<HTMLCanvasElement | null>(null)
  const [canvas, setCanvas] = useState<Canvas >()
  const [drawmode,setdrawmode]=useState(false)
  const[selectobj,setselectobj]=useState<FabricObject|null>()
  const socket = useSocket()
  
  useEffect(() => {
    let initCanva: Canvas | null = null
    if (Canvaref.current) {
      const data = {
        width: window.innerWidth,
        height: window.innerHeight,
        selection:true
      }
      initCanva = new Canvas(Canvaref.current, data);
      initCanva.backgroundColor = "#000"
      initCanva.renderAll()
      setCanvas(initCanva)
    }
    
    const handleResize = () => {
      if (initCanva) {
        initCanva.setHeight(window.innerHeight);
        initCanva.setWidth(window.innerWidth);
        initCanva.renderAll();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      initCanva?.dispose()
    }
  }, [])


  
  useEffect(() => {
  if (!socket || !canvas) return;

  socket.onmessage = (e) => {
    try {
   const data =JSON.parse(e.data)
      switch (data.type) {
        case "rectangle":
          const rect = new Rect(data.data)
          canvas.add(rect)
          canvas.setActiveObject(rect)
          canvas.renderAll()
          break;
        case "circle":
          const cir = new Circle(data.data)
          canvas.add(cir)
          canvas.setActiveObject(cir)
          canvas.renderAll()
          break;
        case "text":
          const text = new IText(data.type,data.data);
          canvas.add(text)
          canvas.setActiveObject(text)
          canvas.renderAll()
          case "erase":
          canvas.remove(data.data)
          canvas.renderAll()
          break;
        case "arrow":
            const line = new Line([data.linedata.x1, data.linedata.y1, data.linedata.x2, data.linedata.y2], data.linedata.data);
            const triangle = new Triangle(data.triangledata)
            const Arrow = new Group([line,triangle],data.arrowdata)
            canvas.add(Arrow)
            canvas.setActiveObject(Arrow)
            canvas.renderAll()
            break;
        default:
          break;
      }
    
    } catch (err) {
      console.error("Failed to handle WebSocket message:", err);
    }
  };
}, [socket, canvas]);

  return (
    <div className='w-full h-screen relative'>
      <canvas ref={Canvaref} />
      <div className='absolute top-10 left-1/2 -translate-x-1/2 h-12 min-w-lg bg-white rounded-2xl  items-center gap-2 px-4 shadow-lg flex justify-between'>
        <button className='p-2 hover:bg-gray-400 rounded-lg transition-colors' onClick={() => canvas && socket && handleRectangle({canvas}, socket)}>
          <FaRegSquare className="w-5 h-5" />
        </button>
        <button className='p-2 hover:bg-gray-400 rounded-lg transition-colors' onClick={()=>canvas&&socket&& handleCircle({canvas},socket)}>
          <FaRegCircle className="w-5 h-5" />
        </button>
        <button className='p-2 hover:bg-gray-400 rounded-lg transition-colors' onClick={()=>canvas && socket&&  handleArrow({canvas},socket)}>
          <FaArrowRight className="w-5 h-5" />
        </button>
        <button className='p-2 hover:bg-gray-400 rounded-lg transition-colors' onClick={()=>canvas && socket&& handleText({canvas},socket)}>
          <FaFont className="w-5 h-5" />
        </button>
        <button className='p-2 hover:bg-gray-400 rounded-lg transition-colors' onClick={()=>canvas && handlePencil({canvas},setdrawmode,drawmode)}>
          <FaPencilAlt className="w-5 h-5" />
        </button>
        <button className='p-2 hover:bg-gray-400 rounded-lg transition-colors' onClick={()=>canvas &&  handleEraser({canvas})}>
          <FaEraser className="w-5 h-5" />
        </button>
        
      </div>
    </div>
  )
}

export default Canvapage
