<div align="center">

<img src="./public/assets/logo.png" width="120" />

# Lexora AI

### Turn Any Document Into an Intelligent Knowledge Base

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Gemini AI](https://img.shields.io/badge/Google_Gemini-AI-orange?style=for-the-badge&logo=google-gemini)](https://deepmind.google/technologies/gemini/)
[![Qdrant](https://img.shields.io/badge/Qdrant-Vector_DB-red?style=for-the-badge&logo=qdrant)](https://qdrant.tech/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)

---

Lexora AI is a premium, enterprise-grade RAG (Retrieval-Augmented Generation) platform built for the modern web. It enables you to upload complex PDFs, instantly vectorize them, and engage in grounded, hallucination-free conversations with your data.

[Live Demo](#) • [Documentation](#) • [Report Bug](https://github.com/Sid13SST/Lexora_AI/issues)

</div>

---

## ✨ Features

- **🚀 Advanced RAG Pipeline**: Powered by Gemini Embeddings and Qdrant Vector Database.
- **📄 Precise Citations**: Every answer includes direct page numbers from the source document.
- **🔒 Zero Hallucination**: Assistant is strictly grounded to your uploaded context.
- **📁 Knowledge Base Management**: Full CRUD operations for your document library.
- **🎨 Premium UI**: Sleek, glassmorphic dark theme built with Tailwind CSS and Framer Motion.
- **⚡ High Performance**: Built on Next.js 15 with Turbopack for lightning-fast speeds.

---

## 📸 Screenshots

### 🏠 Landing Page
![Landing Page](./public/assets/screenshots/landing_page.png)

### 📊 Intelligent Workspace
![Dashboard](./public/assets/screenshots/dashboard.png)

### 📚 Knowledge Base Management
![Documents Page](./public/assets/screenshots/documents_page.png)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- Docker (for Qdrant & PostgreSQL)
- Google AI Studio API Key
- OpenRouter API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sid13SST/Lexora_AI.git
   cd Lexora_AI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/lexora"
   GEMINI_API_KEY="your_gemini_key"
   OPENROUTER_API_KEY="your_openrouter_key"
   QDRANT_URL="http://localhost:6333"
   ```

4. **Initialize Database**
   ```bash
   npx prisma db push
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

---

## 📐 Architecture

1. **Extraction**: PDFs are parsed page-by-page using `pdf-parse-fork`.
2. **Chunking**: Recursive character splitting ensures semantic context preservation.
3. **Embedding**: Text chunks are converted into 3072-dimensional vectors using `text-embedding-004`.
4. **Storage**: Vectors are stored in Qdrant with document metadata.
5. **Retrieval**: User queries trigger a similarity search in Qdrant.
6. **Generation**: GPT-4o-mini generates a grounded response using retrieved context.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

<div align="center">

Built with ❤️ by [Siddhant Prasad](https://github.com/Sid13SST)

</div>
