const SUPABASE_URL ="https://mpafolafsarugztvdcfa.supabase.co/rest/v1/";
const SUPABASE_KEY ="sb_publishable_G_GWDzMhx2AT1HbCNepPDA_b8UY9jQN";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

let currentAdmin = null;

const $ = (id) => document.getElementById(id);

function showLogin(message = "") {
  $("loginView").classList.remove("hidden");
  $("app").classList.add("hidden");
  $("loginMsg").textContent = message;
}

function showApp() {
  $("loginView").classList.add("hidden");
  $("app").classList.remove("hidden");
}

/* =========================
   LOGIN
========================= */

async function checkSession() {
  const {
    data: { session }
  } = await supabaseClient.auth.getSession();

  if (!session) {
    showLogin();
    return;
  }

  await loadAdmin(session.user);
}

async function loadAdmin(user) {

  const { data, error } = await supabaseClient
    .from("admin_users")
    .select("*")
    .eq("id", user.id)
    .eq("is_active", true)
    .single();

  if (error || !data) {
    await supabaseClient.auth.signOut();

    showLogin(
      "This account is not authorized as an administrator."
    );

    return;
  }

  currentAdmin = data;

  $("adminRole").textContent =
    data.role.replace("_", " ").toUpperCase();

  showApp();

  loadDashboard();
  loadSettings();
}

$("loginForm").addEventListener("submit", async (e) => {
  alert("Login Button is working")

  e.preventDefault();

  $("loginMsg").textContent = "Signing in...";

  const email = $("loginEmail").value.trim();
  const password = $("loginPassword").value;

  const { data, error } =
    await supabaseClient.auth.signInWithPassword({
      email,
      password
    });

  if (error) {
    $("loginMsg").textContent = error.message;
    return;
  }

  await loadAdmin(data.user);
});


/* =========================
   LOGOUT
========================= */

$("logoutBtn").addEventListener("click", async () => {

  await supabaseClient.auth.signOut();

  currentAdmin = null;

  showLogin("You have been signed out.");
});


/* =========================
   NAVIGATION
========================= */

document.querySelectorAll(".nav-btn").forEach((button) => {

  button.addEventListener("click", () => {

    const section = button.dataset.section;

    document
      .querySelectorAll(".section")
      .forEach((item) =>
        item.classList.remove("active")
      );

    $(section).classList.add("active");

    document
      .querySelectorAll(".nav-btn")
      .forEach((item) =>
        item.classList.remove("active")
      );

    button.classList.add("active");

    $("pageTitle").textContent =
      section.charAt(0).toUpperCase() +
      section.slice(1);
  });

});


/* =========================
   DASHBOARD
========================= */

async function loadDashboard() {

  const tables = [
    ["courses", "statCourses"],
    ["foundation_classes", "statFoundation"],
    ["notices", "statNotices"],
    ["admission_enquiries", "statEnquiries"]
  ];

  for (const [table, element] of tables) {

    const { count } = await supabaseClient
      .from(table)
      .select("*", {
        count: "exact",
        head: true
      });

    $(element).textContent = count || 0;
  }
}


/* =========================
   WEBSITE SETTINGS
========================= */

async function loadSettings() {

  const { data, error } =
    await supabaseClient
      .from("website_settings")
      .select("*")
      .limit(1)
      .single();

  if (error || !data) return;

  $("siteName").value = data.site_name || "";
  $("phone").value = data.phone || "";
  $("email").value = data.email || "";
  $("address").value = data.address || "";
  $("branchHours").value = data.branch_hours || "";
  $("logoUrl").value = data.logo_url || "";
  $("heroTitle").value = data.hero_title || "";
  $("heroDescription").value =
    data.hero_description || "";
}


$("settingsForm").addEventListener(
  "submit",
  async (e) => {

    e.preventDefault();

    const payload = {

      site_name: $("siteName").value,

      phone: $("phone").value,

      email: $("email").value,

      address: $("address").value,

      branch_hours:
        $("branchHours").value,

      logo_url:
        $("logoUrl").value,

      hero_title:
        $("heroTitle").value,

      hero_description:
        $("heroDescription").value,

      updated_at:
        new Date().toISOString()
    };


    const { data: existing } =
      await supabaseClient
        .from("website_settings")
        .select("id")
        .limit(1)
        .single();


    let result;

    if (existing) {

      result =
        await supabaseClient
          .from("website_settings")
          .update(payload)
          .eq("id", existing.id);

    } else {

      result =
        await supabaseClient
          .from("website_settings")
          .insert(payload);

    }


    if (result.error) {

      $("settingsMsg").textContent =
        result.error.message;

      return;
    }


    $("settingsMsg").textContent =
      "Settings saved successfully.";
  }
);


/* =========================
   GENERIC TABLE LOADER
========================= */

async function loadTable(
  table,
  element,
  columns
) {

  const { data, error } =
    await supabaseClient
      .from(table)
      .select("*")
      .order("created_at", {
        ascending: false
      });

  if (error) {

    $(element).innerHTML =
      `<div class="empty">
        ${error.message}
      </div>`;

    return;
