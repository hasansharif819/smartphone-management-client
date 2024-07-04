import { TQueryParam, TResponseRedux } from "../../../types";
import { TProduct } from "../../../types/productManagement.type";
import { baseApi } from "../../api/baseApi";

const productManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: (args) => {
        const params = new URLSearchParams();

        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }

        return {
          url: "/product",
          method: "GET",
          params: params,
        };
      },
      providesTags: ["products", "sales"],
      transformResponse: (response: TResponseRedux<TProduct[]>) => {
        return {
          data: response.data,
          meta: response.meta,
        };
      },
    }),
    addProduct: builder.mutation({
      query: (data) => ({
        url: `/product/create-product`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["products"],
    }),
    updateProduct: builder.mutation({
      query: (args) => ({
        url: `/product/${args.id}`,
        method: "PATCH",
        body: args.data,
      }),
      invalidatesTags: ["products"],
    }),

    deleteProduct: builder.mutation({
      query: (id: string) => ({
        url: `/product/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["products"],
    }),

    bulkDeleteProduct: builder.mutation({
      query: (data) => ({
        url: `/product/bulk-delete`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["products"],
    }),

    getProductById: builder.query({
      query: (id: string) => ({
        url: `/product/${id}`,
        method: "GET",
      }),
      providesTags: ["products"],
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useBulkDeleteProductMutation,
  useGetProductByIdQuery,
} = productManagementApi;
