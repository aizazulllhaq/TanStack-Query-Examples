import { useState } from "react";
import { useQueries } from "@tanstack/react-query";
import axios from "axios";

const Parallel = () => {
  const [userIds, setUserIds] = useState([1, 2, 3, 4]);

  // Issues with useQuery with dynamic query.

  // Issue 1 : Cannot be use inside callback.
  // Issue 2 : Static okay , but dynamic Query not allowed in there. -> Solution = useQueries();

  //   userIds.forEach((id) => {
  //     const userQuery = useQuery({
  //       queryKey: ["user", id],
  //       queryFn: async () => {
  //         const response = await axios.get(`https://dummyjson.com/users/${id}`);
  //         return response.data;
  //       },
  //     });
  //   });

  const userQueries = useQueries({
    queries: userIds.map((id) => {
      return {
        queryKey: ["user", id],
        queryFn: async () => {
          const response = await axios.get(`https://dummyjson.com/users/${id}`);
          return response.data;
        },
      };
    }),
  });

  return (
    <div className="max-w-[1050px] mx-auto flex flex-col items-center">
      <h1 className="p-4 m-4 border text-semibold bg-gray-100 rounded-lg text-xl">
        Parallel in TenStack
      </h1>

      <button
        className="p-2 my-8 rounded-md border border-gray-200 bg-black text-white hover:bg-gray-900 hover:text-gray-200"
        onClick={() =>
          setUserIds((prev) => {
            return [...prev, prev];
          })
        }
      >
        Load more
      </button>

      <div className="grid grid-cols-2">
        {userQueries?.map((query, index) => (
          <>
            {query?.data && (
              <div className="px-4 py-2 m-4 border bg-gray-100 rounded-md ">
                <div className="flex justify-center items-center">
                  <img
                    src={query?.data?.image}
                    alt=""
                    className="w-[40px] h-[40px] my-6"
                  />
                </div>
                <h1 className="text-center text-gray-500 my-2">
                  {query?.data?.firstName}
                </h1>
                <span className="text-gray-500 mt-2 mb-4">
                  {query?.data?.email}
                </span>
              </div>
            )}
          </>
        ))}
      </div>
    </div>
  );
};

export default Parallel;
