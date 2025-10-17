import json

# Load parsed data
with open("data/parsed/preferred_drugs.json", "r", encoding="utf-8") as f:
    DRUGS = json.load(f)

def find_drug_by_name_or_code(query):
    """
    query: str, e.g., "Adalimumab" or "J0135"
    """
    results = []
    for drug in DRUGS:
        if query.lower() in drug["Drug Name"].lower() or query.lower() in drug["HCPCS"].lower():
            # Find preferred alternatives in the same category
            category = drug["Category"]
            alternatives = [
                d["HCPCS"] for d in DRUGS
                if d["Category"] == category and d["Drug Status"].lower() == "preferred" and d["HCPCS"] != drug["HCPCS"]
            ]
            drug_info = {
                "Drug": drug["Drug Name"],
                "Code": drug["HCPCS"],
                "Preferred": drug["Drug Status"].lower() == "preferred",
                "Preferred_Alternatives": alternatives
            }
            results.append(drug_info)
    return results
