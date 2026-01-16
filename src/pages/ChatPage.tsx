import type React from "react"
import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { apiClient } from "@/lib/apiClient"
import { useNavigate } from "react-router-dom"
import { Send, Loader2, Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

export type ExpertType = string; // Will be defined by API

export interface ExpertInfo {
  type: ExpertType;
  name: string;
  description: string;
  icon: string;
  color: string;
}

interface ChatMessage {
  id?: string
  conversationId?: string
  expertType?: ExpertType
  role: "user" | "assistant"
  content: string
  timestamp?: string
  status?: "sending" | "sent" | "error"
}

// TODO: Add conversation interface when implementing chat history
// interface Conversation {
//   expertType: ExpertType
//   conversationId: string
//   lastActivity: string
//   totalMessages: number
// }

function TypingIndicator() {
  return (
    <div className="flex justify-start animate-fade-in">
      <div className="rounded-2xl px-4 py-3 bg-muted max-w-[75%]">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:-0.3s]" />
          <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" />
        </div>
      </div>
    </div>
  )
}

function MessageSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}>
          <div className="rounded-2xl px-4 py-3 max-w-[75%] bg-muted/50 h-16 w-64" />
        </div>
      ))}
    </div>
  )
}


function ExpertSelection({ experts, onSelectExpert }: { experts: ExpertInfo[], onSelectExpert: (expertType: ExpertType) => void }) {

  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4">
      <div className="max-w-2xl w-full">
        <h2 className="text-2xl font-medium mb-4">Choose Your Expert</h2>
        <p className="text-muted-foreground mb-8">
          Select a specialist to start a conversation tailored to your needs.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {experts.map((expert) => {
            const IconComponent = iconMap[expert.icon as keyof typeof iconMap]
            return (
              <div key={expert.type}>
                <IconComponent style={{ color: expert.color }} />
                <h3 className="font-medium">{expert.name}</h3>
                <p className="text-sm text-muted-foreground">{expert.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4">
      <h3 className="text-lg font-medium mb-2">Start a conversation</h3>
      <p className="text-sm text-muted-foreground max-w-sm">
        Send a message to begin chatting with your selected expert.
      </p>
    </div>
  )
}

function formatTimestamp(timestamp?: string) {
  if (!timestamp) return ""
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  // Less than 1 minute
  if (diff < 60000) return "Just now"
  // Less than 1 hour
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  // Less than 24 hours
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
  // Otherwise show time
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

export function ChatPage() {
  const navigate = useNavigate()
  const [selectedExpert, setSelectedExpert] = useState<ExpertType | null>(null)
  const [availableExperts, setAvailableExperts] = useState<ExpertInfo[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [sending, setSending] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const token = localStorage.getItem("authToken")

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [input])

  // Fetch available experts
  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const res = await apiClient.get("/api/chat/experts")
        setAvailableExperts(res.data.experts || [])
      } catch (err) {
        console.error("Fetch experts error:", err)
        // Fallback to empty array if API fails
        setAvailableExperts([])
      }
    }

    fetchExperts()
  }, [])

  useEffect(() => {
    if (!token) return

    // TODO: Fetch conversations for user to show chat history
    // const fetchConversations = async () => {
    //   try {
    //     const res = await apiClient.get("/api/chat/conversations")
    //     setConversations(res.data.conversations || [])
    //   } catch (err) {
    //     console.error("Fetch conversations error:", err)
    //   }
    // }
    // fetchConversations()
  }, [token])

  useEffect(() => {
    if (!token || !selectedExpert) return

    const fetchHistory = async () => {
      setLoadingHistory(true)
      setError(null)
      try {
        const res = await apiClient.get(`/api/chat/history?expertType=${selectedExpert}`)
        const history: ChatMessage[] =
          res.data?.messages?.map((m: any) => ({
            id: m._id,
            conversationId: m.conversationId,
            expertType: m.expertType,
            role: m.role,
            content: m.content,
            timestamp: m.timestamp,
            status: "sent",
          })) ?? []
        setMessages(history)
      } catch (err: any) {
        console.error("Fetch history error:", err)
        setError(err?.response?.data?.error || err?.response?.data?.message || "Failed to fetch chat history")
      } finally {
        setLoadingHistory(false)
      }
    }

    fetchHistory()
  }, [token, selectedExpert])

  const handleSend = async () => {
    if (!input.trim() || !token || sending || !selectedExpert) return

    setSending(true)
    setError(null)
    const userMsg: ChatMessage = {
      role: "user",
      content: input.trim(),
      expertType: selectedExpert,
      status: "sending",
      timestamp: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput("")

    // Show typing indicator after a brief delay
    setTimeout(() => setIsTyping(true), 500)

    try {
      const res = await apiClient.post("/api/chat/send", {
        message: userMsg.content,
        expertType: selectedExpert,
      })
      const { userMessage, assistantMessage } = res.data || {}

      setIsTyping(false)
      setMessages((prev) => [
        ...prev.slice(0, -1), // Replace optimistic user message
        {
          id: userMessage?.id,
          role: userMessage?.role ?? "user",
          content: userMessage?.content ?? userMsg.content,
          timestamp: userMessage?.timestamp,
          status: "sent",
        },
        {
          id: assistantMessage?.id,
          role: assistantMessage?.role ?? "assistant",
          content: assistantMessage?.content ?? "No response",
          timestamp: assistantMessage?.timestamp,
          status: "sent",
        },
      ])
    } catch (err: any) {
      console.error("Send message error:", err)
      setIsTyping(false)
      setError(err?.response?.data?.error || err?.response?.data?.message || "Failed to send message")
      // Mark message as error
      setMessages((prev) =>
        prev.map((msg, idx) => (idx === prev.length - 1 ? { ...msg, status: "error" as const } : msg)),
      )
      setInput(userMsg.content)
    } finally {
      setSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-background">
        <div className="p-8 space-y-4 max-w-md w-full text-center border rounded-lg bg-card">
          <div className="w-16 h-16 rounded border flex items-center justify-center mx-auto mb-4">
            <span className="text-lg font-medium">EH</span>
          </div>
          <h2 className="text-xl font-medium">Authentication Required</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Sign in to connect with ExpertHub's AI specialists.
          </p>
          <div className="flex gap-3 justify-center pt-4">
            <Button onClick={() => navigate("/login")} size="lg">
              Log in
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate("/signup")}>
              Sign up
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Show expert selection if no expert is selected
  if (!selectedExpert) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-4xl mx-auto px-4 py-6 h-screen flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded border flex items-center justify-center">
                <span className="text-sm font-medium">EH</span>
              </div>
              <div>
                <h1 className="text-2xl font-semibold">ExpertHub</h1>
                <p className="text-xs text-muted-foreground">AI Expert Consultation Network</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => navigate("/")} size="sm">
              Home
            </Button>
          </div>

          {/* Expert Selection */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <ExpertSelection experts={availableExperts} onSelectExpert={(expertType) => setSelectedExpert(expertType)} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-6 h-screen flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded border flex items-center justify-center">
              <span className="text-sm font-medium">EH</span>
            </div>
            <div>
              <h1 className="text-2xl font-semibold">ExpertHub</h1>
              <p className="text-xs text-muted-foreground capitalize">{selectedExpert.replace('_', ' ')} Expert</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setSelectedExpert(null)}
              size="sm"
            >
              Switch Expert
            </Button>
            <Button variant="outline" onClick={() => navigate("/")} size="sm">
              Home
            </Button>
          </div>
        </div>

        {/* Messages Container */}
        <Card className="flex-1 flex flex-col overflow-hidden shadow-lg border-border/50 mb-4">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {loadingHistory && <MessageSkeleton />}

            {!loadingHistory && messages.length === 0 && !isTyping && <EmptyState />}

            {!loadingHistory &&
              messages.map((msg, idx) => {
                const isUser = msg.role === "user"
                const showError = msg.status === "error"

                return (
                  <div
                    key={msg.id ?? idx}
                    className={cn("flex animate-fade-in", isUser ? "justify-end" : "justify-start")}
                  >
                    <div
                      className={cn(
                        "rounded-2xl px-4 py-3 max-w-[85%] md:max-w-[75%] text-sm transition-all",
                        isUser ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-foreground",
                        showError && "bg-destructive/10 border border-destructive/20",
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium">{isUser ? "You" : "ExpertHub"}</span>
                        {msg.status === "sending" && <Loader2 className="w-3 h-3 animate-spin opacity-70" />}
                        {showError && <span className="text-[10px] text-destructive">Failed to send</span>}
                      </div>
                      {isUser ? (
                        <div className="leading-relaxed whitespace-pre-wrap break-words">{msg.content}</div>
                      ) : (
                        <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-background/50 prose-pre:border prose-pre:border-border prose-code:text-foreground prose-headings:text-foreground prose-strong:text-foreground prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                        </div>
                      )}
                      {msg.timestamp && (
                        <div className={cn("text-[10px] mt-1.5 opacity-60", isUser ? "text-right" : "text-left")}>
                          {formatTimestamp(msg.timestamp)}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}

            {isTyping && <TypingIndicator />}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-border/50 p-4 bg-card/50 backdrop-blur-sm">
            {error && (
              <div className="mb-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2 animate-fade-in">
                {error}
              </div>
            )}

            <div className="flex gap-2 items-end">
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  className="w-full border border-input rounded-xl bg-background px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring/20 transition-shadow min-h-[52px] max-h-32"
                  rows={1}
                  placeholder="Ask about skincare routines, ingredients, or skin concerns..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={sending || loadingHistory}
                />
              </div>
              <Button
                onClick={handleSend}
                disabled={sending || !input.trim() || loadingHistory}
                size="lg"
                className="h-[52px] px-6"
              >
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>

            <p className="text-[10px] text-muted-foreground mt-2 text-center">
              Press Enter to send • Shift+Enter for new line
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
