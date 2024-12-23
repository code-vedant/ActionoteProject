import React, { useEffect, useState } from 'react'
import TinyRTE from './RTE'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import NotesService from '@/Services/notes.service'

function NotesNew() {

  const {id} = useParams()
  const [prevData,setPrevData] = useState("")

  const accessToken = useSelector((state)=> state.auth.accessToken)

   // State to store the editor's content
   const [noteContent, setNoteContent] = useState('');

   // Handle editor content change
   const handleEditorChange = (content) => {
     setNoteContent(content);
   };

   console.log(noteContent);
   

  if(id == "new"){
    setPrevData("")
  }

  console.log(id);
  

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const notes = await NotesService.getNoteById(id,accessToken);
        setPrevData(notes.data);
      } catch (error) {
        console.log("Error fetching notes:", error.message);
      }
    };
    fetchNotes();
  }, [id]);

  console.log(prevData);

  const handleSaveNote = async () => {
    try {
      const response = await NotesService.saveNote(noteContent, accessToken);
      console.log('Note saved successfully:', response);
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };  

  if (id == "new") {
    return (
      <div className='w-full min-h-screen px-5 flex flex-col justify-start items-center'>
        <h1 className="text-3xl font-bold text-[#39a2ff] mt-6">Create New Note</h1>
        <TinyRTE className="w-full sm:w-[90vw] lg:w-[60vw] lg:h-[90vw] mt-4" handleEditorChange={handleEditorChange} />
        <button onClick={handleSaveNote}>save</button>
      </div>
    )
  }
  

  

  return (
    <div className='w-full min-h-screen px-5 flex flex-col justify-start items-center'>
      <h1 className="text-3xl font-bold text-[#39a2ff] mt-6">Create New Note</h1>
      {prevData ? <h2>{prevData?.title}</h2> : "" }
      <TinyRTE className="w-full sm:w-[90vw] lg:w-[60vw] lg:h-[90vw] mt-4" initialValue={prevData?.content} handleEditorChange={handleEditorChange} />
      <button>save</button>
    </div>
  )
}

export default NotesNew
