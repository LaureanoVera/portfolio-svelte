<script>
  import TimeLineItem from "./TimeLineItem.svelte";

  let listInstitutions = [
    {
      name: "Google",
      date: "2020",
      list: [
        "Introduccion al Desarrollo Web",
        "Ciberseguridad en el Teletrabajo",
      ],
    },
    {
      name: "freeCodeCamp",
      date: "2020 - 2022",
      list: [
        "Frontend Basico (Html, Css)",
        "JavaScript",
        "Responsive Design",
        "Desarrollo de Videojuegos con JS",
        "Python",
      ],
    },
    {
      name: "Udemy",
      date: "2021",
      list: [
        "JavaScript ES6",
        "React/Svelte",
        "Node/Esxpress",
        "TypeScript",
        "MongoDB",
      ],
    },
    {
      name: "Platzi",
      date: "2021 - 2022",
      list: [
        "ECMAScript 6+",
        "Desarrollo Frontend",
        "JavaScript Asincrono",
        "Manipulacion de Arrays en JS",
        "Closures y Scope en JS",
        "Svelte",
        "NodeJS",
      ],
    },
  ];
</script>

<section class="timeline section" id="education">
  <h2 class="section-title">
    <i class="fa-solid fa-graduation-cap" /> Educacion
  </h2>
  <div class="timeline__items">
    {#each listInstitutions as institution}
      <TimeLineItem {...institution} />
    {/each}
  </div>
</section>

<style>
  .timeline {
    min-height: 100vh;
  }

  .timeline__items {
    max-width: 1024px;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    position: relative;
  }

  .timeline__items::before {
    content: "";
    position: absolute;
    width: 2px;
    height: 100%;
    background-color: #2f363e;
    left: calc(50% - 1px);
  }

  @media (max-width: 767px) {
    .timeline__items::before {
      left: 7px;
    }
  }
</style>
