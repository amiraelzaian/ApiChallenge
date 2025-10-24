let usersWrapper = document.querySelector(".users-wrapper");
let postsWrapper = document.querySelector(".posts-wrapper");

let postsCache = {};

const usersUrl = "https://jsonplaceholder.typicode.com/users";
const postsUrl = "https://jsonplaceholder.typicode.com/posts";

// Controller for canceling requests
let currentPostsRequest = null;

async function getAllData(usersUrl, postsUrl) {
  usersWrapper.innerHTML = `<p class="text-gray-500">⏳ Loading users...</p>`;

  try {
    const [users, posts] = await Promise.all([
      axios.get(usersUrl),
      axios.get(postsUrl),
    ]);

    const usersData = users.data;
    const postsData = posts.data;

    postsData.forEach((post) => {
      if (!postsCache[post.userId]) {
        postsCache[post.userId] = [];
      }
      postsCache[post.userId].push(post);
    });

    renderUsers(usersData);
  } catch (err) {
    console.error("Error fetching data:", err);
    usersWrapper.innerHTML = `
      <div class="text-gray-700 p-4">
        <p class="font-semibold">Error: Can't load users</p>
        <p class="text-red-600 text-sm mt-2">${escapeHtml(err.message)}</p>
      </div>`;
    postsWrapper.innerHTML = `
      <div class="text-gray-700 p-4">
        <p class="font-semibold">Error: Can't load posts</p>
        <p class="text-red-600 text-sm mt-2">${escapeHtml(err.message)}</p>
      </div>`;
  }
}

function renderUsers(usersData) {
  usersWrapper.innerHTML = "";

  if (!usersData || usersData.length === 0) {
    usersWrapper.innerHTML = `<p class="text-gray-500 p-4">No users found</p>`;
    return;
  }

  const fragment = document.createDocumentFragment();

  usersData.forEach((user) => {
    const btn = document.createElement("button");
    btn.className =
      "user-btn w-full px-4 py-2 border border-teal-500 rounded-md m-1 hover:bg-teal-100 transition-colors duration-200 text-left";
    btn.dataset.id = user.id;
    btn.type = "button";
    btn.textContent = user.username;
    btn.setAttribute("aria-label", `View posts by ${user.username}`);
    fragment.appendChild(btn);
  });

  usersWrapper.appendChild(fragment);
}

function handleClickedUser() {
  usersWrapper.addEventListener("click", (e) => {
    if (e.target.classList.contains("user-btn")) {
      document.querySelectorAll(".user-btn").forEach((btn) => {
        btn.classList.remove("border-teal-700", "bg-teal-100");
        btn.setAttribute("aria-pressed", "false");
      });

      e.target.classList.add("border-teal-700", "bg-teal-100");
      e.target.setAttribute("aria-pressed", "true");
      const userId = e.target.dataset.id;
      getPosts(userId);
    }
  });
}

async function getPosts(userId) {
  postsWrapper.innerHTML = `<p class="text-gray-500 p-4">⏳ Loading posts...</p>`;
  if (postsCache[userId]) {
    renderPosts(postsCache[userId]);
    return;
  }

  if (currentPostsRequest) {
    currentPostsRequest.cancel("New request initiated");
  }

  // Create cancelToken for this request
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();
  currentPostsRequest = source;

  try {
    const res = await axios.get(
      `${postsUrl}?userId=${encodeURIComponent(userId)}`,
      { cancelToken: source.token }
    );
    postsCache[userId] = res.data;
    renderPosts(res.data);
  } catch (err) {
    // Don't show error if request was cancelled
    if (axios.isCancel(err)) {
      console.log("Request cancelled:", err.message);
      return;
    }

    console.error("Error fetching posts:", err);
    postsWrapper.innerHTML = `
      <div class="p-4">
        <p class="text-red-500 font-semibold">Failed to load posts.</p>
        <p class="text-red-400 text-sm mt-2">${escapeHtml(err.message)}</p>
      </div>`;
  } finally {
    currentPostsRequest = null;
  }
}

function renderPosts(postsData) {
  postsWrapper.innerHTML = "";

  if (!postsData || postsData.length === 0) {
    postsWrapper.innerHTML = `<p class="text-gray-500 p-4">No posts yet</p>`;
    return;
  }

  const fragment = document.createDocumentFragment();

  postsData.forEach((post) => {
    const div = document.createElement("div");
    div.className =
      "p-4 mb-3 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 bg-white";

    const title = document.createElement("h3");
    title.className = "font-semibold text-teal-700 mb-2 capitalize text-lg";
    title.textContent = post.title;
    const body = document.createElement("p");
    body.className = "text-gray-700 leading-relaxed text-sm";
    body.textContent = post.body;
    div.appendChild(title);
    div.appendChild(body);
    fragment.appendChild(div);
  });

  postsWrapper.appendChild(fragment);
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/// Initialize the application
function initApp() {
  // Setup event listeners (only once)
  handleClickedUser();
  // Fetch initial data
  getAllData(usersUrl, postsUrl);
}
// Start the app when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
