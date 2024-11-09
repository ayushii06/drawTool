'use client'
import list from '../../../public/toolbar/list.svg'
import Image from 'next/image'
import { useState } from 'react'
import {Backgrounds} from '../../constant'
import { setBackground,setIsDownload,setIsReset, } from '@/app/slice/optionsSlice'
import { useDispatch } from 'react-redux'
import deletesvg from '../../../public/toolbar/delete.svg'
import download from '../../../public/toolbar/download.svg'
import question from '../../../public/toolbar/question.svg'
import Link from 'next/link'

export default function Options() {
    const dispatch = useDispatch()
    const [isHidden, setIsHidden] = useState(true)
    const [current, setCurrent] = useState('#ffffff')
    const [help, setHelp] = useState(false)

    const handleClick = () => {
        setIsHidden(!isHidden)
    }

    const handleBackground = (color) => {
        dispatch(setBackground(color))
        setCurrent(color)
        setIsHidden(true)
    }

    const handleDownload = () => {
        dispatch(setIsDownload(true))
        setIsHidden(true)
    }

    const handleReset = () => {
        dispatch(setIsReset(true))
        setIsHidden(true)
    }


    



    return(
        <>
        <div onClick={handleClick} className="flex rounded fixed  top-4 right-5  mx-auto justify-evenly items-center" 
             style={{
                boxShadow: '0px 0px 5px #000000',
               cursor: 'pointer',
               background:'#f1f1f17d',
            
                
                zIndex: 1000,
             }}>
        <Image src={list} alt='list' height={40} width={40} className='p-2 rounded' style={{
            
        }} />
        </div>


        <div className="fixed right-5 px-4 py-4 top-16 text-slate-700"
        style={{
            display: isHidden ? 'none' : 'block',
            zIndex: 1000,
            boxShadow: '0px 0px 5px #000000',
            background: '#f1f1f17d',
            cursor: 'pointer',
        }}
        >
         


                {<div
                onClick={handleDownload}
                 className="hover:bg-gray-300 rounded px-2 pr-6  flex items-center justify-start gap-4"><Image alt='image' width={20} src={download }/><p className="text-start py-1 ">Download Image</p></div>}
                {/* <div
                onClick={handleReset} 
                className="hover:bg-gray-300 rounded px-2 pr-6  flex items-center justify-start gap-4"><Image alt='image' width={20} src={ deletesvg}/><p className="text-start py-1 ">Reset Canvas</p></div> */}
                <div onClick={()=>{setHelp(true)
                    setIsHidden(true)
                }} className="hover:bg-gray-300 rounded px-2 pr-6  flex items-center justify-start gap-4"><Image alt='image' width={20} src={ question}/><p className="text-start py-2 ">Help</p></div>
                <hr className='py-1'/>
                <p className="">Canvas Background</p>

                <div className="flex items-center justify-start gap-4 py-4">
                    {
                        Object.keys(Backgrounds).map((color) => (
                            <div key={color} 
                        onClick={() => handleBackground(Backgrounds[color])}
                                className="rounded hover:bg-gray-200" 
                                style={{
                                    background: current === Backgrounds[color] ? 'rgba(0,0,0,0.1)' : 'transparent',
                                    cursor: 'pointer',

                                }}
            

                            >
                                 <div className=" m-1" style={{ backgroundColor: Backgrounds[color], width: '22px', height: '22px' 
                                }}></div>
                               
                            </div>
                        ))
                    }
                </div>


                <hr className='py-1'></hr>
                <div className="flex flex-col">
                <Link target='_blank' href='https://linkedin.com/in/ayushi-pal-99965b249/' className="hover:bg-gray-300 rounded px-2 pr-6 text-start py-1">LinkedIn</Link>
                <Link target='_blank'  href='https://github.com/ayushii06/drawTool' className="hover:bg-gray-300 rounded px-2 pr-6 text-start py-1">Github</Link>
                <Link  target='_blank' href='https://drive.google.com/file/d/1263gzWPcWP8AbBrr6K7JR91WYV33tVRE/view?usp=drive_link' className="hover:bg-gray-300 rounded px-2 pr-6 text-start py-2">Contact Me</Link>
                </div>
                <hr className='py-2'></hr>
                <p className="text-start text-slate-400  text-sm ">© Ayushi Pal</p>

            
      

        </div>

        {help && <div 
        onClick={() => setHelp(false)}
        className="text-black fixed left-0 top-0 h-full w-full  rounded z-50 flex justify-center items-center" style={{zIndex:1000,
            background:'rgba(0,0,0,0.5)',

            display: help ? 'block' : 'none',
        }}>
            <div className="bg-white p-4 rounded-lg w-8/12 fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
            onClick={(e) => e.stopPropagation()}
            style={{
                height:"70vh",
                overflowY:"scroll",
                scrollbarColor: '#000000 #f1f1f1',
            }}

            >
                
                <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Help</h1>
                    <Link target='blank' href='https://github.com/ayushii06/drawTool' className='text-sm font-bold text-black rounded py-2 px-4 bg-gray-200 '>Contribute on Github</Link>
                </div>
                <hr className="my-4"/>
                <p className="text-lg text-slate-800">This is a simple drawing app. You can draw, erase, write text, select, move, draw shapes, and change the background color of the canvas. You can also download the image. The app is created using Next.js, Redux, and Tailwind CSS.</p>

                <h2 className="text-xl font-bold mt-4 py-4">How to use?</h2>
                <p className="text-lg">Select a tool from the toolbar and draw on the canvas. You can change the color of the tool from the color picker. You can also change the background color of the canvas. You can download the image and reset the canvas using the options menu.</p>

                <h2 className="text-xl font-bold mt-4 py-4">Keyboard Shortcuts</h2>
                <p className="text-lg py-4">You can use the following keyboard shortcuts:</p>
                <ul className="text-lg w-64">
                    <div className="my-2 py-2 px-2 flex items-center justify-between border-2">
                        <div className="">
                            Undo
                        </div>
                        <div className="">
                            Ctrl + Z
                        </div>
                    </div>

                    <div className="my-2 py-2 px-2 flex items-center justify-between border-2">
                        <div className="">
                            Redo
                        </div>
                        <div className="">
                            Ctrl + Y
                        </div>

                    </div>

                    <div className="my-2 py-2 px-2 flex items-center justify-between border-2">
                        <div className="">
                            Pan
                        </div>
                        <div className="">
                            1
                        </div>
                    </div>

                    <div className="my-2 py-2 px-2 flex items-center justify-between border-2">
                        <div className="">
                            Zoom In
                        </div>
                        <div className="">
                            Ctrl + scroll
                        </div>
                    </div>

                    <div className="my-2 py-2 px-2 flex items-center justify-between border-2">
                        <div className="">
                            Zoom Out
                        </div>
                        <div className="">
                            Ctrl + -
                        </div>
                    </div>

                </ul>


<div className="text-center">
                <button onClick={() => setHelp(false)} className="text-center bg-red-500 text-white px-4 py-2 rounded mt-4">Close</button>
                </div>
            </div>
        </div>
            }

        </>
    )
}