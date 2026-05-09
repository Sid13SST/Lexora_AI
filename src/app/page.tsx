"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  Database,
  FileText,
  Lock,
  MessageSquare,
  Search,
  Sparkles,
  Zap,
} from "lucide-react";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden selection:bg-primary/30">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 flex justify-center pointer-events-none">
        <div className="absolute top-[-20%] w-[60%] h-[50%] bg-blue-500/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-purple-500/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute inset-0 bg-grid opacity-20" />
      </div>

      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto border-b border-white/5 glass-dark rounded-b-2xl mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 overflow-hidden">
            <img src="/assets/logo.png" alt="Lexora AI" className="w-full h-full object-cover" />
          </div>
          <span className="font-bold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">Lexora AI</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
          <Link href="#features" className="hover:text-white transition-colors">Features</Link>
          <Link href="#how-it-works" className="hover:text-white transition-colors">How it Works</Link>
          <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button className="bg-white text-black hover:bg-white/90 font-medium rounded-full px-6">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Hero Section */}
        <section className="pt-24 pb-32 flex flex-col items-center text-center">
          <motion.div initial="initial" animate="animate" variants={staggerContainer} className="flex flex-col items-center">
            <motion.div variants={fadeIn} className="mb-6">
              <Badge variant="outline" className="px-4 py-1.5 border-white/10 bg-white/5 text-white/80 rounded-full font-medium flex items-center gap-2 backdrop-blur-md">
                <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                Lexora AI 1.0 is now live
              </Badge>
            </motion.div>
            
            <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-bold tracking-tighter max-w-4xl mb-8 text-glow leading-[1.1]">
              Turn Any Document Into an <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                Intelligent Knowledge Base
              </span>
            </motion.h1>
            
            <motion.p variants={fadeIn} className="text-lg md:text-xl text-white/60 max-w-2xl mb-12 font-light">
              Upload PDFs and let our advanced RAG pipeline instantly extract, analyze, and synthesize answers. Never hallucinate. Always cited.
            </motion.p>
            
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <Link href="/dashboard">
                <Button className="w-full sm:w-auto bg-white text-black hover:bg-white/90 rounded-full px-8 py-6 text-lg font-medium">
                  Start Building Free <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="w-full max-w-3xl mt-24"
          >
            <div className="relative rounded-2xl border border-white/10 bg-black/50 backdrop-blur-xl p-2 shadow-2xl shadow-blue-900/40 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
              <img 
                src="https://images.unsplash.com/photo-1661956602116-aa6865609028?auto=format&fit=crop&q=80&w=2000" 
                alt="Dashboard Preview" 
                className="rounded-xl w-full object-cover aspect-video opacity-80 group-hover:opacity-100 transition-opacity duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Enterprise-grade RAG, out of the box.</h2>
            <p className="text-white/60">Built on modern vector databases and the latest LLM models.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <MessageSquare />, title: "AI Chat with PDFs", desc: "Instantly chat with massive documents without reading them." },
              { icon: <Search />, title: "Semantic Search", desc: "Find exact answers based on meaning, not just keywords." },
              { icon: <FileText />, title: "Source Citations", desc: "Every answer includes a direct citation to the source page." },
              { icon: <BrainCircuit />, title: "Smart Chunking", desc: "Recursive character splitting ensures context is never lost." },
              { icon: <Database />, title: "Vector Storage", desc: "Powered by Qdrant for lightning-fast similarity search." },
              { icon: <Lock />, title: "Zero Hallucination", desc: "Strictly grounded responses. If it's not in the doc, it says so." },
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="bg-white/5 border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors h-full">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                    <p className="text-white/60">{feature.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Architecture Section */}
        <section className="py-24 border-t border-white/10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Complete RAG Pipeline</h2>
              <p className="text-lg text-white/60 mb-8">
                We handle the complex infrastructure so you can focus on building insights. From document parsing to grounded generation.
              </p>
              <ul className="space-y-4">
                {[
                  "Document Upload & Text Extraction",
                  "Recursive Character Chunking",
                  "Gemini Embeddings Generation",
                  "Qdrant Vector Database Storage",
                  "Semantic Similarity Retrieval",
                  "Grounded Response Generation"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/80">
                    <Zap className="text-blue-400 w-5 h-5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full" />
              <Card className="glass-dark border-white/10 relative z-10">
                <CardContent className="p-8">
                  <div className="flex flex-col gap-4">
                    <div className="p-4 rounded bg-white/5 border border-white/10 text-center font-medium">1. User Uploads PDF</div>
                    <div className="h-4 w-px bg-white/20 mx-auto" />
                    <div className="p-4 rounded bg-white/5 border border-white/10 text-center font-medium">2. Extract & Chunk Text</div>
                    <div className="h-4 w-px bg-white/20 mx-auto" />
                    <div className="p-4 rounded bg-white/5 border border-white/10 text-center font-medium">3. Generate Gemini Embeddings</div>
                    <div className="h-4 w-px bg-white/20 mx-auto" />
                    <div className="p-4 rounded bg-white/5 border border-white/10 text-center font-medium text-blue-400 border-blue-500/30 bg-blue-500/10">4. Store in Qdrant Vector DB</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-32 text-center relative">
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent pointer-events-none" />
          <h2 className="text-4xl md:text-6xl font-bold mb-6">Ready to upgrade your workflow?</h2>
          <p className="text-xl text-white/60 mb-10 max-w-2xl mx-auto">
            Join the next generation of AI-powered document analysis.
          </p>
          <Link href="/dashboard">
            <Button className="bg-white text-black hover:bg-white/90 rounded-full px-10 py-7 text-xl font-medium shadow-xl shadow-white/10">
              Get Started for Free
            </Button>
          </Link>
        </section>
      </main>
      
      <footer className="border-t border-white/10 py-12 text-center text-white/40">
        <p>© 2026 Lexora AI. Built for the modern web.</p>
      </footer>
    </div>
  );
}
