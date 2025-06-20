"use client"
import { Canvas, Circle, FabricObject, Group, IText, Line, Path, PencilBrush, Rect, Triangle } from 'fabric'
import React, { useEffect, useRef, useState } from 'react'
import { FaRegSquare, FaRegCircle, FaRegDotCircle, FaPencilAlt, FaEraser, FaFont, FaComment, FaArrowRight } from "react-icons/fa";
import { handleArrow, handleCircle, handleEraser, handlePencil, handleRectangle, handleText } from '../hooks/function';
import { useSocket } from '../hooks/useSocket';


const Canvapage = () => {
  const Canvaref = useRef<HTMLCanvasElement | null>(null)
  const [canvas, setCanvas] = useState<Canvas>()
  const [drawmode, setdrawmode] = useState(false)
  const [selectobj, setselectobj] = useState<FabricObject | null>()
  const socket = useSocket()

  useEffect(() => {
    let initCanva: Canvas | null = null
    if (Canvaref.current) {
      const data = {
        width: window.innerWidth,
        height: window.innerHeight,
        selection: true
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

useEffect(()=>{
  if(!socket&&!canvas)return
if (canvas&&socket){
      canvas.on("object:modified", (e) => {
        const obj = e.target as FabricObject | null;
        const newtimestamp = Date.now()
        obj?.set("timestamp",newtimestamp)
        if (obj ) {
          // Send only serializable properties
          socket.send(JSON.stringify({
            type:"modification",
            data: obj.toObject(),
            id: obj.get('id'),
            timestamp: obj.get("timestamp")
          }))      
      }
    });
}
},[socket,canvas])

  useEffect(() => {
    if (!socket || !canvas) return;
    function getobject(canvas: Canvas, id: string) {
      return canvas.getObjects().find((obj) => obj.get("id") === id)
    }

    socket.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data)
        switch (data.type) {
          case "rectangle":
            const rect = new Rect(data.data)
            rect.set("id",data.id)
            rect.set("timestamp",data.timestamp)
            canvas.add(rect)
            canvas.setActiveObject(rect)
            canvas.renderAll()
            break;
          case "circle":
            const cir = new Circle(data.data)
            cir.set("id",data.id)
            cir.set("timestamp",data.timestamp)
            canvas.add(cir)
            canvas.setActiveObject(cir)
            canvas.renderAll()
            break;
          case "text":
            const text = new IText(data.text, data.data);
            text.set("id",data.id)
            text.set("timestamp",data.timestamp)
            canvas.add(text)
            canvas.setActiveObject(text)
            canvas.renderAll()
            break;
          case "arrow":
            const line = new Line([data.linedata.x1, data.linedata.y1, data.linedata.x2, data.linedata.y2], data.linedata.data);
            const triangle = new Triangle(data.triangledata)
            const Arrow = new Group([line, triangle], data.arrowdata)
            Arrow.set("id",data.id)
            Arrow.set("timestamp",data.timestamp)
            canvas.add(Arrow)
            canvas.setActiveObject(Arrow)
            canvas.renderAll()
            break;
          case "drawing":
            const path = new Path(data.data.path, data.data)
            path.set("id",data.id)
            path.set("timestamp",data.timestamp)
            canvas.add(path)
            canvas.renderAll()
            break;
          case "erase":
            const obj = getobject(canvas, data.id)
            if (obj) {
              canvas.remove(obj)
              canvas.renderAll()
            }
            break;
          case "modification":
            const modifiedobj = getobject(canvas,data.id)
            if (modifiedobj) {
              // Only set serializable properties
              Object.entries(data.data).forEach(([key, value]) => {
                if (key !== 'type' && key !== 'version') {
                  modifiedobj.set(key, value)
                }
              })
              modifiedobj.set("timestamp",data.timestamp)
              modifiedobj.setCoords();
              canvas.renderAll()
            }
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
        <button className='p-2 hover:bg-gray-400 rounded-lg transition-colors' onClick={() => canvas && socket && handleRectangle({ canvas }, socket)}>
          <FaRegSquare className="w-5 h-5" />
        </button>
        <button className='p-2 hover:bg-gray-400 rounded-lg transition-colors' onClick={() => canvas && socket && handleCircle({ canvas }, socket)}>
          <FaRegCircle className="w-5 h-5" />
        </button>
        <button className='p-2 hover:bg-gray-400 rounded-lg transition-colors' onClick={() => canvas && socket && handleArrow({ canvas }, socket)}>
          <FaArrowRight className="w-5 h-5" />
        </button>
        <button className='p-2 hover:bg-gray-400 rounded-lg transition-colors' onClick={() => canvas && socket && handleText({ canvas }, socket)}>
          <FaFont className="w-5 h-5" />
        </button>
        <button className='p-2 hover:bg-gray-400 rounded-lg transition-colors' onClick={() => canvas && socket && handlePencil({ canvas }, setdrawmode, drawmode, socket)}>
          <FaPencilAlt className="w-5 h-5" />
        </button>
        <button className='p-2 hover:bg-gray-400 rounded-lg transition-colors' onClick={() => canvas && socket && handleEraser({ canvas }, socket)}>
          <FaEraser className="w-5 h-5" />
        </button>

      </div>
    </div>
  )
}

export default Canvapage
