
import { Canvas, Circle, Group, IText, Line, PencilBrush, Rect, Triangle } from "fabric"

export const handleRectangle=({canvas}:{canvas:Canvas})=>{
    const rect = new Rect({
        width:100,
        height:100,
        fill:"",
        stroke:"white",
        left:100,
        top:100,
    })
   canvas.add(rect)
   canvas.setActiveObject(rect)
   canvas.renderAll()
}

export const handleCircle=({canvas}:{canvas:Canvas})=>{
    const circle =new Circle({
        radius:50,
        fill:"",
        stroke:"white",
        left:100,
        top:200
    })
    canvas.add(circle)
    canvas.setActiveObject(circle)
    canvas.renderAll()
}

export const handleArrow=({canvas}:{canvas:Canvas})=>{
    const x1 = 100, y1 = 100, x2 = 250, y2 = 200;

  // Create the line
  const line = new Line([x1, y1, x2, y2], {
    stroke: "white",
    strokeWidth: 3,
    selectable: false,
    evented: false,
  });

  // Calculate the angle for the arrowhead
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const degrees = (angle * 180) / Math.PI;

  // Create the triangle (arrowhead)
  const triangle = new Triangle({
    width: 12,
    height: 16,
    fill: "white",
    left: x2,
    top: y2,
    originX: "center",
    originY: "center",
    angle: degrees + 90, // rotate to point in the direction of the line
    selectable: false,
    evented: false,
  });

  // Group line and arrowhead together
  const arrow = new Group([line, triangle], {
    left: 0,
    top: 0,
    selectable: true,
  });

  canvas.add(arrow);
  canvas.setActiveObject(arrow);
  canvas.renderAll();
}

export const handleText=({canvas}:{canvas:Canvas})=>{
    const text = new IText("Double-click to edit", {
        left: 150,
        top: 150,
        fontSize: 24,
        fill: "white", // text color
        fontFamily: "Arial",
        stroke: "", // optional stroke around letters
        editable: true, // default true for IText
      });
      canvas.add(text);
      canvas.setActiveObject(text);
      canvas.renderAll();
}

export const handlePencil=({canvas}:{canvas:Canvas},setdrawmode:any,drawmode:any)=>{
    const newmode = !drawmode
    setdrawmode(newmode)
    canvas.isDrawingMode=newmode
    if(newmode){
        canvas.freeDrawingBrush=new PencilBrush(canvas)
        canvas.freeDrawingBrush.color="#fff"
        canvas.freeDrawingBrush.width=5
    }
}

export const handleEraser=({canvas}:{canvas:Canvas})=>{
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.remove(activeObject);
      canvas.renderAll();
    }
}

