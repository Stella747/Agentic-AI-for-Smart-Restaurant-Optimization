from strands import tool
import datetime
from datetime import timedelta
import json
from src.database.bookings_repo import BookingsRepository
from src.database.models import TableReservation

# Define restaurant tables with properties
TABLES = [
    {"id": 1, "capacity": 2, "near_window": True, "type": "regular"},
    {"id": 2, "capacity": 2, "near_window": False, "type": "regular"},
    {"id": 3, "capacity": 4, "near_window": True, "type": "regular"},
    {"id": 4, "capacity": 4, "near_window": False, "type": "regular"},
    {"id": 5, "capacity": 4, "near_window": False, "type": "regular"},
    {"id": 6, "capacity": 6, "near_window": True, "type": "regular"},
    {"id": 7, "capacity": 6, "near_window": False, "type": "regular"},
    {"id": 8, "capacity": 8, "near_window": True, "type": "regular"},
    {"id": 9, "capacity": 8, "near_window": False, "type": "regular"},
    {"id": 10, "capacity": 2, "near_window": False, "type": "bar"},
    {"id": 11, "capacity": 2, "near_window": False, "type": "bar"},
    {"id": 12, "capacity": 2, "near_window": False, "type": "bar"},
    {"id": 13, "capacity": 2, "near_window": False, "type": "bar"},
    {"id": 14, "capacity": 10, "near_window": False, "type": "private_room"},
]

@tool
def get_table_configuration():
    """
    Get the configuration of all tables in the restaurant.
    
    Returns:
        dict: Information about all tables in the restaurant
    """
    return {
        "tables": TABLES,
        "total_tables": len(TABLES),
        "total_capacity": sum(table["capacity"] for table in TABLES),
        "window_tables": sum(1 for table in TABLES if table["near_window"]),
        "bar_seats": sum(table["capacity"] for table in TABLES if table["type"] == "bar")
    }

@tool
def check_table_availability(date: str, time: str, party_size: int, near_window: bool = False):
    """
    Check if tables are available for a specific date, time and party size.
    
    Args:
        date (str): Date of reservation (YYYY-MM-DD)
        time (str): Time of reservation (HH:MM AM/PM)
        party_size (int): Number of guests
        near_window (bool, optional): Whether a window table is requested
    
    Returns:
        dict: Availability information and suitable tables
    """
    # Initialize repository
    repo = BookingsRepository()
    
    # Convert date and time to a datetime object
    try:
        if "AM" in time or "PM" in time:
            dt = datetime.datetime.strptime(f"{date} {time}", "%Y-%m-%d %I:%M %p")
        else:
            dt = datetime.datetime.strptime(f"{date} {time}", "%Y-%m-%d %H:%M")
    except ValueError:
        return {"error": "Invalid date or time format"}
    
    # Check reservation slot (assuming 2-hour slots)
    reservation_key = f"{date}_{dt.hour}"
    
    # Get all table reservations for this date and hour
    table_reservations = repo.get_table_reservations(date, str(dt.hour))
    reserved_table_ids = [tr.table_id for tr in table_reservations]
    
    # Find suitable tables
    suitable_tables = []
    for table in TABLES:
        # Check if table matches requirements
        if table["capacity"] >= party_size and (not near_window or table["near_window"]):
            # Check if table is already reserved for this time
            if table["id"] not in reserved_table_ids:
                suitable_tables.append(table)
    
    return {
        "available": len(suitable_tables) > 0,
        "date": date,
        "time": time,
        "party_size": party_size,
        "near_window_requested": near_window,
        "suitable_tables": suitable_tables,
        "total_suitable_tables": len(suitable_tables)
    }

