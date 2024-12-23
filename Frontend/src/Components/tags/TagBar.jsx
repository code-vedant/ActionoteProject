import React from 'react'
import TagBox from './TagBox'

function TagBar() {

    const tags = [
        {
            id: 1,
            name: 'home',
            color: '#000a9a',
        },
        {
            id: 2,
            name: 'daily',
            color: '#aa1a1a',
        },
        {
            id: 3,
            name: 'personal',
            color: '#1a9a1a',
        }
    ]
  return (
    <div className='w-full h-full opacity-80 flex flex-wrap gap-2 item justify-start'>
        {tags.map((tag) => (
            <TagBox key={tag.id} tag={tag}/>
        ))}
    </div>
  )
}

export default TagBar