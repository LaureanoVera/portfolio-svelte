<script>
  export let name;
</script>

<main>
  <h1>Hello {name}!</h1>
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
</style>
