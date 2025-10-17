from bs4 import BeautifulSoup

def parse_drug_table(html):
    soup = BeautifulSoup(html, "lxml")
    drugs_data = []

    tables = soup.find_all("table", class_="table table-responsive")

    for table in tables:
        category_tag = table.find_previous("h2")
        category = category_tag.get_text(strip=True) if category_tag else ""
        rows = table.find_all("tr")[1:]

        for row in rows:
            cols = row.find_all("td")
            if len(cols) >= 4:
                drugs_data.append({
                    "Category": category,
                    "Drug Status": cols[0].get_text(strip=True),
                    "Drug Name": cols[1].get_text(strip=True),
                    "HCPCS": cols[2].get_text(strip=True),
                    "Manufacturer": cols[3].get_text(strip=True)
                })

    return drugs_data
