document.addEventListener("DOMContentLoaded", function () {
  const links = document.querySelectorAll("a");
  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = link.getAttribute("href");
      if (!href || href.startsWith("#") || link.target === "_blank") return;

      e.preventDefault();
      document.querySelector(".page-content").classList.add("fade-exit-active");

      setTimeout(() => {
        window.location.href = href;
      }, 400);
    });
  });
});
