let usersWrapper = document.querySelector(".users-wrapper");
let postsWrapper = document.querySelector(".posts-wrapper");
let postsCache = {}; // this is for cache

async function getUsers() {
  try {
    const users = await fetch("https://jsonplaceholder.typicode.com/users");
    if (!users.ok) throw new Error(`HTTP error! status: ${users.status}`);

    const usersData = await users.json();

    usersWrapper.innerHTML =
      usersData.length === 0
        ? `<p>There are no users yet</p>`
        : usersData
            .map(
              (u) =>
                `<button class="user-btn w-full px-2 py-1 border border-teal-500 rounded-md m-1 hover:bg-teal-100" data-id="${
                  u.id
                }">
            ${escapeHtml(u.username)}
          </button>`
            )
            .join("");
  } catch (error) {
    console.error("Error fetching users:", error);
    usersWrapper.innerHTML = `<p class="text-red-500">Failed to load users.</p>`;
  }
}

getUsers();

usersWrapper.addEventListener("click", (e) => {
  if (e.target.classList.contains("user-btn")) {
    document
      .querySelectorAll(".user-btn")
      .forEach((btn) => btn.classList.remove("border-teal-700", "bg-teal-100"));
    e.target.classList.add("border-teal-700", "bg-teal-100");
    getPosts(e.target.dataset.id);
  }
});

async function getPosts(id) {
  if (postsCache[id]) {
    // check if there is cache
    renderPosts(postsCache[id]);
    return;
  }

  try {
    postsWrapper.innerHTML = `<p class="text-gray-500">⏳ Loading...</p>`;

    const posts = await fetch(
      `https://jsonplaceholder.typicode.com/posts?userId=${id}`
    );

    if (!posts.ok) throw new Error(`HTTP error! status: ${posts.status}`);

    const postsData = await posts.json();
    postsCache[id] = postsData;
    renderPosts(postsData);
  } catch (error) {
    console.error("Error fetching posts:", error);
    postsWrapper.innerHTML = `<p class="text-red-500">Failed to load posts.</p>`;
  }
}

function renderPosts(postsData) {
  postsWrapper.innerHTML =
    postsData.length === 0
      ? `<p>No posts yet</p>`
      : postsData
          .map((post) => {
            const div = document.createElement("div");
            div.className =
              "p-3 mb-3 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition";

            const title = document.createElement("h3");
            title.className = "font-semibold text-teal-700 mb-1 capitalize";
            title.textContent = post.title;

            const body = document.createElement("p");
            body.className = "text-gray-700 leading-relaxed";
            body.textContent = post.body;

            div.appendChild(title);
            div.appendChild(body);
            return div.outerHTML;
          })
          .join("");
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
