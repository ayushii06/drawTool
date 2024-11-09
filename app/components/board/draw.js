'use client'

import { useState, useLayoutEffect, useRef, useEffect } from "react";
import Image from "next/image";
import rough from 'roughjs/bundled/rough.esm';
import { getStroke } from 'perfect-freehand'
import { useSelector } from "react-redux";
import undoImg from '../../../public/toolbar/undo.svg';
import redoImg from '../../../public/toolbar/redo.svg';
import plus from '../../../public/toolbar/plus.svg';
import minus from '../../../public/toolbar/minus.svg';
import { setIsDownload , setIsReset } from "@/app/slice/optionsSlice";
import { useDispatch } from "react-redux";
const generator = rough.generator();

const createElements=(id,x1, y1, x2, y2, tool , color , size ,fill , style, fillStyle, thinning , smoothing , streamline)=> {

  switch (tool) {
    case 'line':
      const roughElementlie = generator.line(x1, y1, x2, y2, { stroke: color, strokeWidth: size , strokeLineDash: style === 'dashed' ? [5, 5] : style === 'dotted' ? [2, 2] : [] });
      return { id,x1, y1, x2, y2, tool, roughElement: roughElementlie };
      break;

    case 'rectangle':
      const roughElementrect = generator.rectangle(x1, y1, x2 - x1, y2 - y1, { stroke: color, strokeWidth: size, fill: fill, strokeLineDash: style === 'dashed' ? [5, 5] : style === 'dotted' ? [2, 2] : [],fillStyle:fillStyle  });

      console.log(roughElementrect);

      return {id, x1, y1, x2, y2, tool, roughElement:roughElementrect };
      break;

    case 'circle':

    const roughElementcircle = generator.circle((x1 + x2) / 2, (y1 + y2) / 2, Math.abs(x2 - x1), { stroke: color, strokeWidth: size, fill: fill, strokeLineDash: style === 'dashed' ? [5, 5] : style === 'dotted' ? [2, 2] : [],fillStyle:fillStyle  });


      
      console.log(roughElementcircle);
      return { id, x1, y1, x2, y2, tool, roughElement: roughElementcircle };
      break;

    case 'pen':
      
      return { id, tool, points: [{x:x1,y:y1}] , color, size, thinning, smoothing, streamline};
      break;

    case 'eraser':
      return { id, tool, points: [{x:x1,y:y1}] ,color : 'white', size};
      break;

    case 'text':
      return { id, tool,x1,y1,x2,y2, color , size,  text: '' };
      break;

    
    case 'pan':
      return ;
    

    default:
      break;
  }
}

const adjustmentRequired = tool => ["line", "rectangle"].includes(tool);

const average = (a, b) => (a + b) / 2

const getSvgPathFromStroke=(points, closed = true) =>{
  const len = points.length

  if (len < 4) {
    return ``
  }

  let a = points[0]
  let b = points[1]
  const c = points[2]

  let result = `M${a[0].toFixed(2)},${a[1].toFixed(2)} Q${b[0].toFixed(
    2
  )},${b[1].toFixed(2)} ${average(b[0], c[0]).toFixed(2)},${average(
    b[1],
    c[1]
  ).toFixed(2)} T`

  for (let i = 2, max = len - 1; i < max; i++) {
    a = points[i]
    b = points[i + 1]
    result += `${average(a[0], b[0]).toFixed(2)},${average(a[1], b[1]).toFixed(
      2
    )} `
  }

  if (closed) {
    result += 'Z'
  }

  return result
}

const nearPoints=(x, y, x1, y1, name)=> {
  return Math.abs(x - x1) < 5 && Math.abs(y - y1) < 5 ? name : null;
}

const distance = (a,b) => Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);

const onLine = (x1,y1,x2,y2,x,y,maxDistance = 1 ) =>{
  const a = {x:x1,y:y1};
  const b = {x:x2,y:y2};
  const c = {x,y};

  const offset = distance(a,b) - (distance(a,c) + distance(b,c));
  return Math.abs(offset) < maxDistance ? "inside" : null;

}

