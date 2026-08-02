import { useState } from "react";
import { Search, Send, Paperclip, CheckCircle2, User, Clock, Shield, Sparkles, MoreVertical, Phone, Video } from "lucide-react";

const initialThreads = [
  {
    id: 1,
    sender: "Alice Cruz",
    role: "Policyholder (Primary)",
    avatar: "A",
    avatarBg: "bg-red-100 text-red-600",
    subject: "Claim #CLM-9021 Inquiry",
    lastMessage: "Thank you! I have uploaded the colonoscopy lab results as requested.",
    time: "10:24 AM",
    unread: 2,
    online: true,
    messages: [
      { id: 1, sender: "Alice Cruz", text: "Hello! Could you check if my recent screening claim #CLM-9021 needs any additional documentation?", time: "10:15 AM", isMe: false },
      { id: 2, sender: "InsurCo Support", text: "Hi Alice, we reviewed the initial submission. We just need the signed colonoscopy screening report.", time: "10:18 AM", isMe: true },
      { id: 3, sender: "Alice Cruz", text: "Thank you! I have uploaded the colonoscopy lab results as requested.", time: "10:24 AM", isMe: false },
    ],
  },
  {
    id: 2,
    sender: "St. Jude Medical Center",
    role: "Verified Hospital Partner",
    avatar: "S",
    avatarBg: "bg-blue-100 text-blue-600",
    subject: "Colonoscopy Screening Billing",
    lastMessage: "Direct billing confirmation for Patient ID #84920 has been verified.",
    time: "Yesterday",
    unread: 0,
    online: true,
    messages: [
      { id: 1, sender: "St. Jude Medical Center", text: "Direct billing confirmation for Patient ID #84920 has been verified.", time: "Yesterday at 4:30 PM", isMe: false },
    ],
  },
  {
    id: 3,
    sender: "Billing Dept (Auto)",
    role: "InsurCo Financial Dept",
    avatar: "B",
    avatarBg: "bg-emerald-100 text-brand-green",
    subject: "Auto Policy POL-49201 Receipt",
    lastMessage: "Your monthly credit payment of $135.00 USD was processed successfully.",
    time: "2 days ago",
    unread: 0,
    online: false,
    messages: [
      { id: 1, sender: "Billing Dept (Auto)", text: "Your monthly credit payment of $135.00 USD was processed successfully.", time: "May 12, 2:00 PM", isMe: false },
    ],
  },
  {
    id: 4,
    sender: "Bob Cruz",
    role: "Family Member (Spouse)",
    avatar: "B",
    avatarBg: "bg-purple-100 text-purple-600",
    subject: "Home Insurance Coverage Add-on",
    lastMessage: "Can we add flood protection to our home insurance plan before next month?",
    time: "May 10",
    unread: 0,
    online: false,
    messages: [
      { id: 1, sender: "Bob Cruz", text: "Can we add flood protection to our home insurance plan before next month?", time: "May 10, 11:45 AM", isMe: false },
    ],
  },
];

