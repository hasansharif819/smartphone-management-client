import { TQueryParam, TResponseRedux, TSeller } from "../../../types";

import { baseApi } from "../../api/baseApi";

const userManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSellers: builder.query({
      query: (args) => {
        // console.log(args);
        const params = new URLSearchParams();

        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }

        return {
          url: "/seller",
          method: "GET",
          params: params,
        };
      },
      transformResponse: (response: TResponseRedux<TSeller[]>) => {
        return {
          data: response.data,
          meta: response.meta,
        };
      },
    }),
    addSeller: builder.mutation({
      query: (data) => ({
        url: "/users/create-seller",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Seller"],
    }),
    addManager: builder.mutation({
      query: (data) => ({
        url: "/users/create-manager",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Manager"],
    }),

    // getSingleSeller: builder.query({
    //   query: (id) => ({
    //     url: `/seller/${id}`,
    //     method: "GET",
    //   }),
    // }),

    getSingleSeller: builder.query({
      query: (id: string) => {
        // console.log("seller id from API = ", id);
        return {
          url: `/seller/${id}`,
          method: "GET",
        };
      },
      transformResponse: (response: TResponseRedux<TSeller>) => {
        return {
          data: response.data,
          meta: response.meta,
        };
      },
    }),

    changePassword: builder.mutation({
      query: (data) => ({
        url: "/auth/change-password",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useAddSellerMutation,
  useAddManagerMutation,
  useGetAllSellersQuery,
  useGetSingleSellerQuery,
  useChangePasswordMutation,
} = userManagementApi;
