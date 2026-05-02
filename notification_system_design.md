# Vehicle Maintence Notification System Design
**Author:** Hardik Grover (RA2311003011356)

### Overview
The goal is to build a scalable way to alert users when their vehicle is nearing a service milestone. Instead of just checking on-demand, the system needs to be proactive.

### Logic & Workflow
1. **Data Ingestion:** We track odometer readings via the API. If a reading is within 500 miles of a 5k milestone, a trigger is created.
2. **Message Queuing:** To handle millions of users, we shouldn't send emails directly from the main API. I'd use **Redis** or **RabbitMQ** to queue notification tasks. This keeps the app fast.
3. **Worker Services:** Background workers will pick up jobs from the queue and format the messages (Email/SMS).
4. **Delivery:**
   - **Urgent (High):** Send an SMS via Twilio and a Push Notification.
   - **Routine (Normal):** Send a weekly email digest via AWS SES.

### Scalability Plan
- **Database:** Use an indexed column on `miles_to_next_maintenance` to quickly query which users need alerts today.
- **Caching:** Store the last known mileage in **Redis** to avoid hitting the main database for every minor update.
- **Failover:** If the logging service or notification provider is down, the queue will retry the task later (exponential backoff).

*note: i would also add a "snooze" feature so users dont get annoyed by too many alerts.*