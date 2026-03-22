import sys
import os
import json
from strands import Agent
from strands_tools import use_agent

# Make sure project_root (one level up) is on sys.path
here = os.path.dirname(__file__)
drafts = os.path.abspath(os.path.join(here, ".."))
if drafts not in sys.path:
    sys.path.insert(0, drafts)

from drafts import kb_test

# Retrieve the knowledge base id
kb_id = os.environ.get("KNOWLEDGE_BASE_ID")
if not kb_id:
    print("Knowledge Base ID not found. Please ensure kb_test.py was run successfully.")
    kb_test.main()  # Launch the main script to set KNOWLEDGE_BASE_ID
    kb_id = os.environ.get("KNOWLEDGE_BASE_ID")
    if kb_id:
        print(f"Fetched KNOWLEDGE_BASE_ID: {kb_id}")
    else:
        print("Failed to fetch KNOWLEDGE_BASE_ID after running kb_test.")
        exit(1)


print(f"Using Knowledge Base ID: {kb_id}")
# Use kb_id to call further APIs, for example:
# response = some_api_call(knowledge_base_id=kb_id)

llm_filter_prompt = """
Extract structured filters from the following restaurant query. 
Return a JSON object mapping field names to filter conditions. 
Use OpenSearch field names and types (e.g., 'Price (USD)', 'NearWindow', 'Capacity', etc.).

Query: "{query}"

Example output:
{
  "Price (USD)": {"lte": 100},
  "NearWindow": true
}
"""

system_prompt = """
You are a Knowledge Base Assistant, that provides clear, concise reservation history, table layout answers, and guest preferences assistance,
based on information retrieved from a knowledge base.

The information from the knowledge base contains two sets of data:
1. Data relative to tables: Table IDs, Table capacities, Table Locations, whether they are near the window or not, and other historical data.
2. Data relative to reservations: Guest IDs, Reservation IDs, Table IDs, Reservation Dates, and other historical data.
Focus on the actual content and ignore the metadata.

Your responses should:
1. Be direct and to the point
2. Not mention the source of information (like document IDs or scores)
3. Not include any metadata or technical details
4. Be conversational but brief
5. Acknowledge when information is conflicting or missing
6. Begin the response with \n

When analyzing the knowledge base results:
- Higher scores (closer to 1.0) indicate more relevant results
- Look for patterns across multiple results
- Prioritize information from results with higher scores
- Ignore any JSON formatting or technical elements in the content

Example responses for clear information:
"Guest G0013 made a reservation for 4 people at Table T16, which is near the window and has a capacity of 4. The reservation is confirmed for June 15th, 2023 at 7:00 PM."
"Guest G0455 prefers usually to sit at Table T02, which is a 2-person table near the window. The table is currently available."
"Table T07 has been reserved 5 times in the last month, with an average capacity of 4 people. It is located near the window and has a capacity of 4."
"Table T21 has been occupied most frequently during weekends, especially on Saturday evenings. It has a capacity of 6 and is located near the window."
"During the month of June, we had a total of 150 reservations, with an average of 5 reservations per day. The most popular table was T003, which was reserved 20 times."


Example response for missing information:
"I don't have any information about this guest."
"I couldn't find any reservations for this date."
"I don't have any information about this table for this restaurant."

Your primary responsibilities:
1. Personalize the booking experience based on guest preferences and history
2. Analyze booking patterns and provide insights
3. Manage table assignments based on availability and customer preferences

"""

""" 
    # Advanced search with custom parameters
    historical_data_results = agent.tool.retrieve(
        text="Tell me How many bookings did we have during the month of June?",
        knowledgeBaseId=kb_id,
        region="us-east-1",
        use_llm=True
    )

    table_data_results = agent.tool.retrieve(
        text="Tell me how many tables we have in the restaurant that are near the window?",
        knowledgeBaseId=kb_id,
        region="us-east-1",
        use_llm=True
    )

    print("Search Results:", table_data_results["content"][0]["text"])

    result = agent.tool.memory(action="retrieve", query=query, min_score=0.4, max_results=9)

    table_query = "Tell me how many tables we have in the restaurant that are near the window?"
"""

def get_query_vector(query_text):
    # Replace with actual Bedrock embedding API call
    # Example: embedding = bedrock_client.embed_text(...)
    return embedding['embedding']

def extract_filters_llm(query, llm_client):
    prompt = llm_filter_prompt.format(query=query)
    response = llm_client.complete(prompt=prompt, max_tokens=200)
    # Parse the JSON output from the LLM
    try:
        filters_dict = json.loads(response)
        filters = []
        for field, condition in filters_dict.items():
            if isinstance(condition, dict):  # range filter
                filters.append({"range": {field: condition}})
            else:  # term filter
                filters.append({"term": {field: condition}})
        return filters
    except Exception as e:
        print("LLM filter extraction failed:", e)
        return []


def run_kb_agent(query):
    agent = Agent(tools=[use_agent])
    filters = extract_filters_llm(query, llm_client)  # Use LLM for filter extraction
    query_vector = get_query_vector(query)
    knn_query = build_knn_query(query_vector, filters)
    response = agent.tool.opensearch_search(
        index="resto-mgmt-syst-kb-index-898",
        body=knn_query
    )
    print("\nResults:")
    for hit in response['hits']['hits']:
        print(hit['_source'])

if __name__ == "__main__":
    # Print welcome message
    print("\n🧠 Knowledge Base Agent 🧠\n")
    print("This agent helps you retrieve information from your restaurant knowledge base.")
    print("Try commands like:")
    print("- \"how many tables we have in the restaurant that are near the window?\"")
    print("- \"Which restaurant location does Guest G0344 preferes sitting at?\"")
    print("\nType your request below or 'exit' to quit:")

    # Interactive loop
    while True:
        try:
            user_input = input("\n> ")
            if user_input.lower() in ["exit", "quit"]:
                print("\nGoodbye! 👋")
                break
            
            if not user_input.strip():
                continue
                
            # Process the input through the knowledge base agent
            print("Processing...")
            run_kb_agent(user_input)
            
        except KeyboardInterrupt:
            print("\n\nExecution interrupted. Exiting...")
            break
        except Exception as e:
            print(f"\nAn error occurred: {str(e)}")