import pandas as pd

# 1. load your CSV (or Parquet)
df = pd.read_csv("bookings.csv", parse_dates=["BookingTime","CheckInTime"])

# 2. optional: aggregate per guest if you want a single “profile embedding” per GuestID
guest_profiles = (
    df
    .groupby("GuestID")
    .apply(lambda g: {
        # build a small textual summary of guest preferences
        "GuestID": g.name,
        "ProfileText": (
            f"Guest {g.name} booked {g['PartySize'].sum()} seats total, "
            f"visited locations: {', '.join(sorted(set(g.Location)))}, "
            f"favored channels: {', '.join(sorted(set(g.Channel)))}. "
            f"Statuses: {', '.join(sorted(set(g.Status)))}."
        )
    })
    .tolist()
)


import boto3

client = boto3.client("bedrock-runtime")  # make sure your AWS creds/region are set

def get_embedding(text: str) -> list[float]:
    response = client.invoke_model(
        modelId="amazon.titan-embedding",    # or whichever embedding model you prefer
        contentType="application/json",
        accept="application/json",
        body={
            "input": text
        }
    )
    # parse out the embedding vector
    return response["body"]["embedding"]

# generate embeddings for each guest profile
for prof in guest_profiles:
    prof["Embedding"] = get_embedding(prof["ProfileText"])
