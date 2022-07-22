<script>
  export let imgSrc;
  export let title;
  export let github;
  export let website;
  export let tech;
</script>

<div class="card">
  <img src={imgSrc} alt={title} class="card__img" />
  <div class="card__link">
    <h3 class="card__title">{title}</h3>
    <div class="card__buttons">
      <a href={website} class="card__button" target="_blank"
        ><i class="fas fa-link" /> Visit</a
      >
      <a href={github} class="card__button" target="_blank"
        ><i class="fab fa-github" /> Code</a
      >
    </div>
  </div>
  <h6 class="card__tech">{tech}</h6>
</div>

<style>
  .card {
    position: relative;
    overflow: hidden;
    border-radius: 0.5rem;
  }

  .card img {
    height: 200px;
    width: 100%;
    object-fit: cover;
  }

  .card__link {
    position: absolute;
    bottom: 100%;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background: var(--gradient);
    border-radius: 0.5rem;
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    transition: 0.3s;
  }

  .card__title {
    text-transform: uppercase;
    color: var(--white-color);
    font-weight: 700;
  }

  .card__button {
    background-color: var(--dark-color);
    padding: calc(var(--mb-1) / 2) var(--mb-1);
    color: var(--white-color);
    border-radius: calc(var(--mb-1) / 2);
    transition: 0.3s;
  }

  .card__button:hover {
    color: var(--first-color);
  }

  .card__tech {
    text-transform: uppercase;
    text-align: end;
    padding-right: var(--mb-2);
    font-weight: 500;
    margin-top: 0.18rem;
  }

  .card:hover .card__link {
    bottom: 0;
  }
</style>
