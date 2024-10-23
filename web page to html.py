from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import time

# Set up Chrome options
chrome_options = Options()
chrome_options.add_argument("--headless")  # Run in headless mode for faster performance
chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--disable-dev-shm-usage")

# Set up the WebDriver service (adjust the path to your chromedriver) // please not chromedriver and chorme version must be same
service = Service('C:/webdrivers/chromedriver.exe')
driver = webdriver.Chrome(service=service, options=chrome_options)

# Load the webpage
url = "https://www.eventbrite.com/e/international-conference-on-nursing-2025-tickets-1042239746137?aff=ebdssbdestsearch&keep_tld=1"
driver.get(url)

# Allow time for JavaScript to execute
time.sleep(5)

# Extract the page source
html = driver.page_source

# Parse the HTML with BeautifulSoup
soup = BeautifulSoup(html, 'html.parser')

# Save the HTML to a file
with open("concerts_page.html", "w", encoding="utf-8") as file:
    file.write(soup.prettify())

# Close the driver
driver.quit()

print("HTML extracted successfully.")
