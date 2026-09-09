RAAZ V18 - FULL PROFILE MESSAGE SYSTEM REBUILD

Based on the existing RAAZ V17.2 project architecture.

Main V18 fixes:
- Other user's profile always shows Follow + Message together.
- Message button is independent from the old profile action renderer.
- Existing chat opens directly.
- Incoming message request can be accepted and opens chat.
- Outgoing request shows Request Sent and can be cancelled.
- New message request is created with a Firestore batch.
- Removed the old profile action's cross-user blocked-document read, which could cause permission-denied and hide the action area.
- Profile actions are refreshed after request/accept/decline/cancel.
- Self profile never shows Follow/Message actions.
- Fresh user data is loaded when opening a profile.
- Cache-busting updated to V18.

Firebase note:
This version keeps the existing Firebase Auth + Firestore architecture. Firestore Security Rules must allow the signed-in sender to create their own requestsSent document and the recipient's requestsReceived document, and must allow the accepted users to create/update their own chatsList documents.
