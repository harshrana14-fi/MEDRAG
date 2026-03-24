from services.vector_store import vector_store

def list_files():
    docs = vector_store.get_all_documents()
    print("Files in DB with Company:")
    for d in docs:
        print(f"- {d['filename']} (Company: {d['company']})")

if __name__ == "__main__":
    list_files()
