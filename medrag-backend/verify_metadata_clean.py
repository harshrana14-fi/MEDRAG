from services.vector_store import vector_store

def list_files_clean():
    docs = vector_store.get_all_documents()
    print("----------------------------------------")
    for d in docs:
        print(f"File: {d['filename']} -> Company: {d['company']}")
    print("----------------------------------------")

if __name__ == "__main__":
    list_files_clean()
