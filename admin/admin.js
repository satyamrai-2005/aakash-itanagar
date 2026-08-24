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
const loginScreen = document.getElementById(".login-wrap");
const dashboard = document.querySelector(".app");

if (loginScreen) {
  loginScreen.classList.add("hidden");
}

if (dashboard) {
  dashboard.classList.remove("hidden");
}

    console.log(data);

  });

});
