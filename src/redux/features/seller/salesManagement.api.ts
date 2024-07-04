import { TQueryParam, TResponseRedux } from "../../../types";
import { TSales } from "../../../types/salesManagement.type";
import { baseApi } from "../../api/baseApi";

const salesManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSales: builder.query({
      query: (args) => {
        //   console.log(args);
        const params = new URLSearchParams();

        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }

        return {
          url: "/sales",
          method: "GET",
          params: params,
        };
      },
      providesTags: ["sales"],
      transformResponse: (response: TResponseRedux<TSales[]>) => {
        return {
          data: response.data,
          meta: response.meta,
        };
      },
    }),

    addSales: builder.mutation({
      query: (data) => ({
        url: `/sales/create-sales`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["sales", "products"],
    }),
  }),
});

export const { useGetAllSalesQuery, useAddSalesMutation } = salesManagementApi;
