from services.vector_store import vector_store

def update_metadata():
    docs = vector_store.get_all_documents()
    for d in docs:
        filename = d['filename']
        company = d['company']
        new_company = company
        
        if company.lower() == 'ultimate':
            new_company = 'ultimate care'
        elif company.lower() == 'bluecross':
            new_company = 'icici'
        elif company.lower() == 'brochure':
            new_company = 'hdfc ergo'
            
        if new_company != company:
            print(f"Updating {filename} from {company} to {new_company}")
            # Get all IDs for this filename and update them
            results = vector_store.collection.get(where={"filename": filename})
            if results['ids']:
                metadatas = results['metadatas']
                for m in metadatas:
                    m['company'] = new_company
                
                vector_store.collection.update(
                    ids=results['ids'],
                    metadatas=metadatas
                )

if __name__ == "__main__":
    update_metadata()
