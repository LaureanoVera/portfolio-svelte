<script>
  import { scrollAnimation } from "./ScrollAnimation.svelte";

  let imgProfileSrc = "images/profile.jpg";

  window.addEventListener("scroll", () => {
    scrollAnimation("left_animate", "animate__bounceInLeft");
  });
</script>

<section class="about section" id="about">
  <h2 class="section-title">
    <i class="fa-solid fa-user-astronaut" /> Sobre Mi
  </h2>
  <div class="about__container bd-grid">
    <div class="about__img animate__animated" id="left_animate">
      <img src={imgProfileSrc} alt="Laureano Verea" />
    </div>
    <div class="about__info-content">
      <h2 class="about__subtitle">Soy Laureano Vera</h2>
      <span class="about__profession">
        <span class="about__profesion-mod">&#60;</span>
        Desarrollador Frontend
        <span class="about__profesion-mod">/&#62;</span>
        <br />
        <span class="about__profesion-plus"
          >JavaScript - TypeScript - Svelte</span
        >
      </span>
      <p class="about__text">
        Hmm... constructor de tu futuro en la web y un super saiyan. Me alcanza
        simplemente con conquistar el mundo, yasupiste!. <br />
        Una descripcion muy corta ja, probablemente programador.
      </p>
      <h3 class="about__hobbies">Hobbies</h3>
      <ul>
        <li>Escuchar Musica</li>
        <li>Beber Cafe</li>
        <li>Artes Marciales</li>
      </ul>
      <div class="about__social">
        <a
          href="https://www.linkedin.com/in/laureano-vera-320086204/"
          target="_blank"
          class="about__social-icon"><i class="fab fa-linkedin-in" /></a
        >
        <a
          href="https://github.com/LaureanoVera"
          class="about__social-icon"
          target="_blank"><i class="fab fa-github" /></a
        >
      </div>
    </div>
  </div>
</section>

<style>
  .about__container {
    justify-content: center;
    text-align: center;
    row-gap: 2rem;
  }

  .about__img {
    display: flex;
    margin: auto;
    justify-content: center;
    widows: 120px;
    height: 120px;
    background-color: var(--first-color);
    border-radius: 50%;
    overflow: hidden;
  }

  .about__img img {
    width: 100%;
  }

  .about__subtitle,
  .about__hobbies {
    font-size: 1.25rem;
    color: var(--first-color);
    margin-bottom: var(--mb-1);
  }

  .about__text {
    margin-bottom: var(--mb-4);
    margin-left: var(--mb-2);
    text-align: start;
  }

  .about__profession {
    display: block;
    margin-bottom: var(--mb-4);
  }

  .about__profesion-mod {
    color: var(--first-color);
  }

  .about__profesion-plus {
    color: var(--text-color);
    opacity: 0.7;
  }

  .about__social-icon {
    font-size: 1.4rem;
    margin: var(--mb-1);
    color: var(--text-color);
    transition: 0.1s;
  }

  .about__social-icon:hover {
    color: var(--first-color);
    filter: drop-shadow(0 0 2px var(--dark-color));
  }

  @media screen and (min-width: 768px) {
    .about__container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      align-items: center;
      text-align: initial;
      padding: 4rem 0;
    }

    .about__img {
      width: 200px;
      height: 200px;
    }

    .about__text {
      margin-left: 0;
    }
  }
</style>
