import toast from 'react-hot-toast'
import { assets } from '../../assets/assets'
import useAppStore from '../../stores/AppStore'

const CommentTableItem = ({comment, fetchComments}) => {
    const {blog, createdAt, _id} = comment
    const BlogDate = new Date(createdAt)

    const {axios} = useAppStore()

    const approveComment = async () =>{
        try{
            const {data}= await axios.post("/api/admin/approve-commment", {id: _id})
            if(data.success){
                toast.success(data.message)
                fetchComments()
            }else{
                toast.error(data.message)
            }
        }catch(error){
            toast.error(error.message)
        }
    }

    const deleteComment = async () =>{
        try{
            const confirm = window.confirm("Are you sure you want to delte this comment? ")
            if(! confirm) return
            const {data}= await axios.post("/api/admin/delete-commment", {id: _id})
            if(data.success){
                toast.success(data.message)
                fetchComments()
            }else{
                toast.error(data.message)
            }
        }catch(error){
            toast.error(error.message)
        }
    }
 
    return (
    <tr className='order-y border-gray-300'>
        <td className='px-6 py-4'>
            <b className='font-medium text-gray-600'>Blog</b> : {blog.title}
            <br/>
            <br/>
            <b className='font-medium text-gray-600'>Name</b> : {comment.name}
            <br/>
            <b className='font-medium text-gray-600'>Comment</b> : {comment.content}
            </td>
            <td className='px-6 py-4 max:sm-hidden'>
                {BlogDate.toLocaleDateString()}
            </td>
            <td className='px-6 py-4'>
                <div className='inline-flex items-center gap-4'>
                    {
                        !comment.isApproved ?
                        <img onClick={approveComment} src={assets.tick_icon} className='w-5 hover-scale-110 transition-all cursor-pointer '/> : <p className='text-xs border
                        border-green-600 bg-green-100 text-green-600 rounded-full px-3 py-1'>Approved</p>
                    }
                    <img onClick={deleteComment} src={assets.bin_icon} className='w-5 hover-scale-110 transition-all cursor-pointer '/>
                </div>

            </td>
    </tr>
  )
}

export default CommentTableItem  