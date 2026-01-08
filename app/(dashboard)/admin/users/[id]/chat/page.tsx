"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
}

export default function AdminUserChatPage() {
  const { id } = useParams<{ id: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchMessages() {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`/api/messages/thread/${id}`);
        if (!res.ok) throw new Error("Failed to fetch messages");
        const data = await res.json();
        setMessages(data.messages || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load messages");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchMessages();
  }, [id]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId: id, content: input }),
      });
      if (!res.ok) throw new Error("Failed to send message");
      const data = await res.json();
      setMessages((msgs) => [...msgs, data.message]);
      setInput("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-2">
      <Link href={`/admin/users/${id}`} className="text-blue-600 hover:underline mb-4 block">← Back to User</Link>
      <h1 className="text-2xl font-bold mb-4">Chat with User</h1>
      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading messages...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6 flex flex-col h-[500px]">
          <div className="flex-1 overflow-y-auto mb-4 space-y-2">
            {messages.length === 0 ? (
              <div className="text-gray-500 text-center">No messages yet.</div>
            ) : (
              messages.map((msg) => (
                <div key={msg._id} className={`p-2 rounded-lg max-w-xs ${msg.senderId === "admin" ? "bg-blue-100 ml-auto" : "bg-gray-100"}`}>
                  <div className="text-sm">{msg.content}</div>
                  <div className="text-xs text-gray-400 mt-1">{new Date(msg.createdAt).toLocaleString()}</div>
                </div>
              ))
            )}
          </div>
          <form onSubmit={sendMessage} className="flex gap-2 mt-auto">
            <input
              className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Send</button>
          </form>
        </div>
      )}
    </div>
  );
}
