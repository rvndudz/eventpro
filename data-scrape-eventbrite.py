import os
import requests
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from bs4 import BeautifulSoup
import pandas as pd
import time
import re

MAIN_URL = "https://www.eventbrite.com/d/united-kingdom--london/business--events/"

# Set up WebDriver (adjust the path to your chromedriver)
service = Service('C:/webdrivers/chromedriver.exe')
driver = webdriver.Chrome(service=service)

# Create a folder to store images
if not os.path.exists('eventbrite_images'):
    os.makedirs('eventbrite_images')

# Helper function to download the image and save it locally
def download_image(image_url, filename):
    try:
        response = requests.get(image_url, stream=True)
        if response.status_code == 200:
            with open(f'eventbrite_images/{filename}', 'wb') as f:
                f.write(response.content)
        else:
            print(f"Failed to download image: {image_url}")
    except Exception as e:
        print(f"Error downloading image: {e}")

# Helper function to sanitize filenames for Windows
def sanitize_filename(filename):
    return re.sub(r'[\/:*?"<>|]', '_', filename)

# Store event data
events_data = []

# Iterate through multiple pages
for page_number in range(1, 2):  # Adjust the range as needed
    # Load the webpage with the current page number
    url = f"{MAIN_URL}?page={page_number}"
    driver.get(url)
    time.sleep(5)  # Allow time for the page to load

    # Parse the main page
    main_soup = BeautifulSoup(driver.page_source, 'html.parser')

    # Find all event cards
    event_cards = main_soup.find_all('div', class_='event-card')
    print(f"Page {page_number}: Found {len(event_cards)} event cards.")

    if not event_cards:
        break  # Stop if no events are found

    for card in event_cards:
        try:
            min_ticket_price = card.find('div', class_='DiscoverHorizontalEventCard-module__priceWrapper___3rOUY').get_text(strip=True)

            # Extract the event link
            event_link = card.find('a')['href']

            # Open the event page
            driver.get(event_link)
            time.sleep(3)  # Adjust sleep time as needed

            # Parse the event page
            event_soup = BeautifulSoup(driver.page_source, 'html.parser')

            # Extract event details
            event_name = event_soup.find('h1').get_text(strip=True) if event_soup.find('h1') else "N/A"
            date_time_element = event_soup.find('span', class_='date-info__full-datetime')
            date_time = date_time_element.get_text(strip=True) if date_time_element else "N/A"

            # Sanitize filename for the image
            sanitized_name = sanitize_filename(event_name)
            sanitized_date_time = sanitize_filename(date_time.replace(' ', '_'))
            filename = f"{sanitized_date_time}_{sanitized_name}.jpg"

            # Extract thumbnail URL and download the image
            thumbnail_url = event_soup.find("meta", property="og:image")["content"]
            download_image(thumbnail_url, filename)

            # Extract description
            description = "N/A"
            description_div = event_soup.find('div', class_='has-user-generated-content event-description')
            if description_div:
                description = " ".join([p.get_text(strip=True) for p in description_div.find_all('p')])

            # Extract venue and organizer
            venue_element = event_soup.find('div', class_='location-info__address')
            venue = venue_element.find('p').get_text(strip=True) if venue_element else "N/A"

            organizer_element = event_soup.find('div', class_='descriptive-organizer-info-mobile__name')
            organizer = organizer_element.find('a').get_text(strip=True).replace('Organized by', '').strip() if organizer_element else "N/A"

            # Store the event details
            event_data = {
                'event_name': event_name,
                'description': description,
                'date_time': date_time,
                'venue': venue,
                'organizer': organizer,
                'min_ticket_price': min_ticket_price,
                'thumbnail_filename': filename
            }
            events_data.append(event_data)

        except Exception as e:
            print(f"Error processing event: {e}")

# Close the browser
driver.quit()

# Create a DataFrame from the events data
df = pd.DataFrame(events_data)

# Save the DataFrame to an Excel file
df.to_excel('eventbrite_data_new.xlsx', index=False)

print("Data extraction completed and saved to eventbrite_data.xlsx.")
