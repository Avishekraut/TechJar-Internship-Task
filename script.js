document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("multiStepForm");
  const steps = Array.from(form.getElementsByClassName("step"));
  const confirmationStep = document.getElementById("confirmation-step");
  const summaryDiv = document.getElementById("summary");

  let formData = {}; // varaible for form data

  let currentStep = 0;

  function showStep(stepIndex) {
    steps[currentStep].style.display = "none";

    if (stepIndex < steps.length) {
      steps[stepIndex].style.display = "block";
      currentStep = stepIndex;
    } else {
      // Display confirmation step
      displayConfirmation();
    }

    updateBtns();
  }

  function displayConfirmation() {
    confirmationStep.style.display = "block";
    displaySummary();
  }

  // Display the summary of all form data
  function displaySummary() {
    let summaryHtml =
      "<h3>Please check your Information before submission</h3><ul style='list-style: none; padding: 0; margin: 0; margin-bottom: 12px;'>";
    for (const [key, value] of Object.entries(formData)) {
      summaryHtml += `<li><strong>${key}:</strong> <span id="${key}-value">${value}</span></li>`;
    }
    summaryHtml += "</ul>";

    summaryDiv.innerHTML = summaryHtml;
  }

  function updateBtns() {
    const prevBtn = form.querySelector(".prev");
    const nextBtn = form.querySelector(".next");
    const submitBtn = form.querySelector(".submit");

    if (currentStep === steps.length - 1) {
      nextBtn.style.display = "none";
      submitBtn.style.display = "inline-block";
    } else {
      nextBtn.style.display = "inline-block";
      submitBtn.style.display = "none";
    }

    prevBtn.style.display = currentStep === 0 ? "none" : "inline-block";
  }

  // Function to validate email format
  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Validation before submitting the form
    const requiredInputs = Array.from(form.querySelectorAll("[required]"));
    const isValid = requiredInputs.every((input) => input.value.trim() !== "");

    const emailInput = form.querySelector("#email");
    const isEmailValid = validateEmail(emailInput.value.trim());

    if (!isValid || !isEmailValid) {
      const errorMessage = document.getElementById("error-message");
      errorMessage.textContent = "Please fill out all required fields and enter a valid email address.";
      return;
    }

    // Notify the user that the form has been submitted
    alert("Form submitted successfully");
  });

  form.addEventListener("click", function (e) {
    if (e.target.classList.contains("next")) {
      // Validation before moving to the next step
      const requiredInputs = Array.from(
        steps[currentStep].querySelectorAll("[required]")
      );
      const isValid = requiredInputs.every(
        (input) => input.value.trim() !== ""
      );

      if (isValid) {
        // Update form Data with current step data
        const inputs = Array.from(
          steps[currentStep].querySelectorAll("[name]")
        );

        inputs.forEach((input) => {
          if (input.type === "checkbox") {
            formData[input.name] = input.checked;
          } else if (input.type === "radio" && input.checked) {
            formData[input.name] = input.value;
          } else if (input.type !== "radio") {
            formData[input.name] = input.value;
          }
        });

        // Validate email on the second step
        if (currentStep === 0) {
          const emailInput = form.querySelector("#email");
          const isEmailValid = validateEmail(emailInput.value.trim());

          if (!isEmailValid) {
            const errorMessage = steps[currentStep].querySelector(".error-message");
            errorMessage.textContent = "Please enter a valid email address.";
            return;
          }
        }

        displaySummary();
        showStep(currentStep + 1);
      } else {
        // Display error message in the current step
        const errorMessage = steps[currentStep].querySelector(".error-message");
        errorMessage.textContent = "Please fill out all required fields.";
      }
    } else if (e.target.classList.contains("prev")) {
      showStep(currentStep - 1);
    }
  });

  form.addEventListener("input", updateBtns);

  showStep(currentStep); // Show the initial step
});
