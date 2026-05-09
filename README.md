# <img src="./public/assets/logo.png" width="48" align="center" /> Lexora AI

### Turn Any Document Into an Intelligent Knowledge Base

Lexora AI is a premium, enterprise-grade RAG (Retrieval-Augmented Generation) platform built for the modern web. It enables you to upload complex PDFs, instantly vectorize them, and engage in grounded, halluncination-free conversations with your data.

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

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router + Turbopack)
- **AI Models**: [Google Gemini 1.5](https://deepmind.google/technologies/gemini/) (Embeddings) & GPT-4o-mini (Chat)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (via [Prisma ORM](https://www.prisma.io/))
- **Vector Search**: [Qdrant](https://qdrant.tech/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

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
   git clone https://github.com/your-username/Lexora_AI.git
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

Built with ❤️ by Siddhant Prasad
