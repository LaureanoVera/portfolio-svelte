<script context="module">
  let windowSize = window.innerHeight;

  export const scrollAnimation = (id, className) => {
    let element = document.getElementById(id);
    let position = element.getBoundingClientRect().top;

    if (position < windowSize) {
      element.classList.add(className);
    }
    if (position > windowSize || position < !windowSize) {
      element.classList.remove(className);
    }
  };
</script>
