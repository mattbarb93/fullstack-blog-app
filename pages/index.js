import { useState, useEffect } from "react";
import { API, Storage } from "aws-amplify";
import { listPosts } from "../src/graphql/queries";
import Link from "next/link";

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    const postData = await API.graphql({
      query: listPosts,
    });

    const { items } = postData.data.listPosts;
    const postsWithImages = await Promise.all(
      items.map(async (post) => {
        if (post.coverImage) {
          post.coverImage = await Storage.get(post.coverImage);
        }
        return post;
      })
    );

    setPosts(postsWithImages);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold underline text-sky-400 tracking-wide mt-6 mb-2">
        My Posts
      </h1>
      {posts.map((post, index) => (
        <Link key={index} href={`/posts/${post.id}`}>
          <div className="my-6 pb-6 border-b border-gray-300">
            {post.coverImage && (
              <img
                src={post.coverImage}
                className="w-36 h-36 bg-contain bg-center rounded-full sm:mx-0 sm:shrink-0"
              />
            )}
          </div>
          <div className="cursor-pointer border-b border-gray-300 mt8 pb-4">
            <h2 className="text-xl font-semibold" key={index}>
              {post.title}
            </h2>
            <p className="text-gray-500 mt-2">Author: {post.username} </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
