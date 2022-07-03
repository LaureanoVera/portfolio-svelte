<script>
  let navTarget = document.querySelector(".nav__target");

  window.addEventListener("scroll", () => {
    const top = document.documentElement.scrollTop;
    const scroll = document.documentElement.scrollHeight;
    const client = document.documentElement.clientHeight;

    const height = scroll - client;
    const scrolled = (top / height) * 100;

    scrolled == 100
      ? (navTarget.style.color = `var(--first-color)`)
      : (navTarget.style.color = `var(--text-color)`);

    navTarget.innerHTML = `${scrolled.toFixed(2)}%`;
  });
</script>

<header class="l-header">
  <nav class="nav bd-grid">
    <ul class="nav__list">
      <li>
        <p class="nav__target">0.00%</p>
      </li>
      <li class="nav__item">
        <a
          href="../others/cv.pdf"
          target="_blank"
          download="cv.pdf"
          class="nav__link">Descargar CV</a
        >
      </li>
    </ul>
  </nav>
</header>

<style>
  .l-header {
    padding: calc(var(--mb-1) / 2) 0;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: var(--z-fixed);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(5px);
  }

  .nav {
    height: var(--header-height);
  }

  .nav__list {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .nav__link {
    position: relative;
    border-bottom: 2px solid transparent;
    padding: 0.5rem 1rem;
    background-color: transparent;
    color: var(--white-color);
    border-radius: 5px;
    transition: 0.35s;
    box-shadow: 0 0 3px var(--first-color);
  }

  .nav__link:hover {
    color: var(--first-color);
    box-shadow: 0 0 3px var(--white-color);
  }
</style>
