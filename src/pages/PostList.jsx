import { useQuery } from '@tanstack/react-query'
import { getPostsList, getUsers } from '../api/postsApi'
import { Link } from 'react-router-dom'

export default function PostList() {
  const { data: postList, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const [posts, users] = await Promise.all([getPostsList(), getUsers()])

      const usersMap = Object.fromEntries(users.map(user => [user.id, user]))

      return posts.map(post => ({
        ...post,
        user: usersMap[post.userId],
      }))
    },
  })

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold mb-4">게시글</h1>
      {postList.map(post => (
        <Link
          to={`/posts/${post.id}`}
          key={post.id}
          className="block p-4 bg-white shadow rounded hover:bg-gray-100 transition"
        >
          <div className="flex items-center gap-4">
            <img
              src={`https://i.pravatar.cc/40?u=${post.user.id}`}
              alt={post.user.name}
              className="rounded-full"
              width={40}
              height={40}
            />
            <div>
              <h2 className="text-lg font-semibold">{post.title}</h2>
              <p className="text-gray-500 text-sm">작성자: {post.user.name}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}