import React, { useState } from 'react'
import CommentInput from './CommentInput'
import CommentList from './CommentList'
import { Heart, User, MoreHorizontal } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

function CommentItem({ comment, onReply, onDelete, onEdit }) {
    const [isReplying, setIsReplying] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [showReplies, setShowReplies] = useState(false);

    const handleReplySubmit = (text) => {
        onReply(text, comment.id);
        setIsReplying(false);
        setShowReplies(true);
    };

    const handleEditSubmit = (text) => {
        onEdit(comment.id, text);
        setIsEditing(false);
    };

    const timeAgo = formatDistanceToNow(new Date(comment.timestamp))
        .replace('about ', '')
        .replace(' minutes', 'm')
        .replace(' minute', 'm')
        .replace(' hours', 'h')
        .replace(' hour', 'h')
        .replace(' days', 'd')
        .replace(' day', 'd')
        .replace(' seconds', 's')
        .replace('less than a minute', '1m');

    return (
        <div className="animate-fade">
            <div className="comment-item-container">
                <div className="avatar-circle">
                    <div className="avatar-inner">
                        <User size={20} color="var(--text-muted)" />
                    </div>
                </div>

                <div className="comment-content">
                    <div className="comment-text-wrapper">
                        <span className="username">{comment.author}</span>
                        {isEditing ? (
                            <CommentInput
                                initialValue={comment.text}
                                onSubmit={handleEditSubmit}
                                onCancel={() => setIsEditing(false)}
                            />
                        ) : (
                            <span className="comment-text">{comment.text}</span>
                        )}
                    </div>

                    <div className="comment-meta">
                        <span>{timeAgo}</span>
                        <span className="meta-link" onClick={() => setIsLiked(!isLiked)}>
                            {isLiked ? '1 like' : '0 likes'}
                        </span>
                        <span className="meta-link" onClick={() => setIsReplying(!isReplying)}>Reply</span>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <MoreHorizontal size={14} style={{ cursor: 'pointer' }} />
                        </div>
                    </div>
                </div>

                <div className="comment-heart" onClick={() => setIsLiked(!isLiked)}>
                    <Heart size={12} fill={isLiked ? "var(--secondary)" : "none"} color={isLiked ? "var(--secondary)" : "var(--text-muted)"} />
                </div>
            </div>

            {isReplying && !isEditing && (
                <div style={{ marginLeft: '44px', marginBottom: '1rem' }}>
                    <CommentInput
                        isReplying={true}
                        onSubmit={handleReplySubmit}
                        onCancel={() => setIsReplying(false)}
                        placeholder={`Reply to ${comment.author}...`}
                    />
                </div>
            )}

            {comment.replies && comment.replies.length > 0 && (
                <div className="replies-container">
                    {!showReplies ? (
                        <div className="view-replies" onClick={() => setShowReplies(true)}>
                            View replies ({comment.replies.length})
                        </div>
                    ) : (
                        <>
                            <div className="view-replies" onClick={() => setShowReplies(false)}>
                                Hide replies
                            </div>
                            <CommentList
                                comments={comment.replies}
                                onReply={onReply}
                                onDelete={onDelete}
                                onEdit={onEdit}
                            />
                        </>
                    )}
                </div>
            )}
        </div>
    )
}

export default CommentItem
