import boto3
import os
from datetime import datetime
from typing import List, Dict, Any, Optional
from boto3.dynamodb.conditions import Key, Attr
from src.database.models import Booking, TableReservation
from src.database.setup_database import DynamoDBClient

class BookingsRepository:
    def __init__(self):
        self.client = DynamoDBClient()
        self.table = self.client.table
    
    # Booking operations
    def create_booking(self, booking: Booking) -> Booking:
        """Create a new booking in DynamoDB"""
        self.table.put_item(Item=booking.to_dynamodb_item())
        return booking
    
    def get_booking(self, booking_id: str) -> Optional[Booking]:
        """Get a booking by ID"""
        response = self.table.get_item(Key={"booking_id": booking_id})
        if "Item" not in response:
            return None
        return Booking.from_dynamodb_item(response["Item"])
    
    def update_booking(self, booking: Booking) -> Booking:
        """Update a booking"""
        booking.updated_at = datetime.now().isoformat()
        self.table.put_item(Item=booking.to_dynamodb_item())
        return booking
    
    def delete_booking(self, booking_id: str) -> bool:
        """Delete a booking"""
        self.table.delete_item(Key={"booking_id": booking_id})
        return True
    
    def find_bookings(self, **kwargs) -> List[Booking]:
        """Find bookings by various criteria"""
        filter_expression = None
        expression_attr_values = {}
        
        for i, (key, value) in enumerate(kwargs.items()):
            if value is not None:
                placeholder = f":val{i}"
                if filter_expression:
                    filter_expression &= Attr(key).eq(value)
                else:
                    filter_expression = Attr(key).eq(value)
                expression_attr_values[placeholder] = value
        
        if filter_expression:
            response = self.table.scan(
                FilterExpression=filter_expression,
                ExpressionAttributeValues=expression_attr_values
            )
        else:
            response = self.table.scan()
            
        return [Booking.from_dynamodb_item(item) for item in response.get("Items", [])]
    
    # Table reservation operations
    def create_table_reservation(self, reservation: TableReservation) -> TableReservation:
        """Create a new table reservation"""
        # Use GSI or separate table for TableReservations
        # For simplicity, we'll use the same table with a different prefix
        item = reservation.to_dynamodb_item()
        # Add a prefix to distinguish from bookings
        item["booking_id"] = f"TR#{reservation.booking_id}"  # Prefix for querying
        item["type"] = "table_reservation"  # To filter by type
        
        self.table.put_item(Item=item)
        return reservation
    
    def get_table_reservations(self, date: str, time: str = None) -> List[TableReservation]:
        """Get all table reservations for a specific date/time"""
        filter_expression = Attr("type").eq("table_reservation") & Attr("reservation_date").eq(date)
        
        if time:
            filter_expression &= Attr("reservation_time").eq(time)
        
        response = self.table.scan(FilterExpression=filter_expression)
        
        return [TableReservation.from_dynamodb_item(item) for item in response.get("Items", [])]
    
    def is_table_reserved(self, table_id: int, date: str, time: str) -> bool:
        """Check if a table is already reserved for a specific date/time"""
        filter_expression = (
            Attr("type").eq("table_reservation") & 
            Attr("table_id").eq(table_id) & 
            Attr("reservation_date").eq(date) & 
            Attr("reservation_time").eq(time)
        )
        
        response = self.table.scan(FilterExpression=filter_expression)
        
        return len(response.get("Items", [])) > 0
    
    def delete_table_reservation(self, reservation_id: str) -> bool:
        """Delete a table reservation"""
        self.table.delete_item(Key={"booking_id": f"TR#{reservation_id}"})
        return True
