import os
import sys
from pathlib import Path

# Add the project root to the Python path
project_root = str(Path(__file__).parents[2])  # Go up 2 levels from src/agents to reach project root
if project_root not in sys.path:
    sys.path.append(project_root)

from strands import Agent
from strands.models import BedrockModel
import boto3
from typing import Dict, List, Optional, Any
from tools.get_booking_details import get_booking_details
from tools.create_booking import create_booking
from tools.cancel_booking import cancel_booking
from tools.analyze_bookings import analyze_bookings
from tools.send_notification import send_notification
from tools.manage_tables import check_table_availability, get_table_configuration, assign_table, recommend_alternatives
from strands_tools import current_time, retrieve

# from strands.memory import Memory
# from strands.triggers import Trigger

system_prompt = """
You are the Restaurant Reservation Orchestrator Agent, an AI assistant designed to streamline restaurant reservations, optimize table turnover, and personalize dining experiences across multiple channels.

Your primary responsibilities:
1. Manage reservations from multiple channels (web, mobile, phone, kiosk)
2. Create, retrieve, update, and cancel bookings
3. Optimize table assignments to maximize seating efficiency
4. Personalize the booking experience based on guest preferences and history
5. Analyze booking patterns and provide insights
6. Send notifications for confirmations, reminders, and updates
7. Handle guest feedback and generate reports
8. Manage table assignments based on availability and customer preferences

You have access to the following tools:
- retrieve: Retrieve historical reservation data for insights, menu entries and their prices, and knowledge base information
- current_time: Get the current time in the restaurant's timezone
- get_booking_details: Retrieve booking details using various search criteria
- create_booking: Create a new reservation in the system
- cancel_booking: Cancel an existing reservation
- analyze_bookings: Provide insights into booking patterns and guest behavior
- send_notification: Send notifications to guests and staff
- check_table_availability: Check if tables are available for a specific time and party size
- get_table_configuration: Get information about all tables in the restaurant
- assign_table: Assign a specific table to a reservation
- recommend_alternatives: Suggest alternative times or seating options (like bar area) when preferred options aren't available


When handling reservations:
1. Always check table availability before confirming a reservation
2. Consider special requests like window seating
3. If requested time/table isn't available, offer alternatives (different time or bar seating)
4. Assign tables efficiently based on party size
5. Prioritize guest preferences when possible

Always be professional, courteous, and focused on enhancing the guest experience while maximizing restaurant capacity. Provide clear, concise responses and use the appropriate tools to complete tasks efficiently.
"""

# model = BedrockModel(
#     model_id=os.getenv("BEDROCK_MODEL_ID", "amazon.nova-lite-v1:0"),
#     # boto_client_config=Config(
#     #    read_timeout=900,
#     #    connect_timeout=900,
#     #    retries=dict(max_attempts=3, mode="adaptive"),
#     # ),
#     additional_request_fields={
#         "thinking": {
#             "type": "enabled",
#             # "budget_tokens": 2048,
#         }
#     },
# )


# bedrock_client = bedrock_client
# memory = Memory(persistent=True)
tools = [
    retrieve,
    current_time,
    get_booking_details,
    create_booking,
    cancel_booking,
#    analyze_bookings,
    send_notification,
    check_table_availability,
    get_table_configuration,
    assign_table,
    recommend_alternatives
]

# triggers = [
#     Trigger(event_type="new_reservation"),
#     Trigger(event_type="cancel_reservation"),
#     Trigger(event_type="query_booking")
# ]


def get_agent():
    """Return the reservation agent instance."""
    return Agent(
        name="ReservationManager",
        model=os.getenv("BEDROCK_MODEL_ID", "amazon.nova-lite-v1:0"),
        # memory=memory,
        tools=tools,
        # triggers=triggers,
        system_prompt=system_prompt,
    )

# Create a singleton instance of the agent
reservation_agent = get_agent()

def process_reservation_request(reservation_data: dict) -> str:
    """
    Process a reservation request using the reservation agent.
    
    Args:
        reservation_data: Dictionary containing reservation details
        
    Returns:
        The agent's response as a string
    """
    # Format the reservation data into a natural language request
    request = f"I'd like to make a reservation for {reservation_data.get('name', '')}, "
    request += f"phone number {reservation_data.get('phone', '')}, "
    request += f"email {reservation_data.get('email', '')}, "
    request += f"on {reservation_data.get('date', '')} at {reservation_data.get('time', '')} "
    request += f"for a party of {reservation_data.get('party_size', '')}."
    
    # Add any special requests if present
    if special_requests := reservation_data.get('special_requests'):
        request += f" Special requests: {special_requests}."
    
    # Process the request through the agent
    return reservation_agent(request)


#response = reservation_agent("I'd like to cancel my reservation for Iliass booking id cd21644b-ad9c-4030-abf0-991f5f88dc2f, phone number 123-456-7890, email iliass@example.com, on 2025-07-17 at 8:00 PM for a party of 8.")
response = reservation_agent("can you look into historical data using the retrieve tool? and tell me how many reservations we had last week?")
# response = reservation_agent("which strands-agents version do you operate on?")
print(response)  # Print the agent's response
