'use client'
import Image from "next/image"
import { useState } from "react"
import { colors, fillColors } from "@/app/constant"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { setColor, setSize, setSmoothing, setThinning, setStreamline, setFill ,setFillStyle,setStyle} from "../../slice/menuSlice"
import colorWheel from "../../../public/toolbar/color-wheel.png"



export default function Menu() {
    const tool = useSelector(state => state.toolbar.tool)

    const dispatch = useDispatch()

    const [selected, setSelected] = useState({
        color: '#1d1d1d',
        size: 9,
        thinning: 0.73,
        smoothing: 0.45,
        streamline: 0.53,
        fill: 'white',
        fillStyle: 'solid',
        style: 'solid'
    })

    const changeColor = (tool, newColor) => {
        dispatch(setColor({ item: tool, color: newColor }))
        setSelected({...selected,color:newColor})
    }

    const changeSize = (brush) => {
        dispatch(setSize({ item: tool, size: brush }))
        setSelected({...selected,size:brush})
    }

    const changeThinning = (thinning) => {
        dispatch(setThinning({ thinning }))
        setSelected({...selected,thinning})
    }

    const changeSmoothing = (smoothing) => {
        dispatch(setSmoothing({ smoothing }))
        setSelected({...selected,smoothing})
    }

    const changeStreamline = (stream) => {
        dispatch(setStreamline({ stream }))
        setSelected({...selected,streamline:stream})
    }

    const changeFill = (fill) => {
        dispatch(setFill({ item: tool, fill }))
        setSelected({...selected,fill})
    }

    const changeFillStyle = (fill) => {
        dispatch(setFillStyle({ item: tool, fill }))
        setSelected({...selected,fillStyle:fill})
    }

    const changeStyle = (fill) => {
        dispatch(setStyle({ item: tool, fill }))
        setSelected({...selected,style:fill})
    }

    const showStrokeTool = tool === 'pen'  || tool === 'arrow' || tool === 'line'  || tool === 'rectangle' || tool === 'circle'

    const showColorTool = tool === 'pen'  || tool === 'text' || tool === 'arrow' || tool === 'line' || tool === 'rectangle' || tool === 'circle'

    const showPenTool = tool === 'pen' 

    const showFillTool = tool === 'rectangle'  || tool === 'circle'




    return (
        <>
            {(showStrokeTool || showColorTool || showPenTool || showFillTool) && <div style={{zIndex:100,height:'70vh',overflowY:'auto',
            scrollbarColor: '#d8d8d8 #f3f4f6',scrollbarWidth: 'thin',scrollbarGutter: 'revert',
                scrollTimeline: 'smooth',msOverflowStyle: 'none'
            }} className="shadow-lg border-2 absolute top-1 left-2 rounded bg-white px-5 py-2 w-72 max-md:w-36 "
            >

                {showColorTool && <div className="text-start py-2">
                    <h4 className="text-slate-500 max-md:text-sm ">Color</h4>
                    <div className="flex items-center flex-wrap py-4 max-md:py-1">
                        {Object.keys(colors).map(color => (
                            <div key={color}
                                onClick={() => changeColor(tool, colors[color])}
                                className="rounded hover:bg-gray-200" 
                                style={{
                                    background: selected.color === colors[color] ? '#dddddd' : '',
                                    cursor: 'pointer',

                                }}

                               

                
                                >
                                <div className="rounded m-1 w-6 h-6 max-md:w-4 max-md:h-4 max-sm:w-2 max-sm:h-2" style={{ backgroundColor: colors[color], 
                                }}></div>
                              
                                </div>
                        ))}
                        <label htmlFor="bgColor">
    <Image src={colorWheel} alt="Color Picker Icon" className="w-7 h-7 max-md:w-4 max-md:h-4 max-sm:w-2 max-sm:h-2"/>
  </label>
  <input type="color" id="bgColor" name="bgColor" value="#ffffff" style={{display:"none"}}
    onChange={(e) => changeColor(tool, e.target.value)}
  />

                    </div>
                </div>
                }
                {showStrokeTool && <div>
                    <div className="flex items-center justify-start gap-4 ">
                    <h4 className="text-slate-500 max-md:text-sm ">Width</h4>
                    <div className="text-slate-500">{selected.size}</div>
                    </div>
                    <input
                    value={selected.size}
                        onChange={(e) => changeSize(e.target.value)}
                        type="range" min="1" max="50"
                        className="w-44 py-2  max-md:h-1 max-md:w-20" />
                </div>
                }

                {showPenTool && <div>
                    
                    <div className="flex items-center justify-start gap-4 ">
                    <h4 className="text-slate-500 max-md:text-sm ">Thinning</h4>
                    <div className="text-slate-500">{selected.thinning}</div>
                    </div>

                    <input
                    value={selected.thinning}
                        onChange={(e) => changeThinning(parseFloat(e.target.value))}
                        type="range" min="-0.99" max="0.99"
                        step="0.01"
                        className="w-44 py-2 max-md:w-20" />

<div className="flex items-center justify-start gap-4 ">
                    <h4 className="text-slate-500 max-md:text-sm ">Smoothing</h4>
                    <div className="text-slate-500">{selected.smoothing}</div>
                    
                    </div>
                    <input
                    value={selected.smoothing}

                        onChange={(e) => changeSmoothing(parseFloat(e.target.value))}
                        type="range" min="0.01" max="0.99"
                        step="0.01"
                        className="w-44 py-2 max-md:w-20" />


                        <div className="flex items-center justify-start gap-4 ">
                    <h4 className="text-slate-500 max-md:text-sm ">Streamline</h4>
                    <div className="text-slate-500">{selected.streamline}</div>
                    </div>
                    <input
                    value={selected.streamline
                    }
                        onChange={(e) => changeStreamline(parseFloat(e.target.value))}
                        type="range" min="0.01" max="0.99"
                        step="0.01"
                        className="w-44 py-2 max-md:w-20" />
                </div>

                }


                {showFillTool && <><div>
                    <h4 className="text-slate-500 max-md:text-sm ">Fill</h4>
                    <div className="flex items-center flex-wrap gap-1 py-4 max-md:py-1">
                        {Object.keys(fillColors).map(color => (
                            <div key={color}
                                onClick={() => changeFill(fillColors[color])}
                                className="rounded hover:bg-gray-200" style={{ 
                                    background: selected.fill === fillColors[color] ? '#dddddd' : '',
                                    cursor: 'pointer',
                                    
                                 }}>
                                    <div className="rounded m-1 w-6 h-6 max-md:w-4 max-md:h-4 max-sm:w-2 max-sm:h-2" style={{ backgroundColor: fillColors[color]
                                    }}></div>
                                     
                                  
                                </div>
                                   
                                
                        ))}
                        <label htmlFor="fillColor">
    <Image src={colorWheel} alt="Color Picker Icon"   className="w-7 h-7 max-md:w-4 max-md:h-4 max-sm:w-2 max-sm:h-2"/>
  </label>
  <input type="color" id="fillColor" name="fillColor" value="#ffffff" style={{display:"none"}}
    onChange={(e) => changeFill(e.target.value)}
  />
                    </div>
                </div>

                    <div>
                        <h4 className="text-slate-500 max-md:text-sm ">Fill Style</h4>
                        <div className="flex gap-2 py-4 max-md:py-1 flex-wrap">
                            <div
                                onClick={() => changeFillStyle('hachure')}
                                className="px-2 py-1 max-md:text-xs rounded text-slate-800 hover:bg-slate-400 " style={{cursor:"pointer",                                  background: selected.fillStyle === 'hachure' ? 'rgb(5 164 185)' : '#d8d8d863',
                                    color: selected.fillStyle === 'hachure' ? 'white' : 'black'
                                 }}>Hachure</div>

                            <div onClick={() => changeFillStyle('solid')}
                                className="px-2 py-1 max-md:text-xs  rounded text-slate-800 hover:bg-slate-400" style={{cursor:"pointer",
                                    background: selected.fillStyle === 'solid' ? 'rgb(5 164 185)' : '#d8d8d863',
                                    color: selected.fillStyle === 'solid' ? 'white' : 'black'
                                }}>Solid</div>

                            <div onClick={() => changeFillStyle('zig-zag')}
                                className="px-2 py-1 max-md:text-xs rounded text-slate-800 hover:bg-slate-400" style={{cursor:"pointer",
                                    background: selected.fillStyle === 'zig-zag' ? 'rgb(5 164 185)' : '#d8d8d863',
                                    color: selected.fillStyle === 'zig-zag' ? 'white' : 'black'
                                }}>Zig-Zag</div>

                            <div onClick={() => changeFillStyle('cross-hatch')}
                                className="px-2 py-1 max-md:text-xs rounded text-slate-800 hover:bg-slate-400" style={{cursor:"pointer",
                                    background: selected.fillStyle === 'cross-hatch' ? 'rgb(5 164 185)' : '#d8d8d863',
                                    color: selected.fillStyle === 'cross-hatch' ? 'white' : 'black'
                                }}>Cross-Hatch</div>

                            <div onClick={() => changeFillStyle('dots')}
                                className="px-2 py-1 max-md:text-xs rounded text-slate-800 hover:bg-slate-400" style={{cursor:"pointer",
                                    background: selected.fillStyle === 'dots' ? 'rgb(5 164 185)' : '#d8d8d863',
                                    color: selected.fillStyle === 'dots' ? 'white' : 'black'
                                }}>Dots</div>

                            <div onClick={() => changeFillStyle('dashed')}
                                className="px-2 py-1 max-md:text-xs rounded text-slate-800 hover:bg-slate-400" style={{cursor:"pointer",
                                    background: selected.fillStyle === 'dashed' ? 'rgb(5 164 185)' : '#d8d8d863',
                                    color: selected.fillStyle === 'dashed' ? 'white' : 'black'
                                }}>Dashed</div>




                        </div>
                    </div>

                    <h4 className="text-slate-500 max-md:text-sm ">Stroke Style</h4>
                    <div className="flex gap-4 py-4 max-md:py-1">
                        <div
                            onClick={() => changeStyle('solid')}
                            className="rounded flex items-center hover:bg-gray-200" style={{ width: '32px', height: '32px',
                                background: selected.style === 'solid' ? '#dddddd' : '',
                            }}>
                                <div className="mx-2" style={{ width: '22px', height: '0px', border: '1px solid black'}}></div>
                            </div>
                        <div
                            onClick={() => changeStyle('dotted')}
                            className="rounded flex items-center hover:bg-gray-200" style={{ width: '32px', height: '32px',
                                background: selected.style === 'dotted' ? '#dddddd' : '',
                             }}>
                                <div className="mx-2" style={{ width: '22px', height: '0px', border: '1px dotted black'}}></div>
                             </div>
                        <div
                            onClick={() => changeStyle('dashed')}
                            className="rounded flex items-center hover:bg-gray-200" style={{ width: '32px', height: '32px',
                                background: selected.style === 'dashed' ? '#dddddd' : '',
                            }}>
                                <div className="mx-2" style={{ width: '22px', height: '0px', border: '1px dashed black'}}></div>
                            </div>
                    </div>


                </>}

                {tool === 'line' && 
             
                <div>
                    <h4 className="text-slate-500 max-md:text-sm ">Line Style</h4>
                    <div className="flex flex-wrap gap-4 py-4 max-md:py-1">
                        <div
                            onClick={() => changeStyle('solid')}
                            className="rounded flex items-center hover:bg-gray-200" style={{ width: '32px', height: '32px',
                                background: selected.style === 'solid' ? '#dddddd' : '',
                            }}>
                                <div className="mx-2 rounded  w-6 h-0 max-md:w-4 " style={{ border: '1px solid black'}}></div>
                            </div>
                        <div
                            onClick={() => changeStyle('dotted')}
                            className="rounded flex items-center hover:bg-gray-200" style={{ width: '32px', height: '32px',
                                background: selected.style === 'dotted' ? '#dddddd' : '',
                             }}>
                                <div className="mx-2" style={{ width: '22px', height: '0px', border: '1px dotted black'}}></div>
                             </div>
                        <div
                            onClick={() => changeStyle('dashed')}
                            className="rounded flex items-center hover:bg-gray-200" style={{ width: '32px', height: '32px',
                                background: selected.style === 'dashed' ? '#dddddd' : '',
                            }}>
                                <div className="mx-2" style={{ width: '22px', height: '0px', border: '1px dashed black'}}></div>
                            </div>
                    </div>
                </div>
              
                }

                {tool === 'text' && <div>
                    <div className="flex items-center justify-start gap-4 ">
                    <h4 className="text-slate-500 max-md:text-sm ">Font Size</h4>
                    <div className="text-slate-500">{selected.size}</div>
                    </div>
                    <input
                    value={selected.size}
                        onChange={(e) => changeSize(e.target.value)}

                        type="range" min="1" max="100"
                        className="w-44 py-2 max-md:w-20" />
                </div>
                }

            </div>

            }

        </>
    )
}