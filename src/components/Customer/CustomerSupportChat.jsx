import React, { useEffect, useState, useRef } from "react";
import { LuBot, LuSend, LuTicket, LuUser } from "react-icons/lu";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { io } from "socket.io-client";
import axios from "axios";


const token = localStorage.getItem("token");

const CustomerSupportChat = ({ ticketId, customerId }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [ticketDialogOpen, setTicketDialogOpen] = useState(false);
    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);
    const shouldAutoScroll = useRef(false);


    // useEffect(() => {
    //     if (messagesEndRef.current) {
    //         messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    //     }
    // }, [messages]);

    useEffect(() => {
        if (shouldAutoScroll.current && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "nearest", });
            shouldAutoScroll.current = false;
        }
    }, [messages]);



    useEffect(() => {
        const socket = io("http://localhost:8080", {
            transports: ["websocket"],
            auth: { token },
        });

        socketRef.current = socket;

        socket.on("connect", () => {
            console.log("✅ Connected to server");
            socket.emit("joinTicketRoom", ticketId);
        });

        socket.on("receiveMessage", (data) => {
            if (data.senderId === customerId && data.senderRole === "customer") return;

            shouldAutoScroll.current = true;
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now(),
                    role: data.senderRole === "admin" ? "admin" : "customer",
                    content: data.message,
                },
            ]);
        });

        const fetchChatHistory = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/api/messages/${ticketId}`);
                const history = res.data.map((msg) => ({
                    id: msg._id,
                    role: msg.senderRole.toLowerCase(),
                    content: msg.message,
                }));

                setMessages(history);
            } catch (err) {
                console.error("❌ Failed to fetch history", err);
            }
        };

        fetchChatHistory();

        return () => {
            socket.disconnect();
        };
    }, []);

    const handleInputChange = (e) => setInput(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const msg = {
            ticketId,
            senderId: customerId,
            senderRole: "customer",
            message: input,
        };

        try {
            setIsLoading(true);
            console.log(msg);

            const response = await axios.post("http://localhost:8080/api/messages/", msg, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });


            if (socketRef.current) {
                socketRef.current.emit("sendMessage", msg);
            }
            shouldAutoScroll.current = true;

            setMessages((prev) => [
                ...prev,
                { id: response.data._id || Date.now(), role: "customer", content: input },
            ]);

            setInput("");
        } catch (err) {
            console.error("❌ Failed to send message", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col">
            <Card className="flex flex-col h-[500px] bg-white/90 backdrop-blur-sm overflow-hidden">
                {/* Header */}
                <CardHeader className="border-b px-4 py-3 bg-white">
                    <div className="flex items-center gap-3 w-full">
                        <div className="h-10 w-10 rounded-full bg-teal-500 text-white flex items-center justify-center font-semibold border-2 border-teal-100">
                            CS
                        </div>
                        <div>
                            <CardTitle>Support Assistant</CardTitle>
                            <p className="text-xs text-slate-500">Typically replies in a few minutes</p>
                        </div>
                        <span className="ml-auto text-sm text-green-700 bg-green-100 border border-green-200 px-2 py-0.5 rounded">
                            Online
                        </span>
                    </div>
                </CardHeader>

                {/* Scrollable Chat Messages */}
                <CardContent className="flex-1 overflow-y-auto px-4 py-2 space-y-6">
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mb-4">
                                <LuBot size={32} className="text-rose-600" />
                            </div>
                            <h3 className="text-lg font-medium text-slate-800 mb-2">
                                Welcome to Support Center
                            </h3>
                            <p className="text-slate-500 max-w-md">
                                Our support team is here to help. Send a message to get started.
                            </p>
                            <div className="mt-6 flex flex-wrap gap-2 justify-center">
                                {[
                                    "I need help with my account",
                                    "How do I reset my password?",
                                    "Billing question",
                                ].map((text) => (
                                    <button
                                        key={text}
                                        onClick={() => setInput(text)}
                                        className="px-3 py-1.5 text-sm bg-slate-100 rounded-full hover:bg-slate-200 transition"
                                    >
                                        {text}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <>
                            {messages.map((message, index) => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.role === "customer" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`flex items-start gap-3 max-w-[85%] ${message.role === "customer" ? "flex-row-reverse" : ""
                                            }`}
                                    >
                                        <div
                                            className={`h-8 w-8 rounded-full mt-1 flex items-center justify-center text-white font-semibold border-2 ${message.role === "customer"
                                                ? "bg-rose-500 border-rose-100"
                                                : "bg-teal-500 border-teal-100"
                                                }`}
                                        >
                                            {message.role === "customer" ? <LuUser size={14} /> : "CS"}
                                        </div>
                                        <div
                                            className={`p-3 rounded-2xl text-sm ${message.role === "customer"
                                                ? "bg-gradient-to-r from-rose-500 to-rose-600 text-white"
                                                : "bg-white border border-slate-200 text-slate-800 shadow-sm"
                                                }`}
                                        >
                                            <div>{message.content}</div>
                                            <div
                                                className={`text-xs mt-1 text-right ${message.role === "customer" ? "text-rose-100" : "text-slate-400"
                                                    }`}
                                            >
                                                {index === messages.length - 1 ? "Just now" : `${messages.length - 1 - index} min ago`}

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="flex items-start gap-3 max-w-[85%]">
                                        <div className="h-8 w-8 rounded-full mt-1 bg-teal-500 text-white font-semibold flex items-center justify-center border-2 border-teal-100">
                                            CS
                                        </div>
                                        <div className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-800">
                                            <div className="flex items-center gap-2">
                                                <div className="flex space-x-1">
                                                    <div className="h-2 w-2 rounded-full bg-slate-300 animate-bounce [animation-delay:-0.3s]" />
                                                    <div className="h-2 w-2 rounded-full bg-slate-300 animate-bounce [animation-delay:-0.15s]" />
                                                    <div className="h-2 w-2 rounded-full bg-slate-300 animate-bounce" />
                                                </div>
                                                <span className="text-xs text-slate-400">Typing a response...</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>

                {/* Message Input */}
                <div className="border-t p-4 bg-slate-50">
                    <form onSubmit={handleSubmit} className="flex w-full items-end gap-2">
                        <div className="flex-1 relative">
                            <textarea
                                value={input}
                                onChange={handleInputChange}
                                placeholder="Type your message here..."
                                className="w-full min-h-[80px] resize-none border border-slate-300 rounded-lg p-3 pr-10 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className="absolute bottom-2 right-2 h-8 w-8 flex items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white shadow-md"
                            >
                                <LuSend size={16} />
                            </button>
                        </div>
                        <button
                            type="button"
                            onClick={() => setTicketDialogOpen(true)}
                            className="h-10 w-10 rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 flex items-center justify-center"
                        >
                            <LuTicket size={16} />
                        </button>
                    </form>
                </div>
            </Card>
        </div>
    );
};

export default CustomerSupportChat;
