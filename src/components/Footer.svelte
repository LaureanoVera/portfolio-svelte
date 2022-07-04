<script>
  let footerSrc = "images/profile.jpg";
</script>

<footer class="footer section">
  <div class="footer__container">
    <div class="footer__data">
      <img class="footer__image" src={footerSrc} alt="Laureano Vera Perfil" />
      <ul class="footer__sections">
        <li><a href="#home" class="footer__link">Home</a></li>
        <li><a href="#about" class="footer__link">Sobre mi</a></li>
        <li><a href="#education" class="footer__link">Educacion</a></li>
        <li><a href="#skills" class="footer__link">Habilidades</a></li>
        <li><a href="#portfolio" class="footer__link">Portfolio</a></li>
        <li><a href="#contact" class="footer__link">Contacto</a></li>
      </ul>
    </div>
    <div class="footer__copy">
      <p>&copy;Laureano Vera 2022</p>
    </div>
  </div>
</footer>

<style>
  .footer {
    transform: translateX(-20px);
    width: 100vw;
    background-color: var(--black-color);
  }

  .footer__container {
    display: grid;
    justify-items: center;
    row-gap: 2rem;
    margin: 0 auto;
  }

  .footer__image {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    margin: 0 auto;
    margin-bottom: var(--mb-2);
  }

  .footer__sections {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  .footer__sections a {
    margin-right: calc(var(--mb-1) + 0.25rem);
  }

  .footer__link {
    padding: 0.25rem 0;
    color: var(--text-color);
  }

  .footer__link:hover {
    color: var(--first-color);
  }

  .footer__copy {
    color: var(--text-color);
    font-weight: 400;
    font-size: 1rem;
    display: flex;
  }

  .footer__copy p {
    color: var(--first-color);
  }
</style>
