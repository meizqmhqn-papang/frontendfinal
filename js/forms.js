"use strict";

$(function () {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function markField($field, message) {
        $field.toggleClass("is-invalid", Boolean(message));
        $field.toggleClass("is-valid", !message);
        $field.attr("aria-invalid", String(Boolean(message)));
        const $feedback = $field.closest("div[class*='col-']").find(".invalid-feedback").last();
        if (message) $feedback.text(message);
        return !message;
    }

    function contactValid() {
        const $name = $("#contact-name");
        const $email = $("#contact-email");
        const $message = $("#contact-message");
        const name = String($name.val() || "").trim();
        const email = String($email.val() || "").trim();
        const message = String($message.val() || "").trim();
        const checks = [
            markField($name, name.length >= 2 ? "" : "Please enter at least 2 characters."),
            markField($email, emailPattern.test(email) ? "" : "Please enter a valid email address."),
            markField($message, message.length >= 10 && message.length <= 500 ? "" : "Please enter a message between 10 and 500 characters.")
        ];
        return checks.every(Boolean);
    }

    $(".needs-validation").each(function () {
        const $form = $(this);
        const $success = $("#" + $form.attr("data-success-target"));
        const validate = contactValid;
        let attempted = false;

        $form.on("submit", function (event) {
            event.preventDefault();
            attempted = true;
            $success.stop(true, true).hide().attr("hidden", "hidden");
            if (!validate()) {
                $form.find(".is-invalid").first().trigger("focus");
                return;
            }
            const subject = "Aurora Hotel enquiry";
            const body = `From: ${$("#contact-name").val().trim()} (${ $("#contact-email").val().trim()})\n\n${$("#contact-message").val().trim()}`;
            $("#sendEmail").attr("href", "mailto:meizlegenda@mail.ru?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body));
            $success.removeAttr("hidden").hide().fadeIn(230);
            $success.trigger("focus");
        });

        $form.on("input change", "input, select, textarea", function () {
            if (attempted) {
                $success.stop(true, true).hide().attr("hidden", "hidden");
                validate();
            }
        });

        $form.on("reset", function () {
            attempted = false;
            $success.stop(true, true).hide().attr("hidden", "hidden");
            $form.find(".is-valid, .is-invalid").removeClass("is-valid is-invalid").removeAttr("aria-invalid");
        });
    });
});
