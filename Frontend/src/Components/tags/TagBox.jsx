import React from 'react';

function TagBox({ tag }) {
  return (
    <div
      className="w-fit h-fit px-2 py-0 rounded-lg text-xs cursor-pointer text-white"
      style={{ backgroundColor: tag.color }}
    >
      {tag.name}
    </div>
  );
}

export default TagBox;