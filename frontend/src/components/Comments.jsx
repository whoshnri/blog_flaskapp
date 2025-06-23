import { MessageSquareText, Send, ChevronDown, ChevronUp } from "lucide-react"
import { useRef, useState, useEffect } from "react"
const API = import.meta.env.VITE_API_BASE_URL;

const CommentSection = ({pid}) => {
    const [changes, setChanges] = useState(false)
    return (
        <div className="w-full space-y-6">
            <Comments pid={pid} setChanges={setChanges} changes={changes} />
            <AddComment pid={pid} setChanges={setChanges} changes={changes}/>
        </div>
    )
}

const Comments = ({pid, changes, setChanges}) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const getComments = async() => {
            setLoading(true)
            try {
                const response = await fetch(`${API}/comments/${pid}`)
                if (response.ok) {
                    const res = await response.json()
                    setComments(res.comments)
                    console.log(res.comments)
                } else {
                    console.error("Failed to fetch comments:", response.statusText)
                }
            } catch (error) {
                console.error("Error fetching comments:", error)
            } finally {
                setLoading(false)
            }
        }

        if (pid) {
            getComments()
        }
    }, [changes, pid])

    return (
        <div className="border-t border-slate-800 pt-8">
            {/* Header */}
            <div
                className="flex items-center justify-between py-2 cursor-pointer hover:bg-slate-900/50 transition-colors rounded-lg px-4"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-3">
                    <MessageSquareText className="w-5 h-5 text-slate-400" />
                    <span className="text-sm font-medium text-slate-200">
                        Comments {loading ? '' : `(${comments.length})`}
                    </span>
                </div>
                {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
            </div>

            {isExpanded && (
                <div className="mt-4">
                    {loading ? (
                        <div className="flex justify-center py-4">
                            <div className="w-6 h-6 border-2 border-t-transparent border-slate-400 rounded-full animate-spin" />
                        </div>
                    ) : comments.length > 0 ? (
                        <div className="space-y-2">
                            {comments.map((comment) => (
                                <div key={comment.id} className="flex items-start gap-3 bg-slate-900/40 p-2 rounded-md">
                                    <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-xs font-medium text-slate-300">
                                            {comment.name?.[0]?.toUpperCase() || 'A'}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="text-xs font-semibold text-slate-200">
                                                {comment.name || 'Anonymous'}
                                            </span>
                                            <span className="text-xs text-slate-400">
                                                {comment.timestamp}
                                            </span>
                                        </div>
                                        <p className="text-slate-300 text-xs leading-relaxed">
                                            {comment.comment}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <MessageSquareText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                            <p className="text-slate-400">No comments yet. Be the first to share your thoughts!</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

const AddComment = ({pid, changes, setChanges}) => {
    const [comment, setComment] = useState("")
    const [name, setName] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const commentRef = useRef()

    const handleSubmit = async() => {
        if (!comment.trim()) return;

        const data = {
            "name": name.trim() || "Anonymous",
            "comment": comment.trim(),
        }

        setSubmitting(true)
        try {
            const response = await fetch(`${API}/add/comment/${pid}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const res = await response.json();
                console.log("Comment added:", res.message)
                setChanges(!changes)
                setComment("")
                setName("")
            } else {
                console.error("Failed to add comment:", response.statusText)
            }
        } catch (error) {
            console.error("Network error:", error);
        } finally {
            setSubmitting(false);
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit()
        }
    }

    const handleNameKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            commentRef.current?.focus()
        }
    }

    return (
        <div className="border border-slate-800 rounded-lg p-6 bg-slate-900/20">
            <h3 className="text-lg font-medium text-slate-200 mb-4">Leave a comment</h3>

            <div className="space-y-4">
                {/* Name input */}
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium text-slate-300">
                            {name ? name[0].toUpperCase() : "?"}
                        </span>
                    </div>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyPress={handleNameKeyPress}
                        placeholder="Your name (optional)"
                        className="flex-1 px-4 py-2 bg-black/50 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-slate-600 focus:border-transparent transition-all"
                    />
                </div>

                {/* Comment input */}
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <MessageSquareText className="w-5 h-5 text-slate-400" />
                    </div>
                    <div className="flex-1 relative">
                        <textarea
                            ref={commentRef}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Share your thoughts..."
                            rows={1}
                            className="w-full px-4 py-2 bg-black/50 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-600 text-sm focus:border-transparent transition-all resize-none"
                        />
                        <button
                            onClick={handleSubmit}
                            disabled={!comment.trim() || submitting}
                            className="absolute bottom-[.7rem] right-1 p-1 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-700"
                        >
                            {submitting ? (
                                <div className="w-5 h-5 border-2 border-t-transparent border-slate-400 rounded-full animate-spin" />
                            ) : (
                                <Send className="w-5 h-5 text-slate-300" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CommentSection
