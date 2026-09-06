// ================= STATE MANAGEMENT =================
const state = {
  currentUserName: "",
  currentUsername: "",
  currentPhotoBase64: null,
  currentBio: "",
  currentChatId: null,
  currentFriendUid: null,
  currentFriendName: "",
  currentFriendUsername: "",
  theme: "dark",
  statusWatchers: {},
  heartbeatTimer: null,
  typingTimer: null,
  searchTimer: null,
  messageUnsubscribers: {},
  statusUnsubscribers: {},
  recording: false,
  mediaRecorder: null,
  audioChunks: [],
  recordingTimer: null,
  pendingStatusPhoto: null,
  pendingStatusVideo: null,
  pendingPostPhoto: null,
  pendingPostVideo: null,
  deferredPrompt: null,
  callTimer: null,
  callSeconds: 0
};

// ================= DOM ELEMENTS =================
const elements = {
  splash: document.getElementById('splashScreen'),
  auth: document.getElementById('authScreen'),
  home: document.getElementById('homeScreen'),
  search: document.getElementById('searchScreen'),
  chat: document.getElementById('chatScreen'),
  profile: document.getElementById('profileScreen'),
  feed: document.getElementById('feedScreen'),
  nameInput: document.getElementById('nameInput'),
  usernameInput: document.getElementById('usernameInput'),
  emailInput: document.getElementById('emailInput'),
  passInput: document.getElementById('passInput'),
  authError: document.getElementById('authError'),
  signupBtn: document.getElementById('signupBtn'),
  loginBtn: document.getElementById('loginBtn'),
  themeToggle: document.getElementById('themeToggle'),
  requestsBtn: document.getElementById('requestsBtn'),
  requestsBadge: document.getElementById('requestsBadge'),
  profileBtn: document.getElementById('profileBtn'),
  logoutBtn: document.getElementById('logoutBtn'),
  friendUsernameInput: document.getElementById('friendUsernameInput'),
  searchResultsList: document.getElementById('searchResultsList'),
  chatListPrimary: document.getElementById('chatListPrimary'),
  chatListSecondary: document.getElementById('chatListSecondary'),
  chatListEmpty: document.getElementById('chatListEmpty'),
  backBtn: document.getElementById('backBtn'),
  chatHeaderAvatar: document.getElementById('chatHeaderAvatar'),
  friendNameDisplay: document.getElementById('friendNameDisplay'),
  friendStatus: document.getElementById('friendStatus'),
  chatMenuBtn: document.getElementById('chatMenuBtn'),
  voiceCallBtn: document.getElementById('voiceCallBtn'),
  messages: document.getElementById('messages'),
  msgInput: document.getElementById('msgInput'),
  sendBtn: document.getElementById('sendBtn'),
  attachBtn: document.getElementById('attachBtn'),
  chatPhotoInput: document.getElementById('chatPhotoInput'),
  chatVideoInput: document.getElementById('chatVideoInput'),
  micBtn: document.getElementById('micBtn'),
  profileBackBtn: document.getElementById('profileBackBtn'),
  profileAvatar: document.getElementById('profileAvatar'),
  profileName: document.getElementById('profileName'),
  profileUsername: document.getElementById('profileUsername'),
  profileEmail: document.getElementById('profileEmail'),
  bioDisplay: document.getElementById('bioDisplay'),
  editBioBtn: document.getElementById('editBioBtn'),
  editBioBox: document.getElementById('editBioBox'),
  newBioInput: document.getElementById('newBioInput'),
  saveBioBtn: document.getElementById('saveBioBtn'),
  blockedListBtn: document.getElementById('blockedListBtn'),
  qrcodeBox: document.getElementById('qrcodeBox'),
  shareAppBtn: document.getElementById('shareAppBtn'),
  chatItemMenuOverlay: document.getElementById('chatItemMenuOverlay'),
  moveCategoryBtn: document.getElementById('moveCategoryBtn'),
  blockFromMenuBtn: document.getElementById('blockFromMenuBtn'),
  deleteChatBtn: document.getElementById('deleteChatBtn'),
  closeMenuBtn: document.getElementById('closeMenuBtn'),
  toast: document.getElementById('toast'),
  statusList: document.getElementById('statusList'),
  myStatusAvatar: document.getElementById('myStatusAvatar'),
  myStatusItem: document.getElementById('myStatusItem'),
  statusViewScreen: document.getElementById('statusViewScreen'),
  statusImage: document.getElementById('statusImage'),
  statusText: document.getElementById('statusText'),
  statusTime: document.getElementById('statusTime'),
  statusViews: document.getElementById('statusViews'),
  closeStatusBtn: document.getElementById('closeStatusBtn'),
  statusCreateModal: document.getElementById('statusCreateModal'),
  statusTextInput: document.getElementById('statusTextInput'),
  statusPhotoBtn: document.getElementById('statusPhotoBtn'),
  statusVideoBtn: document.getElementById('statusVideoBtn'),
  statusTextBtn: document.getElementById('statusTextBtn'),
  statusPhotoInput: document.getElementById('statusPhotoInput'),
  statusVideoInput: document.getElementById('statusVideoInput'),
  postStatusBtn: document.getElementById('postStatusBtn'),
  cancelStatusBtn: document.getElementById('cancelStatusBtn'),
  callScreen: document.getElementById('callScreen'),
  callAvatar: document.getElementById('callAvatar'),
  callName: document.getElementById('callName'),
  callStatus: document.getElementById('callStatus'),
  callTimer: document.getElementById('callTimer'),
  muteBtn: document.getElementById('muteBtn'),
  endCallBtn: document.getElementById('endCallBtn'),
  speakerBtn: document.getElementById('speakerBtn'),
  recordingIndicator: document.getElementById('recordingIndicator'),
  recordingTimer: document.getElementById('recordingTimer'),
  installPrompt: document.getElementById('installPrompt'),
  installBtn: document.getElementById('installBtn'),
  dismissInstallBtn: document.getElementById('dismissInstallBtn'),
  navChats: document.getElementById('navChats'),
  navSearch: document.getElementById('navSearch'),
  navFeed: document.getElementById('navFeed'),
  navCalls: document.getElementById('navCalls'),
  navProfile: document.getElementById('navProfile'),
  searchBackBtn: document.getElementById('searchBackBtn'),
  searchUsernameInput: document.getElementById('searchUsernameInput'),
  searchUserResults: document.getElementById('searchUserResults'),
  feedBackBtn: document.getElementById('feedBackBtn'),
  createPostBtn: document.getElementById('createPostBtn'),
  feedContent: document.getElementById('feedContent'),
  createPostModal: document.getElementById('createPostModal'),
  postCaptionInput: document.getElementById('postCaptionInput'),
  postPhotoBtn: document.getElementById('postPhotoBtn'),
  postVideoBtn: document.getElementById('postVideoBtn'),
  postPhotoInput: document.getElementById('postPhotoInput'),
  postVideoInput: document.getElementById('postVideoInput'),
  publishPostBtn: document.getElementById('publishPostBtn'),
  cancelPostBtn: document.getElementById('cancelPostBtn'),
  uploadPhotoBtn: document.getElementById('uploadPhotoBtn'),
  profilePhotoInput: document.getElementById('profilePhotoInput'),
  followersScreen: document.getElementById('followersScreen'),
  followersBackBtn: document.getElementById('followersBackBtn'),
  followersList: document.getElementById('followersList'),
  followingScreen: document.getElementById('followingScreen'),
  followingBackBtn: document.getElementById('followingBackBtn'),
  followingList: document.getElementById('followingList')
};

