from strands import tool
from typing import Dict, Any
import datetime
import boto3
import os
from dotenv import load_dotenv

load_dotenv()

boto3.setup_default_session(region_name=os.getenv('AWS_REGION'))
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.getenv('DYNAMODB_TABLE_NAME'))

@tool
def cancel_booking(booking_id: str, reason: str = "") -> Dict[str, Any]:
    """
    Cancel an existing booking in DynamoDB.
    """
    if not booking_id:
        return {"status": "error", "message": "Booking ID is required"}

    try:
        response = table.get_item(Key={'booking_id': booking_id})

        if 'Item' not in response:
            return {"status": "error", "message": f"Booking with ID {booking_id} not found"}

        booking = response['Item']

        if booking['status'] == 'cancelled':
            return {"status": "error", "message": "Booking is already cancelled"}

        timestamp = datetime.datetime.now().isoformat()

        table.update_item(
            Key={'booking_id': booking_id},
            UpdateExpression="SET #status = :status, cancellation_reason = :reason, updated_at = :updated_at",
            ExpressionAttributeNames={'#status': 'status'},
            ExpressionAttributeValues={
                ':status': 'cancelled',
                ':reason': reason,
                ':updated_at': timestamp
            }
        )

        return {"status": "success", "message": f"Booking {booking_id} cancelled successfully"}
    except Exception as e:
        return {"status": "error", "message": str(e)}
