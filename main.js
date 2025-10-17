let usersWrapper = document.querySelector(".users-wrapper");
let postsWrapper = document.querySelector(".posts-wrapper");
let userBtn = document.querySelector(".user-btn");

async function getUsers() {
  try {
    const users = await fetch("https://jsonplaceholder.typicode.com/users");

    if (!users.ok) {
      throw new Error(`HTTP error! status: ${users.status}`);
    }

    const usersData = await users.json();
    console.log(usersData);

    usersWrapper.innerHTML =
      usersData.length === 0
        ? `<p>There are no users yet</p>`
        : usersData
            .map(
              (u) =>
                `<button class="user-btn w-full px-2 py-1 border border-teal-500 rounded-md m-1 hover:bg-teal-100" data-id="${u.id}">
                  ${u.username}
                </button>`
            )
            .join("");
  } catch (error) {
    console.error("Error fetching users:", error);
    usersWrapper.innerHTML = `<p class="text-red-500">Failed to load users. Please try again later.</p>`;
  }
}

getUsers();

usersWrapper.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    console.log("Clicked:", e.target.dataset.id);
    getPosts(e.target.dataset.id);
  }
});

async function getPosts(id) {
  try {
    const posts = await fetch("https://jsonplaceholder.typicode.com/posts");

    if (!posts.ok) {
      throw new Error(`HTTP error! status: ${posts.status}`);
    }

    const postsData = await posts.json();
    const filteredPosts = postsData.filter((p) => p.userId == id);
    console.log(filteredPosts);
    console.log(filteredPosts.length);

    postsWrapper.innerHTML =
      filteredPosts.length == 0
        ? `<p>There are no posts yet</p>`
        : filteredPosts
            .map(
              (post) => `
                <div class="p-3 mb-3 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition">
                  <h3 class="font-semibold text-teal-700 mb-1 capitalize">${post.title}</h3>
                  <p class="text-gray-700 leading-relaxed">${post.body}</p>
                </div>`
            )
            .join("");
  } catch (error) {
    console.error("Error fetching posts:", error);
    postsWrapper.innerHTML = `<p class="text-red-500">Failed to load posts. Please try again later.</p>`;
  }
}
