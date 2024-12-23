import { createSlice } from '@reduxjs/toolkit';

const notesSlice = createSlice({
  name: 'notes',
  initialState: {
    notes: [], // Array of notes
  },
  reducers: {
    addNote: (state, action) => {
      const newNotes = action.payload.notes;
      newNotes.forEach((newNote) => {
        if (!state.notes.some((note) => note.id === newNote.id)) {
          state.notes.push(newNote); // Add only if it doesn't already exist
        }
      });
    },
    deleteNote: (state, action) => {
      state.notes = state.notes.filter((note) => note.id !== action.payload);
    },
    updateNote: (state, action) => {
      const index = state.notes.findIndex((note) => note.id === action.payload.id);
      if (index !== -1) {
        state.notes[index] = { ...state.notes[index], ...action.payload }; // Merge updates
      }
    },
  },
});

export const { addNote, deleteNote, updateNote } = notesSlice.actions;
export default notesSlice.reducer;
