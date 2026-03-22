from strands import tool
from typing import List, Dict
import datetime

@tool
def analyze_bookings(bookings: List[Dict]) -> Dict:
    """
    Provides insights into booking patterns, guest behavior, and system performance.
    """
    insights = {}
    total_bookings = len(bookings)

    if total_bookings == 0:
        return {"message": "No booking data available for analysis."}

    total_party_size = 0
    booking_hours = []

    for booking in bookings:
        total_party_size += booking.get("party_size", 0)
        booking_time_str = booking.get("booking_time", "00:00")
        try:
            time_obj = datetime.datetime.strptime(booking_time_str, "%H:%M")
            booking_hours.append(time_obj.hour)
        except ValueError:
            continue

    avg_party_size = total_party_size / total_bookings
    hour_counts = {}
    for hour in booking_hours:
        hour_counts[hour] = hour_counts.get(hour, 0) + 1

    peak_hour = max(hour_counts, key=hour_counts.get) if hour_counts else None
    insights["total_bookings"] = total_bookings
    insights["average_party_size"] = avg_party_size
    insights["peak_booking_hour"] = peak_hour
    insights["hourly_distribution"] = hour_counts

    return insights
