// Array of hashtags to filter out
const filterKeywords = ["#collab", "#preplacedcollab"];

// Function to expand posts by clicking "more" buttons
function expandPosts(callback) {
  const moreButtons = document.querySelectorAll(
    'button[aria-label="see more, visually reveals content which is already detected by screen readers"]'
  );
  moreButtons.forEach((btn) => btn.click());

  // Wait for the expansion to complete before filtering
  setTimeout(callback, 1500); // Adjust timing if needed
}

// Function to hide posts containing any of the filterKeywords
function hideCollabPosts() {
  const posts = document.querySelectorAll(".feed-shared-update-v2");
  let hiddenCount = 0;
  posts.forEach((post) => {
    // Select the expanded text inside the post
    const expandedText = post.querySelector(
      ".feed-shared-inline-show-more-text--expanded"
    );
    const postText = expandedText
      ? expandedText.innerText.toLowerCase()
      : post.innerText.toLowerCase();

    // Check if the post contains any filtered keywords
    const containsKeyword = filterKeywords.some((keyword) =>
      postText.includes(keyword.toLowerCase())
    );

    if (containsKeyword) {
      post.style.display = "none";
      hiddenCount++;
    }
  });
  chrome.storage.local.get("filteredCount", (data) => {
    const previousCount = data.filteredCount || 0;
    chrome.storage.local.set({ filteredCount: previousCount + hiddenCount });
  });
}

if (!window.location.pathname.startsWith("/in/") && !window.location.pathname.startsWith("/company/")) {
  // Check if the current page is a LinkedIn profile or company page
  // If not, proceed with filtering posts
  // First expand posts, then filter them
  expandPosts(hideCollabPosts);

  // Use MutationObserver to watch for dynamically loaded posts
  const observer = new MutationObserver(() => expandPosts(hideCollabPosts));
  observer.observe(document.body, { childList: true, subtree: true });
}
