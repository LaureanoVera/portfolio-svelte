<script>
  import Header from "./components/Header.svelte";
  import Main from "./components/Main.svelte";
</script>

<main>
  <Header />
  <Main />
</main>

<style>
  :global(:root) {
    --header-height: 3rem;
    --font-medium: 500;

    /* colores */
    --first-color: #14aafa;
    --white-color: #fafaff;
    --dark-color: #171d32;
    --text-color: #ced2da;

    /* fuente y tipo */
    --body-font: "Montserrat", sans-serif;
    --big-font-size: 8rem;
    --h2-font-size: 1.15rem;
    --normal-font-size: 0.938rem;
    --small-font-size: 0.813rem;

    /* margenes */
    --mb-1: 0.5rem;
    --mb-2: 1rem;
    --mb-3: 1.5rem;
    --mb-4: 2rem;

    /* z-index */
    --z-fixed: 100;
  }

  @media screen and (min-width: 768px) {
    :global(:root) {
      --body-font: "Montserrat", sans-serif;
      --big-font-size: 10.5rem;
      --h2-font-size: 2rem;
      --normal-font-size: 1rem;
      --small-font-size: 0.875rem;
    }
  }

  :global(*),
  :global(::before),
  :global(::after) {
    box-sizing: border-box;
  }

  :global(html) {
    scroll-behavior: smooth;
  }

  :global(body) {
    scroll-behavior: smooth;
    margin: 0;
    font-family: var(--body-font);
    font-size: var(--normal-font-size);
    font-weight: var(--font-medium);
    color: var(--text-color);
    line-height: 1.6;
    background-color: var(--dark-color);
    overflow-x: hidden;
  }

  :global(h1),
  :global(h2),
  :global(p) {
    margin: 0;
  }

  :global(ul) {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  :global(img) {
    max-width: 100%;
    height: auto;
    display: block;
  }

  :global(a),
  :global(a:hover) {
    text-decoration: none;
  }

  :global(.section) {
    padding: 3rem 0;
  }

  :global(.section-title) {
    position: relative;
    font-size: var(--h2-font-size);
    color: var(--first-color);
    margin: var(--mb-4) 0;
    text-align: center;
  }

  :global(.section-title::after) {
    position: absolute;
    content: "";
    width: 32px;
    height: 0.18rem;
    left: 0;
    right: 0;
    margin: 0 auto;
    top: 2rem;
    background-color: var(--white-color);
  }

  :global(.bd-grid) {
    max-width: 1024px;
    display: grid;
    grid-template-columns: 100%;
    grid-column-gap: 3rem;
    width: calc(100% - 3rem);
    margin-left: var(--mb-2);
    margin-right: var(--mb-2);
  }

  @media screen and (min-width: 768px) {
    :global(body) {
      margin: 0;
    }
    :global(.section) {
      padding-top: 4rem;
    }
    :global(.section-title) {
      margin-bottom: 3rem;
    }

    :global(.section-title::after) {
      width: 64px;
      top: 3rem;
    }
  }

  @media screen and (min-width: 1024px) {
    :global(.bd-grid) {
      margin: 0 auto;
    }
  }
</style>
