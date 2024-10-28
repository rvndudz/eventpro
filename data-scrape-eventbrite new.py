import os
import requests
import json
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from bs4 import BeautifulSoup
import pandas as pd
import time
import re

# Read configuration from config.json
with open('config.json', 'r') as f:
    config = json.load(f)

# Extract configuration data
locations = config.get('locations')
categories = config.get('categories')
num_pages = config.get('num_pages', 2)  # Number of pages to scrape



# Set up WebDriver (adjust the path to your chromedriver)
service = Service('C:/webdrivers/chromedriver.exe')  # Update this path as needed
driver = webdriver.Chrome(service=service)

# Helper function to download the image and save it locally
def download_image(image_url, filename, images_folder):
    try:
        response = requests.get(image_url, stream=True)
        if response.status_code == 200:
            with open(os.path.join(images_folder, filename), 'wb') as f:
                f.write(response.content)
        else:
            print(f"Failed to download image: {image_url}")
    except Exception as e:
        print(f"Error downloading image: {e}")

# Helper function to sanitize filenames for Windows
def sanitize_filename(filename):
    return re.sub(r'[\/:*?"<>|]', '_', filename)

# Iterate over each country and its cities
for location in locations:
    country = location.get('country', 'united-kingdom')
    cities = location.get('cities', [])
    
    for city in cities:
        print(f"\nScraping events for {city.title()}, {country.title()}...\n")

        for category in categories:
            print(f"Category: {category}")

            # Prepare city folder name
            city_folder = city.lower().replace(' ', '_')
            
            # Create a folder named after the city
            if not os.path.exists(city_folder):
                os.makedirs(city_folder)
            
            # Create an images subfolder inside the city folder
            images_folder = os.path.join(city_folder, 'eventbrite_images')
            if not os.path.exists(images_folder):
                os.makedirs(images_folder)
            
            MAIN_URL = f"https://www.eventbrite.com/d/{country}--{city}/{category}/"
            
            # Store event data
            events_data = []
            
            # Iterate through multiple pages
            for page_number in range(1, num_pages + 1):  # Use num_pages from config
                # Load the webpage with the current page number
                url = f"{MAIN_URL}?page={page_number}"
                driver.get(url)
                time.sleep(5)  # Allow time for the page to load
            
                # Parse the main page
                main_soup = BeautifulSoup(driver.page_source, 'html.parser')
            
                # Find all event cards
                event_cards = main_soup.find_all('div', class_='event-card')
                print(f"Page {page_number}: Found {len(event_cards)} event cards in {city.title()}.")
            
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
                        filename = f"{sanitized_name}.jpg"
            
                        # Extract thumbnail URL and download the image
                        thumbnail_meta = event_soup.find("meta", property="og:image")
                        if thumbnail_meta:
                            thumbnail_url = thumbnail_meta["content"]
                            download_image(thumbnail_url, filename, images_folder)
                        else:
                            print(f"No thumbnail found for event: {event_name}")
            
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
                            'category': category,  # Added category here
                            'thumbnail_filename': filename
                        }
                        events_data.append(event_data)

                        print(f"Processed data: {event_data}")
            
                    except Exception as e:
                        print(f"Error processing event: {e}")
        
        # Save the DataFrame to an Excel file inside the city folder
        if events_data:
            df = pd.DataFrame(events_data)
            excel_file_path = os.path.join(city_folder, 'eventbrite_data_new.xlsx')
            df.to_excel(excel_file_path, index=False)
            print(f"Data extraction completed for {city.title()} and saved to {excel_file_path}.")
        else:
            print(f"No events found for {city.title()} in {country.title()}.")
        
# Close the browser after all scraping is done
driver.quit()
