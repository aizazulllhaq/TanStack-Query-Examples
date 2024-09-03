import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { debounce } from "lodash";
import { useSearchParams } from "react-router-dom";

function Products() {
  const [searchParams, setSearchParams] = useSearchParams({
    skip: 0,
    limit: 4,
  });

  const skip = parseInt(searchParams.get("skip") || 0);
  const limit = parseInt(searchParams.get("limit") || 0);
  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await axios.get(
        "https://dummyjson.com/products/categories"
      );
      return response.data;
    },
    staleTime: 20000,
});

  const { data: products } = useQuery({
    queryKey: ["products", limit, skip, q, category],
    queryFn: async () => {
      let url = `https://dummyjson.com/products/search?limit=${limit}&skip=${skip}&q=${q}`;
      if (category) {
        url = `https://dummyjson.com/products/category/${category}?limit=${limit}&skip=${skip}`;
      }
      const response = await axios.get(url);
      return response.data;
    },
    placeholderData: keepPreviousData,
    staleTime: 20000,
  });

  const handleMove = (moveCount) => {
    setSearchParams((prevState) =>
      prevState.set("skip", Math.max(skip + moveCount, 0))
    );
  };

  return (
    <>
      <div className="bg-gray-100">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              My store
            </h2>
          </div>
          <div>
            <div className="relative mt-2 rounded-md flex items-center gap-8 mb-4">
              <input
                onChange={debounce((e) => {
                  setSearchParams((pre) => {
                    pre.set("q", e.target.value);
                    pre.set("skip", 0);
                    pre.delete("category");
                    return pre;
                  });
                }, 1000)}
                type="text"
                name="price"
                id="price"
                className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="IPhone"
              />
              <select
                className="border p-2"
                onChange={(e) => {
                  setSearchParams((pre) => {
                    pre.set("category", e.target.value);
                    pre.delete("q");
                    pre.set("skip", 0);
                    return pre;
                  });
                }}
              >
                <option>Select category</option>
                {categories?.map((category, index) => (
                  <option key={index} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {products?.products.map((product, index) => (
              <div key={index} className="group relative">
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-300 lg:aspect-none group-hover:opacity-75 lg:h-64">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                  />
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700">
                      <a href="">
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.title}
                      </a>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {product.category}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {product.price}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mt-12">
            <button
              disabled={skip < limit}
              className="bg-purple-500 px-4 py-1 text-white rounded"
              onClick={() => handleMove(-limit)}
            >
              Prev
            </button>
            <button
              disabled={skip + limit >= products?.total}
              className="bg-purple-500 px-4 py-1 text-white rounded"
              onClick={() => handleMove(limit)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Products;
