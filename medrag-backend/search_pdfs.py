import fitz
import os

def search_pdfs(terms):
    policies_dir = "policies"
    for filename in os.listdir(policies_dir):
        if filename.endswith(".pdf"):
            path = os.path.join(policies_dir, filename)
            doc = fitz.open(path)
            for page_num, page in enumerate(doc):
                text = page.get_text()
                for term in terms:
                    if term.lower() in text.lower():
                        print(f"MATCH: '{term}' in {filename} [Page {page_num+1}]")
                        idx = text.lower().find(term.lower())
                        print(f"Snippet: {text[max(0, idx-50):idx+50].replace('\n', ' ')}")
            doc.close()

if __name__ == "__main__":
    search_pdfs(["hair", "transplant", "alopecia", "cosmetic", "exclusion"])
