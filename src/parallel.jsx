import { useState } from "react";
import { useQueries } from "@tanstack/react-query";
import axios from "axios";

const Parallel = () => {
  const [userIds, setUserIds] = useState([1, 2]);

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
    <div>
      <button
        onClick={() =>
          setUserIds((prev) => {
            return [...prev,prev];
          })
        }
      >
        Load more
      </button>

      {userQueries?.map((query, index) => (
        <>
          <h1>{query?.data?.firstName}</h1>
          <span>{query?.data?.email}</span>
        </>
      ))}
    </div>
  );
};

export default Parallel;
