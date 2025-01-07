import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import TinyRTE from './RTE';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import NotesService from '@/Services/notes.service';
import penBlue from '../../assets/Icons/penBlue.png';
import pen from '../../assets/Icons/pen.png';

function NotesNew() {
  const { id } = useParams();
  const [prevData, setPrevData] = useState(null);
  const accessToken = useSelector((state) => state.auth.accessToken);
  const [loading,setLoading] = useState(false);
  const [messagePopup, setMessagePopup] = useState(false);

  const { control, handleSubmit, setValue, reset } = useForm({
    defaultValues: {
      title: '',
      content: '',
    },
  });

  useEffect(() => {
    if (id !== 'new') {
      const fetchNote = async () => {
        try {
          const notes = await NotesService.getNoteById(id, accessToken);
          setPrevData(notes.data);
          reset({
            title: notes.data?.title || '',
            content: notes.data?.content || '',
          });
        } catch (error) {
          console.error('Error fetching notes:', error.message);
        }
      };
      fetchNote();
    } else {
      reset({ title: '', content: '' });
    }
  }, [id, reset, accessToken]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await NotesService.saveNote(data, accessToken);
      setLoading(false);
      setMessagePopup(true);
      console.log('Note saved successfully:', response);
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  return (
    <div className="w-full min-h-screen px-5 flex flex-col justify-start items-center gap-5 lg:gap-2">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col items-center gap-5">
        {/* Title Input */}
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              className="text-3xl font-bold text-[#39a2ff] bg-inherit outline-none w-full sm:w-[90vw] lg:w-[60vw] border-b-2 border-[#39a2ff]"
              placeholder="Title of Note"
            />
          )}
        />

        {/* TinyMCE Editor */}
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <TinyRTE
              {...field}
              className="w-full sm:w-[90vw] lg:w-[60vw] lg:h-[90vw] mt-4"
              initialValue={prevData?.content || ''}
              handleEditorChange={(content) => setValue('content', content)}
            />
          )}
        />

        {/* Save Button */}
        <button
          type="submit"
          className="text-xl px-4 py-2 rounded-md text-white bg-[#39a2ff]"
        >
          Save
        </button>
      </form>
    </div>
  );
}

export default NotesNew;
