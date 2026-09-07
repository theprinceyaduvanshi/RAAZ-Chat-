# RAAZ V15 — Final Functional Stability Update

V14 base preserved. This release hardens existing functionality before the final Firebase Console phase.

## Included
- Direct Profile navigation from bottom navigation
- Feed post engagement hydration protection
- Follow/unfollow double-tap protection + error feedback
- Followers/following list retry/error states
- Blocked-list listener cleanup + retry state
- Message-request listener cleanup + retry state
- Chat-list synchronous failure fallback
- Communities/Notes error visibility
- Canonical Create → Note path loads Notes
- Escape-to-close for modal/sheet overlays
- Correct Primary chat section visibility logic
- Heartbeat interval cleanup
- V15 asset version bump

## Intentionally NOT changed
Firebase Console Rules, indexes, Auth settings, or external media storage. These are the final backend phase after this code build.
