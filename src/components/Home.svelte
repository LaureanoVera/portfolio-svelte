<script>
  let imgSrc = "images/perfil.svg";

  const heroAnimation = () => {
    let heroImage = document.getElementById("hero_image");
    let heroText = document.getElementById("hero_text");

    heroImage.classList.add("animate__zoomInRight");
    heroText.classList.add("animate__flipInX");
  };

  document.addEventListener("DOMContentLoaded", heroAnimation);
</script>

<section class="home" id="home">
  <div class="home__container bd-grid">
    <h1 class="home__title animate__animated" id="hero_text">
      <span>HO</span> <br />_LA
    </h1>
    <div class="home__scroll">
      <a href="#about" class="home__scroll-link"
        ><i class="fas fa-arrow-up" /> Scroll down</a
      >
    </div>
    <img
      src={imgSrc}
      class="home__img animate__animated"
      alt="Home"
      id="hero_image"
    />
  </div>
</section>

<style>
  .home {
    position: relative;
    overflow: hidden;
    height: 100vh;
  }

  .home__container {
    height: 100vh;
  }

  .home__title {
    align-self: flex-end;
    font-size: calc(var(--big-font-size) - 2rem);
    color: var(--white-color);
    line-height: 0.8;
  }

  .home__title span {
    text-shadow: 0 20px 25px rgba(0, 0, 0, 0.5);
  }

  .home__scroll {
    align-self: flex-end;
    padding-bottom: var(--mb-4);
  }

  .home__scroll-link {
    writing-mode: vertical-lr;
    transform: rotate(-180deg);
    color: var(--white-color);
  }

  .home__img {
    opacity: 1;
    filter: opacity(1);
    position: absolute;
    right: 4%;
    bottom: 0;
    max-height: 198px;
    filter: drop-shadow(0 5px 3px var(--text-color));
  }

  @media screen and (min-width: 768px) {
    .home__container {
      height: 100vh;
      grid-template-rows: 1.7fr 1fr;
      row-gap: 0;
    }

    .home__title {
      font-size: var(--big-font-size);
    }

    .home__img {
      max-height: none;
      height: auto;
      width: 32%;
      right: 10%;
      bottom: 10%;
      animation: move 12s infinite;
    }
  }

  @keyframes move {
    10%,
    30%,
    50%,
    70%,
    90% {
      transform: translateY(1em);
    }
    20%,
    40%,
    60%,
    80%,
    100% {
      transform: translateY(-1em);
    }
  }
</style>
