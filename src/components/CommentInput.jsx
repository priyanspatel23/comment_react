import React, { useState } from 'react'
import { Smile } from 'lucide-react'

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
        <form onSubmit={handleSubmit} className="animate-fade">
            <div className="ig-input-container">
                <Smile size={20} color="var(--text-main)" style={{ cursor: 'pointer' }} />
                <textarea
                    className="ig-textarea"
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

export default CommentInput
