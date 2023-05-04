import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    page: "today",
}

export const pageSlice = createSlice({
    name: 'page',
    initialState,
    reducers: {
        changePage: (state,action) => ({
            page : action.payload
        })
}
});

export const {changePage} = pageSlice.actions;

export default pageSlice.reducer;