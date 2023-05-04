import {createSlice} from '@reduxjs/toolkit';

const initialState = {
     post: [],
     isPending: false,
     error: false
}

export const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {    
        fetchStart: (state) => ({
            post: [],
            error:false,
            isPending:true  
        }),
        fetchSuccess: (state,action) => ({
            post : action.payload,
            isPending: false
        }),
        fetchFailure: (state) => ({
            ...state,
            isPending: false,
            error: state.error
        }),
        postStart: (state) => ({
            ...state,
            isPending:true  
        }),
        postSuccess: (state,action) => ({
            ...state,
            post : [...state.post,action.payload]
        
        }),
        postFailure: (state) => ({
            ...state,
            isPending: false,
            error: state.error
        }),
        postDelete: (state,action) => ({
            ...state,
            post: state.post.filter(item => item._id !== action.payload)
        }),
        postView: (state) => (
            state.post.views += 1
        )     
        }
        });

export const {postStart,postSuccess,postFailure,postDelete,postView,postUnlike,fetchStart,fetchSuccess,fetchFailure} = postSlice.actions;

export default postSlice.reducer;