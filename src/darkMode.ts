const checkbox = document.getElementById("checkbox") as HTMLInputElement;
checkbox.addEventListener("change", () => {
  document.body.classList.toggle("dark");
  const elementsToToggle = document.querySelectorAll(".dark-mode-target");
  elementsToToggle.forEach((element) => {
    element.classList.toggle("dark");
  });
});
