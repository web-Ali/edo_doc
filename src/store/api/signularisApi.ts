import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import {
    DocType,
    User,
    Recipient,
    Document,
    DocSort,
    DocsResponse,
    TokenInfo,
    Notifications, NotificationMain, GetNotificationsRequest, GetMetaDocumentsRequest, NotificationTost
} from '../../types/types'



export const signularisApi = createApi({
    reducerPath: 'signularisApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api/v1',
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token')
            if (token) {
                headers.set("Authorization", `Bearer ${token}`)
            }
            return headers
        }
    }),
    keepUnusedDataFor: 1,
    tagTypes: ['MetaDocument', 'MetaDocumentInfo', 'IndexNotifications','tostNotifications', 'documentCount'],
    endpoints: (builder) => ({
        getSelfInfo: builder.query<User, void>({
            query: () => ({
                url: '/getselfinfo',
                method: 'GET'
            })
        }),
        getNotificationsMessage: builder.query<NotificationTost, null>({
            query: (time) => ({
                url: `/getnewnotifications`,
                method: 'GET'
            }),
            providesTags: ['tostNotifications']
        }),

        getIndexNotifications: builder.query<NotificationMain, GetNotificationsRequest>({
            query: (req: GetNotificationsRequest) => ({
                url: `/notifications/${req.skip}/${req.limit}/`,
                method: 'GET'
            }),
            keepUnusedDataFor: 0,
            providesTags: ['IndexNotifications']
        }),
        getRecipientsList: builder.query<Recipient[], void>({
            query: () => ({
                url: '/getrecipientslist',
                method: 'GET',
            })
        }),
        getDocumentCount: builder.query<{count: number}, DocType>({
            query: (DocType) => ({
                url: '/getdocumentscount/'+DocType,
                method: 'GET',
            }),
            providesTags: ['documentCount']
        }),
        getMetaDocuments: builder.query<DocsResponse, GetMetaDocumentsRequest>({
            query: (req: GetMetaDocumentsRequest) => ({
                url: `/getdocuments/${req.type}/${req.skip}/${req.limit}/${req.sort}`,
                method: 'GET'
            }),
            providesTags: ['MetaDocument'],
        }),
        getMetaDocument: builder.query<Document, string>({
            query: (id: string) => ({
                url: `/getdocument/${id}`,
                method: 'GET'
            }),
            providesTags: ['MetaDocumentInfo']
        }),
        getTokenInfo: builder.query<TokenInfo, string>({
            query: (token: string) => ({
                url: `/gettokeninfo/${token}`,
                method: 'GET'
            })
        }),
        createMetaDocument: builder.mutation<any, FormData>({
            query: (fd: FormData) => ({
                url: '/createdocument',
                method: 'POST',
                body: fd
            })
        })
    })
})

export const {
    useGetDocumentCountQuery,
    useGetSelfInfoQuery,
    useGetRecipientsListQuery,
    useGetMetaDocumentsQuery,
    useGetMetaDocumentQuery,
    useGetTokenInfoQuery,
    useGetNotificationsMessageQuery,
    useCreateMetaDocumentMutation,
    useGetIndexNotificationsQuery
} = signularisApi
