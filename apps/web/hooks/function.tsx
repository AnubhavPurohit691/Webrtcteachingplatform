
import { Canvas, Circle, Group, IText, Line, PencilBrush, Rect, Triangle } from "fabric"
import { randomUUID } from "crypto"
export const handleRectangle = ({ canvas }: { canvas: Canvas }, socket: WebSocket) => {
  const rec_data = {
    type: "rectangle",
    data: {
      width: 100,
      height: 100,
      fill: "",
      stroke: "white",
      left: 100,
      top: 100,
      id:`rect_$`
    }
  }
  const rect = new Rect(rec_data.data)
  socket.send(JSON.stringify(rec_data))
  canvas.add(rect)
  canvas.setActiveObject(rect)
  canvas.renderAll()
}

export const handleCircle = ({ canvas }: { canvas: Canvas },socket:WebSocket) => {
  const cir_data = {
    type: "circle",
    data: {
      radius: 50,
      fill: "",
      stroke: "white",
      left: 100,
      top: 200
    }
  }
  const circle = new Circle(cir_data.data)
  socket.send(JSON.stringify(cir_data))
  canvas.add(circle)
  canvas.setActiveObject(circle)
  canvas.renderAll()
}

export const handleArrow = ({ canvas }: { canvas: Canvas },socket:WebSocket) => {
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
  const triangledata ={
    width: 12,
    height: 16,
    fill: "white",
    left: x2,
    top: y2,
    originX: 'center' as const,
    originY: 'center' as const,
    angle: degrees + 90, // rotate to point in the direction of the line
    selectable: false,
    evented: false,
  }
  // Create the triangle (arrowhead)
  const triangle = new Triangle(triangledata);
const data = {
  type:"arrow",
  triangledata:triangledata,
  arrowdata:{
    left: 0,
    top: 0,
    selectable: true,
  },
  linedata:{
    x1,x2,y1,y2,
    data:{
    stroke: "white",
    strokeWidth: 3,
    selectable: false,
    evented: false,
  }},
}
  // Group line and arrowhead together
  const arrow = new Group([line, triangle],{
    left: 0,
    top: 0,
    selectable: true,
  } );
  socket.send(JSON.stringify(data))
  canvas.add(arrow);
  canvas.setActiveObject(arrow);
  canvas.renderAll();
}

export const handleText = ({ canvas }: { canvas: Canvas },socket:WebSocket) => {
  const Text_data = {
    type: "text", 
    data: {
      left: 150,
      top: 150,
      fontSize: 24,
      fill: "white", // text color
      fontFamily: "Arial",
      stroke: "", // optional stroke around letters
      editable: true, // default true for IText
    }
  }
  const text = new IText("text",Text_data.data);
  socket.send(JSON.stringify(Text_data))
  canvas.add(text);
  canvas.setActiveObject(text);
  canvas.renderAll();
}

export const handlePencil = ({ canvas }: { canvas: Canvas }, setdrawmode: any, drawmode: any) => {
  const newmode = !drawmode
  setdrawmode(newmode)
  canvas.isDrawingMode = newmode
  if (newmode) {
    canvas.freeDrawingBrush = new PencilBrush(canvas)
    canvas.freeDrawingBrush.color = "#fff"
    canvas.freeDrawingBrush.width = 5
  }
}

export const handleEraser = ({ canvas }: { canvas: Canvas }) => {
  const activeObject = canvas.getActiveObject();
  const data = {
    type:"erase",
    data:activeObject
  }
  if (activeObject) {
    canvas.remove(activeObject);
    canvas.renderAll();
  }
}