const positionWithinElement = (x, y, element) =>{
  const {tool , x1, y1, x2, y2} = element;

  switch (tool) {
    case 'line':
      const on = onLine(x1, y1, x2, y2, x, y);
  
      const start = nearPoints(x, y, x1, y1, "start");
      const end = nearPoints(x, y, x2, y2, "end");
  
      return start || end || on;
      break;

    case 'rectangle':
      const topLeft = nearPoints(x, y, x1, y1, "tl");
    const topRight = nearPoints(x, y, x2, y1, "tr");
    const bottomLeft = nearPoints(x, y, x1, y2, "bl");
    const bottomRight = nearPoints(x, y, x2, y2, "br");

    const inside = x >= x1 && x <= x2 && y >= y1 && y <= y2 ? "inside" : null;

    return topLeft || topRight || bottomLeft || bottomRight || inside;
    break;

    case 'circle':
      const center = { x: (x1 + x2) / 2, y: (y1 + y2) / 2 };
      const radius = distance(center, { x: x1, y: y1 });

      const insideCircle = distance(center, { x, y }) < radius;

      return insideCircle ? "inside" : null;
      break;

    case 'pen':
      const betweenAnyPoint = element.points.some((point,index) => {
        const nextPoint = element.points[index + 1];
        if(!nextPoint) return false;

        return onLine(point.x , point.y , nextPoint.x , nextPoint.y , x,y,5)!=null;
      });

      const onPath = betweenAnyPoint ? "inside" : null;

      return onPath;

      break;

    case 'text':
      return x >= x1 && x <= x2 && y >= y1 && y <= y2 ? "inside" : null;

    case 'eraser':
      const betweenAnyPointEraser = element.points.some((point,index) => {
        const nextPoint = element.points[index + 1];
        if(!nextPoint) return false;

        return onLine(point.x , point.y , nextPoint.x , nextPoint.y , x,y,5)!=null;
      });

      const onPathEraser = betweenAnyPointEraser ? "inside" : null;

      return onPathEraser;

      break;

  
    default:
      break;
  }

}

const getElementAtPosition = (x, y, elements)=> {
  return elements.map((element)=>({
    ...element,
    position: positionWithinElement(x, y, element)
  })).find(element => element.position !== null);
}

const cursorForPosition=(position)=> {
  switch (position) {
    case "start":
    case "end":
      return "nesw-resize";
    case "tl":
    case "br":
      return "nwse-resize";
    case "tr":
    case "bl":
      return "nesw-resize";
    case "inside":
      return "move";
    default:
      return "default";
  }
}

const resizedCoordinates=(clientX, clientY, position, coordinates)=> {
  const { x1, y1, x2, y2 } = coordinates;

  switch (position) {
    case "tl":
    case "start":
      return { x1: clientX, y1: clientY, x2, y2 };
    case "tr":
      return { x1, y1: clientY, x2: clientX, y2 };
    case "bl":
      return { x1: clientX, y1, x2, y2: clientY };
    case "br":
    case "end":
      return { x1, y1, x2: clientX, y2: clientY };
  
    default:
      return null ;
  }
}

const useHistory = initialState => {
  const [index, setIndex] = useState(0);
  const [history, setHistory] = useState([initialState]);

  const setState = (action, overwrite = false) => {
    const newState = typeof action === "function" ? action(history[index]) : action;
    if (overwrite) {
      const historyCopy = [...history];
      historyCopy[index] = newState;
      setHistory(historyCopy);
    } else {
      const updatedState = [...history].slice(0, index + 1);
      setHistory([...updatedState, newState]);
      setIndex(prevState => prevState + 1);
    }
  };

  const undo = () => index > 0 && setIndex(prevState => prevState - 1);
  const redo = () => index < history.length - 1 && setIndex(prevState => prevState + 1);

  return [history[index], setState, undo, redo];
};

const drawElement=(rc, ctx, element) =>{
  switch (element.tool) {
    case 'line':
    case 'rectangle':
    case 'circle':
      rc.draw(element.roughElement);
      break;


    case 'pen':
      
    ctx.fillStyle = element.color;
      const myStroke = getStroke(element.points, 
        {
          
          size: element.size,
          smoothing: element.smoothing,
          thinning: element.thinning,
          streamline: element.streamline,
          
        }
      );
      const path = getSvgPathFromStroke(myStroke);
      const myPath = new Path2D(path);
      ctx.fill(myPath);
      break;

    case 'eraser':

      ctx.fillStyle = element.color;
      const eraserStroke = getStroke(element.points, {
        size:element.size
       });
      const eraserPath = getSvgPathFromStroke(eraserStroke);
      const eraser = new Path2D(eraserPath);
      ctx.fill(eraser);
      break;

    case 'text':
      ctx.textBaseline = 'top';
      console.log(element.size);
      ctx.font = `bold ${element.size}px Comic Sans MS`;
     
      
      ctx.fillStyle = element.color;

      ctx.fillText(element.text, element.x1, element.y1);
      break;

    case 'pan':
      break;

    
    default:
      break;
  }
}

