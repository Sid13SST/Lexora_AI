"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { UploadCloud, File, Loader2, Send, Bot, User, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [documentId, setDocumentId] = useState<string | null>(null);
  
  const [messages, setMessages] = useState<{role: string, content: string, citations?: any[]}[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      
      if (!res.ok) {
        throw new Error(`Upload failed with status: ${res.status}`);
      }
      
      const data = await res.json();
      if (data.documentId) {
        setDocumentId(data.documentId);
        setMessages([{
          role: "assistant", 
          content: `Successfully analyzed **${file.name}**. I've extracted ${data.chunkCount} chunks. Ask me anything about it!`
        }]);
      }
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          documentId
        })
      });
      
      const data = await res.json();
      setMessages(prev => [...prev, {
        role: data.role,
        content: data.content,
        citations: data.citations
      }]);
    } catch (error) {
      console.error("Chat failed", error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full relative z-10 p-6">
      <header className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Workspace</h1>
          <p className="text-white/70 text-sm">Upload documents and start chatting instantly.</p>
        </div>
      </header>

      {!documentId ? (
        <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full"
          >
            <Card 
              className="border-dashed border-2 border-white/20 bg-black/40 backdrop-blur-xl hover:border-blue-500/50 transition-colors"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
            >
              <CardContent className="flex flex-col items-center justify-center py-20 text-center px-6">
                <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center mb-6">
                  {file ? <File className="w-10 h-10 text-blue-400" /> : <UploadCloud className="w-10 h-10 text-blue-400" />}
                </div>
                
                <h3 className="text-xl font-semibold mb-2">
                  {file ? file.name : "Drag & Drop your document here"}
                </h3>
                <p className="text-white/70 mb-8 max-w-sm">
                  {file ? "Ready to process. Supports PDF and TXT up to 10MB." : "Supports PDF and TXT. Upload a file to generate a vector knowledge base."}
                </p>

                <input 
                  type="file" 
                  className="hidden" 
                  ref={fileInputRef} 
                  accept=".pdf,.txt"
                  onChange={(e) => e.target.files && setFile(e.target.files[0])}
                />

                {!file ? (
                  <Button onClick={() => fileInputRef.current?.click()} className="bg-white/10 hover:bg-white/20 text-white rounded-full px-8">
                    Browse Files
                  </Button>
                ) : (
                  <div className="flex gap-4">
                    <Button variant="outline" onClick={() => setFile(null)} className="rounded-full px-8 border-white/10 hover:bg-white/10">
                      Cancel
                    </Button>
                    <Button onClick={handleUpload} disabled={isUploading} className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8">
                      {isUploading ? <><Loader2 className="mr-2 w-4 h-4 animate-spin" /> Processing...</> : "Start Analysis"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      ) : (
        <div className="flex-1 flex gap-6 overflow-hidden">
          {/* Document Context Sidebar */}
          <div className="hidden md:flex w-[300px] flex-col gap-4 border-r border-white/10 pr-6">
            <h3 className="font-semibold text-white/80 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              Active Document
            </h3>
            <Card className="bg-white/5 border-white/10 p-4">
              <div className="flex items-center gap-3 mb-4">
                <File className="w-8 h-8 text-blue-400" />
                <div className="overflow-hidden">
                  <p className="font-medium truncate" title={file?.name}>{file?.name}</p>
                  <p className="text-xs text-white/70">Vectorized • Ready</p>
                </div>
              </div>
            </Card>
            <div className="flex-1 flex flex-col gap-2">
              <h4 className="text-sm font-medium text-white/70 mt-4">Retrieved Sources</h4>
              <div className="overflow-y-auto space-y-3 pr-2">
                {[...messages].reverse().find(m => m.role === 'assistant' && m.citations)?.citations?.map((c, i) => (
                  <div key={i} className="text-xs bg-white/5 p-3 rounded border border-white/10">
                    <span className="text-blue-400 font-semibold mb-1 block">Page {c.pageNumber}</span>
                    <span className="text-white/70 italic">&quot;{c.snippet}&quot;</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="flex-1 flex flex-col bg-black/40 border border-white/10 rounded-xl overflow-hidden glass-dark">
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((msg, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i} 
                  className={`flex gap-4 max-w-3xl ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-white/20' : 'bg-blue-600'}`}>
                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`p-4 rounded-2xl ${msg.role === 'user' ? 'bg-blue-600/20 text-white rounded-tr-sm' : 'bg-white/5 border border-white/10 rounded-tl-sm'}`}>
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</div>
                    
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <p className="text-xs font-semibold text-white/50 mb-2">Sources:</p>
                        <div className="flex flex-wrap gap-2">
                          {msg.citations.map((c, j) => (
                            <Badge key={j} variant="secondary" className="bg-white/10 hover:bg-white/20 border-0 cursor-pointer">
                              Page {c.pageNumber}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 rounded-tl-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s'}} />
                    <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0.4s'}} />
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-white/5 border-t border-white/10">
              <form onSubmit={handleSend} className="relative max-w-4xl mx-auto">
                <Input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything about the document..." 
                  className="w-full bg-black/50 border-white/20 focus-visible:ring-blue-500 rounded-full pl-6 pr-14 py-6 text-base shadow-inner"
                  disabled={isTyping}
                />
                <Button 
                  size="icon" 
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full w-10 h-10 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
