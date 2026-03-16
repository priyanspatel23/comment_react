import React, { useState } from 'react'
import CommentList from './components/CommentList'
import CommentInput from './components/CommentInput'
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, User } from 'lucide-react'

const INITIAL_COMMENTS = [
    {
        id: 1,
        text: "This sunset is absolutely breathtaking! 😍",
        author: "traveler_jane",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        replies: [
            {
                id: 2,
                text: "Right? One of the best I've seen.",
                author: "official_dev",
                timestamp: new Date(Date.now() - 1800000).toISOString(),
                replies: []
            }
        ]
    },
    {
        id: 3,
        text: "Which island is this? 🏝️",
        author: "elena_m",
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        replies: []
    }
];

function App() {
    const [comments, setComments] = useState(INITIAL_COMMENTS);
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
            const updateReplies = (cms) => {
                return cms.map(c => {
                    if (c.id === parentId) return { ...c, replies: [...c.replies, newComment] };
                    if (c.replies.length > 0) return { ...c, replies: updateReplies(c.replies) };
                    return c;
                });
            };
            setComments(updateReplies(comments));
        }
    };

    const deleteComment = (id) => {
        const filterComments = (cms) => {
            return cms.filter(c => c.id !== id).map(c => ({
                ...c,
                replies: filterComments(c.replies)
            }));
        };
        setComments(filterComments(comments));
    };

    const editComment = (id, newText) => {
        const updateText = (cms) => {
            return cms.map(c => {
                if (c.id === id) return { ...c, text: newText };
                if (c.replies.length > 0) return { ...c, replies: updateText(c.replies) };
                return c;
            });
        };
        setComments(updateText(comments));
    };

    return (
        <div className="container">
            <main className="post-card animate-fade">
                {/* Post Header */}
                <div className="post-header">
                    <div className="avatar-circle">
                        <div className="avatar-inner">
                            <User size={18} color="var(--text-muted)" />
                        </div>
                    </div>
                    <div style={{ flex: 1 }}>
                        <span className="username">official_dev</span>
                    </div>
                    <MoreHorizontal size={20} style={{ cursor: 'pointer' }} />
                </div>

                {/* Post Image */}
                <div className="post-image-container">
                    <img
                        src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop"
                        alt="Beach Sunset"
                        className="post-image"
                    />
                </div>

                {/* Post Actions */}
                <div className="post-actions">
                    <Heart
                        className="action-btn"
                        size={24}
                        onClick={() => setPostLiked(!postLiked)}
                        fill={postLiked ? "var(--secondary)" : "none"}
                        color={postLiked ? "var(--secondary)" : "currentColor"}
                    />
                    <MessageCircle className="action-btn" size={24} />
                    <Send className="action-btn" size={24} />
                    <Bookmark className="action-btn" size={24} style={{ marginLeft: 'auto' }} />
                </div>

                {/* Post Info / Caption */}
                <div className="post-info">
                    <span className="likes-count">{postLiked ? '12,401 likes' : '12,400 likes'}</span>
                    <div className="caption">
                        <span className="caption-username">official_dev</span>
                        <span className="caption-text">Chasing sunsets in paradise. 🌅 Who wants to be here right now? #travel #sunset #vibes</span>
                    </div>
                </div>

                {/* Comments Section */}
                <div className="comments-section" style={{ borderTop: '1px solid var(--card-border)', marginTop: '8px' }}>
                    <CommentList
                        comments={comments}
                        onReply={addComment}
                        onDelete={deleteComment}
                        onEdit={editComment}
                    />
                </div>
            </main>

            {/* Fixed Bottom Input */}
            <div className="main-input-wrapper">
                <CommentInput onSubmit={(text) => addComment(text)} />
            </div>

            <div style={{ height: '80px' }}></div> {/* Spacer for fixed input */}
        </div>
    )
}

export default App
