import { time, timeStamp } from "console";
import {
  Canvas,
  Circle,
  Group,
  IText,
  Line,
  PencilBrush,
  Rect,
  Triangle,
} from "fabric";
export const handleRectangle = (
  { canvas }: { canvas: Canvas },
  socket: WebSocket,
  roomid: string,
  admin: boolean,
  recording: boolean,
) => {
  const id = crypto.randomUUID();
  const rec_data = {
    type: "rectangle",
    id,
    data: {
      width: 100,
      height: 100,
      fill: "",
      stroke: "white",
      left: 100,
      top: 100,
    },
    timestamp: Date.now(),
    roomid: roomid,
    admin,
    recording,
  };
  const rectangle = new Rect(rec_data.data);
  rectangle.set("id", id);
  rectangle.set("timestamp", rec_data.timestamp);
  canvas.add(rectangle);
  canvas.setActiveObject(rectangle);
  canvas.renderAll();
  socket.send(JSON.stringify(rec_data));
};

export const handleCircle = (
  { canvas }: { canvas: Canvas },
  socket: WebSocket,
  roomid: string,
  admin: boolean,
  recording: boolean,
) => {
  const id = crypto.randomUUID();
  const cir_data = {
    type: "circle",
    id,
    data: {
      radius: 50,
      fill: "",
      stroke: "white",
      left: 100,
      top: 200,
    },
    timestamp: Date.now(),
    roomid: roomid,
    admin,
    recording,
  };
  const circle = new Circle(cir_data.data);
  circle.set("id", id);
  circle.set("timestamp", cir_data.timestamp);
  socket.send(JSON.stringify(cir_data));
  canvas.add(circle);
  canvas.setActiveObject(circle);
  canvas.renderAll();
};

export const handleArrow = (
  { canvas }: { canvas: Canvas },
  socket: WebSocket,
  roomid: string,
  admin: boolean,
  recording: boolean,
) => {
  const id = crypto.randomUUID();
  const x1 = 100,
    y1 = 100,
    x2 = 250,
    y2 = 200;

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
  const triangledata = {
    width: 12,
    height: 16,
    fill: "white",
    left: x2,
    top: y2,
    originX: "center" as const,
    originY: "center" as const,
    angle: degrees + 90, // rotate to point in the direction of the line
    selectable: false,
    evented: false,
  };
  // Create the triangle (arrowhead)
  const triangle = new Triangle(triangledata);
  const data = {
    type: "arrow",
    id,
    triangledata: triangledata,
    arrowdata: {
      left: 0,
      top: 0,
      selectable: true,
    },
    linedata: {
      x1,
      x2,
      y1,
      y2,
      data: {
        stroke: "white",
        strokeWidth: 3,
        selectable: false,
        evented: false,
      },
    },
    timestamp: Date.now(),
    roomid: roomid,
    admin,
    recording,
  };
  // Group line and arrowhead together
  const arrow = new Group([line, triangle], data.arrowdata);
  arrow.set("id", data.id);
  arrow.set("timestamp", data.timestamp);
  socket.send(JSON.stringify(data));
  canvas.add(arrow);
  canvas.setActiveObject(arrow);
  canvas.renderAll();
};

export const handleText = (
  { canvas }: { canvas: Canvas },
  socket: WebSocket,
  roomid: string,
  admin: boolean,
  recording: boolean,
) => {
  const id = crypto.randomUUID();
  const Text_data = {
    type: "text",
    text: "click here",
    id,
    timestamp: Date.now(),
    data: {
      left: 150,
      top: 150,
      fontSize: 24,
      fill: "white", // text color
      fontFamily: "Arial",
      stroke: "", // optional stroke around letters
      editable: true, // default true for IText
    },
    roomid: roomid,
    admin: admin,
    recording,
  };
  const text = new IText(Text_data.text, Text_data.data);
  text.set("id", Text_data.id);
  text.set("timestamp", Text_data.timestamp);
  socket.send(JSON.stringify(Text_data));
  canvas.add(text);
  canvas.setActiveObject(text);
  canvas.renderAll();
};

export const handlePencil = (
  { canvas }: { canvas: Canvas },
  setdrawmode: any,
  drawmode: any,
  socket: WebSocket,
  roomid: string,
  admin: boolean,
  recording: boolean,
) => {
  const id = crypto.randomUUID();
  const timestamp = Date.now();
  const newmode = !drawmode;
  setdrawmode(newmode);
  canvas.isDrawingMode = newmode;
  if (newmode) {
    canvas.freeDrawingBrush = new PencilBrush(canvas);
    canvas.freeDrawingBrush.color = "#fff";
    canvas.freeDrawingBrush.width = 5;
    canvas.on("path:created", (opt) => {
      const path = opt.path;
      path.set("id", id);
      path.set("timestamp", timestamp);
      socket.send(
        JSON.stringify({
          type: "drawing",
          timestamp,
          id,
          roomid,
          data: path.toObject(),
          admin: admin,
          recording,
        }),
      );
    });
  }
};

export const handleEraser = (
  { canvas }: { canvas: Canvas },
  socket: WebSocket,
  roomid: string,
  admin: boolean,
  recording: boolean,
) => {
  const activeObject = canvas.getActiveObject();

  if (activeObject) {
    const id = activeObject.get("id");
    if (id) {
      socket.send(
        JSON.stringify({
          type: "erase",
          id,
          roomid,
          timestamp: Date.now(),
          admin: admin,
          recording,
        }),
      );
    }
    canvas.remove(activeObject);
    canvas.renderAll();
  }
};
