import React from 'react'
import CommentItem from './CommentItem'

function CommentList({ comments, onReply, onDelete, onEdit }) {
    if (comments.length === 0) return null;

    return (
        <div className="comment-list animate-slide-in">
            {comments.map((comment) => (
                <CommentItem
                    key={comment.id}
                    comment={comment}
                    onReply={onReply}
                    onDelete={onDelete}
                    onEdit={onEdit}
                />
            ))}
        </div>
    )
}

export default CommentList
