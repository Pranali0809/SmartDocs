# Python RAG Service

A lightweight RAG (Retrieval-Augmented Generation) service for document Q&A and summarization.

## Features

- Document Q&A with context retrieval
- Automatic summarization
- Document analysis (word count, top words, etc.)
- RESTful API

## Setup

```bash
pip install -r requirements.txt
python rag_service.py
```

## API Endpoints

### Query Document
```
POST /api/rag/query
{
  "content": "<html>document content</html>",
  "question": "What is this document about?"
}
```

### Summarize Document
```
POST /api/rag/summarize
{
  "content": "<html>document content</html>"
}
```

### Analyze Document
```
POST /api/rag/analyze
{
  "content": "<html>document content</html>"
}
```

## Environment Variables

- `PORT`: Service port (default: 5000)
