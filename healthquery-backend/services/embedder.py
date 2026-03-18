from sentence_transformers import SentenceTransformer
from config import config

class Embedder:
    def __init__(self):
        self.model = SentenceTransformer(config.EMBEDDING_MODEL)

    def embed_texts(self, texts: list):
        return self.model.encode(texts).tolist()

    def embed_query(self, query: str):
        return self.model.encode([query]).tolist()[0]

embedder = Embedder()
