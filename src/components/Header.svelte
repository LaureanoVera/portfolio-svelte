<script>
  let cvSrc = "others/cv.pdf";
  let scrolled;
  let newText;

  // let navTarget = document.querySelector(".nav__target");

  window.addEventListener("scroll", () => {
    const top = document.documentElement.scrollTop;
    const scroll = document.documentElement.scrollHeight;
    const client = document.documentElement.clientHeight;

    const height = scroll - client;
    scrolled = (top / height) * 100;

    let newInnerHTML = `${scrolled.toFixed(2)}%`;
    newText.innerHTML = newInnerHTML;
  });
</script>

<header class="l-header">
  <nav class="nav bd-grid">
    <ul class="nav__list">
      <li>
        <p
          class="nav__target"
          class:scroll-full={scrolled == 100}
          bind:this={newText}
        >
          0.00%
        </p>
      </li>
      <li class="nav__item">
        <a
          href={cvSrc}
          target="_blank"
          download="laureano_vera.pdf"
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

  .scroll-full {
    color: var(--first-color);
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

  @media screen and (min-width: 768px) {
    .nav__list {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }

    .nav__item {
      margin-left: var(--mb-4);
      margin-bottom: 0;
    }
  }
</style>