@tool
def assign_table(date: str, time: str, booking_id: str, table_id: int):
    """
    Assign a specific table to a reservation.
    
    Args:
        date (str): Date of reservation (YYYY-MM-DD)
        time (str): Time of reservation (HH:MM AM/PM)
        booking_id (str): Unique booking identifier
        table_id (int): ID of the table to assign
    
    Returns:
        dict: Assignment result
    """
    # Initialize repository
    repo = BookingsRepository()
    
    # Convert date and time to a datetime object
    try:
        if "AM" in time or "PM" in time:
            dt = datetime.datetime.strptime(f"{date} {time}", "%Y-%m-%d %I:%M %p")
        else:
            dt = datetime.datetime.strptime(f"{date} {time}", "%Y-%m-%d %H:%M")
    except ValueError:
        return {"error": "Invalid date or time format"}
    
    # Check if table exists
    table = next((t for t in TABLES if t["id"] == table_id), None)
    if not table:
        return {"error": f"Table {table_id} does not exist"}
    
    # Create reservation key (date_hour)
    reservation_hour = str(dt.hour)
    
    # Check if table is already reserved
    if repo.is_table_reserved(table_id, date, reservation_hour):
        return {"error": f"Table {table_id} is already reserved for this time"}
    
    # Create table reservation
    reservation = TableReservation(
        table_id=table_id,
        booking_id=booking_id,
        reservation_date=date,
        reservation_time=reservation_hour
    )
    
    # Store reservation in DynamoDB
    repo.create_table_reservation(reservation)
    
    return {
        "success": True,
        "booking_id": booking_id,
        "table_id": table_id,
        "date": date,
        "time": time,
        "table_info": table
    }

@tool
def recommend_alternatives(date: str, time: str, party_size: int, near_window: bool = False):
    """
    Recommend alternative times or seating options when preferred options aren't available.
    
    Args:
        date (str): Requested date (YYYY-MM-DD)
        time (str): Requested time (HH:MM AM/PM)
        party_size (int): Number of guests
        near_window (bool, optional): Whether a window table was requested
    
    Returns:
        dict: Alternative recommendations
    """
    # Initialize repository
    repo = BookingsRepository()
    
    # Convert date and time to a datetime object
    try:
        if "AM" in time or "PM" in time:
            dt = datetime.datetime.strptime(f"{date} {time}", "%Y-%m-%d %I:%M %p")
        else:
            dt = datetime.datetime.strptime(f"{date} {time}", "%Y-%m-%d %H:%M")
    except ValueError:
        return {"error": "Invalid date or time format"}
    
    alternatives = {
        "bar_seating": False,
        "alternative_times": [],
        "alternative_dates": []
    }
    
    # Check if bar seating is available for the requested time
    bar_tables = [table for table in TABLES if table["type"] == "bar" and table["capacity"] >= party_size]
    
    if bar_tables:
        # Get all table reservations for this date and hour
        reservation_hour = str(dt.hour)
        table_reservations = repo.get_table_reservations(date, reservation_hour)
        reserved_table_ids = [tr.table_id for tr in table_reservations]
        
        available_bar_tables = []
        for table in bar_tables:
            if table["id"] not in reserved_table_ids:
                available_bar_tables.append(table)
        
        alternatives["bar_seating"] = len(available_bar_tables) > 0
    
    # Check alternative times (+/- 2 hours)
    for hour_offset in [-2, -1, 1, 2]:
        alt_dt = dt + timedelta(hours=hour_offset)
        alt_date = alt_dt.strftime("%Y-%m-%d")
        alt_time = alt_dt.strftime("%I:%M %p")
        
        availability = check_table_availability(alt_date, alt_time, party_size, near_window)
        if availability["available"]:
            alternatives["alternative_times"].append({
                "date": alt_date,
                "time": alt_time,
                "available_tables": len(availability["suitable_tables"])
            })
    
    # Check next day and previous day at same time
    for day_offset in [-1, 1]:
        alt_dt = dt + timedelta(days=day_offset)
        alt_date = alt_dt.strftime("%Y-%m-%d")
        alt_time = dt.strftime("%I:%M %p")
        
        availability = check_table_availability(alt_date, alt_time, party_size, near_window)
        if availability["available"]:
            alternatives["alternative_dates"].append({
                "date": alt_date,
                "time": alt_time,
                "available_tables": len(availability["suitable_tables"])
            })
    
    return alternatives
