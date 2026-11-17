"use strict";
$(function () {
    const accountsKey = "auroraAccounts";
    const sessionKey = "auroraAccount";
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s]).{8,}$/;
    const phoneValid = value => /^\+?[0-9 ()-]+$/.test(value) && /^[0-9]{10,15}$/.test(value.replace(/\D/g, ""));
    const value = id => String($(id).val() || "").trim();
    const password = id => String($(id).val() || "");
    function readAccounts() {
        try { const data = JSON.parse(localStorage.getItem(accountsKey) || "[]"); return Array.isArray(data) ? data : []; }
        catch { return []; }
    }
    function activeAccount() {
        try { const email = localStorage.getItem(sessionKey); return readAccounts().find(user => user.email === email); }
        catch { return undefined; }
    }
    function field(id, message) {
        const $input = $(id);
        $input.toggleClass("is-invalid", Boolean(message)).attr("aria-invalid", String(Boolean(message)));
        $input.siblings(".invalid-feedback").text(message);
        return !message;
    }
    function error(message) { $("#accountError").text(message).prop("hidden", !message); }
    function focusError(form) { $(form).find(".is-invalid").first().trigger("focus"); }
    // Store a salted password verifier rather than the original password. This is a local simulation.
    async function derivePassword(secret, salt) {
        const encoder = new TextEncoder();
        const key = await crypto.subtle.importKey("raw", encoder.encode(secret), "PBKDF2", false, ["deriveBits"]);
        const bits = await crypto.subtle.deriveBits({name:"PBKDF2", hash:"SHA-256", salt:encoder.encode(salt), iterations:100000}, key, 256);
        return Array.from(new Uint8Array(bits), byte => byte.toString(16).padStart(2,"0")).join("");
    }
    const current = activeAccount();
    $(".account-link").attr("href", current ? "profile.html" : "login.html");
    if (/\/(login|register|profile)\.html$/.test(location.pathname)) $("#primaryNav .account-link").attr("aria-current", "page");
    if (current && $("#bookingForm").length) {
        $("#full-name").val(current.name); $("#email").val(current.email); $("#phone").val(current.phone);
    }
    $("#registrationForm").on("submit", async function (event) {
        event.preventDefault(); error("");
        const first = value("#first-name"), last = value("#last-name"), email = value("#registration-email").toLowerCase(), phone = value("#registration-phone"), secret = password("#password"), repeat = password("#confirm-password");
        const checks = [field("#first-name", first.length >= 2 ? "" : "Enter your first name."), field("#last-name", last.length >= 2 ? "" : "Enter your last name."), field("#registration-email", emailPattern.test(email) ? "" : "Enter a valid email address."), field("#registration-phone", phoneValid(phone) ? "" : "Enter a valid phone number with 10–15 digits."), field("#password", passwordPattern.test(secret) ? "" : "Use 8 or more characters, including uppercase, lowercase, a number and a symbol."), field("#confirm-password", secret && secret === repeat ? "" : "Passwords must match.")];
        if (!checks.every(Boolean)) { focusError(this); return; }
        if (readAccounts().some(user => user.email === email)) { field("#registration-email", "This email already has an account. Log in instead."); focusError(this); return; }
        const $button = $(this).find("button[type=submit]").prop("disabled", true);
        try {
            const salt = Array.from(crypto.getRandomValues(new Uint8Array(16)), b => b.toString(16).padStart(2,"0")).join("");
            const verifier = await derivePassword(secret, salt);
            const accounts = readAccounts();
            if (accounts.some(user => user.email === email)) { error("This email already has an account."); return; }
            accounts.push({name: first + " " + last, email, phone, salt, verifier});
            localStorage.setItem(accountsKey, JSON.stringify(accounts));
            location.href = "login.html?registered=1";
        } catch { error("Unable to create an account. Open the site over HTTPS or localhost and allow browser storage."); }
        finally { $button.prop("disabled", false); }
    });
    if ($("#loginForm").length && new URLSearchParams(location.search).has("registered")) $("#loginForm").before($("<p>", {class:"account-success",role:"status",text:"Your account is ready. Please log in."}));
    $("#loginForm").on("submit", async function (event) {
        event.preventDefault(); error("");
        const email = value("#loginEmail").toLowerCase(), secret = password("#loginPassword");
        const checks = [field("#loginEmail", emailPattern.test(email) ? "" : "Enter a valid email address."), field("#loginPassword", passwordPattern.test(secret) ? "" : "Enter your password (8 or more characters, uppercase, lowercase, number and symbol).")];
        if (!checks.every(Boolean)) { focusError(this); return; }
        const $button = $(this).find("button[type=submit]").prop("disabled", true);
        try {
            const user = readAccounts().find(account => account.email === email);
            if (!user || await derivePassword(secret, user.salt) !== user.verifier) { error("Email or password is incorrect."); return; }
            localStorage.setItem(sessionKey, user.email);
            location.href = "profile.html";
        } catch { error("Unable to log in. Please allow browser storage and use HTTPS or localhost."); }
        finally { $button.prop("disabled", false); }
    });
    $("#registrationForm, #loginForm").on("input", "input", function () { $(this).removeClass("is-invalid").removeAttr("aria-invalid"); error(""); });
    if ($("#profilePanel").length) {
        if (!current) { location.replace("login.html"); return; }
        $("#profileGreeting").text("Welcome, " + current.name.split(" ")[0]);
        $("#profileName").text(current.name); $("#profileEmail").text(current.email); $("#profilePhone").text(current.phone);
        $("#profilePanel").prop("hidden", false);
    }
    $("#logoutBtn").on("click", function () { try { localStorage.removeItem(sessionKey); } catch {} location.href = "login.html"; });
});
