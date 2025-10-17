# This code runs when the package is imported
print("Scraper package loaded")

# Optional: import submodules automatically
# from . import fetcher
from . import parser

# Optional: set default configuration
BASE_URL = "https://www.horizonblue.com/providers/productsprograms/pharmacy/pharmacyprograms/preferred-medical-drugs"
