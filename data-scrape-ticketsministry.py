import os
import requests
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from bs4 import BeautifulSoup
import pandas as pd
import json
import time
import re

# Set up WebDriver (adjust the path to your chromedriver)
service = Service('C:/webdrivers/chromedriver.exe')
driver = webdriver.Chrome(service=service)

# Create a folder to store images
if not os.path.exists('event_images'):
    os.makedirs('event_images')

# Helper function to download the image and save it locally
def download_image(image_url, filename):
    response = requests.get(image_url, stream=True)
    if response.status_code == 200:
        with open(f'event_images/{filename}', 'wb') as f:
            f.write(response.content)
    else:
        print(f"Failed to download image: {image_url}")

# Helper function to sanitize filenames for Windows
def sanitize_filename(filename):
    # Replace invalid characters with underscores
    return re.sub(r'[\/:*?"<>|]', '_', filename)

# Helper function to extract readable description from JSON
def extract_description_from_json(description_json):
    try:
        blocks = description_json.get("blocks", [])
        description = " ".join([block["text"] for block in blocks if block["text"]])
        return description.strip()
    except Exception as e:
        print(f"Error extracting description: {e}")
        return ""

# Load the main webpage
driver.get("https://www.ticketsministry.com/theatre")
time.sleep(5)  # Allow time for the page to load

# Parse the main page
main_soup = BeautifulSoup(driver.page_source, 'html.parser')

# Find all event cards
event_cards = main_soup.find_all('div', class_='event-card')
print(f"Found {len(event_cards)} event cards.")

# Store event data
events_data = []

for card in event_cards:
    # Extract the event link and indoor/outdoor type from the main page
    event_link = f"https://www.ticketsministry.com{card.find('a')['href']}"
    event_type = card.find('div', class_='type').get_text(strip=True)
    min_ticket_price = card.find('span', class_='price-value').get_text(strip=True)

    # Open the event page
    driver.get(event_link)
    time.sleep(1)  # Adjust sleep time as needed

    # Parse the event page
    event_soup = BeautifulSoup(driver.page_source, 'html.parser')

    # Extract event name and date & time
    event_name = event_soup.find('h1').get_text(strip=True)
    date_time = event_soup.find('div', class_='datetime').find('p').get_text(strip=True)

    # Format the filename
    sanitized_name = sanitize_filename(event_name)
    sanitized_date_time = sanitize_filename(date_time.replace(' ', '_'))
    filename = f"{sanitized_date_time}_{sanitized_name}.jpg"

    # Extract thumbnail URL and download the image
    thumbnail_url = event_soup.find("meta", property="og:image")["content"]
    download_image(thumbnail_url, filename)

    # Extract description (from JSON or HTML)
    description = ""
    try:
        script = event_soup.find("script", {"id": "__NEXT_DATA__"}).string
        json_data = json.loads(script)
        description_json = json.loads(json_data["props"]["pageProps"]["event"]["description"])
        description = extract_description_from_json(description_json)
    except (AttributeError, KeyError, TypeError, json.JSONDecodeError):
        description_div = event_soup.find('div', class_='description')
        if description_div:
            description = " ".join([p.get_text(strip=True) for p in description_div.find_all('p')])

    # Extract venue, organizer, and tickets
    venue = event_soup.find('div', class_='location').find('p').get_text(strip=True)
    organizer = event_soup.find('div', class_='organizer').find('p').get_text(strip=True).replace('Organized by', '').strip()

    ticket_elements = event_soup.find('div', class_='ticket-prices').find_all('li')
    tickets = [
        f"{ticket.find('span', class_='label').get_text(strip=True)} - {ticket.find('span', class_='price').get_text(strip=True)}"
        for ticket in ticket_elements
    ]

    # Store the event details
    event_data = {
        'event_name': event_name,
        'description': description,
        'date_time': date_time,
        'venue': venue,
        'event_type': event_type,
        'organizer': organizer,
        'ticket_options': tickets,
        'min_ticket_price': min_ticket_price,
        'thumbnail_filename': filename  # Include the filename in the Excel sheet
    }
    events_data.append(event_data)

# Close the browser
driver.quit()

# Create a DataFrame from the events data
df = pd.DataFrame(events_data)

# Save the DataFrame to an Excel file
df.to_excel('ticketsministry_theatre_data.xlsx', index=False)

print("Data and images have been saved successfully.")
