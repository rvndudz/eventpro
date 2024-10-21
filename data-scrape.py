from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from bs4 import BeautifulSoup
import pandas as pd
import time

# Set up the WebDriver service (adjust the path to your chromedriver) // please not chromedriver and chorme version must be same
service = Service('C:/webdrivers/chromedriver.exe')
driver = webdriver.Chrome(service=service)

# Load the webpage
driver.get("https://www.ticketsministry.com/concerts")

# Allow some time for the page to load
time.sleep(15)  # Adjust sleep time if necessary

# Extract page source and parse it with BeautifulSoup
soup = BeautifulSoup(driver.page_source, 'html.parser')

# Close the browser
driver.quit()

# Find event cards
event_cards = soup.find_all('div', class_='event-card')
print(f"Found {len(event_cards)} event cards.")

# Create a list to store event data
events_data = []

# Extract event details
for card in event_cards:
    title = card.find('div', class_='title').get_text(strip=True)
    date = card.find('div', class_='date').get_text(separator=' ', strip=True)
    location = card.find('div', class_='location').get_text(strip=True)
    price = card.find('span', class_='price-value').get_text(strip=True)
    event_link = f"https://www.ticketsministry.com{card.find('a')['href']}"
    
    event = {
        'Title': title,
        'Date': date,
        'Location': location,
        'Price': price,
        'Link': event_link
    }
    events_data.append(event)

# Create a DataFrame from the list of events
df = pd.DataFrame(events_data)

# Save the data to an Excel file
df.to_excel('concerts_data.xlsx', index=False)

print("Data has been saved to 'concerts_data.xlsx'")