// ================= INITIALIZATION =================
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
});

function initializeApp() {
  loadTheme();
  setTimeout(() => {
    elements.splash.classList.add('splashHide');
    setTimeout(() => elements.splash.style.display = 'none', 800);
  }, 2000);
  firebase.auth().onAuthStateChanged(handleAuthState);
  setupEventListeners();
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
  setupInstallPrompt();
}

// ================= THEME =================
function loadTheme() {
  const savedTheme = localStorage.getItem('raaz-theme') || 'dark';
  applyTheme(savedTheme);
}
function applyTheme(theme) {
  state.theme = theme;
  document.body.classList.toggle('light-theme', theme === 'light');
  elements.themeToggle.textContent = theme === 'dark' ? '🌙' : '☀️';
  localStorage.setItem('raaz-theme', theme);
}

// ================= INSTALL PROMPT =================
function setupInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    state.deferredPrompt = e;
    elements.installPrompt.classList.remove('hidden');
  });
  elements.installBtn.addEventListener('click', async () => {
    if (state.deferredPrompt) {
      state.deferredPrompt.prompt();
      await state.deferredPrompt.userChoice;
      state.deferredPrompt = null;
      elements.installPrompt.classList.add('hidden');
    }
  });
  elements.dismissInstallBtn.addEventListener('click', () => {
    elements.installPrompt.classList.add('hidden');
  });
}

// ================= AUTH =================
async function handleAuthState(user) {
  if (user) {
    const userDoc = await db.collection('users').doc(user.uid).get();
    if (userDoc.exists) {
      state.currentUserName = userDoc.data().name || user.displayName || '';
      state.currentUsername = userDoc.data().username || '';
      state.currentPhotoBase64 = userDoc.data().photoBase64 || null;
      state.currentBio = userDoc.data().bio || '';
    }
    showScreen(elements.home);
    startHeartbeat();
    listenForChatList();
    listenForRequests();
    listenForStatus();
    listenForFeed();
    updateProfileUI();
    setupPermissions();
    listenForIncomingCalls();
  } else {
    showScreen(elements.auth);
    cleanupServices();
  }
}

// ================= EVENT LISTENERS =================
function setupEventListeners() {
  elements.signupBtn.addEventListener('click', handleSignup);
  elements.loginBtn.addEventListener('click', handleLogin);
  elements.themeToggle.addEventListener('click', () => applyTheme(state.theme === 'dark' ? 'light' : 'dark'));
  elements.profileBtn.addEventListener('click', showProfile);
  elements.profileBackBtn.addEventListener('click', () => showScreen(elements.home));
  elements.backBtn.addEventListener('click', closeChat);
  elements.logoutBtn.addEventListener('click', handleLogout);
  elements.shareAppBtn.addEventListener('click', shareApp);
  elements.requestsBtn.addEventListener('click', openRequestsScreen);
  elements.navChats.addEventListener('click', () => showScreen(elements.home));
  elements.navSearch.addEventListener('click', () => showScreen(elements.search));
  elements.navFeed.addEventListener('click', () => showScreen(elements.feed));
  elements.navCalls.addEventListener('click', () => showScreen(elements.callScreen));
  elements.navProfile.addEventListener('click', showProfile);
  elements.searchBackBtn.addEventListener('click', () => showScreen(elements.home));
  elements.searchUsernameInput.addEventListener('input', handleSearchInput);
  elements.friendUsernameInput.addEventListener('input', handleSearchInput);
  elements.sendBtn.addEventListener('click', sendMessage);
  elements.msgInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });
  elements.msgInput.addEventListener('input', handleTyping);
  elements.attachBtn.addEventListener('click', () => elements.chatPhotoInput.click());
  elements.chatPhotoInput.addEventListener('change', handlePhotoUpload);
  elements.chatVideoInput.addEventListener('change', handleVideoUpload);
  elements.micBtn.addEventListener('click', toggleVoiceRecording);
  elements.voiceCallBtn.addEventListener('click', startVoiceCall);
  elements.chatMenuBtn.addEventListener('click', openChatMenu);
  elements.closeMenuBtn.addEventListener('click', closeMenu);
  elements.chatItemMenuOverlay.addEventListener('click', (e) => { if (e.target === elements.chatItemMenuOverlay) closeMenu(); });
  elements.moveCategoryBtn.addEventListener('click', moveCategory);
  elements.blockFromMenuBtn.addEventListener('click', blockUserFromMenu);
  elements.deleteChatBtn.addEventListener('click', deleteChat);
  elements.editBioBtn.addEventListener('click', () => {
    elements.newBioInput.value = state.currentBio;
    elements.editBioBox.classList.toggle('hidden');
  });
  elements.saveBioBtn.addEventListener('click', saveBio);
  elements.myStatusItem.addEventListener('click', openMyStatus);
  elements.closeStatusBtn.addEventListener('click', closeStatusView);
  elements.statusPhotoBtn.addEventListener('click', () => elements.statusPhotoInput.click());
  elements.statusVideoBtn.addEventListener('click', () => elements.statusVideoInput.click());
  elements.statusTextBtn.addEventListener('click', () => elements.statusTextInput.focus());
  elements.statusPhotoInput.addEventListener('change', handleStatusPhoto);
  elements.statusVideoInput.addEventListener('change', handleStatusVideo);
  elements.postStatusBtn.addEventListener('click', postStatus);
  elements.cancelStatusBtn.addEventListener('click', () => elements.statusCreateModal.classList.add('hidden'));
  elements.endCallBtn.addEventListener('click', endCall);
  elements.muteBtn.addEventListener('click', toggleMute);
  elements.speakerBtn.addEventListener('click', toggleSpeaker);
  
  // Feed & Posts
  elements.feedBackBtn.addEventListener('click', () => showScreen(elements.home));
  elements.createPostBtn.addEventListener('click', () => elements.createPostModal.classList.remove('hidden'));
  elements.postPhotoBtn.addEventListener('click', () => elements.postPhotoInput.click());
  elements.postVideoBtn.addEventListener('click', () => elements.postVideoInput.click());
  elements.postPhotoInput.addEventListener('change', handlePostPhoto);
  elements.postVideoInput.addEventListener('change', handlePostVideo);
  elements.publishPostBtn.addEventListener('click', publishPost);
  elements.cancelPostBtn.addEventListener('click', () => elements.createPostModal.classList.add('hidden'));
  
  // Profile Photo
  elements.uploadPhotoBtn.addEventListener('click', () => elements.profilePhotoInput.click());
  elements.profilePhotoInput.addEventListener('change', handleProfilePhoto);
  
  // Followers / Following
  elements.followersStatItem.addEventListener('click', () => showFollowersScreen());
  elements.followingStatItem.addEventListener('click', () => showFollowingScreen());
  elements.followersBackBtn.addEventListener('click', () => showScreen(elements.profile));
  elements.followingBackBtn.addEventListener('click', () => showScreen(elements.profile));
}

