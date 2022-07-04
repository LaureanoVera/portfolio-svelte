<script>
  export let date = 2022;
  export let name = "";
  export let list = [];
</script>

<div class="item">
  <div class="item__dot" />
  <div class="item__date">{date}</div>
  <div class="item__content">
    <h3>{name}</h3>
    <ul>
      {#each list as item}
        <li>{item}</li>
      {/each}
    </ul>
  </div>
</div>

<style>
  .item {
    margin-bottom: var(--mb-3);
    width: 100%;
    position: relative;
  }

  .item:last-child {
    margin-bottom: 0;
  }

  .item:nth-child(odd) {
    padding-right: calc(50% + 30px);
    text-align: right;
  }

  .item:nth-child(even) {
    padding-left: calc(50% + 30px);
  }

  .item__dot {
    height: 16px;
    width: 16px;
    background-color: var(--first-color);
    position: absolute;
    left: calc(50% - 8px);
    border-radius: 50%;
    top: 10px;
  }

  .item__date {
    font-size: 18px;
    color: var(--first-color);
    margin: var(--mb-1) 0 var(--mb-1);
  }

  .item__content {
    padding: var(--mb-1) var(--mb-2);
    border-radius: 8px;
  }

  .item__content h3 {
    color: var(--white-color);
    margin: 0 0 var(--mb-1);
    text-transform: capitalize;
    font-weight: 500;
  }

  .item__content ul {
    color: var(--text-color);
    font-weight: 400;
    line-height: 20px;
  }

  @media (max-width: 767px) {
    .item:nth-child(odd) {
      padding-right: 0;
      text-align: left;
    }

    .item:nth-child(odd),
    .item:nth-child(even) {
      padding-left: var(--mb-3);
    }

    .item__dot {
      left: 0;
    }
  }
</style>
