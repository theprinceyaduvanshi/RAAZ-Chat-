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


V15.2 REQUEST FIX
- Fixed Message Request flow: removed client-side read of another user's private blocked collection, which was causing permission-denied before request creation.
- Existing Firebase config and architecture preserved.


V15.2 stability/media patch
- Reel publishing no longer stores the original large video directly; client compresses larger videos to a Firestore-safe payload (demo limit 20 seconds).
- Communities and Notes listeners now show Firebase errors instead of failing silently.
- Settings changes show an immediate saved confirmation.
- Asset version bumped to 15.2.0.
- Large production video storage still requires object storage; Firebase Cloud Storage currently requires Blaze.

V15.3 FULL CODE AUDIT + BUG FIXES
- Fixed My Posts shortcut so it actually loads the signed-in user's posts (up to 100) instead of being reset to the normal feed.
- Post options menu now opens for every post, so Report is reachable for other users' posts.
- Fixed chat message rendering to escape text safely.
- Added safer error handling for post comments and engagement actions.
- Made follow/unfollow, message requests, request acceptance/decline, and chat-list preview writes atomic where possible using Firestore batches.
- Added send-message/photo-send error feedback instead of silent failures.
- Chat header menu now detects Primary/Secondary category correctly.
- Repost now avoids duplicate repost notifications.
- Explore hashtag results are clickable and return to hashtag posts.
- Community creation now writes the group and owner membership atomically.
- Reel/Community/Notes modal overlays can close by tapping outside.
- Reel autoplay setting now takes effect immediately.
- Notifications listener and Mark-all-read now expose errors instead of failing silently.
- Logout now cleans up feature listeners and the reel IntersectionObserver.

AUDIT STATUS
- JavaScript syntax check: PASS
- HTML duplicate-ID check: PASS
- ZIP integrity check: PASS
- Firebase live read/write behavior still depends on the published Firebase project/rules and real-device testing.
- Production video storage remains the main architectural limitation while RAAZ uses Firestore-based demo video payloads.
