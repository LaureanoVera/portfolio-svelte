<script context="module">
  export const scroll = (id, className) => {
    let target = document.getElementById(id);
    let position = target.getBoundingClientRect().top;

    if (position > windowSize) {
      target.classList.add(className);
    }

    if (position > windowSize || position < !windowSize) {
      target.classList.remove(className);
    }
  };
</script>
