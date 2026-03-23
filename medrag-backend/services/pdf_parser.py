import fitz  # PyMuPDF
import pandas as pd
import re

def extract_text_from_pdf(file_path: str) -> list[dict]:
    """
    Two-pass section detection for Insurance Brochures and Policy Wordings.
    """
    doc = fitz.open(file_path)
    full_text = ""
    pages_text = []
    
    # Pass 0: Extract full text for type detection
    for page in doc:
        pages_text.append(page.get_text())
    full_text = "\n".join(pages_text)
    
    # Detect Document Type
    policy_indicators = len(re.findall(r'^[a-g]\.\s+[A-Z]', full_text, re.MULTILINE))
    brochure_indicators = len(re.findall(r'(Key Features|Coverages|Entry Age|Sum Insured|Waiting Periods)', full_text))
    doc_type = "BROCHURE" if brochure_indicators > policy_indicators else "POLICY_WORDING"
    print(f"[UPLOAD] Doc type detected: {doc_type}")

    # Pass 1: Define Patterns
    BROCHURE_PATTERNS = {
        "Key Features": ["Key Features", "KEY FEATURES", "key features"],
        "Coverages": ["Coverages", "COVERAGES", "Coverage", "Inpatient Treatment", "In-patient Treatment", "Day Care Treatment", "AYUSH Treatment", "Modern Treatments", "Pre-Hospitalization", "Post-Hospitalization", "Road Ambulance", "Air Ambulance", "Domiciliary", "Organ Donor", "Home Care Treatment", "Loyalty Bonus", "Automatic Restoration", "Recharge Benefit", "Newborn Baby", "Shared Accommodation", "Health Checkup", "Tele-Consultation", "Medical Opinion", "Compassionate Travel", "Mortal Remains", "Wellness Program", "Valuable Service", "Assisted Reproduction", "Road Traffic"],
        "Exclusions": ["Key Exclusions", "Exclusions", "EXCLUSIONS", "What is not covered", "Not Covered"],
        "Optional Cover": ["Optional Cover", "OPTIONAL COVER", "Optional Benefits", "Add-on"],
        "Waiting Periods": ["Waiting Periods", "WAITING PERIODS", "Waiting Period"],
        "Discounts": ["Discounts", "DISCOUNTS", "Discount"],
        "Zone": ["Zone Description", "Zone", "ZONE"],
        "Policy Details": ["Entry Age", "Sum Insured", "Policy Tenure", "Instalment Facility", "Co-payment", "Copayment"]
    }

    POLICY_PATTERNS = {
        "Preamble": r"^[bB]\.\s*(Preamble|PREAMBLE)",
        "Definitions": r"^[cC]\.\s*(Definitions|DEFINITIONS)",
        "Benefits": r"^[dD]\.\s*(Benefits|COVERAGE|Covered)",
        "Exclusions": r"^[eE]\.\s*(Exclusions|EXCLUSIONS)",
        "General Terms": r"^[fF]\.\s*(General|GENERAL)",
        "Claims": r"^[gG]\.\s*(Claims|CLAIMS|Other Terms)",
        "Schedule": r"(Schedule|SCHEDULE|Part [aA])"
    }

    def map_to_section(text: str) -> str | None:
        if doc_type == "BROCHURE":
            for section, keywords in BROCHURE_PATTERNS.items():
                if any(kw in text for kw in keywords):
                    return section
        else:
            for section, pattern in POLICY_PATTERNS.items():
                if re.match(pattern, text, re.MULTILINE):
                    return section
        return None

    # Pass 2: Partition text
    sections = []
    current_section = "GENERAL"
    current_header = ""
    current_text = []

    def flush():
        nonlocal current_section, current_header, current_text
        if current_text:
            sections.append({
                "section": current_section,
                "original_header": current_header,
                "text": "\n".join(current_text).strip()
            })
            current_text = []

    for page in doc:
        tabs = page.find_tables()
        table_rects = [tab.bbox for tab in tabs]
        blocks = page.get_text("blocks", sort=True)
        
        for b in blocks:
            rect, text = fitz.Rect(b[:4]), b[4].strip()
            if not text: continue
            if any(rect.intersects(t_rect) for t_rect in table_rects): continue

            # Check if text is a section header based on doc_type
            detected_section = map_to_section(text)
            
            if detected_section:
                flush()
                current_section = detected_section
                current_header = text
                current_text = [text]
            else:
                current_text.append(text)

        for tab in tabs:
            try:
                df = tab.to_pandas()
                if not df.empty:
                    current_text.append(f"\n### TABLE DATA:\n{df.to_markdown(index=False)}\n")
            except: pass

    flush()
    doc.close()
    return sections
