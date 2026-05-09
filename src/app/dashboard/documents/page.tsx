"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { File, Clock, Trash2, Search, ExternalLink, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

interface Document {
  id: string;
  title: string;
  filename: string;
  mimeType: string;
  createdAt: string;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await fetch("/api/documents");
      const data = await res.json();
      if (Array.isArray(data)) {
        setDocuments(data);
      }
    } catch (error) {
      console.error("Failed to fetch documents", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this document and all its vectors?")) return;
    
    try {
      const res = await fetch(`/api/documents/delete?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setDocuments(prev => prev.filter(doc => doc.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete document", error);
    }
  };

  const filteredDocs = documents.filter(doc => 
    doc.title.toLowerCase().includes(search.toLowerCase()) ||
    doc.filename.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 relative z-10">
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Knowledge Base</h1>
          <p className="text-white/70">Manage your uploaded documents and vectors.</p>
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <Input 
            placeholder="Search documents..." 
            className="bg-white/5 border-white/10 pl-10 rounded-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
          <p className="text-white/50">Loading your knowledge base...</p>
        </div>
      ) : filteredDocs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
            <File className="w-10 h-10 text-white/20" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No documents found</h3>
          <p className="text-white/50 mb-8 max-w-sm">
            {search ? "No matches for your search query." : "You haven't uploaded any documents to your knowledge base yet."}
          </p>
          {!search && (
            <Link href="/dashboard">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8">
                Upload First Document
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocs.map((doc, i) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-all group overflow-hidden border-l-4 border-l-blue-500/50">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                      <File className="w-6 h-6" />
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDelete(doc.id)}
                        className="h-8 w-8 rounded-full hover:bg-red-500/20 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-1 truncate" title={doc.title}>{doc.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-white/40 mb-6">
                    <Clock className="w-3 h-3" />
                    {new Date(doc.createdAt).toLocaleDateString()}
                  </div>

                  <div className="flex items-center gap-2">
                    <Link href={`/dashboard?doc=${doc.id}`} className="flex-1">
                      <Button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium rounded-lg h-9">
                        Chat
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
