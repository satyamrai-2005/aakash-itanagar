const SUPABASE_URL = "https://mpafolafsarugztvdcfa.supabase.co";
const SUPABASE_KEY = "sb_publishable_G_GWDzMhx2AT1HbCNepPDA_b8UY9jQN";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

document.addEventListener("DOMContentLoaded", function () {

  const loginForm = document.getElementById("loginForm");

  if (!loginForm) {
    alert("Login form not found");
    return;
  }

  loginForm.addEventListener("submit", async function (e) {

    e.preventDefault();


    const email =
      document.getElementById("loginEmail").value.trim();

    const password =
      document.getElementById("loginPassword").value;

    const message =
      document.getElementById("loginMsg");

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
  });

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
    noticesList.innerHTML = "Error loading notices: " + error.message;
    return;
  }

  if (!data || data.length === 0) {
    noticesList.innerHTML = "No notices found.";
    return;
  }

  noticesList.innerHTML = data.map((notice) => `
    <div class="notice-card">
      <h4>${notice.title || "Notice"}</h4>
      <p>${notice.content || notice.description || ""}</p>
      <small>
        ${notice.created_at
          ? new Date(notice.created_at).toLocaleDateString()
          : ""}
      </small>
    </div>
  `).join("");
}


// Load notices when dashboard opens
document.addEventListener("DOMContentLoaded", function () {
  loadNotices();
});
