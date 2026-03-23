from langchain_text_splitters import RecursiveCharacterTextSplitter
from config import config

def chunk_sections(sections: list, source_filename: str) -> list:
    """
    Chunks each section separately and attaches metadata.
    Returns: list of {"text": str, "metadata": dict}
    """
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=config.CHUNK_SIZE,
        chunk_overlap=config.CHUNK_OVERLAP,
        length_function=len,
        separators=["\n### ", "\n## ", "\n# ", "\n\n", "\n", " ", ""]
    )

    all_chunks = []
    global_chunk_index = 0

    for section_data in sections:
        section_name = section_data.get("section", "GENERAL")
        original_header = section_data.get("original_header", "")
        section_text = section_data.get("text", "")
        
        if not section_text:
            continue
            
        # Split text within the section only
        sub_chunks = text_splitter.split_text(section_text)
        
        for text in sub_chunks:
            all_chunks.append({
                "text": text,
                "metadata": {
                    "section": section_name,
                    "original_header": original_header,
                    "filename": source_filename,
                    "chunk_index": global_chunk_index,
                    "document_type": "insurance_policy"
                }
            })
            global_chunk_index += 1
            
    return all_chunks


