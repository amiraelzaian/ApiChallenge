let usersWrapper = document.querySelector(".users-wrapper");
let postsWrapper = document.querySelector(".posts-wrapper");
let userBtn = document.querySelector(".user-btn");
async function getUsers() {
  const users = await fetch("https://jsonplaceholder.typicode.com/users");
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
}

getUsers();

usersWrapper.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    console.log("Clicked:", e.target.dataset.id);
    getPosts(e.target.dataset.id);
  }
});
async function getPosts(id) {
  const posts = await fetch("https://jsonplaceholder.typicode.com/posts");
  const postsData = await posts.json();

  const filteredPosts = postsData.filter((p) => p.userId == id);
  console.log(filteredPosts);
  console.log(filteredPosts.length);
  postsWrapper.innerHTML =
    filteredPosts.length == 0
      ? `<p>there is not posts yet</p>`
      : filteredPosts
          .map(
            (post) => `
              <div class="p-3 mb-3 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition">
                <h3 class="font-semibold text-teal-700 mb-1 capitalize">${post.title}</h3>
                <p class="text-gray-700 leading-relaxed">${post.body}</p>
              </div>`
          )
          .join("");
}
