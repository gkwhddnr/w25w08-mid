import { useQuery } from '@tanstack/react-query'
import { useParams, Link } from 'react-router-dom'
import { 
    getPostById, 
    getPostComments,
    getUserById,
} from '../api/postsApi'

export default function PostDetail() {
    const { id } = useParams()
    const { data, isLoading } = useQuery({
      queryKey: ['posts', id],
      queryFn: async () => {
        const post = await getPostById(id)
        const [comments, user] = await Promise.all([
          getPostComments(id),
          getUserById(post.userId),
        ])
        return {
          ...post,
          comments,
          user,
        }
      },
    })

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <Link to="/" className="px-4 py-2 rounded-md bg-gray-300 text-gray-700 hover:text-blue-600">&larr; 리스트</Link>
      <div className="bg-white p-6 shadow rounded">
        <div className="flex items-center gap-4 mb-4">
          <img
            src={`https://i.pravatar.cc/60?u=${data.user.id}`}
            alt={data.user.name}
            className="rounded-full"
            width={60}
            height={60}
          />
          <div>
            <h2 className="text-xl font-bold">{data.title}</h2>
            <p className="text-gray-600">작성자: {data.user.name}</p>
          </div>
        </div>
        <p className="text-gray-800">{data.body}</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">댓글</h3>
        <div className="space-y-2">
          {data.comments.map(comment => (
            <div key={comment.id} className="bg-gray-50 p-4 rounded shadow-sm">
              <p className="font-semibold">{comment.name}</p>
              <p className="text-sm text-gray-600">{comment.email}</p>
              <p className="text-gray-800 mt-2">{comment.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
