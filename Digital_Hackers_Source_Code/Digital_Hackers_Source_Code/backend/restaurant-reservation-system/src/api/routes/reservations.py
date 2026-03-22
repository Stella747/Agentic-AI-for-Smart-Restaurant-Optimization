from fastapi import APIRouter, Body
from pydantic import BaseModel
from typing import Optional
import sys
from pathlib import Path

# Add the project root to the Python path
project_root = str(Path(__file__).parents[3])  # Go up 3 levels to reach project root
if project_root not in sys.path:
    sys.path.append(project_root)

from src.agents.reservation_agent import process_reservation_request

# Define request model
class ReservationRequest(BaseModel):
    name: str
    phone: str
    email: str
    date: str
    time: str
    party_size: int
    special_requests: Optional[str] = None

router = APIRouter(prefix='/reservations')

@router.post('/')
def create_reservation(reservation: ReservationRequest):
    """
    Create a new reservation using the reservation agent.
    
    This endpoint accepts reservation details and processes them through
    the reservation agent to create a new booking.
    """
    # Convert Pydantic model to dict for processing
    reservation_data = reservation.dict()
    
    # Process the reservation through the agent
    agent_response = process_reservation_request(reservation_data)
    
    # Return the response
    return {
        'message': 'Reservation request processed',
        'agent_response': agent_response,
        'reservation': reservation_data
    }
