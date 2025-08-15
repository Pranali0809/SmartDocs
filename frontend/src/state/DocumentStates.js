import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: null,
  userName: null,
};

const documentSlice = createSlice({
  name: "document",
  initialState,
  reducers: {
    setDocumentId(state, action) {
      state.documentId = action.payload;
    }
  },
});

export const {
  setDocumentId,
  
 
} = documentSlice.actions;

export default authSlice.reducer;
