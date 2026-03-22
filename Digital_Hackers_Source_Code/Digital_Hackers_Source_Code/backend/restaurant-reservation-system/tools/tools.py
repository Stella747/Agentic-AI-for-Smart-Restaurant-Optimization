from strands import tool
from typing import Dict, List, Optional, Any
import datetime
import uuid
import boto3
import os
from dotenv import load_dotenv

load_dotenv()

boto3.setup_default_session(region_name=os.getenv('AWS_REGION'))  # Change to your preferred region

# Initialize DynamoDB client
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.getenv('DYNAMODB_TABLE_NAME'))

@tool
def collect_feedback(booking_id: str, feedback: str) -> dict:
    """
    Collects feedback for a booking and stores it.
    
    Args:
        booking_id (str): The identifier of the booking.
        feedback (str): The guest's feedback.
    
    Returns:
        dict: Status of the feedback collection.
    """
    try:
        # For simulation, we print the feedback.
        # In practice, use boto3 to write to a feedback table in DynamoDB.
        print(f"Feedback for booking {booking_id}: {feedback}")
        return {"status": "success", "message": "Feedback collected successfully"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@tool
def generate_report(bookings: list) -> dict:
    """
    Generates a report on booking statistics and system performance.
    
    Args:
        bookings (list): List of booking records.
    
    Returns:
        dict: A report including total bookings, confirmed, cancelled, and other insights.
    """
    total_bookings = len(bookings)
    confirmed = len([b for b in bookings if b.get("status") == "confirmed"])
    cancelled = len([b for b in bookings if b.get("status") == "cancelled"])
    
    report = {
        "total_bookings": total_bookings,
        "confirmed_bookings": confirmed,
        "cancelled_bookings": cancelled,
    }
    return {"status": "success", "report": report}

@tool
def integrate_with_systems(booking: dict, system: str) -> dict:
    """
    Integrates the booking data with external restaurant management systems.
    
    Args:
        booking (dict): Booking details.
        system (str): The target system for integration (e.g., POS, CRM).
        
    Returns:
        dict: The result of the integration operation.
    """
    try:
        # Simulated integration logic.
        # In production, call the appropriate API endpoints of the external system.
        print(f"Integrating booking {booking.get('booking_id')} with {system}")
        return {"status": "success", "message": f"Successfully integrated with {system}"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@tool
def secure_data(data: dict) -> dict:
    """
    Ensures that data is stored securely by applying encryption or hashing to sensitive fields.
    
    Args:
        data (dict): The data to secure.
    
    Returns:
        dict: The secured (simulated encrypted) data.
    """
    try:
        # Simulated encryption: in a production environment, use a cryptographic library.
        secured_data = {k: f"encrypted({v})" for k, v in data.items()}
        return {"status": "success", "secured_data": secured_data}
    except Exception as e:
        return {"status": "error", "message": str(e)}
