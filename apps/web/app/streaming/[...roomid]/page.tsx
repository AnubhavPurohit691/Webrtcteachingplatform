"use client";
import {
  Canvas,
  Circle,
  FabricObject,
  Group,
  IText,
  Line,
  Path,
  Rect,
  Triangle,
} from "fabric";
import React, { useEffect, useRef, useState } from "react";
import { use } from "react";

import { useSocket } from "../../../hooks/useSocket";
const Canvapage = ({ params }: { params: Promise<{ roomid: string }> }) => {
  const Canvaref = useRef<HTMLCanvasElement | null>(null);
  const [canvas, setCanvas] = useState<Canvas>();
  const socket = useSocket();
  const { roomid } = use(params);

  useEffect(() => {
    let initCanva: Canvas | null = null;
    if (Canvaref.current) {
      const data = {
        width: window.innerWidth,
        height: window.innerHeight,
        selection: true,
      };
      initCanva = new Canvas(Canvaref.current, data);
      initCanva.backgroundColor = "#000";
      initCanva.renderAll();
      setCanvas(initCanva);
    }

    const handleResize = () => {
      if (initCanva) {
        initCanva.setHeight(window.innerHeight);
        initCanva.setWidth(window.innerWidth);
        initCanva.renderAll();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      initCanva?.dispose();
    };
  }, []);
  useEffect(() => {
    if (!socket || !roomid) return;

    const joinRoom = () => {
      socket.send(
        JSON.stringify({
          type: "streaming",
          roomid: roomid.toString(),
          action: "play",
        }),
      );
    };

    if (socket.readyState === WebSocket.OPEN) {
      joinRoom();
    } else {
      socket.addEventListener("open", joinRoom);

      // Cleanup listener when component unmounts or socket changes
      return () => {
        socket.removeEventListener("open", joinRoom);
      };
    }
  }, [socket, roomid]);

  useEffect(() => {
    if (!socket || !canvas) return;
    function getobject(canvas: Canvas, id: string) {
      return canvas.getObjects().find((obj) => obj.get("id") === id);
    }

    socket.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);

        switch (data.data.data.type) {
          case "rectangle":
            console.log(data.data.data.data);
            const rect = new Rect(data.data.data.data);
            rect.set("id", data.data.data.id);
            rect.set("timestamp", data.data.data.timestamp);
            canvas.add(rect);

            canvas.renderAll();
            break;
          case "circle":
            const cir = new Circle(data.data.data.data);
            cir.set("id", data.data.data.id);
            cir.set("timestamp", data.data.data.timestamp);
            canvas.add(cir);

            canvas.renderAll();
            break;
          case "text":
            console.log(data);
            const text = new IText(data.data.data.text, data.data.data.data);
            text.set("id", data.data.data.id);
            text.set("timestamp", data.data.data.timestamp);
            canvas.add(text);
            canvas.renderAll();
            break;
          case "arrow":
            console.log(data.data.data.linedata);
            const line = new Line(
              [
                data.data.data.linedata.x1,
                data.data.data.linedata.y1,
                data.data.data.linedata.x2,
                data.data.data.linedata.y2,
              ],
              data.data.data.linedata.data,
            );
            const triangle = new Triangle(data.data.data.triangledata);
            const Arrow = new Group([line, triangle], data.data.data.arrowdata);
            Arrow.set("id", data.data.data.id);
            Arrow.set("timestamp", data.data.data.timestamp);
            canvas.add(Arrow);
            canvas.renderAll();
            break;
          case "drawing":
            console.log(data);
            const path = new Path(
              data.data.data.data.path,
              data.data.data.data,
            );
            path.set("id", data.data.data.id);
            path.set("timestamp", data.data.data.timestamp);
            canvas.add(path);
            canvas.renderAll();
            break;
          case "erase":
            console.log(data);
            const obj = getobject(canvas, data.data.data.id);
            if (obj) {
              canvas.remove(obj);
              canvas.renderAll();
            }
            break;
          case "modification":
            console.log(data);
            const modifiedobj = getobject(canvas, data.data.data.id);
            if (modifiedobj) {
              // Only set serializable properties
              Object.entries(data.data.data.data).forEach(([key, value]) => {
                if (key !== "type" && key !== "version") {
                  modifiedobj.set(key, value);
                }
              });
              modifiedobj.set("timestamp", data.data.data.timestamp);
              modifiedobj.setCoords();
              canvas.renderAll();
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
    <div className="w-full h-screen relative">
      <canvas ref={Canvaref} />
    </div>
  );
};

export default Canvapage;
