// checkout.js

function validateCheckout(values) {
  const errors = {};

  if (!values.nameOnCard.trim()) {
    errors.nameOnCard = "Name on card is required.";
  }

  if (!/^\d{16}$/.test(values.cardNumber)) {
    errors.cardNumber = "Card number must be 16 digits.";
  }

  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(values.expiry)) {
    errors.expiry = "Expiry must be in MM/YY format.";
  }

  if (!/^\d{3,4}$/.test(values.cvv)) {
    errors.cvv = "CVV must be 3–4 digits.";
  }

  return errors;
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("checkout-form");

  const fields = {
    nameOnCard: document.getElementById("nameOnCard"),
    cardNumber: document.getElementById("cardNumber"),
    expiry: document.getElementById("expiry"),
    cvv: document.getElementById("cvv"),
  };

  const errorEls = {
    nameOnCard: document.getElementById("error-nameOnCard"),
    cardNumber: document.getElementById("error-cardNumber"),
    expiry: document.getElementById("error-expiry"),
    cvv: document.getElementById("error-cvv"),
  };

  function clearErrors() {
    Object.values(errorEls).forEach((el) => {
      el.textContent = "";
    });
  }

  // Strip non-digits as user types for card number + CVV
  ["cardNumber", "cvv"].forEach((fieldName) => {
    const input = fields[fieldName];
    input.addEventListener("input", () => {
      input.value = input.value.replace(/\D/g, "");
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors();

    const values = {
      nameOnCard: fields.nameOnCard.value,
      cardNumber: fields.cardNumber.value.replace(/\D/g, ""),
      expiry: fields.expiry.value,
      cvv: fields.cvv.value.replace(/\D/g, ""),
    };

    const errors = validateCheckout(values);

    if (Object.keys(errors).length > 0) {
      Object.entries(errors).forEach(([field, message]) => {
        if (errorEls[field]) {
          errorEls[field].textContent = message;
        }
      });
      return;
    }

    // All good: go to thank-you page
    window.location.href = "thank-you.html";
  });
});
