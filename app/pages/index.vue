<script setup lang="ts">

</script>

<template>
  <main>
    <article class="heading">
      <h1>Find the best web-dev<br>tools in <span class="orange">minutes</span></h1>
      <p>WebToolKit is a community-driven catalogue of web development tools made <b>by web-devs for web-devs.</b></p>
    </article>
    <section class="options">
      <NuxtLink to="/explore" class="catalogue">
        <h2 class="h1">CATALOGUE</h2>
        <img src="/landing-catalogue.png" alt="WebToolKit catalogue page">
      </NuxtLink>
      <section class="catalogue-note">
        <p class="h4">Looking for<br>something specific?</p>
        <svg width="222" height="211" viewBox="0 0 222 211" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g id="Curved Arrow Icon 1">
            <path id="Vector" d="M169.286 56.217C135.211 120.707 57.1023 123.17 42.4075 125.43" stroke="#13469A" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
            <path id="Vector_2" d="M59.8886 149.259C48.386 133.76 42.5276 125.737 42.3133 125.188C41.9918 124.365 53.4684 113.241 56.3927 102.008" stroke="#13469A" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
          </g>
        </svg>
      </section>
      <section class="quiz-note">
        <svg width="183" height="166" viewBox="0 0 183 166" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g id="Curved Arrow Icon 2">
            <path id="Vector" d="M17.7839 103.75C75.0452 58.5708 147.467 87.9336 161.819 91.8151" stroke="#13469A" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
            <path id="Vector_2" d="M155.479 62.95C159.724 81.7778 161.834 91.4858 161.808 92.0743C161.768 92.9571 146.771 98.4841 139.55 107.573" stroke="#13469A" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
          </g>
        </svg>
        <p class="h4">Unsure what’s the<br>best for you?</p>
      </section>
      <NuxtLink to="/quiz" class="quiz">
        <h2 class="h1">QUIZ</h2>
        <img src="/landing-quiz.png" alt="WebToolKit quiz page">
      </NuxtLink>
    </section>
  </main>
</template>

<style scoped lang="scss">
main {
  display: flex;
  flex-direction: column;
  align-items: center;

  height: calc(100vh - 10rem);
  overflow: hidden;

  gap: $xxl * 4;
  padding: $xxl;

  .heading {
    display: flex;
    flex-direction: column;
    align-items: center;

    width: fit-content;
    text-align: center;
    gap: $l;

    .orange {
      color: $secondary-400;
      font-style: italic;
    }

    p {
      width: 400px;
    }

    b {
      font-weight: 800;
    }
  }

  .options {
    position: relative;
    display: flex;
    justify-content: center;

    width: 100%;
    gap: 25rem;

    .catalogue, .quiz {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: $s;
      transition: transform 0.3s ease-out;

      img {
        max-width: 70rem;
        border: 0.1rem solid $primary-100;
        border-radius: $xxl;
        overflow: hidden;
      }

      &:hover {
        transform: translateX(0.5rem) translateY(-1rem);
      }
    }

    .quiz {
      align-items: unset;

      &:hover {
        transform: translateX(-0.5rem) translateY(-1rem);
      }
    }

    .catalogue-note {
      position: absolute;
      left: 30rem;

      p {
        position: absolute;
        top: -1rem;
        right: -3rem;
      }
    }

    .quiz-note {
      position: absolute;
      right: 32rem;
      top: 5rem;

      p {
        position: absolute;
        top: 8rem;
        left: -3.5rem;
      }
    }
  }
}
</style>
