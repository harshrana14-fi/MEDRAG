from services.vector_store import vector_store

def final_check():
    docs = vector_store.get_all_documents()
    print("FINAL DOCUMENT LIST:")
    for d in docs:
        print(f"- File: {d['filename'][:30]}... | Company: {d['company']}")

if __name__ == "__main__":
    final_check()
