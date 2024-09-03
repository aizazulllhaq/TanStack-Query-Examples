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

  const { data: comments, status } = useQuery({
    queryKey: ["comments", postID],
    queryFn: () => fetchCommentsByPostId(post.id),
    enabled:!!postID,
  });

  return (
    <div className="p-12">
      <h1 className="text-lg font-bold">Post:</h1>
      {isLoading ? <p>Loading the post</p> : <h2>{post?.title}</h2>}
      <br />
      <h1 className="text-lg font-bold">
        Comments {"   "}
        {status === "pending" && (
          <span className="text-red-400 opacity-60 text-sm">Pending</span>
        )}
      </h1>
      <ul>
        {comments?.map((comment) => (
          <p key={comment.id}>{comment.body}</p>
        ))}
      </ul>
    </div>
  );
};

export default Dependant;
