import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { LoginResponse, Credentials } from "../../types/types";

export const noLoginApi = createApi({
  reducerPath: 'noLoginApi',
  baseQuery: fetchBaseQuery({
    baseUrl: ''
  }),
  endpoints: (builder) => ({
    logIn: builder.mutation<LoginResponse, Credentials>({
      query: (creds: Credentials) => ({
        url: '/login',
        method: 'POST',
        body: creds
      })
    })
  })
})

export const {
  useLogInMutation
} = noLoginApi