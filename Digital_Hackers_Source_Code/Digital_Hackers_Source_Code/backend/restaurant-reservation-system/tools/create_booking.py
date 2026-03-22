from strands import tool
from typing import Dict, Any
import uuid
from datetime import datetime
from tools.manage_tables import check_table_availability, assign_table
from src.database.models import Booking
from src.database.bookings_repo import BookingsRepository

@tool
def create_booking(
    customer_name: str,
    booking_date: str,
    booking_time: str,
    party_size: int,
    customer_phone: str = None,
    customer_email: str = None,
    special_requests: str = None,
    near_window: bool = False
) -> Dict[str, Any]:
    """
    Create a new reservation in the system.
    
    Args:
        customer_name (str): Name of the customer
        booking_date (str): Date of reservation (YYYY-MM-DD)
        booking_time (str): Time of reservation (HH:MM)
        party_size (int): Number of guests
        customer_phone (str, optional): Contact phone number
        customer_email (str, optional): Contact email address
        special_requests (str, optional): Any special requests
        near_window (bool, optional): Whether a window table is requested
    
    Returns:
        dict: Booking details with ID and status
    """
    # Initialize repository
    repo = BookingsRepository()
    
    # Check table availability first
    availability = check_table_availability(booking_date, booking_time, party_size, near_window)
    
    if not availability["available"]:
        return {
            "status": "error",
            "message": "No suitable tables available for this reservation",
            "availability_details": availability
        }
    
    # Generate booking ID
    booking_id = str(uuid.uuid4())
    
    # Create booking record
    booking = Booking(
        booking_id=booking_id,
        customer_name=customer_name,
        booking_date=booking_date,
        booking_time=booking_time,
        party_size=party_size,
        customer_phone=customer_phone,
        customer_email=customer_email,
        special_requests=special_requests,
        near_window=near_window,
        status="confirmed",
        created_at=datetime.now().isoformat()
    )
    
    # Find the best table for this reservation
    # Pick the smallest suitable table to maximize efficiency
    suitable_tables = sorted(
        availability["suitable_tables"], 
        key=lambda t: (t["capacity"], not t["near_window"] if near_window else 0)
    )
    
    if suitable_tables:
        best_table = suitable_tables[0]
        table_assignment = assign_table(booking_date, booking_time, booking_id, best_table["id"])
        
        if "error" not in table_assignment:
            booking.table = best_table
            booking.table_id = best_table["id"]
        else:
            booking.status = "pending_table"
            # Store error message in special_requests if there's no existing request
            if not booking.special_requests:
                booking.special_requests = f"Table assignment error: {table_assignment['error']}"
    
    # Store booking in DynamoDB
    repo.create_booking(booking)
    
    # Return response
    return {
        "status": "success",
        "booking_id": booking_id,
        "booking_details": booking.model_dump(),
        "booking_time": booking_time,
        "special_requests": special_requests,
    }
