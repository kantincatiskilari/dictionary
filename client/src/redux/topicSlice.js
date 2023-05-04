import {createSlice} from '@reduxjs/toolkit';

const initialState = {
     topic: [],
     isPending: false,
     error: false
}

export const topicSlice = createSlice({
    name: 'topic',
    initialState,
    reducers: {    
        fetchTopicStart: (state) => ({
            topic: [],
            isPending: true,
            error: false 
        }),
        fetchTopicSuccess: (state,action) => ({
            topic : action.payload,
            isPending: false
        }),
        fetchTopicFailure: (state) => ({
            ...state,
            isPending: false,
            error: state.error
        }),
    }
});
export const {fetchTopicStart,fetchTopicSuccess,fetchTopicFailure} = topicSlice.actions;

export default topicSlice.reducer;