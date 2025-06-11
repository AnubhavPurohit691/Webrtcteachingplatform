"use client"
import { Canvas, FabricObject, PencilBrush } from 'fabric'
import React, { useEffect, useRef, useState } from 'react'
import { FaRegSquare, FaRegCircle, FaRegDotCircle, FaPencilAlt, FaEraser, FaFont, FaComment, FaArrowRight } from "react-icons/fa";
import { handleArrow, handleCircle,  handleEraser, handlePencil, handleRectangle, handleText } from '../hooks/function';

const Canvapage = () => {
  const Canvaref = useRef<HTMLCanvasElement | null>(null)
  const [canvas, setCanvas] = useState<Canvas >()
  const [color, setcolor]=useState<string>("#ffffff")
  const [drawmode,setdrawmode]=useState(false)
  const[selectobj,setselectobj]=useState<FabricObject|null>()

  useEffect(() => {
    let initCanva: Canvas | null = null
    if (Canvaref.current) {
      initCanva = new Canvas(Canvaref.current, {
        width: window.innerWidth,
        height: window.innerHeight,
        selection:true
      });
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
    if (canvas) {
      if (!canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush = new PencilBrush(canvas);
      }
      canvas.freeDrawingBrush.color = color;
      canvas.freeDrawingBrush.width = 5;
    }
  }, [canvas, color]);

  return (
    <div className='w-full h-screen relative'>
      <canvas ref={Canvaref} />
      <div className='absolute top-10 left-1/2 -translate-x-1/2 h-12 min-w-lg bg-white rounded-2xl flex items-center gap-2 px-4 shadow-lg flex justify-between'>
        <button className='p-2 hover:bg-gray-400 rounded-lg transition-colors' onClick={() => canvas && handleRectangle({canvas})}>
          <FaRegSquare className="w-5 h-5" />
        </button>
        <button className='p-2 hover:bg-gray-400 rounded-lg transition-colors' onClick={()=>canvas&&handleCircle({canvas})}>
          <FaRegCircle className="w-5 h-5" />
        </button>
        <button className='p-2 hover:bg-gray-400 rounded-lg transition-colors' onClick={()=>canvas && handleArrow({canvas})}>
          <FaArrowRight className="w-5 h-5" />
        </button>
        <button className='p-2 hover:bg-gray-400 rounded-lg transition-colors' onClick={()=>canvas && handleText({canvas})}>
          <FaFont className="w-5 h-5" />
        </button>
        <button className='p-2 hover:bg-gray-400 rounded-lg transition-colors' onClick={()=>canvas && handlePencil({canvas},setdrawmode,drawmode)}>
          <FaPencilAlt className="w-5 h-5" />
        </button>
        <button className='p-2 hover:bg-gray-400 rounded-lg transition-colors' onClick={()=>canvas && handleEraser({canvas})}>
          <FaEraser className="w-5 h-5" />
        </button>
        
      </div>
    </div>
  )
}

export default Canvapage
