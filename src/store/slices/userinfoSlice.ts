import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from '../../types/types'

const initialState: User = {
  id: "",
  firstname: "",
  lastname: "",
  middlename: "",
  email: "",
  telegram: "",
  position: "",
  department: "",
  avatar: "",
  username: ""
}

export const userinfoSlice = createSlice({
  name: 'userinfo',
  initialState: initialState,
  reducers: {
    setnew: (state, action: PayloadAction<User>) => {
      return state = {
        ...action.payload
      }
    }
  }
})

export const { setnew } = userinfoSlice.actions
