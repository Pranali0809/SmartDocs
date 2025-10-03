from flask import Flask, request, jsonify
from flask_cors import CORS
import re
from datetime import datetime
import os
from typing import List, Dict
import json

app = Flask(__name__)
CORS(app)

class DocumentRAG:
    def __init__(self):
        self.documents_cache = {}

    def clean_html(self, html_content: str) -> str:
        """Remove HTML tags and clean the text"""
        text = re.sub(r'<[^>]+>', '', html_content)
        text = re.sub(r'\s+', ' ', text)
        return text.strip()

    def chunk_text(self, text: str, chunk_size: int = 500) -> List[str]:
        """Split text into chunks for better context retrieval"""
        words = text.split()
        chunks = []
        current_chunk = []
        current_length = 0

        for word in words:
            current_chunk.append(word)
            current_length += len(word) + 1

            if current_length >= chunk_size:
                chunks.append(' '.join(current_chunk))
                current_chunk = []
                current_length = 0

        if current_chunk:
            chunks.append(' '.join(current_chunk))

        return chunks

    def find_relevant_context(self, text: str, query: str, top_k: int = 3) -> List[str]:
        """Find most relevant chunks for the query"""
        chunks = self.chunk_text(text)
        query_words = set(query.lower().split())

        scored_chunks = []
        for chunk in chunks:
            chunk_words = set(chunk.lower().split())
            score = len(query_words.intersection(chunk_words))
            scored_chunks.append((score, chunk))

        scored_chunks.sort(reverse=True, key=lambda x: x[0])
        return [chunk for score, chunk in scored_chunks[:top_k] if score > 0]

    def generate_answer(self, context: List[str], question: str) -> str:
        """Generate answer based on context (simple keyword-based for now)"""
        combined_context = ' '.join(context)

        if not context or not combined_context.strip():
            return "I don't have enough context from the document to answer that question."

        question_lower = question.lower()

        if any(word in question_lower for word in ['what', 'define', 'meaning']):
            sentences = re.split(r'[.!?]+', combined_context)
            relevant = [s.strip() for s in sentences if any(word in s.lower() for word in question.split())]
            if relevant:
                return relevant[0] + '.'

        if any(word in question_lower for word in ['how many', 'count', 'number']):
            words = combined_context.split()
            return f"Based on the relevant context, there are approximately {len(words)} words in the related sections."

        if any(word in question_lower for word in ['summary', 'summarize', 'about']):
            return self.summarize_text(combined_context)

        sentences = re.split(r'[.!?]+', combined_context)
        if sentences:
            return sentences[0].strip() + '.'

        return "Here's what I found: " + combined_context[:200] + "..."

    def summarize_text(self, text: str) -> str:
        """Generate a summary of the text"""
        sentences = re.split(r'[.!?]+', text)
        sentences = [s.strip() for s in sentences if len(s.strip()) > 20]

        if not sentences:
            return "The document appears to be empty or too short to summarize."

        if len(sentences) <= 3:
            return ' '.join(sentences) + '.'

        summary_sentences = []
        summary_sentences.append(sentences[0])

        middle_idx = len(sentences) // 2
        if middle_idx < len(sentences):
            summary_sentences.append(sentences[middle_idx])

        if len(sentences) > 1:
            summary_sentences.append(sentences[-1])

        return ' '.join(summary_sentences) + '.'

rag_system = DocumentRAG()

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'service': 'RAG Service'}), 200

@app.route('/api/rag/query', methods=['POST'])
def query_document():
    try:
        data = request.json
        document_content = data.get('content', '')
        question = data.get('question', '')

        if not document_content or not question:
            return jsonify({'error': 'Missing content or question'}), 400

        clean_text = rag_system.clean_html(document_content)

        relevant_context = rag_system.find_relevant_context(clean_text, question)

        answer = rag_system.generate_answer(relevant_context, question)

        return jsonify({
            'answer': answer,
            'context_used': relevant_context[:2],
            'timestamp': datetime.now().isoformat()
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/rag/summarize', methods=['POST'])
def summarize_document():
    try:
        data = request.json
        document_content = data.get('content', '')

        if not document_content:
            return jsonify({'error': 'Missing document content'}), 400

        clean_text = rag_system.clean_html(document_content)

        summary = rag_system.summarize_text(clean_text)

        word_count = len(clean_text.split())
        char_count = len(clean_text)

        return jsonify({
            'summary': summary,
            'statistics': {
                'word_count': word_count,
                'character_count': char_count,
                'original_length': len(document_content)
            },
            'timestamp': datetime.now().isoformat()
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/rag/analyze', methods=['POST'])
def analyze_document():
    try:
        data = request.json
        document_content = data.get('content', '')

        if not document_content:
            return jsonify({'error': 'Missing document content'}), 400

        clean_text = rag_system.clean_html(document_content)

        words = clean_text.split()
        sentences = re.split(r'[.!?]+', clean_text)
        sentences = [s.strip() for s in sentences if s.strip()]

        word_freq = {}
        for word in words:
            word_lower = word.lower().strip('.,!?;:')
            if len(word_lower) > 3:
                word_freq[word_lower] = word_freq.get(word_lower, 0) + 1

        top_words = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)[:10]

        return jsonify({
            'word_count': len(words),
            'sentence_count': len(sentences),
            'character_count': len(clean_text),
            'average_word_length': sum(len(w) for w in words) / len(words) if words else 0,
            'top_words': [{'word': w, 'count': c} for w, c in top_words],
            'timestamp': datetime.now().isoformat()
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"🚀 RAG Service starting on port {port}")
    app.run(host='0.0.0.0', port=port, debug=True)
