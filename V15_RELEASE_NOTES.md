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


V15.4 UX + CHAT/VIEWERS POLISH
- Feed All / Following / Saved toolbar now stays pinned to the top of the feed scroll area.
- Reel likes no longer attempt an unauthorized parent-document update; likes are sourced from the reel likes subcollection, fixing the permission-denied like error under the published rules.
- Reel comment count no longer requires an unauthorized parent update.
- Story viewer count is now tappable; a dedicated Story viewers screen lists viewers with name, @username and view time.
- Tapping a story viewer opens that user's profile.
- Back buttons are visually consistent and moved to the left on feature screens; browser/Android back handling is improved.
- Chat list now shows numeric unread counts and a total unread badge on the Chats bottom-nav item.
- Incoming chat messages create an upper notification entry and increment the recipient's chat unread count.
- Opening a chat immediately clears its unread count and marks messages seen; live incoming messages update seen state, so sender ticks can change to ✓✓ without leaving the chat.
- Message rendering now preserves scroll position when the user is reading older messages; new messages only auto-scroll when already near the bottom.
- Typing indicator writes are debounced and clear quickly on blur/send for smoother real-time behaviour.
- Online/last-active status remains live and refreshes every few seconds.
- Notification types/icons/text improved for chat, reel like/comment, story reply and repost.

V15.4 FINAL CHECK
- Reels like/comment permission issue fixed at the client architecture level by using likes/comments subcollections as the engagement source of truth; the current published rules no longer need reel parent likeCount/commentCount writes from other users.
- Chat unread count is now numeric and works for Primary and Secondary chats.
- Activity status is synced to the user profile so other users can see Online / Active Xm ago / Active Xh ago, or Activity status off.

V16 CHAT ENGAGEMENT + GAME CENTER
- Added swipe-right reply to any chat message.
- Added double-tap message reactions with quick emoji picker.
- Added reaction counts and personal reaction highlighting.
- Added reply quotes that jump back to the original message.
- Photo messages can also be sent as replies.
- Improved chat scroll anchoring so incoming messages do not unexpectedly move the user's reading position.
- Added RAAZ Game Center with Ludo, 2048 Infinite and Neon Rush.
- Ludo supports solo play against RAAZ Bot and friend-room multiplayer.
- Friend Ludo room search avoids an unnecessary composite Firestore index.
- Added V16 Firestore rule additions for secure message reactions and friend Ludo.
- Existing architecture and Firebase compat SDK remain unchanged.


V16.1 UI / GAME NAV FIX
- Fixed Game Center discoverability by adding Games to the primary bottom navigation.
- Game Center remains available from Home promo and More drawer.
- Added Games navigation handling to both navigation layers and feature hiding.
- Hardened key header/game/navigation icons against HTML preview encoding/mojibake by replacing emoji-only controls with safe text/SVG UI.
- Bumped assets to 16.1.0 to prevent stale cached UI.

V16.2 GAME CENTER + LUDO POLISH
- Replaced Neon Rush with Stack Tower, an endless timing/stacking game with combo, level and best-score progression.
- Removed emoji-dependent Game Center controls and replaced primary navigation/header controls with SVG-safe icons to avoid mojibake in file previews.
- Bottom navigation now has a dedicated, visually highlighted Games button with a real gamepad icon.
- Home Game Center promo now advertises Ludo, 2048 and Stack Tower.
- Upgraded Ludo presentation with player chips, turn pill, home-score indicators, animated dice feedback, richer board colors and safer visual zones.
- Friend Ludo room codes now use the 6-character code as the games document ID, avoiding a roomCode query that could fail Firestore rule query constraints.
- Preserved existing Bot Ludo, Friend Ludo, 2048, chat replies/reactions and Firebase architecture.