// ================= NAVIGATION =================
function showScreen(screen) {
  [elements.auth, elements.home, elements.search, elements.chat, elements.profile, elements.feed, elements.followersScreen, elements.followingScreen].forEach(s => s.classList.add('hidden'));
  screen.classList.remove('hidden');
}

// ================= SIGNUP =================
async function handleSignup() {
  const name = elements.nameInput.value.trim();
  const username = elements.usernameInput.value.trim().toLowerCase();
  const email = elements.emailInput.value.trim();
  const pass = elements.passInput.value.trim();
  if (!name || !username || !email || !pass) { elements.authError.textContent = 'Sab fields bharo!'; return; }
  if (username.includes(' ')) { elements.authError.textContent = 'Username me space nahi ho sakta!'; return; }
  if (pass.length < 6) { elements.authError.textContent = 'Password kam se kam 6 characters ka ho!'; return; }
  elements.authError.textContent = 'Create ho raha hai...';
  try {
    const existing = await db.collection('users').where('username', '==', username).get();
    if (!existing.empty) { elements.authError.textContent = 'Ye username already liya gaya hai!'; return; }
    const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, pass);
    await userCredential.user.updateProfile({ displayName: name });
    await db.collection('users').doc(userCredential.user.uid).set({ name, username, email, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
    elements.authError.textContent = '';
  } catch (err) {
    elements.authError.textContent = err.message;
  }
}

// ================= LOGIN =================
async function handleLogin() {
  const email = elements.emailInput.value.trim();
  const pass = elements.passInput.value.trim();
  if (!email || !pass) { elements.authError.textContent = 'Email aur password daalo!'; return; }
  try {
    await firebase.auth().signInWithEmailAndPassword(email, pass);
  } catch (err) {
    elements.authError.textContent = err.message;
  }
}

// ================= LOGOUT =================
function handleLogout() {
  cleanupServices();
  firebase.auth().signOut();
}

// ================= HEARTBEAT =================
function startHeartbeat() {
  updateLastSeen();
  state.heartbeatTimer = setInterval(() => { if (firebase.auth().currentUser) updateLastSeen(); }, 15000);
}
function updateLastSeen() {
  db.collection('users').doc(firebase.auth().currentUser.uid).update({ lastSeen: firebase.firestore.FieldValue.serverTimestamp() }).catch(() => {});
}
function cleanupServices() {
  if (state.heartbeatTimer) clearInterval(state.heartbeatTimer);
  if (state.typingTimer) clearTimeout(state.typingTimer);
  if (state.recordingTimer) clearInterval(state.recordingTimer);
  if (state.callTimer) clearInterval(state.callTimer);
  Object.values(state.messageUnsubscribers).forEach(unsub => unsub());
  Object.values(state.statusUnsubscribers).forEach(unsub => unsub());
  state.messageUnsubscribers = {};
  state.statusUnsubscribers = {};
}

// ================= CHAT LIST =================
function listenForChatList() {
  const uid = firebase.auth().currentUser.uid;
  db.collection('users').doc(uid).collection('chatsList').orderBy('lastMessageTime', 'desc').onSnapshot((snapshot) => {
    elements.chatListPrimary.innerHTML = '';
    elements.chatListSecondary.innerHTML = '';
    let primaryCount = 0, secondaryCount = 0;
    snapshot.forEach(doc => {
      const data = doc.data();
      const category = data.category === 'secondary' ? 'secondary' : 'primary';
      const isUnread = category === 'primary' && data.lastSenderUid && data.lastSenderUid !== uid && data.lastMessageTime && (!data.myLastRead || data.lastMessageTime.toMillis() > data.myLastRead.toMillis());
      const chatItem = createChatListItem(data, isUnread);
      if (category === 'secondary') { elements.chatListSecondary.appendChild(chatItem); secondaryCount++; }
      else { elements.chatListPrimary.appendChild(chatItem); primaryCount++; }
    });
    elements.chatListEmpty.classList.toggle('hidden', primaryCount + secondaryCount > 0);
    document.getElementById('statsChats').textContent = primaryCount + secondaryCount;
  });
}

function createChatListItem(data, isUnread) {
  const item = document.createElement('div');
  item.className = `chat-item ${isUnread ? 'unread' : ''}`;
  let preview = data.lastMessage || 'Naya connection - message bhejo!';
  if (data.lastMessageType === 'voice') preview = '🎤 ' + preview;
  else if (data.lastMessageType === 'image') preview = '📷 ' + preview;
  else if (data.lastMessageType === 'video') preview = '🎥 ' + preview;
  item.innerHTML = `
    <div class="chat-avatar">${data.friendName.charAt(0).toUpperCase()}</div>
    <div class="chat-info"><div class="chat-name">${data.friendName}</div><div class="chat-preview">${preview}</div></div>
    <div class="chat-meta"><div class="chat-time">${formatTime(data.lastMessageTime)}</div>${isUnread ? '<div class="unread-badge">Naya</div>' : ''}</div>
    <button class="chat-item-menu" onclick="event.stopPropagation(); openChatItemMenu('${data.friendUid}', '${data.friendName}', '${data.friendUsername}', '${data.category || 'primary'}')">⋮</button>
  `;
  item.addEventListener('click', () => openChat(data.friendUid, data.friendName, data.friendUsername));
  return item;
}

// ================= SEARCH =================
function handleSearchInput() {
  clearTimeout(state.searchTimer);
  const q = elements.searchUsernameInput.value.trim().toLowerCase();
  if (!q) { elements.searchUserResults.innerHTML = ''; return; }
  state.searchTimer = setTimeout(() => performSearch(q), 300);
}

async function performSearch(q) {
  const myUid = firebase.auth().currentUser.uid;
  elements.searchUserResults.innerHTML = '<div class="empty-state"><div class="spinner"></div><p>Dhundh rahe hain...</p></div>';
  try {
    const result = await db.collection('users').where('username', '>=', q).where('username', '<=', q + '\uf8ff').limit(20).get();
    const matches = result.docs.filter(doc => doc.id !== myUid);
    if (matches.length === 0) { elements.searchUserResults.innerHTML = '<div class="empty-state"><p>Koi user nahi mila</p></div>'; return; }
    elements.searchUserResults.innerHTML = '';
    matches.forEach(doc => {
      const data = doc.data();
      const item = document.createElement('div');
      item.className = 'chat-item';
      item.innerHTML = `<div class="chat-avatar">${data.name.charAt(0).toUpperCase()}</div><div class="chat-info"><div class="chat-name">${data.name}</div><div class="chat-preview">@${data.username}</div></div><button class="btn-primary" style="padding:8px 12px; font-size:12px;" onclick="sendMessageRequest('${doc.id}', '${data.name}', '${data.username}')">Message</button>`;
      elements.searchUserResults.appendChild(item);
    });
  } catch (err) { elements.searchUserResults.innerHTML = '<div class="empty-state"><p>Search me dikkat hui</p></div>'; }
}

async function sendMessageRequest(toUid, toName, toUsername) {
  const myUid = firebase.auth().currentUser.uid;
  const chatId = getChatId(myUid, toUid);
  const chatDoc = await db.collection('users').doc(myUid).collection('chatsList').doc(chatId).get();
  if (chatDoc.exists) { openChat(toUid, toName, toUsername); return; }
  const blockedDoc = await db.collection('users').doc(myUid).collection('blocked').doc(toUid).get();
  if (blockedDoc.exists) { showToast('Is user ko block kiya hai aapne', 'error'); return; }
  await db.collection('users').doc(myUid).collection('requestsSent').doc(toUid).set({ toUid, toName, toUsername, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
  await db.collection('users').doc(toUid).collection('requestsReceived').doc(myUid).set({ fromUid: myUid, fromName: state.currentUserName, fromUsername: state.currentUsername, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
  showToast('Request bhej di! 📨', 'success');
}

// ================= REQUESTS =================
function listenForRequests() {
  const uid = firebase.auth().currentUser.uid;
  db.collection('users').doc(uid).collection('requestsReceived').onSnapshot(snapshot => {
    elements.requestsBadge.textContent = snapshot.size;
    elements.requestsBadge.classList.toggle('hidden', snapshot.size === 0);
  });
}

// ================= OPEN REQUESTS SCREEN =================
function openRequestsScreen() {
  const myUid = firebase.auth().currentUser.uid;
  
  db.collection('users').doc(myUid).collection('requestsReceived')
    .orderBy('createdAt', 'desc')
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        showToast('📭 Koi request nahi hai', 'info');
        return;
      }
      
      const requests = snapshot.docs.map(doc => doc.data());
      
      for (const request of requests) {
        const accept = confirm(`📨 ${request.fromName} (@${request.fromUsername}) ne request bheji hai. Accept karo?`);
        if (accept) {
          acceptRequest(request.fromUid, request.fromName, request.fromUsername);
        } else {
          declineRequest(request.fromUid);
        }
      }
    })
    .catch((err) => {
      showToast('Error: ' + err.message, 'error');
    });
}

async function acceptRequest(fromUid, fromName, fromUsername) {
  const myUid = firebase.auth().currentUser.uid;
  const chatId = getChatId(myUid, fromUid);
  
  await db.collection('users').doc(myUid).collection('requestsReceived').doc(fromUid).delete();
  await db.collection('users').doc(fromUid).collection('requestsSent').doc(myUid).delete();
  
  await db.collection('users').doc(myUid).collection('chatsList').doc(chatId).set({
    friendUid: fromUid,
    friendName: fromName,
    friendUsername: fromUsername,
    lastMessage: "",
    lastMessageTime: firebase.firestore.FieldValue.serverTimestamp(),
    lastSenderUid: null,
    category: "primary"
  }, { merge: true });
  
  await db.collection('users').doc(fromUid).collection('chatsList').doc(chatId).set({
    friendUid: myUid,
    friendName: state.currentUserName,
    friendUsername: state.currentUsername,
    lastMessage: "",
    lastMessageTime: firebase.firestore.FieldValue.serverTimestamp(),
    lastSenderUid: null,
    category: "primary"
  }, { merge: true });
  
  showToast('✅ Request accept ho gayi!', 'success');
}

async function declineRequest(fromUid) {
  const myUid = firebase.auth().currentUser.uid;
  await db.collection('users').doc(myUid).collection('requestsReceived').doc(fromUid).delete();
  await db.collection('users').doc(fromUid).collection('requestsSent').doc(myUid).delete();
  showToast('✖ Request decline ho gayi', 'info');
}

// ================= CHAT =================
async function openChat(friendUid, friendName, friendUsername) {
  const myUid = firebase.auth().currentUser.uid;
  state.currentChatId = getChatId(myUid, friendUid);
  state.currentFriendUid = friendUid;
  state.currentFriendName = friendName;
  state.currentFriendUsername = friendUsername;
  elements.friendNameDisplay.textContent = friendName;
  elements.chatHeaderAvatar.textContent = friendName.charAt(0).toUpperCase();
  await db.collection('users').doc(myUid).collection('chatsList').doc(state.currentChatId).update({ myLastRead: firebase.firestore.FieldValue.serverTimestamp() });
  showScreen(elements.chat);
  elements.messages.innerHTML = '';
  listenForMessages();
  updateChatStatus();
}

function getChatId(uidA, uidB) { return [uidA, uidB].sort().join('_'); }

// ================= MESSAGES =================
function listenForMessages() {
  const chatId = state.currentChatId;
  if (state.messageUnsubscribers[chatId]) state.messageUnsubscribers[chatId]();
  state.messageUnsubscribers[chatId] = db.collection('chats').doc(chatId).collection('messages').orderBy('createdAt', 'asc').limitToLast(100).onSnapshot(snapshot => {
    elements.messages.innerHTML = '';
    snapshot.forEach(doc => { elements.messages.appendChild(createMessageElement(doc.data())); });
    elements.messages.scrollTop = elements.messages.scrollHeight;
  });
}

function createMessageElement(msg) {
  const myUid = firebase.auth().currentUser.uid;
  const isMine = msg.uid === myUid;
  const el = document.createElement('div');
  el.className = `message ${isMine ? 'mine' : 'theirs'}`;
  let content = '';
  if (msg.imageBase64) content = `<img src="${msg.imageBase64}" class="message-image" alt="photo">`;
  else if (msg.videoBase64) content = `<video src="${msg.videoBase64}" class="message-video" controls></video>`;
  else if (msg.voiceBase64) content = `<div class="voice-message"><button class="voice-play-btn" onclick="playVoiceMessage(this, '${msg.voiceBase64}')">▶️</button><div class="voice-progress"><div class="voice-progress-fill"></div></div><span class="voice-duration">${msg.voiceDuration || '0:00'}</span></div>`;
  else content = `<div class="message-text">${escapeHtml(msg.text || '')}</div>`;
  const time = msg.createdAt ? formatTime(msg.createdAt) : '';
  el.innerHTML = `${!isMine ? `<div class="message-sender">${msg.sender}</div>` : ''}${content}<div class="message-meta"><span>${time}</span>${isMine ? '<span class="message-ticks seen">✓✓</span>' : ''}</div>`;
  return el;
}
function escapeHtml(text) { const div = document.createElement('div'); div.textContent = text; return div.innerHTML; }

// ================= SEND MESSAGE =================
function sendMessage() {
  const text = elements.msgInput.value.trim();
  if (!text || !state.currentChatId) return;
  const myUid = firebase.auth().currentUser.uid;
  clearTypingStatus();
  db.collection('chats').doc(state.currentChatId).collection('messages').add({ text, sender: state.currentUserName, uid: myUid, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
  updateChatListPreview(text, 'text');
  elements.msgInput.value = '';
}

// ================= PHOTO MESSAGE =================
function handlePhotoUpload(e) {
  const file = e.target.files[0];
  if (!file || !state.currentChatId) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    const img = new Image();
    img.onload = () => {
      const maxWidth = 480;
      const scale = Math.min(1, maxWidth / img.width);
      const canvas = document.createElement('canvas');
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
      if (compressedBase64.length > 900000) { showToast('Photo bahut badi hai!', 'error'); return; }
      const myUid = firebase.auth().currentUser.uid;
      db.collection('chats').doc(state.currentChatId).collection('messages').add({ imageBase64: compressedBase64, sender: state.currentUserName, uid: myUid, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
      updateChatListPreview('Photo', 'image');
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
  e.target.value = '';
}

// ================= VIDEO MESSAGE =================
function handleVideoUpload(e) {
  const file = e.target.files[0];
  if (!file || !state.currentChatId) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    const videoBase64 = event.target.result;
    if (videoBase64.length > 200 * 1024 * 1024) { showToast('Video 200MB se badi hai!', 'error'); return; }
    const myUid = firebase.auth().currentUser.uid;
    db.collection('chats').doc(state.currentChatId).collection('messages').add({ videoBase64, sender: state.currentUserName, uid: myUid, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
    updateChatListPreview('Video', 'video');
  };
  reader.readAsDataURL(file);
  e.target.value = '';
}

// ================= VOICE MESSAGE =================
let mediaRecorder = null;
let audioChunks = [];
let isRecording = false;
let recordingStartTime = null;
let recordingInterval = null;

function toggleVoiceRecording() {
  if (!state.currentChatId) return;
  if (isRecording) stopVoiceRecording();
  else startVoiceRecording();
}

async function startVoiceRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];
    mediaRecorder.ondataavailable = (e) => audioChunks.push(e.data);
    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      const reader = new FileReader();
      reader.onload = () => {
        const voiceBase64 = reader.result;
        const duration = Math.max(1, Math.round((Date.now() - recordingStartTime) / 1000));
        const myUid = firebase.auth().currentUser.uid;
        db.collection('chats').doc(state.currentChatId).collection('messages').add({ voiceBase64, voiceDuration: duration, sender: state.currentUserName, uid: myUid, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
        updateChatListPreview('Voice message', 'voice');
      };
      reader.readAsDataURL(audioBlob);
      stream.getTracks().forEach(track => track.stop());
    };
    mediaRecorder.start();
    isRecording = true;
    recordingStartTime = Date.now();
    elements.recordingIndicator.classList.remove('hidden');
    elements.micBtn.classList.add('recording');
    recordingInterval = setInterval(() => {
      const seconds = Math.floor((Date.now() - recordingStartTime) / 1000);
      elements.recordingTimer.textContent = `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
    }, 1000);
    showToast('Recording... (tap karo stop karne ke liye)', 'info');
  } catch (err) { showToast('Microphone access nahi hai', 'error'); }
}

function stopVoiceRecording() {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop();
  isRecording = false;
  elements.recordingIndicator.classList.add('hidden');
  elements.micBtn.classList.remove('recording');
  clearInterval(recordingInterval);
  showToast('Voice message bheja gaya! 🎤', 'success');
}

function playVoiceMessage(btn, base64) {
  try {
    const audio = new Audio(base64);
    const progressFill = btn.parentElement.querySelector('.voice-progress-fill');
    audio.addEventListener('timeupdate', () => { progressFill.style.width = (audio.currentTime / audio.duration) * 100 + '%'; });
    audio.addEventListener('ended', () => { btn.textContent = '▶️'; progressFill.style.width = '0%'; });
    if (audio.paused) { btn.textContent = '⏸️'; audio.play(); }
    else { btn.textContent = '▶️'; audio.pause(); }
  } catch (err) { showToast('Audio play nahi ho sakta', 'error'); }
}

// ================= TYPING =================
function handleTyping() {
  if (!state.currentChatId) return;
  db.collection('chats').doc(state.currentChatId).set({ [`typing_${firebase.auth().currentUser.uid}`]: true }, { merge: true });
  clearTimeout(state.typingTimer);
  state.typingTimer = setTimeout(clearTypingStatus, 2500);
}
function clearTypingStatus() {
  if (!state.currentChatId) return;
  db.collection('chats').doc(state.currentChatId).set({ [`typing_${firebase.auth().currentUser.uid}`]: false }, { merge: true });
}

// ================= CHAT STATUS =================
function updateChatStatus() {
  if (!state.currentFriendUid) return;
  db.collection('users').doc(state.currentFriendUid).onSnapshot(doc => {
    if (!doc.exists) return;
    const data = doc.data();
    const isOnline = data.lastSeen && (Date.now() - data.lastSeen.toMillis()) < 25000;
    if (isOnline) { elements.friendStatus.textContent = '🟢 Online'; elements.friendStatus.className = 'chat-header-status online'; }
    else {
      const lastSeen = data.lastSeen ? data.lastSeen.toDate() : null;
      if (lastSeen) {
        const minsAgo = Math.floor((Date.now() - lastSeen.getTime()) / 60000);
        elements.friendStatus.textContent = minsAgo < 1 ? 'Abhi active tha' : `${minsAgo} min pehle`;
        elements.friendStatus.className = 'chat-header-status';
      }
    }
  });
  
  // Listen for typing
  db.collection('chats').doc(state.currentChatId).onSnapshot(doc => {
    const data = doc.data() || {};
    if (data[`typing_${state.currentFriendUid}`]) {
      elements.friendStatus.textContent = '✍️ Type kar raha hai...';
      elements.friendStatus.className = 'chat-header-status typing';
    }
  });
}

// ================= CHAT LIST PREVIEW =================
function updateChatListPreview(previewText, messageType = 'text') {
  const myUid = firebase.auth().currentUser.uid;
  db.collection('users').doc(myUid).collection('chatsList').doc(state.currentChatId).set({ friendUid: state.currentFriendUid, friendName: state.currentFriendName, friendUsername: state.currentFriendUsername, lastMessage: previewText, lastMessageType: messageType, lastMessageTime: firebase.firestore.FieldValue.serverTimestamp(), lastSenderUid: myUid }, { merge: true });
  db.collection('users').doc(state.currentFriendUid).collection('chatsList').doc(state.currentChatId).set({ friendUid: myUid, friendName: state.currentUserName, friendUsername: state.currentUsername, lastMessage: previewText, lastMessageType: messageType, lastMessageTime: firebase.firestore.FieldValue.serverTimestamp(), lastSenderUid: myUid }, { merge: true });
}

// ================= CLOSE CHAT =================
function closeChat() {
  clearTypingStatus();
  if (state.messageUnsubscribers[state.currentChatId]) { state.messageUnsubscribers[state.currentChatId](); delete state.messageUnsubscribers[state.currentChatId]; }
  state.currentChatId = null;
  state.currentFriendUid = null;
  showScreen(elements.home);
}

// ================= PROFILE =================
function showProfile() {
  const user = firebase.auth().currentUser;
  if (!user) return;
  if (state.currentPhotoBase64) {
    elements.profileAvatar.style.backgroundImage = `url(${state.currentPhotoBase64})`;
    elements.profileAvatar.style.backgroundSize = 'cover';
    elements.profileAvatar.style.backgroundPosition = 'center';
    elements.profileAvatar.textContent = '';
  } else {
    elements.profileAvatar.style.backgroundImage = 'none';
    elements.profileAvatar.textContent = state.currentUserName.charAt(0).toUpperCase();
  }
  elements.profileName.textContent = state.currentUserName;
  elements.profileUsername.textContent = '@' + state.currentUsername;
  elements.profileEmail.textContent = user.email;
  elements.bioDisplay.textContent = state.currentBio || 'Bio nahi likha hai abhi';
  elements.qrcodeBox.innerHTML = '';
  const appUrl = window.location.href.split('?')[0].split('#')[0];
  new QRCode(elements.qrcodeBox, { text: appUrl, width: 160, height: 160, colorDark: '#000000', colorLight: '#ffffff' });
  showScreen(elements.profile);
}

function updateProfileUI() {
  if (state.currentPhotoBase64) {
    elements.profileAvatar.style.backgroundImage = `url(${state.currentPhotoBase64})`;
    elements.profileAvatar.style.backgroundSize = 'cover';
    elements.profileAvatar.style.backgroundPosition = 'center';
    elements.profileAvatar.textContent = '';
  } else {
    elements.profileAvatar.style.backgroundImage = 'none';
    elements.profileAvatar.textContent = state.currentUserName.charAt(0).toUpperCase();
  }
}

// ================= PROFILE PHOTO UPLOAD =================
function handleProfilePhoto(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    const img = new Image();
    img.onload = async () => {
      const maxWidth = 300;
      const scale = Math.min(1, maxWidth / img.width);
      const canvas = document.createElement('canvas');
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
      const uid = firebase.auth().currentUser.uid;
      await db.collection('users').doc(uid).set({ photoBase64: compressedBase64 }, { merge: true });
      state.currentPhotoBase64 = compressedBase64;
      updateProfileUI();
      showToast('Profile photo update ho gayi! ✅', 'success');
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
}

// ================= SAVE BIO =================
async function saveBio() {
  const newBio = elements.newBioInput.value.trim();
  await db.collection('users').doc(firebase.auth().currentUser.uid).set({ bio: newBio }, { merge: true });
  state.currentBio = newBio;
  elements.bioDisplay.textContent = newBio || 'Bio nahi likha hai abhi';
  elements.editBioBox.classList.add('hidden');
  showToast('Bio save ho gaya! ✨', 'success');
}

// ================= SHARE APP =================
async function shareApp() {
  const shareData = { title: 'RAAZ - Private Messenger', text: 'RAAZ app use karo! 🔥', url: window.location.href.split('?')[0].split('#')[0] };
  if (navigator.share) { try { await navigator.share(shareData); } catch (err) {} }
  else { navigator.clipboard.writeText(shareData.url); showToast('Link copy ho gaya! 📋', 'success'); }
}

// ================= STATUS =================
function listenForStatus() {
  const uid = firebase.auth().currentUser.uid;
  db.collection('users').doc(uid).collection('status').orderBy('createdAt', 'desc').limit(20).onSnapshot(snapshot => renderMyStatus(snapshot));
  db.collection('users').doc(uid).collection('chatsList').onSnapshot(async chatSnapshot => {
    const friendUids = chatSnapshot.docs.map(doc => doc.data().friendUid);
    for (const friendUid of friendUids) {
      if (state.statusUnsubscribers[friendUid]) continue;
      state.statusUnsubscribers[friendUid] = db.collection('users').doc(friendUid).collection('status').orderBy('createdAt', 'desc').limit(1).onSnapshot(snapshot => renderFriendStatus(friendUid, snapshot));
    }
  });
}

function renderMyStatus(snapshot) {
  if (snapshot.size > 0) {
    const latestStatus = snapshot.docs[0].data();
    if (latestStatus.imageBase64) {
      elements.myStatusAvatar.style.backgroundImage = `url(${latestStatus.imageBase64})`;
      elements.myStatusAvatar.style.backgroundSize = 'cover';
      elements.myStatusAvatar.style.backgroundPosition = 'center';
      elements.myStatusAvatar.innerHTML = '';
    } else if (latestStatus.videoBase64) {
      elements.myStatusAvatar.style.backgroundImage = `url(${latestStatus.videoBase64})`;
      elements.myStatusAvatar.style.backgroundSize = 'cover';
      elements.myStatusAvatar.style.backgroundPosition = 'center';
      elements.myStatusAvatar.innerHTML = '';
    } else { elements.myStatusAvatar.style.backgroundImage = 'none'; elements.myStatusAvatar.innerHTML = '📸'; }
  } else { elements.myStatusAvatar.style.backgroundImage = 'none'; elements.myStatusAvatar.innerHTML = '+'; }
}

function renderFriendStatus(friendUid, snapshot) {
  const oldItem = document.querySelector(`[data-status-user="${friendUid}"]`);
  if (oldItem) oldItem.remove();
  if (snapshot.size > 0) {
    const friendData = snapshot.docs[0].data();
    const item = document.createElement('div');
    item.className = 'status-item';
    item.dataset.statusUser = friendUid;
    item.innerHTML = `<div class="status-avatar" onclick="viewStatus('${friendUid}')">${friendData.name ? friendData.name.charAt(0).toUpperCase() : '?'}</div><div class="status-name">${friendData.name || 'Friend'}</div>`;
    elements.myStatusItem.parentElement.appendChild(item);
  }
}

function openMyStatus() {
  const uid = firebase.auth().currentUser.uid;
  db.collection('users').doc(uid).collection('status').orderBy('createdAt', 'desc').limit(1).get().then(snapshot => {
    if (snapshot.empty) { elements.statusCreateModal.classList.remove('hidden'); }
    else { viewMyStatus(snapshot.docs[0].data()); }
  }).catch(() => { elements.statusCreateModal.classList.remove('hidden'); });
}

function viewMyStatus(statusData) {
  elements.statusViewScreen.classList.remove('hidden');
  if (statusData.imageBase64) { elements.statusImage.innerHTML = `<img src="${statusData.imageBase64}" style="width:100%; height:100%; object-fit:contain;">`; }
  else if (statusData.videoBase64) { elements.statusImage.innerHTML = `<video src="${statusData.videoBase64}" style="width:100%; height:100%; object-fit:contain;" controls autoplay></video>`; }
  else { elements.statusImage.innerHTML = ''; }
  elements.statusText.textContent = statusData.text || '';
  const time = statusData.createdAt ? formatTime(statusData.createdAt) : '';
  elements.statusTime.textContent = time;
  const views = statusData.views ? statusData.views : 0;
  elements.statusViews.textContent = views + ' Views';
}

function viewStatus(userUid) {
  db.collection('users').doc(userUid).collection('status').orderBy('createdAt', 'desc').limit(1).get().then(snapshot => {
    if (snapshot.empty) return;
    const statusData = snapshot.docs[0].data();
    elements.statusViewScreen.classList.remove('hidden');
    if (statusData.imageBase64) { elements.statusImage.innerHTML = `<img src="${statusData.imageBase64}" style="width:100%; height:100%; object-fit:contain;">`; }
    else if (statusData.videoBase64) { elements.statusImage.innerHTML = `<video src="${statusData.videoBase64}" style="width:100%; height:100%; object-fit:contain;" controls autoplay></video>`; }
    else { elements.statusImage.innerHTML = ''; }
    elements.statusText.textContent = statusData.text || '';
    const time = statusData.createdAt ? formatTime(statusData.createdAt) : '';
    elements.statusTime.textContent = time;
    const views = statusData.views ? statusData.views : 0;
    elements.statusViews.textContent = views + ' Views';
  });
}

function closeStatusView() { elements.statusViewScreen.classList.add('hidden'); }

function handleStatusPhoto(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    const img = new Image();
    img.onload = () => {
      const maxWidth = 480;
      const scale = Math.min(1, maxWidth / img.width);
      const canvas = document.createElement('canvas');
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
      state.pendingStatusPhoto = compressedBase64;
      elements.statusTextInput.placeholder = 'Photo ke saath status likho...';
      showToast('Photo select ho gayi! ✅', 'success');
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
}

function handleStatusVideo(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    const videoBase64 = event.target.result;
    if (videoBase64.length > 200 * 1024 * 1024) { showToast('Video 200MB se badi hai!', 'error'); return; }
    state.pendingStatusVideo = videoBase64;
    elements.statusTextInput.placeholder = 'Video ke saath status likho...';
    showToast('Video select ho gayi! ✅', 'success');
  };
  reader.readAsDataURL(file);
}

async function postStatus() {
  const text = elements.statusTextInput.value.trim();
  const photo = state.pendingStatusPhoto || null;
  const video = state.pendingStatusVideo || null;
  if (!text && !photo && !video) { showToast('Status khali hai!', 'error'); return; }
  const uid = firebase.auth().currentUser.uid;
  await db.collection('users').doc(uid).collection('status').add({ text, imageBase64: photo, videoBase64: video, name: state.currentUserName, createdAt: firebase.firestore.FieldValue.serverTimestamp(), expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) });
  elements.statusTextInput.value = '';
  state.pendingStatusPhoto = null;
  state.pendingStatusVideo = null;
  elements.statusCreateModal.classList.add('hidden');
  showToast('Status post ho gaya! 📸', 'success');
}

// ================= VOICE CALL =================
async function startVoiceCall() {
  if (!state.currentFriendUid) return;
  elements.callScreen.classList.remove('hidden');
  elements.callAvatar.textContent = state.currentFriendName.charAt(0).toUpperCase();
  elements.callName.textContent = state.currentFriendName;
  elements.callStatus.textContent = 'Call connecting...';
  elements.callTimer.textContent = '00:00';
  state.callSeconds = 0;
  state.callTimer = setInterval(() => {
    state.callSeconds++;
    elements.callTimer.textContent = `${Math.floor(state.callSeconds / 60).toString().padStart(2, '0')}:${(state.callSeconds % 60).toString().padStart(2, '0')}`;
  }, 1000);
  setTimeout(() => { elements.callStatus.textContent = 'Connected'; }, 2000);
}

function endCall() {
  if (state.callTimer) clearInterval(state.callTimer);
  elements.callScreen.classList.add('hidden');
  showToast('Call ended', 'info');
}

function toggleMute() {
  const btn = elements.muteBtn;
  if (btn.textContent === '🔊') { btn.textContent = '🔇'; showToast('Muted', 'info'); }
  else { btn.textContent = '🔊'; showToast('Unmuted', 'info'); }
}

function toggleSpeaker() {
  const btn = elements.speakerBtn;
  if (btn.textContent === '🔉') { btn.textContent = '🔊'; showToast('Speaker on', 'info'); }
  else { btn.textContent = '🔉'; showToast('Speaker off', 'info'); }
}

// ================= PERMISSIONS & NOTIFICATIONS =================
async function setupPermissions() {
  try {
    if (window.Notification && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    }
  } catch (err) {
    console.log('Permission error:', err.message);
  }
}

// ================= INCOMING CALLS (SIMULATED) =================
async function listenForIncomingCalls() {
  const myUid = firebase.auth().currentUser.uid;
  
  db.collection('users').doc(myUid).collection('calls')
    .where('status', '==', 'ringing')
    .onSnapshot((snapshot) => {
      snapshot.forEach(doc => {
        const callData = doc.data();
        
        if (window.Notification && Notification.permission === 'granted') {
          const notification = new Notification('📞 Incoming Call', {
            body: `${callData.fromName} aapko call kar raha hai...`,
            icon: 'icon-192.png',
            tag: 'raaz-incoming-call',
            vibrate: [200, 100, 200],
            requireInteraction: true
          });
          
          notification.onclick = () => {
            window.focus();
            elements.callScreen.classList.remove('hidden');
            elements.callAvatar.textContent = callData.fromName.charAt(0).toUpperCase();
            elements.callName.textContent = callData.fromName;
            elements.callStatus.textContent = 'Incoming Call...';
            elements.callTimer.textContent = '00:00';
            notification.close();
          };
        }
      });
    });
}

// ================= FOLLOW SYSTEM =================
async function followUser(targetUid) {
  const myUid = firebase.auth().currentUser.uid;
  await db.collection('users').doc(myUid).collection('following').doc(targetUid).set({
    followedAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  await db.collection('users').doc(targetUid).collection('followers').doc(myUid).set({
    followedAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  showToast('✅ Follow kar liya!', 'success');
}

async function unfollowUser(targetUid) {
  const myUid = firebase.auth().currentUser.uid;
  await db.collection('users').doc(myUid).collection('following').doc(targetUid).delete();
  await db.collection('users').doc(targetUid).collection('followers').doc(myUid).delete();
  showToast('Unfollow kar diya', 'info');
}

// ================= FOLLOWERS / FOLLOWING SCREENS =================
async function showFollowersScreen() {
  const myUid = firebase.auth().currentUser.uid;
  elements.followersList.innerHTML = '';
  db.collection('users').doc(myUid).collection('followers').onSnapshot(snapshot => {
    elements.followersList.innerHTML = '';
    snapshot.forEach(doc => {
      const data = doc.data();
      const item = document.createElement('div');
      item.className = 'chat-item';
      item.innerHTML = `<div class="chat-avatar">${data.name ? data.name.charAt(0).toUpperCase() : '?'}</div><div class="chat-info"><div class="chat-name">${data.name || 'User'}</div></div>`;
      elements.followersList.appendChild(item);
    });
  });
  showScreen(elements.followersScreen);
}

async function showFollowingScreen() {
  const myUid = firebase.auth().currentUser.uid;
  elements.followingList.innerHTML = '';
  db.collection('users').doc(myUid).collection('following').onSnapshot(snapshot => {
    elements.followingList.innerHTML = '';
    snapshot.forEach(doc => {
      const data = doc.data();
      const item = document.createElement('div');
      item.className = 'chat-item';
      item.innerHTML = `<div class="chat-avatar">${data.name ? data.name.charAt(0).toUpperCase() : '?'}</div><div class="chat-info"><div class="chat-name">${data.name || 'User'}</div></div>`;
      elements.followingList.appendChild(item);
    });
  });
  showScreen(elements.followingScreen);
}

// ================= FEED / POSTS =================
function listenForFeed() {
  const uid = firebase.auth().currentUser.uid;
  db.collection('posts').orderBy('createdAt', 'desc').limit(50).onSnapshot(snapshot => {
    elements.feedContent.innerHTML = '';
    if (snapshot.empty) {
      elements.feedContent.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📸</div><p>Abhi koi post nahi hai</p></div>';
      return;
    }
    snapshot.forEach(doc => {
      const post = doc.data();
      const postEl = document.createElement('div');
      postEl.className = 'post-card';
      postEl.innerHTML = `
        <div class="post-header">
          <div class="post-avatar">${(post.name || '?').charAt(0).toUpperCase()}</div>
          <div class="post-info"><div class="post-name">${post.name}</div><div class="post-username">@${post.username}</div></div>
        </div>
        ${post.imageBase64 ? `<img src="${post.imageBase64}" class="post-image" alt="post">` : ''}
        ${post.videoBase64 ? `<video src="${post.videoBase64}" class="post-video" controls></video>` : ''}
        <div class="post-caption">${escapeHtml(post.caption || '')}</div>
      `;
      elements.feedContent.appendChild(postEl);
    });
  });
}

function handlePostPhoto(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    const img = new Image();
    img.onload = () => {
      const maxWidth = 600;
      const scale = Math.min(1, maxWidth / img.width);
      const canvas = document.createElement('canvas');
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
      state.pendingPostPhoto = compressedBase64;
      elements.postCaptionInput.placeholder = 'Photo ke saath caption likho...';
      showToast('Photo select ho gayi! ✅', 'success');
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
}

function handlePostVideo(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    const videoBase64 = event.target.result;
    if (videoBase64.length > 200 * 1024 * 1024) { showToast('Video 200MB se badi hai!', 'error'); return; }
    state.pendingPostVideo = videoBase64;
    elements.postCaptionInput.placeholder = 'Video ke saath caption likho...';
    showToast('Video select ho gayi! ✅', 'success');
  };
  reader.readAsDataURL(file);
}

async function publishPost() {
  const caption = elements.postCaptionInput.value.trim();
  const photo = state.pendingPostPhoto || null;
  const video = state.pendingPostVideo || null;
  if (!caption && !photo && !video) { showToast('Post khali hai!', 'error'); return; }
  const uid = firebase.auth().currentUser.uid;
  await db.collection('posts').add({
    caption,
    imageBase64: photo,
    videoBase64: video,
    name: state.currentUserName,
    username: state.currentUsername,
    uid,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  elements.postCaptionInput.value = '';
  state.pendingPostPhoto = null;
  state.pendingPostVideo = null;
  elements.createPostModal.classList.add('hidden');
  showToast('✅ Post publish ho gaya!', 'success');
}

// ================= BLOCK/DELETE =================
function openChatMenu() {
  if (!state.currentChatId || !state.currentFriendUid) return;
  elements.chatItemMenuOverlay.classList.add('show');
}
function closeMenu() { elements.chatItemMenuOverlay.classList.remove('show'); }
function openChatItemMenu(friendUid, friendName, friendUsername, category) {
  state.menuTarget = { friendUid, friendName, friendUsername, chatId: getChatId(firebase.auth().currentUser.uid, friendUid), category };
  elements.moveCategoryBtn.textContent = category === 'secondary' ? 'Primary me bhejo' : 'Secondary me bhejo';
  elements.chatItemMenuOverlay.classList.add('show');
}

async function moveCategory() {
  if (!state.menuTarget) return;
  const newCategory = state.menuTarget.category === 'secondary' ? 'primary' : 'secondary';
  await db.collection('users').doc(firebase.auth().currentUser.uid).collection('chatsList').doc(state.menuTarget.chatId).set({ category: newCategory }, { merge: true });
  closeMenu();
  showToast('Category badal gayi! 📂', 'success');
}

async function blockUserFromMenu() {
  if (!state.menuTarget) return;
  const myUid = firebase.auth().currentUser.uid;
  await db.collection('users').doc(myUid).collection('blocked').doc(state.menuTarget.friendUid).set({ name: state.menuTarget.friendName, blockedAt: firebase.firestore.FieldValue.serverTimestamp() });
  await db.collection('users').doc(myUid).collection('chatsList').doc(state.menuTarget.chatId).delete();
  await db.collection('users').doc(state.menuTarget.friendUid).collection('chatsList').doc(state.menuTarget.chatId).delete();
  closeMenu();
  showToast('User block kar diya! 🚫', 'success');
}

async function deleteChat() {
  if (!state.menuTarget) return;
  await db.collection('users').doc(firebase.auth().currentUser.uid).collection('chatsList').doc(state.menuTarget.chatId).delete();
  closeMenu();
  showToast('Chat delete ho gayi! 🗑️', 'success');
}

// ================= TOAST =================
function showToast(message, type = 'info') {
  elements.toast.textContent = message;
  elements.toast.className = `toast ${type} show`;
  setTimeout(() => elements.toast.classList.remove('show'), 3000);
}

// ================= UTILS =================
function formatTime(timestamp) {
  if (!timestamp) return '';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const now = new Date();
  if (date.toDateString() === now.toDateString()) {
    let hours = date.getHours();
    const mins = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    if (hours === 0) hours = 12;
    return `${hours}:${mins} ${ampm}`;
  } else return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}