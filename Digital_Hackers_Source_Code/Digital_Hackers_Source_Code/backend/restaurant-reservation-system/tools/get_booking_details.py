from strands import tool
from typing import Dict, Any
import boto3
import os
from dotenv import load_dotenv

load_dotenv()

boto3.setup_default_session(region_name=os.getenv('AWS_REGION'))
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.getenv('DYNAMODB_TABLE_NAME'))

@tool
def get_booking_details(booking_id: str = None, customer_name: str = None, phone: str = None, date: str = None) -> Dict[str, Any]:
    """
    Get booking details for a specific booking from DynamoDB using various search criteria.
    """
    if not any([booking_id, customer_name, phone, date]):
        return {"status": "error", "message": "At least one search parameter is required"}

    filter_expression = None
    expression_attr_values = {}

    if booking_id:
        filter_expression = "booking_id = :booking_id"
        expression_attr_values[":booking_id"] = booking_id
    elif customer_name:
        filter_expression = "customer_name = :customer_name"
        expression_attr_values[":customer_name"] = customer_name
    elif date:
        filter_expression = "booking_date = :date"
        expression_attr_values[":date"] = date

    try:
        response = table.scan(
            FilterExpression=filter_expression,
            ExpressionAttributeValues=expression_attr_values
        ) if filter_expression else table.scan()

        bookings = response.get('Items', [])

        if not bookings:
            return {"status": "not_found", "message": "No bookings found matching the criteria"}

        return {"status": "success", "bookings": bookings}
    except Exception as e:
        return {"status": "error", "message": str(e)}
