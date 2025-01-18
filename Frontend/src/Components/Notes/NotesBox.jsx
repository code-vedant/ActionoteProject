import React from 'react'

function NotesBox({note,bgColor}) {
  return (
    <div className="new w-[77vw] h-[40vw] lg:w-[20vw] lg:h-[60vh] flex items-center shadow-lg justify-center overflow-hidden p-3 hover:scale-105 duration-100 cursor-pointer rounded-lg"
    style={{ backgroundColor: bgColor }}
    >
        <h1 className='font-light text-black text-xl'>{note.title.length > 0 ? note.title : note.content.substr(0,30) }</h1>
    </div>
  )
}

export default NotesBox