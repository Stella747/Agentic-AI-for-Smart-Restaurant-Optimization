from strands import tool
from typing import Dict

@tool
def send_notification(recipient: str, subject: str, message: str) -> Dict:
    """
    Sends a notification to the recipient about booking updates.
    """
    try:
        print(f"Notification sent to {recipient}: {subject} - {message}")
        return {"status": "success", "message": "Notification sent successfully"}
    except Exception as e:
        return {"status": "error", "message": str(e)}
