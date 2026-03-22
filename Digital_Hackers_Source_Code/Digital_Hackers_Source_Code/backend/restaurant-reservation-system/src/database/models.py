from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional, Dict, Any
import uuid

class Booking(BaseModel):
    booking_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    customer_name: str
    customer_email: Optional[EmailStr] = None
    customer_phone: Optional[str] = None
    party_size: int
    booking_date: str  # ISO format date string
    booking_time: str  # Time in 24hr format (HH:MM)
    special_requests: Optional[str] = None
    near_window: Optional[bool] = False
    status: str = "confirmed"
    table_id: Optional[int] = None
    table: Optional[Dict[str, Any]] = None
    created_at: str = Field(default_factory=lambda: datetime.now().isoformat())
    updated_at: Optional[str] = None
    
    def to_dynamodb_item(self):
        item = self.model_dump(exclude_none=True)
        # Convert any complex types to JSON strings for DynamoDB
        if self.table:
            item["table"] = str(self.table)
        return item
    
    @classmethod
    def from_dynamodb_item(cls, item):
        if not item:
            return None
        
        # Convert JSON string back to dict if needed
        if "table" in item and isinstance(item["table"], str):
            import json
            try:
                item["table"] = json.loads(item["table"])
            except:
                pass
                
        return cls(**item)

class TableReservation(BaseModel):
    reservation_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    table_id: int
    booking_id: str
    reservation_date: str  # YYYY-MM-DD
    reservation_time: str  # HH:MM or hour number
    created_at: str = Field(default_factory=lambda: datetime.now().isoformat())
    
    def to_dynamodb_item(self):
        return self.model_dump()
    
    @classmethod
    def from_dynamodb_item(cls, item):
        if not item:
            return None
        return cls(**item)
