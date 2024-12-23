import React from 'react'

function PopupHolder({children}) {
  return (
    <section className='w-screen h-screen z-20 fixed flex justify-center items-center bg-[#ffffff31] dark:bg-[#363636dd]' >
        {children}
    </section>
  )
}

export default PopupHolder