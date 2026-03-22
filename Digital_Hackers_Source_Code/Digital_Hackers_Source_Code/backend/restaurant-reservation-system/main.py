import src.agents.reservation_agent
import boto3
import os
from dotenv import load_dotenv
import src.database.setup_database as setup_database

load_dotenv()

# Ensure the DynamoDB table exists before starting the application
setup_database.setup_restaurant_reservation_table()

boto3.setup_default_session(region_name=os.getenv('AWS_REGION'))

# Initialize DynamoDB client
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.getenv('DYNAMODB_TABLE_NAME'))

# aws dynamodb scan --table-name RestaurantBookings
# aws dynamodb list-tables