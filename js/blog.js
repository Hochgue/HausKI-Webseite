function formatDate(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("de-DE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
}

function createPostCard(post) {
  const isLinkedIn = post.post_type === "linkedin";
  const sourceClass = isLinkedIn ? "linkedin" : "blog";
  const sourceLabel = isLinkedIn ? "LinkedIn" : "Blog";
  const linkUrl = isLinkedIn ? (post.linkedin_url || "#") : "#";
  const buttonLabel = isLinkedIn ? "Beitrag ansehen" : "Artikel lesen";

  return `
    <article class="post-card">
      <div class="post-top">
        <span class="post-source ${sourceClass}">${sourceLabel}</span>
        <span class="post-date">${formatDate(post.published_at)}</span>
      </div>

      <h3>${post.title || "Ohne Titel"}</h3>
      <p>${post.excerpt || ""}</p>

      <div class="post-actions">
        <a class="read-more" href="${linkUrl}" ${isLinkedIn ? 'target="_blank" rel="noopener noreferrer"' : ""}>
          ${buttonLabel}
        </a>
      </div>
    </article>
  `;
}

function renderEmptyState(elementId, text) {
  const element = document.getElementById(elementId);
  if (!element) return;

  element.innerHTML = `<div class="empty-state">${text}</div>`;
}

async function loadPosts() {
  try {
    const { data: posts, error } = await supabase
      .from("posts")
      .select("*")
      .eq("visible", true)
      .order("published_at", { ascending: false });

    if (error) {
      throw error;
    }

    const linkedinGrid = document.getElementById("linkedin-grid");
    const blogGrid = document.getElementById("blog-grid");

    if (!linkedinGrid || !blogGrid) {
      console.error("Die Zielcontainer für die Beiträge wurden nicht gefunden.");
      return;
    }

    const safePosts = Array.isArray(posts) ? posts : [];

    const linkedinPosts = safePosts.filter((post) => post.post_type === "linkedin");
    const blogPosts = safePosts.filter((post) => post.post_type === "blog");

    if (linkedinPosts.length > 0) {
      linkedinGrid.innerHTML = linkedinPosts.map(createPostCard).join("");
    } else {
      renderEmptyState("linkedin-grid", "Noch keine LinkedIn-Beiträge vorhanden.");
    }

    if (blogPosts.length > 0) {
      blogGrid.innerHTML = blogPosts.map(createPostCard).join("");
    } else {
      renderEmptyState("blog-grid", "Noch keine Blogartikel vorhanden.");
    }
  } catch (error) {
    console.error("Fehler beim Laden der Beiträge:", error);

    renderEmptyState("linkedin-grid", "Beiträge konnten gerade nicht geladen werden.");
    renderEmptyState("blog-grid", "Beiträge konnten gerade nicht geladen werden.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadPosts();
});