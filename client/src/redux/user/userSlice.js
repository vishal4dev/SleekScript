import { createSlice} from "@reduxjs/toolkit";


const initialState = {
    currentUser: null,
    error:null,
    loading:false
}

const userSlice = createSlice({
     name:'user',
     initialState,
     reducers:{

        signInStart:(state)=>{//this will set the loading to true and error to null and signInStart is a action creator function(can be any thing )
            state.loading = true;
            state.error = null;
        },

        signInSuccess:(state,action)=>{//this will set the loading to false and error to null and currentUser to action.payload
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },

        signInFailure:(state,action)=>{//this will set the loading to false and error to action.payload
            state.loading = false;
            state.error = action.payload;
        },

     },

});

export const {signInStart,signInSuccess,signInFailure} = userSlice.actions;

export default userSlice.reducer;