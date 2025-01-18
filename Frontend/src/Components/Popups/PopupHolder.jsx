import React from 'react'

function PopupHolder({children}) {
  return (
    <section className='w-screen h-screen z-50 absolute top-0 left-0 -mt-16 flex justify-center items-center bg-[#ffffff31] dark:bg-[#363636dd]' >
        {children}
    </section>
  )
}

export default PopupHolder