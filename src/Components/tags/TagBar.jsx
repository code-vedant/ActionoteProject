import React, { useState, useEffect } from 'react';
import TagBox from './TagBox';
import TagsService from '@/Services/tags.service';
import { useSelector } from 'react-redux';

function TagBar({ tags }) {
  const [tagList, setTagList] = useState([]);
  const accessToken = useSelector((state) => state.auth.accessToken);

  const fetchTagList = async () => {
    try {
      const tagList = await Promise.all(
        (tags || []).map(async (tagId) => {
          const res = await TagsService.getTagById(tagId, accessToken);
          return res?.data;
        })
      );
      setTagList(tagList.filter(tag => tag));
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  useEffect(() => {
    if (tags && tags.length > 0) {
      fetchTagList();
    }
  }, [tags, accessToken]);

  return (
    <div className="w-full h-full opacity-80 flex flex-wrap gap-2 justify-start">
      {tagList.length > 0 &&
        tagList.map((tag) => (
          <TagBox key={tag._id || `fallback-${Math.random()}`} tag={tag} />
        ))}
    </div>
  );
}

export default TagBar;
