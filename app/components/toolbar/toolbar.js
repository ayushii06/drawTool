'use client'

import Image from 'next/image'
import { useState } from 'react'
import { icons } from '../../constant'
import { useDispatch } from 'react-redux'
import { setTool } from '../../slice/toolbarSlice'

export default function Toolbar() {
    const dispatch = useDispatch();
    const [selected, setSelected] = useState('pen')

    const handleClick = (id) => {
        dispatch(setTool(id))
        setSelected(id)
    }




    return (
        
        <div className="flex rounded bg-white py-1 w-5/12  mx-auto justify-evenly items-center" 
             style={{
                boxShadow: '0px 0px 5px #000000',
                position: 'fixed',
                bottom: '18px',
                left: '26%',
                zIndex: 1000,
             }}>
                {
                    icons.map(icon => (
                        <Image
                            key={icon.id}
                            height={40}
                            width={40}
                            className='p-2 rounded'
                            src={icon.src}
                            alt={icon.alt}
                            style={{
                                cursor: 'pointer',
                                backgroundColor: selected === icon.id ? '#3182ed' : 'transparent',
                                filter: selected === icon.id ? 'invert(100%)' : 'none'

                            }}
                            onClick={() => handleClick(icon.id)}
                        />
                    ))
                }
            {/* {icons.map(icon => (
                <Image
                    key={icon.id}
                    onClick={() => setSelected(icon.id)}
                    height={40}
                    width={40}
                    className='p-2 rounded'
                    src={icon.src}
                    alt={icon.alt}
                    style={{
                        backgroundColor: selected === icon.id ? '#3182ed' : 'transparent',
                        cursor: selected === icon.id ? 'default' : 'pointer',
                        filter: selected === icon.id ? 'invert(100%)' : 'none'
                    }}
                />
            ))} */}
        </div>
    )
}

function getMousePositon(e){
    return {x: e.clientX, y: e.clientY}
}