import React from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { queryClient } from "./main";

const Optimistic = () => {
  const { data: posts } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const response = await axios.get(
        "http://localhost:3000/posts?_sort=id&_order=desc"
      );
      return response.data;
    },
  });

  const { mutate, isError, isPending, variables } = useMutation({
    mutationFn: async (newPost) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        if (Math.random() > 0.5) {
          throw new Error("Network Error");
        }

        const response = await axios.post(
          "http://localhost:3000/posts",
          newPost,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        return response.data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: async () => {
      return await queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const post = {
      id: Date.now(),
      title: e.target.elements.title.value,
    };
    mutate(post);
  };

  const handleRetry = (post) => {
    mutate(post);
  };

  return (
    <>
      <div className="p-4">
        <div className="max-w-[600px] mx-auto my-4">
          <h1 className="p-4 my-4 border font-semibold rounded-lg text-xl text-center">
            Optimistic in TenStack
          </h1>
          <form className="flex flex-col" onSubmit={handleSubmit}>
            <input
              className="border mb-4 p-2 rounded-sm"
              type="text"
              placeholder="Title"
              name="title"
              autoComplete
            />
            <button
              className="border mb-4 p-2 bg-purple-500 text-white rounded-sm"
              type="submit"
            >
              Submit
            </button>
          </form>
        </div>

        <div className="max-w-[800px] mx-auto">
          <h2 className="text-lg font-bold mb-4">Posts:</h2>
          <ul className="grid grid-cols-3 gap-2">
            {isPending && (
              <li className="border p-2 mb-4 opacity-40 text-center">
                {variables.title}
              </li>
            )}

            {isError && (
              <li className="border p-2 mb-4 flex justify-between opacity-40 text-red-400">
                {variables.title}
                <button
                  className="text-blue-400 text-sm"
                  onClick={() => handleRetry(variables)}
                >
                  {" "}
                  Retry
                </button>
              </li>
            )}

            {posts?.map((post) => {
              return (
                <li className="border p-2 mb-4 text-center" key={post.id}>
                  {post.title}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Optimistic;
