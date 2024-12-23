import React from 'react'

function NotesBox({note}) {
  return (
    <div className="new w-[95vw] h-[40vw] lg:w-[20vw] lg:h-[60vh] flex items-center shadow-lg justify-center overflow-hidden p-3 bg-white dark:bg-[#2c2c2c] hover:scale-105 duration-100 cursor-pointer rounded-lg">
        <h1>{note.title.length > 0 ? note.title : note.content.substr(0,30) }</h1>
    </div>
  )
}

export default NotesBox