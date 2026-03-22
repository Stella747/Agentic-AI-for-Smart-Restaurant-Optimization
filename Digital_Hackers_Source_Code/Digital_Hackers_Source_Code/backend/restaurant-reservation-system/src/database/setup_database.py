import os
import boto3
import time
from dotenv import load_dotenv

class DynamoDBClient:
    def __init__(self):
        self.table_name = os.getenv('DYNAMODB_TABLE_NAME')
        self.dynamodb = boto3.resource('dynamodb', region_name=os.getenv('AWS_REGION'))
        self.table = self.dynamodb.Table(self.table_name)

def setup_restaurant_reservation_table():
    """Create the DynamoDB table for restaurant reservations if it doesn't exist"""
    load_dotenv()
    
    table_name = os.getenv('DYNAMODB_TABLE_NAME')
    region = os.getenv('AWS_REGION')
    
    if not table_name:
        table_name = 'RestaurantBookings'
        print(f"DYNAMODB_TABLE_NAME not found in environment variables. Using default: {table_name}")
    
    if not region:
        region = 'us-east-1'
        print(f"AWS_REGION not found in environment variables. Using default: {region}")
    
    # Initialize boto3 client
    dynamodb = boto3.resource('dynamodb', region_name=region)
    
    # Check if table already exists
    existing_tables = [table.name for table in dynamodb.tables.all()]
    if table_name in existing_tables:
        # print(f"Table '{table_name}' already exists")
        return dynamodb.Table(table_name)
    
    # Create table
    print(f"Creating table '{table_name}'...")
    table = dynamodb.create_table(
        TableName=table_name,
        KeySchema=[
            {
                'AttributeName': 'booking_id',
                'KeyType': 'HASH'  # Partition key
            }
        ],
        AttributeDefinitions=[
            {
                'AttributeName': 'booking_id',
                'AttributeType': 'S'
            },
            {
                'AttributeName': 'customer_email',
                'AttributeType': 'S'
            },
            {
                'AttributeName': 'type',
                'AttributeType': 'S'
            }
        ],
        GlobalSecondaryIndexes=[
            {
                'IndexName': 'CustomerEmailIndex',
                'KeySchema': [
                    {
                        'AttributeName': 'customer_email',
                        'KeyType': 'HASH'
                    }
                ],
                'Projection': {
                    'ProjectionType': 'ALL'
                }
            },
            {
                'IndexName': 'TypeIndex',
                'KeySchema': [
                    {
                        'AttributeName': 'type',
                        'KeyType': 'HASH'
                    }
                ],
                'Projection': {
                    'ProjectionType': 'ALL'
                }
            }
        ],
        BillingMode='PAY_PER_REQUEST'
    )
    
    # Wait for table to be created
    print("Waiting for table to be created (this may take a minute)...")
    table.meta.client.get_waiter('table_exists').wait(TableName=table_name)
    
    print(f"Table '{table_name}' created successfully!")
    return table

def test_dynamodb_connection():
    """Test the DynamoDB connection using the DynamoDBClient class"""
    try:
        client = DynamoDBClient()
        print(f"Successfully connected to DynamoDB table: {client.table_name}")
        print("Running a test scan operation...")
        
        # Perform a scan operation to test the connection
        response = client.table.scan(Limit=1)
        items = response.get('Items', [])
        
        print(f"Scan successful. Found {len(items)} items.")
        if items:
            print("Sample item:")
            print(items[0])
        else:
            print("Table is empty.")
            
        return True
    except Exception as e:
        print(f"Error connecting to DynamoDB: {str(e)}")
        return False

if __name__ == "__main__":
    print("Setting up the Restaurant Reservation DynamoDB table...")
    table = setup_restaurant_reservation_table()
    
    print("\nTesting DynamoDB connection...")
    test_result = test_dynamodb_connection()
    
    if test_result:
        print("\nDatabase setup complete and connection successful!")
    else:
        print("\nDatabase setup completed but connection test failed. Please check your AWS credentials and configuration.")
    
    print("\nYou can now run the main application.")