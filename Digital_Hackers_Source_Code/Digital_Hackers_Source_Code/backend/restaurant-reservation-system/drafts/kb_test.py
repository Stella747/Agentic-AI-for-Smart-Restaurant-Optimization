from prereqs.knowledge_base import KnowledgeBasesForAmazonBedrock
# from agent import invoke_agent_helper
import boto3
import time
import os

########################################################################################

iam_client = boto3.client('iam')
s3_client = boto3.client('s3')
sts_client = boto3.client('sts')
session = boto3.session.Session()
region = session.region_name
account_id = sts_client.get_caller_identity()["Account"]

########################################################################################

suffix = f"{region}-{account_id}"
agent_name = 'resto-mgmt-syst'
knowledge_base_name = f'{agent_name}-kb'
knowledge_base_description = "Knowledge Base containing the restaurant menu's collection, seating layout, and historical data."
bucket_name = f'{agent_name}-{suffix}'

########################################################################################

kb = KnowledgeBasesForAmazonBedrock()

# Delete the knowledge base if it already exists
# kb.delete_kb("resto-mgmt-agent-kb")
# kb.delete_kb("resto-mgmt-syst-kb")


kb_id, ds_id = kb.create_or_retrieve_knowledge_base(knowledge_base_name, knowledge_base_description, bucket_name)


########################################################################################

def upload_directory(path, bucket_name):
    # Get the list of existing files in the bucket
    existing_files = set()
    response = s3_client.list_objects_v2(Bucket=bucket_name)
    if 'Contents' in response:
        existing_files = {obj['Key'] for obj in response['Contents']}
    for root, dirs, files in os.walk(path):
        for file in files:
            file_to_upload = os.path.join(root, file)
            s3_key = file  # You may want to adjust this if you want to preserve directory structure
            if s3_key in existing_files:
                print(f"Skipping upload for {file_to_upload} (already exists in {bucket_name})")
                continue
            print(f"Uploading file {file_to_upload} to {bucket_name}")
            s3_client.upload_file(file_to_upload, bucket_name, s3_key)

########################################################################################

# Function to delete all objects in the S3 bucket
def delete_all_objects(bucket_name):
    
    paginator = s3_client.get_paginator('list_objects_v2')
    for page in paginator.paginate(Bucket=bucket_name):
        if 'Contents' in page:
            delete_keys = [{'Key': obj['Key']} for obj in page['Contents']]
            s3_client.delete_objects(Bucket=bucket_name, Delete={'Objects': delete_keys})
    print(f"All objects in bucket '{bucket_name}' have been deleted.")

#########################################################################################

def main():

    # Upload the knowledge base files
    kb_files = os.path.abspath("prereqs/kb_files")
    if not os.path.exists(kb_files):
        print(f"Directory {kb_files} does not exist. Please create it and add files.")

    else:
        # Clear the bucket before uploading new files
        if s3_client.head_bucket(Bucket=bucket_name):
            print(f"Bucket {bucket_name} already exists. Clearing it before uploading new files.")
            print(f"Clearing S3 bucket {bucket_name}")
            delete_all_objects(bucket_name)
            time.sleep(10)  # Wait for the bucket to be cleared
        # Upload the knowledge base files to the S3 bucket
        print(f"Uploading files from {kb_files} to S3 bucket {bucket_name} ...")
        upload_directory(kb_files, bucket_name)

    print("Knowledge Base created successfully. ID:", kb_id)
    print("Data Source. ID:", ds_id)

    s3_objects = s3_client.list_objects_v2(Bucket=bucket_name)
    if 'Contents' in s3_objects:
        print(f"Files in S3 bucket {bucket_name}:")
        for obj in s3_objects['Contents']:
            print(f"- {obj['Key']}")

    # Set the environment variable for the knowledge base ID
    os.environ["KNOWLEDGE_BASE_ID"] = kb_id
    os.environ["STRANDS_KNOWLEDGE_BASE_ID"] = kb_id

    # Checking the environment variable
    print("Knowledge Base ID set in environment variable: ", os.environ.get("KNOWLEDGE_BASE_ID"))

    # synchronise the knowledge base
    kb.synchronize_data(kb_id, ds_id)

if __name__ == "__main__":
    main()

# This code is for creating and managing a knowledge base in Amazon Bedrock using boto3.



