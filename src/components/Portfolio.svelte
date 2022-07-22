<script>
  import Card from "./Card.svelte";
  const projects = [
    {
      imgSrc: "images/project-01.png",
      title: "Batatabit",
      github: "https://github.com/LaureanoVera/todoapp-svelte",
      website: "https://the-batabit.netlify.app/",
      tech: "Html / Css / Js",
    },
    {
      imgSrc: "images/project-02.png",
      title: "TODOs App",
      github: "https://github.com/LaureanoVera/landing-page-de-starbuckst",
      website: "https://todoappglass.netlify.app/",
      tech: "Svelte / Bootstrap / localStorage",
    },
    {
      imgSrc: "images/project-03.png",
      title: "Crypto Market",
      github: "https://github.com/LaureanoVera/crypto-market",
      website: "https://crypto-market-web.netlify.app/",
      tech: "Svelte / CoinGecko API",
    },
    {
      imgSrc: "images/project-04.png",
      title: "Rockstars Michis",
      github: "https://github.com/LaureanoVera/rockstars-michis",
      website: "https://rockstar-michis.netlify.app/",
      tech: "Svelte / TheCat API",
    },
  ];
</script>

<section class="portfolio section" id="portfolio">
  <h2 class="section-title"><i class="fas fa-tasks" /> Portfolio</h2>
  <div class="portfolio__container bd-grid">
    {#each projects as project}
      <Card {...project} />
    {/each}
  </div>
</section>

<style>
  .portfolio__container {
    justify-content: center;
    row-gap: 2rem;
  }

  @media screen and (min-width: 768px) {
    .portfolio__container {
      grid-template-columns: repeat(2, 1fr);
      grid-template-rows: repeat(2, 1fr);
      column-gap: 2rem;
    }
  }
</style>