const adjustElementCoordinates = element => {
  const { tool, x1, y1, x2, y2 } = element;
  if (tool === "rectangle") {
    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);
    return { x1: minX, y1: minY, x2: maxX, y2: maxY };
  } else {
    if (x1 < x2 || (x1 === x2 && y1 < y2)) {
      return { x1, y1, x2, y2 };
    } else {
      return { x1: x2, y1: y2, x2: x1, y2: y1 };
    }
  }
};

const usePressedKeys = () => {
  const [pressedKeys, setPressedKeys] = useState(new Set());

  useEffect(() => {
    const handleKeyDown = event => {
      setPressedKeys(prevKeys => new Set(prevKeys).add(event.key));
    };

    const handleKeyUp = event => {
      setPressedKeys(prevKeys => {
        const updatedKeys = new Set(prevKeys);
        updatedKeys.delete(event.key);
        return updatedKeys;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return pressedKeys;
};
const downloadf = () => {
  const canvas = document.getElementById('canvas');
  if (canvas) {
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = 'image.png';
    link.click();
  }
};


export default function Home() {
  const tool = useSelector(state => state.toolbar.tool);
  const color = useSelector(state => state.menu[tool]?.color || 'black');
  const size = useSelector(state => state.menu[tool]?.size || 5);
  const thinning = useSelector(state => state.menu[tool]?.thinning || 0.5);
  const smoothing = useSelector(state => state.menu[tool]?.smoothing || 0.5);
  const streamline = useSelector(state => state.menu[tool]?.streamline || 0.5);
  const fill = useSelector(state => state.menu[tool]?.fill || 'white');
  const style = useSelector(state => state.menu[tool]?.style || 'solid');
  const fillStyle = useSelector(state => state.menu[tool]?.fillStyle || 'solid');
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [startPanMousePosition, setStartPanMousePosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [scaleOffset, setScaleOffset] = useState({ x: 0, y: 0 });
  const pressedKeys = usePressedKeys();
  const download = useSelector(state => state.options.isDownload);
  const textAreaRef = useRef();
  const reset = useSelector(state => state.options.isReset);
  const canva_bg = useSelector(state => state.options.backgrounds);

  const [selectedElement, setSelectedElement] = useState(null);
  const [elements, setElements, undo, redo] = useHistory([]);
  const [action, setAction] = useState('none')

  const dispatch = useDispatch();

  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Empty dependency array ensures it runs only once on mount




  useEffect(() => {
    if (download) {
      downloadf();
      dispatch(setIsDownload(false)); // Reset download state if needed
    }

    
  }, [download, dispatch]);
  
  useLayoutEffect(() => {
    const canvas = document.getElementById('canvas');
    const rc = rough.canvas(canvas); //create a rough canvas
    const ctx = canvas.getContext('2d'); //get the context of the canvas
    


    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight); //we will clear the canvas on every render so that it is empty for the next render

    if (reset) {
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      
      dispatch(setIsReset(false)); // Reset download state if needed
    }

    const scaleWidth =canvas.width * scale;
    const scaleHeight = canvas.height * scale;

    const scaleOffsetX = (scaleWidth - canvas.width) / 2;

    const scaleOffsetY = (scaleHeight - canvas.height) / 2;

    setScaleOffset({ x: scaleOffsetX, y: scaleOffsetY });

    ctx.save();
    ctx.translate(panOffset.x * scale-scaleOffsetX, panOffset.y * scale  - scaleOffsetY);
    ctx.scale(scale, scale);

    elements.forEach(element => {
      if (action === "write" && selectedElement.id === element.id) return;

    
      drawElement(rc, ctx, element);
    });
    ctx.restore();
    
  },[elements,selectedElement, panOffset, action, scale]);

  useEffect(() => {
    const undoRedoFunction = (e) => {
      if(e.ctrlKey && e.key === 'z'){
        undo();
      }
      else if(e.ctrlKey && e.key === 'y'){
        redo();
      }
    }
    document.addEventListener('keydown',undoRedoFunction);
    return () => document.removeEventListener('keydown',undoRedoFunction);
  },[undo,redo])

  useEffect(() => {
    const panOrZoomFunction = event => {
      if (pressedKeys.has("Control")) {
        onZoom(event.deltaY * -0.01);
      }
      else{
      setPanOffset(prevState => ({
        x: prevState.x - event.deltaX,
        y: prevState.y - event.deltaY,
      }))
    }};

    document.addEventListener("wheel", panOrZoomFunction);
    return () => {
      document.removeEventListener("wheel", panOrZoomFunction);
    };
  }, [pressedKeys]);

  useEffect(() => {
    const textArea = textAreaRef.current;
    if (action === "write") {
      setTimeout(() => {
        textArea.focus();
        textArea.value = selectedElement.text;
      }, 0);
    }
  }, [action, selectedElement]);

  const updateElement = (index, x1, y1, x2, y2,tool,options) => {
    const elementsCopy = [...elements];
    
    switch (tool) {
      case 'pen':
      case 'eraser':
        console.log("pen" , elementsCopy[index]);
        elementsCopy[index].points = [...elementsCopy[index].points, { x: x2, y: y2 }];
        break;

      case 'line':
      case 'rectangle':
      case 'circle':
        elementsCopy[index] =  createElements(index, x1, y1, x2, y2, tool, color, size, fill, style, fillStyle, thinning, smoothing, streamline);
        break;

        
      case 'text':
        const textWidth = document.getElementById('canvas').getContext('2d').measureText(options.text).width;

        const textHeight = options.size;

        
        elementsCopy[index] = {...createElements[index],tool, x1: x1, y1: y1,x2: x1 + textWidth, y2: y1 + textHeight, text: options.text, color: options.color, size: options.size};
        console.log(elementsCopy[index]);
        break;
      
      case 'pan':
        setPanOffset(prevState => ({
          x: prevState.x + x1 - x2,
          y: prevState.y + y1 - y2,
        }));
    
      
        default:
          break;
        }
        setElements(elementsCopy,true);
  }

  const getMouseCoordinates = event => {
    const clientX = (event.clientX - panOffset.x*scale+  scaleOffset.x)/scale;
    const clientY = (event.clientY - panOffset.y*scale +  scaleOffset.y)/scale;
    return { clientX, clientY };
  };


  const handleMouseDown = (e) => {

    if(action === 'write'){
      return;
    }

    const { clientX, clientY } = getMouseCoordinates(e);

    if (e.button === 1 ||  tool === 'pan') {
      document.body.style.cursor = 'grabbing';
      setAction("panning");
      setStartPanMousePosition({ x: clientX, y: clientY });
      return;
    }

    if (tool === 'select') {
      //check if the mouse is over an element
      const element = getElementAtPosition(clientX, clientY, elements);

      //if an element is found, set it as the selected element and set the action to move
      if (element) {
        if(element.tool === 'pen'){
          const xOffsets = element.points.map(point => clientX - point.x);
          const yOffsets = element.points.map(point => clientY - point.y);

          setSelectedElement({ ...element, xOffsets, yOffsets });
        }
        else{

        const offsetX = clientX - element.x1;
        const offsetY = clientY - element.y1;

        setSelectedElement({ ...element, offsetX, offsetY });
        }
        setElements(prevState => prevState); 

        if(element.position === 'inside'){
          setAction('move');
        }
        else{
          setAction('resize');
        }
      }
    }
    else {
      //get the x and y coordinates of the mouse
     
      const id = elements.length ;


      const element = createElements(id,clientX, clientY, clientX, clientY, tool, color , size , fill , style , fillStyle, thinning , smoothing,streamline); //create the element
     //add the element to the elements array
     setElements(prevState => [...prevState, element]);

      setSelectedElement(element);
      setAction(tool === 'text' ? 'write':'draw');
      

    }
  }

  const handleMouseMove = (e) => {
    const { clientX, clientY } = getMouseCoordinates(e);

    if (action === "panning") {
      const deltaX = clientX - startPanMousePosition.x;
      const deltaY = clientY - startPanMousePosition.y;
      setPanOffset(prevStats =>({
        x: prevStats.x + deltaX,
        y: prevStats.y + deltaY,
      }));
      return;
    }

    if(tool === 'select'){
      const element = getElementAtPosition(e.clientX, e.clientY, elements) 
      e.target.style.cursor = element ? cursorForPosition(element.position) : 'default';
    }
    
    if (action === 'draw') {

      const index = elements.length - 1;

      const { x1, y1 } = elements[index]

      //update the position of the mouse
      updateElement(index, x1, y1, clientX, clientY, tool, {
        color,
        size,
        thinning,
        smoothing,
        streamline,
        fill,
        style,
        fillStyle,
        thinning,
        smoothing,
        streamline
      });

    }
    else if (action === 'move') {
      if(selectedElement.tool === 'pen' || selectedElement.tool === 'eraser') {
        const newPoints = selectedElement.points.map((point,index) => {
          return {
          x: clientX - selectedElement.xOffsets[index],
          y: clientY - selectedElement.yOffsets[index]
          }
        });

        const elementCopy = [...elements];
        elementCopy[selectedElement.id] = {...elementCopy[selectedElement.id],points:newPoints};
        setElements(elementCopy,true);

      }
      else{
        
        const {id, x1, y1, x2, y2, tool, offsetX,offsetY} = selectedElement;
        
        const width = x2 - x1;
        const height = y2 - y1;
        
        const newX1 = clientX - offsetX;
        const newY1 = clientY - offsetY;
      
        const options = tool === 'text' ? {text:selectedElement.text, color:selectedElement.color , size:selectedElement.size} : {};

        updateElement(id, newX1, newY1, newX1 + width, newY1 + height, tool,options);
      }
    }
    else if(action === 'resize'){
      const {id , tool , position , ...coordinates} = selectedElement;

      const {x1,y1,x2,y2 } = resizedCoordinates(clientX,clientY,position, coordinates);

      updateElement(id,x1,y1,x2,y2,tool);
    }


  }

  const handleMouseUp = (e) => {
    const { clientX, clientY } = getMouseCoordinates(e);

    if(selectedElement){
      if (
        selectedElement.tool === "text" &&
        clientX - selectedElement.offsetX === selectedElement.x1 &&
        clientY - selectedElement.offsetY === selectedElement.y1
      ) {
        setAction("write");
        return;
      }
    const index = selectedElement.id

    const { id, tool } = elements[index];
    if ((action === "draw" || action === "resize") && adjustmentRequired(tool)) {
      const { x1, y1, x2, y2 } = adjustElementCoordinates(elements[index]);
      updateElement(id, x1, y1, x2, y2, tool);
    }
  }
  if(action === 'write'){
    return;
  }
    setAction('none');
    setSelectedElement(null);
  }

  const handleBlur = event => {
    const { id, x1, y1, tool } = selectedElement;
    setAction("none");
    setSelectedElement(null);
    updateElement(id, x1, y1, null, null, tool,  { text: event.target.value , color : color , size : size});
  };

  const onZoom  = (delta) => {
    setScale(prevState =>Math.min(Math.max(prevState + delta,0.1),2));

  }

  return (
    <>
      <div className="canva">
        <canvas id="canvas" style={{ backgroundColor: canva_bg, 
        cursor: tool === 'pan' ? 'grab' : tool === 'select' ? 'crosshair' : 'crosshair'
        ,
        position: "absolute",
        zIndex: 1,
        }} width={windowSize.width} 
        height={windowSize.height}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}

        ></canvas>
      </div>

      {action === 'write' ? (
       <textarea
        onBlur={handleBlur}
       ref={textAreaRef}
       style={{
         position: "fixed",
         top: (selectedElement.y1-2)*scale+panOffset.y*scale- scaleOffset.y,
         left: (selectedElement.x1)*scale+ panOffset.x*scale-scaleOffset.x,
         font: `${selectedElement.size*scale}px Comic Sans MS`,
         fontWeight: "bold",
          color: selectedElement.color,
          resize: "none",
          outline: "none",
          backgroundColor: "transparent",
          zIndex: 2,
       }}
     />
      ):null}

      <div style={{zIndex:2}} className="absolute flex items-center bottom-4 right-2 rounded-xl bg-gray-100">
        <Image src={minus} alt="redo" onClick={()=>
          onZoom(-0.1)
      } width={45} className="px-2 py-2 hover:bg-gray-300"/>
        <div onClick={()=>{
          setScale(1);
        }} className="text-slate-800 px-2">{new Intl.NumberFormat('en-GB',{style:"percent"}).format(scale)}</div>
        <Image src={plus} alt="undo" onClick={()=>{
          onZoom(0.1);
        }} width={40} className="px-2 py-2 hover:bg-gray-300"/>
      </div>

      <div style={{zIndex:2}} className="absolute flex items-center justify-center bottom-4 right-44 rounded-xl bg-gray-100">
        <Image src={undoImg} alt="undo" onClick={undo}  width={60} className="px-4 py-2 hover:bg-gray-300"/>
        <Image src={redoImg} alt="redo" onClick={redo}  width={60} className="px-4 py-2 hover:bg-gray-300"/>
      </div>

      <p style={{zIndex:2}} className="font-bold absolute py-2 px-2 text-gray-400 flex items-center justify-center bottom-4 left-4 rounded-xl bg-gray-100">CREATED BY AYUSHI PAL</p>

    </>
  );
}