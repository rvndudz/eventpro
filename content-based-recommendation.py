import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Step 1: Load the event data from the Excel file
file_path = "eventbrite_data_new.xlsx"  # Update this to your file path if needed
df = pd.read_excel(file_path)

# Step 2: Prepare the combined features for TF-IDF
df['combined_features'] = df['category'] + ' ' + df['description']

# Step 3: Apply TF-IDF vectorization to the combined features
tfidf = TfidfVectorizer(stop_words='english')  # Initialize the vectorizer
tfidf_matrix = tfidf.fit_transform(df['combined_features'])  # Transform the data

# Step 4: Calculate the cosine similarity matrix
cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)

# Step 5: Create the recommendation function
def recommend_events(event_name, df, cosine_sim, top_n=3):
    """Given an event name, recommend top N similar events."""
    try:
        # Get the index of the event matching the given name
        idx = df[df['event_name'] == event_name].index[0]

        # Calculate similarity scores for all events with this event
        sim_scores = list(enumerate(cosine_sim[idx]))

        # Sort the events by similarity score (in descending order)
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)

        # Get the top N similar events (excluding the original event)
        top_events = sim_scores[1:top_n + 1]

        # Print the recommendations
        print(f"Top {top_n} recommendations for '{event_name}':")
        for i, score in top_events:
            print(f"{df.iloc[i]['event_name']} (Similarity Score: {score:.2f})")
    except IndexError:
        print(f"Event '{event_name}' not found in the dataset.")

# Example usage: Recommend top 3 events similar to 'The Good Money Guide London Investor Show 2024'
recommend_events('Women in industry and innovation', df, cosine_sim, top_n=3)
