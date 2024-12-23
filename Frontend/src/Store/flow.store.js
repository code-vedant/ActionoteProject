import { createSlice } from '@reduxjs/toolkit';

const flowSlice = createSlice({
  name: 'flow',
  initialState: {
    flows: [],
  },
  reducers: {
    addFlow: (state, action) => {
      state.flows.push(action.payload);
    },
    deleteFlow: (state, action) => {
      state.flows = state.flows.filter((flow) => flow.id !== action.payload);
    },
    updateFlow: (state, action) => {
      const index = state.flows.findIndex((flow) => flow.id === action.payload.id);
      if (index !== -1) {
        state.flows[index] = action.payload;
      }
    },
  },
});

export const { addFlow, deleteFlow, updateFlow } = flowSlice.actions;
export default flowSlice.reducer;