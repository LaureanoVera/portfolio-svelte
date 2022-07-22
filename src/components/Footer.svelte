<script>
  let footerSrc = "images/profile.jpg";
</script>

<footer class="footer section">
  <div class="footer__container">
    <div class="footer__data">
      <img class="footer__image" src={footerSrc} alt="Laureano Vera Perfil" />
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
    row-gap: 1rem;
    margin: 0 auto;
  }

  .footer__image {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    margin: 0 auto;
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
