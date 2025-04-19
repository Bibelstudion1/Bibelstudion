// main.js – Bibelstudion

document.addEventListener("DOMContentLoaded", () => {
    console.log("Bibelstudion är laddad och klar!");
  
    // Smooth scroll till länkar med #
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    scrollLinks.forEach(link => {
      link.addEventListener("click", e => {
        const target = document.querySelector(link.getAttribute("href"));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }
      });
    });
  
    // Scroll-effekt: lägg till skugga på header vid scroll
    const header = document.querySelector(".site-header");
    window.addEventListener("scroll", () => {
      if (window.scrollY > 10) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    });
  
    // Kommande: mobilmeny
    const menuToggle = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector(".main-nav");
  
    if (menuToggle && navMenu) {
      menuToggle.addEventListener("click", () => {
        navMenu.classList.toggle("active");
      });
    }
  });
  