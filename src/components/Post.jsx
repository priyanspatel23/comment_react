import React, { useState } from 'react'
import './Post.css'

function CommentInput({ onSubmit, onCancel, placeholder = "Add a comment...", initialValue = "", isReplying = false }) {
    const [text, setText] = useState(initialValue);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        onSubmit(text);
        setText("");
        if (onCancel) onCancel();
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="input-container">
                <span style={{ cursor: 'pointer', fontSize: '20px' }}>😊</span>
                <textarea
                    className="textarea-box"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={placeholder}
                    rows={1}
                    onInput={(e) => {
                        e.target.style.height = 'auto';
                        e.target.style.height = e.target.scrollHeight + 'px';
                    }}
                />
                {isReplying && onCancel && (
                    <button type="button" onClick={onCancel} className="btn-post" style={{ color: 'var(--text-muted)' }}>
                        Cancel
                    </button>
                )}
                <button type="submit" className="btn-post" disabled={!text.trim()}>
                    {initialValue ? "Save" : "Post"}
                </button>
            </div>
        </form>
    )
}

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

    const timeAgo = new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div>
            <div className="comment-item-container">
                <div className="avatar-circle">
                    <div className="avatar-inner">
                        <span style={{ color: 'var(--text-muted)' }}>👤</span>
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
                            <span style={{ cursor: 'pointer', fontWeight: 'bold' }}>•••</span>
                        </div>
                    </div>
                </div>

                <div className="comment-heart" onClick={() => setIsLiked(!isLiked)} style={{ cursor: 'pointer' }}>
                    <span style={{ color: isLiked ? 'var(--secondary)' : 'var(--text-muted)' }}>
                        {isLiked ? '❤️' : '🤍'}
                    </span>
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

function CommentList({ comments, onReply, onDelete, onEdit }) {
    if (comments.length === 0) return null;

    return (
        <div className="comment-list">
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

const dummyData = [
    {
        id: 1,
        text: "looks good",
        author: "john_doe",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        replies: [
            {
                id: 2,
                text: "thanks",
                author: "official_dev",
                timestamp: new Date(Date.now() - 1800000).toISOString(),
                replies: []
            }
        ]
    },
    {
        id: 3,
        text: "nice post",
        author: "user_123",
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        replies: []
    }
];

export default function Post() {
    const [comments, setComments] = useState(dummyData);
    const [count, setCount] = useState(20);
    const [postLiked, setPostLiked] = useState(false);

    const addComment = (text, parentId = null) => {
        const newComment = {
            id: count + 1,
            text,
            author: "you",
            timestamp: new Date().toISOString(),
            replies: []
        };
        setCount(prev => prev + 1);

        if (parentId === null) {
            setComments([...comments, newComment]);
        } else {
            const updateArr = (arr) => {
                return arr.map(item => {
                    if (item.id === parentId) return { ...item, replies: [...item.replies, newComment] };
                    if (item.replies.length > 0) return { ...item, replies: updateArr(item.replies) };
                    return item;
                });
            };
            setComments(updateArr(comments));
        }
    };

    const deleteComment = (id) => {
        const filterTree = (arr) => {
            return arr.filter(item => item.id !== id).map(item => ({
                ...item,
                replies: filterTree(item.replies)
            }));
        };
        setComments(filterTree(comments));
    };

    const editComment = (id, newText) => {
        const updateTreeText = (arr) => {
            return arr.map(item => {
                if (item.id === id) return { ...item, text: newText };
                if (item.replies.length > 0) return { ...item, replies: updateTreeText(item.replies) };
                return item;
            });
        };
        setComments(updateTreeText(comments));
    };

    return (
        <div className="container">
            <main className="post-card">
                <div className="post-header">
                    <div className="avatar-circle">
                        <span style={{ color: 'var(--text-muted)' }}>👤</span>
                    </div>
                    <div style={{ flex: 1 }}>
                        <span className="username">official_dev</span>
                    </div>
                    <span style={{ cursor: 'pointer', fontWeight: 'bold' }}>•••</span>
                </div>

                <div className="post-image-container">
                    <img
                        src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop"
                        alt="Beach Sunset"
                        className="post-image"
                    />
                </div>

                <div className="post-actions">
                    <span
                        className="action-btn"
                        onClick={() => setPostLiked(!postLiked)}
                        style={{ fontSize: '24px', color: postLiked ? 'var(--secondary)' : 'currentColor' }}
                    >
                        {postLiked ? '❤️' : '🤍'}
                    </span>
                    <span className="action-btn" style={{ fontSize: '24px' }}>💬</span>
                    <span className="action-btn" style={{ fontSize: '24px' }}>🚀</span>
                    <span className="action-btn" style={{ fontSize: '24px', marginLeft: 'auto' }}>🔖</span>
                </div>

                <div className="post-info">
                    <span className="likes-count">{postLiked ? '12,401 likes' : '12,400 likes'}</span>
                    <div className="caption">
                        <span className="caption-username">official_dev</span>
                        <span className="caption-text">Just sharing this image. #testing</span>
                    </div>
                </div>

                <div className="comments-section" style={{ borderTop: '1px solid var(--card-border)', marginTop: '8px' }}>
                    <CommentList
                        comments={comments}
                        onReply={addComment}
                        onDelete={deleteComment}
                        onEdit={editComment}
                    />
                </div>
            </main>

            <div className="main-input-wrapper">
                <CommentInput onSubmit={(text) => addComment(text)} />
            </div>

            <div style={{ height: '80px' }}></div>
        </div>
    )
}
