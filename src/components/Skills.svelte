<script>
  import { scrollAnimation } from "./ScrollAnimation.svelte";

  let skillsImgSrc = "images/skills.svg";

  addEventListener("scroll", () => {
    scrollAnimation("right_animate", "animate__bounceInRight");
  });
</script>

<section class="skills section" id="skills">
  <h2 class="section-title">
    <i class="fas fa-code" /> Habilidades
  </h2>
  <div class="skills__container bd-grid">
    <div class="skills__box">
      <h3 class="skills__subtitle">Desarrollo</h3>
      <span class="skills__name">Html</span>
      <span class="skills__name">Css</span>
      <span class="skills__name">Javascript</span>
      <span class="skills__name">Python</span>
      <span class="skills__name">MongoDB</span>
      <span class="skills__name">Express</span>
      <span class="skills__name">Svelte</span>
      <span class="skills__name">Nodejs</span>

      <h3 class="skills__subtitle">Herramientas</h3>
      <span class="skills__name">Git</span>
      <span class="skills__name">Github</span>
      <span class="skills__name">NPM</span>
      <span class="skills__name">Terminal</span>

      <h3 class="skills__subtitle">Soft</h3>
      <span class="skills__name">Flexibilidad</span>
      <span class="skills__name">Compromiso</span>
      <span class="skills__name">Creatividad</span> <br />
      <span class="skills__name">Aprendizaje independiente</span>
    </div>

    <div class="skills__img animate__animated" id="right_animate">
      <img src={skillsImgSrc} alt="Skills" />
    </div>
  </div>
</section>

<style>
  .skills__container {
    row-gap: 2rem;
  }

  .skills__subtitle {
    color: var(--first-color);
    margin-bottom: var(--mb-3);
  }

  .skills__name {
    font-size: var(--small-font-size);
    padding: 0.25rem 0.5rem;
    margin-right: var(--mb-2);
    box-shadow: 0 0 2px var(--text-color);
    border-radius: 0.25rem;
    cursor: none;
    line-height: 1.9rem;
  }

  .skills__name:hover {
    background-color: var(--first-color);
    color: var(--text-color);
    transition: 0.252s;
  }

  @media screen and (min-width: 768px) {
    .skills__container {
      grid-template-columns: 1fr 1fr;
      align-items: center;
    }

    .skills__name {
      line-height: 2rem;
    }
  }
</style>
