const loginForm = document.getElementById("loginForm");
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
const loginMessage = document.getElementById("loginMessage");

togglePassword.addEventListener("click", function () {
    const isPassword = passwordInput.type === "password";

    passwordInput.type = isPassword ? "text" : "password";

    togglePassword.setAttribute(
        "aria-label",
        isPassword ? "Hide password" : "Show password"
    );
});

loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
        loginMessage.textContent = "Please enter your email and password.";
        loginMessage.style.color = "#b00020";
        return;
    }

    loginMessage.textContent = "Login form is ready.";
    loginMessage.style.color = "#27720e";
});

document.getElementById("registerLink").addEventListener("click", function (event) {
    event.preventDefault();
    alert("Register page will be connected here.");
});

document.getElementById("forgotPassword").addEventListener("click", function (event) {
    event.preventDefault();
    alert("Forgot Password page will be connected here.");
});
