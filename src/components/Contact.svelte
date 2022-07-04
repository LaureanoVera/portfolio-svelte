<script>
  let contactSrc = "images/contact.svg";
</script>

<section class="contact section" id="contact">
  <h2 class="section-title"><i class="far fa-id-card" /> Contacto</h2>
  <div class="contact__container bd-grid">
    <div class="contact__info animate__animated" id="contact_info">
      <h3 class="contact__subtitle">EMAIL</h3>
      <span class="contact__text">laureanoigvera@gmail.com</span>
      <h3 class="contact__subtitle">PAIS</h3>
      <span class="contact__text">Argentina, Buenos Aires</span>
      <h3 class="contact__subtitle">LINKEDIN</h3>
      <span class="contact__text">Laureano Vera</span>
    </div>
    <img src={contactSrc} alt="Contact" />
  </div>
</section>

<style>
  .contact__container {
    row-gap: 2rem;
    min-height: 60vh;
  }

  .contact__subtitle {
    font-size: var(--normal-font-size);
    color: var(--first-color);
  }

  .contact__text {
    display: inline-block;
    margin-bottom: var(--mb-1);
  }

  @media screen and (min-width: 768px) {
    .contact__container {
      grid-template-columns: repeat(2, 1fr);
      justify-items: center;
    }
  }
</style>
