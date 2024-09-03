import React from "react";
import { useQuery } from "@tanstack/react-query";

const fetchPostById = async (postId) => {
  const data = await fetch(`https://dummyjson.com/posts/${postId}`).then(
    (res) => res.json()
  );
  return data;
};

const fetchCommentsByPostId = async (postId) => {
  const data = await fetch(
    `https://dummyjson.com/comments/post/${postId}`
  ).then((res) => res.json());
  return data.comments;
};

const Dependant = () => {
  const { data: post, isLoading } = useQuery({
    queryKey: ["post"],
    queryFn: () => fetchPostById(2),
  });

  const postID = post?.id;

  const {
    data: comments,
    status,
    error,
  } = useQuery({
    queryKey: ["comments", postID],
    queryFn: () => fetchCommentsByPostId(post.id),
    enabled: !!postID,
  });

  return (
    <div className="max-w-[1250px] mx-auto">
      <div className="border p-4 m-2 bg-gray-100 flex flex-col justify-center items-center rounded-md max-w-[700px] mx-auto">
        <h1 className="text-xl font-semibold text-center">Dependent Queries in TanStack Query</h1>
        <p>
          Dependent Queries in TanStack Query When dealing with dependent
          queries, the idea is that one query depends on the result of another.
          For instance, suppose you have a posts query that fetches a list of
          posts, and a comments query that fetches comments for a specific post.
          You want to ensure that the comments query only runs after the posts
          query has successfully completed.
        </p>
      </div>

      <h1 className="text-center font-bold text-2xl">Users Posts with Comments</h1>
      <div className="">
        <div className="px-4 py-2 m-4 border bg-gray-100 rounded-md max-w-[700px] mx-auto">
          <div className="relative">
            <span className="absolute -top-4 -left-3 opacity-50 text-sm">
              userID : {post?.id}
            </span>
            <h1 className="text-center my-2">{post?.title}</h1>
          </div>
          <hr />
          <p className="text-gray-500 mt-2 mb-4 px-4 py-2">{post?.body}</p>
          <hr />
          <div>
            <h1 className="text-bold px-4 opacity-90">Comments : </h1>
            {status === "pending" && (
              <div role="status" className="flex justify-center items-center">
                <svg
                  aria-hidden="true"
                  className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            )}
            {comments?.map((comment) => (
              <p className="text-gray-500 my-2 px-4 py-2 border mx-4">
                {comment.body}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dependant;
