const SUPABASE_URL = "https://mpafolafsarugztvdcfa.supabase.co";
const SUPABASE_KEY = "sb_publishable_G_GWDzMhx2AT1HbCNepPDA_b8UY9jQN";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);


// ===============================
// LOGIN
// ===============================
document.addEventListener("DOMContentLoaded", function () {

  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {

      e.preventDefault();

      const email = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value;
      const message = document.getElementById("loginMsg");

      message.textContent = "Signing in...";

      const { data, error } =
        await supabaseClient.auth.signInWithPassword({
          email: email,
          password: password
        });

      if (error) {
        message.textContent = error.message;
        return;
      }

      message.textContent = "Login successful!";

      const loginView = document.getElementById("loginView");
      const app = document.getElementById("app");

      loginView.classList.add("hidden");
      app.classList.remove("hidden");

      console.log("Dashboard opened");

      loadNotices();
    });
  }

});


// ===============================
// NAVIGATION
// ===============================
document.addEventListener("click", function (e) {

  const button = e.target.closest(".nav-btn");

  if (!button) return;

  e.preventDefault();

  const sectionId = button.getAttribute("data-section");

  document.querySelectorAll(".section").forEach(function (section) {
    section.classList.remove("active");
  });

  const section = document.getElementById(sectionId);

  if (section) {
    section.classList.add("active");
  }

  document.querySelectorAll(".nav-btn").forEach(function (btn) {
    btn.classList.remove("active");
  });

  button.classList.add("active");

  const pageTitle = document.getElementById("pageTitle");

  if (pageTitle) {
    pageTitle.textContent = button.textContent.trim();
  }

  if (sectionId === "notices") {
    loadNotices();
  }

});


// ===============================
// LOAD NOTICES
// ===============================
async function loadNotices() {

  const noticesList = document.getElementById("noticesList");

  if (!noticesList) return;

  noticesList.innerHTML = "Loading notices...";

  const { data, error } = await supabaseClient
    .from("notices")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Notices error:", error);
    noticesList.innerHTML =
      "Error loading notices: " + error.message;
    return;
  }

  if (!data || data.length === 0) {
    noticesList.innerHTML = "No notices found.";
    return;
  }

  noticesList.innerHTML = data.map(function (notice) {

    return `
      <div class="notice-card">
        <h4>${notice.title || "Notice"}</h4>

        <p>
          ${notice.content || notice.description || ""}
        </p>

        <small>
          ${
            notice.created_at
              ? new Date(notice.created_at).toLocaleDateString()
              : ""
          }
        </small>
      </div>
    `;

  }).join("");

}