const MessagesPage = () => {
  const [threads, setThreads] = useState(initialThreads);
  const [activeThreadId, setActiveThreadId] = useState(1);
  const [search, setSearch] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const activeThread = threads.find((t) => t.id === activeThreadId) || threads[0];

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: "InsurCo Support",
      text: inputMessage.trim(),
      time: "Just now",
      isMe: true,
    };

    setThreads((prev) =>
      prev.map((thread) =>
        thread.id === activeThreadId
          ? {
              ...thread,
              lastMessage: inputMessage.trim(),
              time: "Just now",
              messages: [...thread.messages, newMsg],
            }
          : thread
      )
    );

    setInputMessage("");
    triggerToast("Message sent successfully!");
  };

  const handleSelectThread = (id) => {
    setActiveThreadId(id);
    setThreads((prev) =>
      prev.map((thread) => (thread.id === id ? { ...thread, unread: 0 } : thread))
    );
  };

  const filteredThreads = threads.filter(
    (t) =>
      t.sender.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-1px)] bg-[#F7FFFE] overflow-hidden">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-lg text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 size={16} className="text-brand-green" />
          {toastMessage}
        </div>
      )}

      {/* ── Left Sidebar — Conversation List ────────────────────────── */}
      <div className="w-full sm:w-[340px] bg-white border-r border-gray-100 flex flex-col shrink-0">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">Messages</h1>
          <p className="text-xs text-gray-400 mt-1 font-medium">Customer inquiries & claim communications</p>

          <div className="mt-4 flex items-center gap-2.5 bg-gray-50 px-3.5 py-2.5 rounded-xl border border-gray-100">
            <Search size={16} className="text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-xs text-gray-700 outline-none w-full placeholder-gray-400 font-medium"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
          {filteredThreads.map((thread) => {
            const isActive = thread.id === activeThreadId;
            return (
              <div
                key={thread.id}
                onClick={() => handleSelectThread(thread.id)}
                className={`p-4 cursor-pointer transition flex gap-3 ${
                  isActive ? "bg-[#E8FFF7]/70 border-l-4 border-brand-green" : "hover:bg-gray-50/70"
                }`}
              >
                <div className="relative shrink-0">
                  <div className={`w-11 h-11 rounded-full ${thread.avatarBg} flex items-center justify-center font-bold text-sm shadow-sm`}>
                    {thread.avatar}
                  </div>
                  {thread.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-brand-green border-2 border-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-gray-900 truncate">{thread.sender}</h3>
                    <span className="text-[10px] text-gray-400 font-semibold shrink-0">{thread.time}</span>
                  </div>
                  <p className="text-[11px] text-brand-green font-semibold truncate mt-0.5">{thread.subject}</p>
                  <p className="text-xs text-gray-500 truncate mt-1">{thread.lastMessage}</p>
                </div>
                {thread.unread > 0 && (
                  <div className="shrink-0 flex items-center">
                    <span className="w-5 h-5 rounded-full bg-brand-red text-white text-[10px] font-bold flex items-center justify-center">
                      {thread.unread}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Right Panel — Active Thread Chat ────────────────────────── */}
      <div className="flex-1 flex flex-col bg-white min-w-0">
        {/* Chat Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-full ${activeThread.avatarBg} flex items-center justify-center font-bold text-sm shadow-sm`}>
              {activeThread.avatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-extrabold text-gray-900">{activeThread.sender}</h2>
                {activeThread.online ? (
                  <span className="px-2 py-0.5 bg-emerald-50 text-brand-green rounded text-[10px] font-bold">Online</span>
                ) : (
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px] font-bold">Offline</span>
                )}
              </div>
              <p className="text-xs text-gray-400 font-medium">{activeThread.role} — {activeThread.subject}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => triggerToast("Initiating secure phone call...")}
              className="p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 transition"
              title="Voice Call"
            >
              <Phone size={16} />
            </button>
            <button
              onClick={() => triggerToast("Initiating telehealth video conference...")}
              className="p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 transition"
              title="Video Call"
            >
              <Video size={16} />
            </button>
            <button
              onClick={() => triggerToast("Thread options opened")}
              className="p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 transition"
              title="More Options"
            >
              <MoreVertical size={16} />
            </button>
          </div>
        </div>

        {/* Message Bubbles */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
          <div className="text-center my-2">
            <span className="px-3 py-1 rounded-full bg-gray-200/70 text-gray-500 text-[10px] font-bold uppercase tracking-wider">
              Encrypted Insurance Communication Ledger
            </span>
          </div>

          {activeThread.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.isMe ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-md px-4 py-3 rounded-2xl text-xs font-medium leading-relaxed shadow-sm ${
                  msg.isMe
                    ? "bg-brand-green text-white rounded-br-none"
                    : "bg-white text-gray-800 rounded-bl-none border border-gray-100"
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[10px] text-gray-400 font-semibold mt-1 px-1">{msg.time}</span>
            </div>
          ))}
        </div>

        {/* Send Message Footer */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100 bg-white flex items-center gap-3">
          <button
            type="button"
            onClick={() => triggerToast("File attachment dialog opened")}
            className="p-3 text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl transition"
            title="Attach File"
          >
            <Paperclip size={18} />
          </button>
          <input
            type="text"
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1 bg-gray-50/80 hover:bg-gray-100/80 focus:bg-white border border-gray-100 focus:border-brand-green rounded-xl px-4 py-3 text-xs text-gray-800 outline-none transition"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-brand-green hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-sm hover:shadow-md transition flex items-center gap-2"
          >
            <span>Send</span>
            <Send size={15} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default MessagesPage;