V16.3 UNIVERSAL ICON + BACK NAVIGATION FIX
- Removed source-level UI symbols that were appearing as mojibake/garbled letters in Android file previews.
- Replaced page back arrows with a real inline SVG back icon, so the icon renders consistently without encoding dependency.
- Replaced remaining visible emoji/symbol UI labels in HTML/JS with ASCII-safe labels/entities while preserving the existing functionality.
- Added a universal page back handler for Profile, other profiles, Requests, Blocked, People, Explore, Reels, Communities, Notes, Settings, Games and Chat.
- Android/browser back now closes the top overlay first, then navigates the current RAAZ screen instead of leaving the user stuck.
- Game Center back now returns from an active game to Game Center first, then from Game Center to Home.
- Preserved existing Firebase architecture and V16 chat/game functionality.

V16.4 COMPLETE POLISH + FUNCTIONAL AUDIT
- Removed remaining mojibake-prone HTML entities and source-level non-ASCII UI symbols from the current UI files.
- Replaced chat attachment text with a compact SVG attachment icon so it no longer overlaps the message field on narrow phones.
- Replaced message reaction words with real emoji reactions generated at runtime: heart, laugh, wow, sad, angry and like. Legacy LOVE/LOL/WOW/SAD/ANGRY/LIKE reaction values are normalized for display.
- Clamped the reaction picker to the viewport and made it a compact six-button emoji bar.
- Fixed the Ludo bot turn bug: the bot now moves its selected pawn instead of calling the human-only move handler.
- Fixed bot extra-turn behavior after rolling 6 without a legal move.
- Added separate user/opponent dice areas; the user's Roll control stays on the user's side and the opponent's last roll is shown on the opposite side.
- Upgraded the Ludo logical path from a simple outer square to a 52-cell 15x15 cross-style track and cleaned pawn labels to numbered tokens.
- Friend room input is now exactly six alphanumeric characters and room lookup uses the room document ID directly.
- Fixed universal back navigation recursion: back handlers now navigate directly instead of calling themselves through programmatic button clicks.
- Added safer browser/Android history entries for app pages and secondary screens.
- Feature page headers now keep the Back icon on the left for consistent navigation.
- Removed duplicated/legacy wording such as "EDIT ... Edit Karo", "POSTS My Posts", "Saved Save", "Repost Repost" and similar labels.
- Fixed the visible online status duplication from "Online Online" to "Online".
- Made block cleanup respect the client security boundary instead of attempting forbidden writes into another user's private collections.
- Added SVG back icons to game sub-panels and story navigation controls.

AUDIT CHECKS
- JavaScript syntax: PASS
- HTML duplicate IDs: PASS
- Source files ASCII-safe for preview encoding: PASS
- V16.4 bot-turn logic reviewed: PASS
- V16.4 navigation recursion removed: PASS
- Firebase-dependent behavior still requires the final published Firestore rules and real two-device testing, especially friend Ludo and message reactions.


V17 PROFESSIONAL PROFILE + FINAL UX HARDENING
- Replaced the legacy profile presentation with an Instagram-style profile layout for both self and other users.
- Added live Posts/Reels tabs and a professional dashboard for Total Views, Likes, Comments and Shares on the user's own content.
- Added real-time profile content listeners so new posts/reels and engagement counts refresh without reopening the profile.
- Added post/reel viewCount and shareCount updates from the active feed/reel experiences.
- Prevented self-follow at the UI and action layer.
- Made user identity rows/cards open the selected user's profile.
- Reworked Create and More sheets with fixed icon/text columns to eliminate label overlap on small screens.
- Replaced legacy back-button listeners with deterministic page/overlay navigation and Escape/back handling.
- Added stronger profile, analytics and content-grid mobile responsiveness.

V17 QA
- JavaScript syntax check: PASS
- HTML duplicate-ID check: verified after profile replacement
- UTF-8 source files retained; user-visible mojibake-prone icon strings removed from the affected sheets


V17.1 FINAL UI/NAVIGATION HARDENING
- Replaced Create and More sheet text/symbol layout with stable grid + SVG icons.
- Removed legacy competing popstate handlers; one navigation router now owns page Back behavior.
- Added consistent Back hit target and hardware/browser back handling.
- Kept V17 Instagram-style profile posts/reels grid and analytics listeners.
- Enforced self-follow protection.
