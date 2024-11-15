<template>
  <main>
    <div class="heading">
      <h1>Find the <span class="orange">best</span> tools</h1>
      <h1>for your <span class="material-symbols-rounded">language</span>web-dev
        projects
      </h1>
    </div>
    <div class="buttons">
      <NuxtLink to="/explore" class="btn--primary--large">Explore</NuxtLink>
      <!-- <p>or</p>
      <NuxtLink to="/quiz" class="btn--secondary--large">Quiz</NuxtLink> -->
      <p>or</p>
      <span class="material-symbols-rounded" @click="startSlowdownEffect(engine)()">bomb</span>
    </div>
    <Teleport to="body">
      <div ref="matterContainer" id="matter"></div>
    </Teleport>
  </main>
</template>

<script setup lang="ts">
import { render } from 'vue';
import Matter, { Engine, type IBodyDefinition } from 'matter-js'
import MatterWrap from 'matter-wrap';
import ToolCard from '~/components/ToolCard.vue'

Matter.use(MatterWrap as any);
const matterContainer = ref<HTMLElement | null>(null)
const { filteredTools } = useExplore()

// Functions that need to be accessible globally
let handleResize = () => { }
let startSlowdownEffect: any = (engine: Matter.Engine) => { }
let engine: Engine

onMounted(() => {
  if (!matterContainer.value) return
  const containerWidth = matterContainer.value.clientWidth;
  const containerHeight = matterContainer.value.clientHeight;

  const Engine = Matter.Engine
  const Render = Matter.Render
  const Runner = Matter.Runner
  const Bodies = Matter.Bodies
  const Composite = Matter.Composite
  const Events = Matter.Events
  const Body = Matter.Body
  const Common = Matter.Common

  engine = Engine.create({
    positionIterations: 20,
    velocityIterations: 20,
    gravity: {
      x: 0,
      y: 1
    }
  })

  const matterRender = Render.create({
    element: matterContainer.value,
    engine: engine,
    options: {
      width: containerWidth,
      height: containerHeight,
      background: 'transparent',
      wireframes: false
    }
  })

  const toolCards = [...filteredTools.value, ...filteredTools.value].map((data) => {
    const x = Math.random() * containerWidth;
    const y = Math.random() * containerHeight;

    const vNode = h(ToolCard, {
      data,
      alt: 'homepage',
      hover: false,
      style: {
        position: 'absolute',
        width: 'fit-content',
        height: 'fit-content',
      }
    });

    const container = document.createElement('div');
    container.style.display = 'inline-block';
    container.style.position = 'absolute';
    container.style.zIndex = '-1';

    render(vNode, container);
    matterContainer.value!.appendChild(container);

    const toolCardElement = container.firstElementChild || container;
    const actualWidth = toolCardElement.getBoundingClientRect().width;
    const actualHeight = toolCardElement.getBoundingClientRect().height;
    container.style.width = `${actualWidth}px`;
    container.style.height = `${actualHeight}px`;

    const body = Bodies.rectangle(x, y, actualWidth, actualHeight, {
      frictionAir: 0,
      friction: 0.5,
      restitution: 0.5,
      render: { visible: false },
      chamfer: { radius: 10 },
      plugin: {
        wrap: {
          min: { x: 0, y: 0 },
          max: { x: containerWidth, y: containerHeight }
        }
      }
    } as IBodyDefinition);

    Events.on(engine, 'afterUpdate', () => {
      container.style.left = `${body.position.x}px`;
      container.style.top = `${body.position.y}px`;
      container.style.transform = `translate(-50%, -50%) rotate(${body.angle}rad)`;
    });

    return body;
  });

  Composite.add(engine.world, toolCards);

  const ground = Bodies.rectangle(containerWidth / 2, containerHeight + 30, containerWidth + 500, 60,
    { isStatic: true, render: { visible: false }, friction: 0.5 })

  Composite.add(engine.world, [ground]);

  /* const circles = Array.from({ length: 10 }, () => {
    const x = Math.random() * containerWidth;
    const y = Math.random() * containerHeight;

    const radius = Math.random() * 50 + 20;

    return Bodies.circle(x, y, radius, {
      frictionAir: 0,
      friction: 0.5,
      restitution: 0.5,
      render: { visible: true },
      plugin: {
        wrap: {
          min: { x: 0, y: 0 },
          max: { x: containerWidth, y: containerHeight }
        }
      }
    } as IBodyDefinition);
  });
  Composite.add(engine.world, circles); */

  const mouse = Matter.Mouse.create(matterRender.canvas)
  const mouseConstraint = Matter.MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 1,
      render: { visible: false }
    }
  })

  Composite.add(engine.world, mouseConstraint)

  Render.run(matterRender)
  const runner = Runner.create()
  Runner.run(runner, engine)

  // Explosion function
  const explosionForce = 0.4;

  const explosion = (engine: Matter.Engine) => {
    const bodies = Composite.allBodies(engine.world);

    for (let i = 0; i < bodies.length; i++) {
      const body = bodies[i];

      if (!body?.isStatic && body) {
        const forceMagnitude = explosionForce * body.mass;

        // Generate a random angle in radians
        const angle = Math.random() * Math.PI * 2;

        // Calculate force components using trigonometry for random directions
        const forceX = forceMagnitude * Math.cos(angle);
        const forceY = forceMagnitude * Math.sin(angle);

        Body.applyForce(body, body.position, {
          x: forceX,
          y: forceY
        });
      }
    }
  };

  // Time scaling
  startSlowdownEffect = (engine: Matter.Engine) => {
    let isRunning = false;
    let eventListener = (event: any) => { };

    function runEffect() {
      if (isRunning) return; // Ignore if already running
      isRunning = true;

      let timeScaleTarget = 1,
        lastTime = Common.now() - 2000, // Start 2 seconds in the past
        hasSlowedDown = false,
        speedUpTime: number | null = null;

      //console.log("Slowdown effect started");

      eventListener = (event: any) => {
        let timeScale = (event.delta || (1000 / 60)) / 1000;
        let currentTime = Common.now();

        // tween the timescale for bullet time slow-mo
        engine.timing.timeScale += (timeScaleTarget - engine.timing.timeScale) * 12 * timeScale;

        // every 2 sec (real time)
        if (currentTime - lastTime >= 2000) {
          if (!hasSlowedDown) {
            // Slow down to bullet time
            timeScaleTarget = 0;
            hasSlowedDown = true;
            speedUpTime = currentTime + 2000; // Set time to speed up
            setTimeout(() => {
              explosion(engine);
            }, 10);
          } else if (hasSlowedDown && currentTime >= speedUpTime!) {
            // Speed back up to normal time
            timeScaleTarget = 1;
            // Effect is complete, remove listener and reset
            setTimeout(() => {
              Events.off(engine, 'afterUpdate', eventListener);
              isRunning = false;
              //console.log("Slowdown effect completed");
            }, 1500);
          }

          // update last time
          lastTime = currentTime;
        }

        //console.log("Current timeScale:", engine.timing.timeScale);
      };

      Events.on(engine, 'afterUpdate', eventListener);
    }

    return runEffect;
  }

  startSlowdownEffect(engine)();

  handleResize = () => {
    if (!matterContainer.value) return
    const newWidth = matterContainer.value.clientWidth;
    const newHeight = matterContainer.value.clientHeight;

    matterRender.canvas.width = newWidth
    matterRender.canvas.height = newHeight

    Matter.Body.setPosition(ground, Matter.Vector.create(newWidth / 2, newHeight + 30))

    // Update wrap boundaries for all bodies
    const allBodies = Composite.allBodies(engine.world);
    for (let i = 0; i < allBodies.length; i++) {
      const body = allBodies[i];
      if (body && body.plugin && 'wrap' in body.plugin) {
        (body.plugin as any).wrap = {
          min: { x: 0, y: 0 },
          max: { x: newWidth, y: newHeight }
        };
      }
    }
  }

  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped lang="scss">
main {
  display: flex;
  flex-direction: column;

  gap: $xxl;
  padding: $xxl;

  .heading {
    display: flex;
    flex-direction: column;

    width: fit-content;
    z-index: -2;

    .orange {
      color: $secondary-400;
      font-style: italic;
    }

    .material-symbols-rounded {
      color: $primary-400;
      font-size: 5rem;
      font-variation-settings:
        'opsz' 48,
        'wght' 500,
        'FILL' 0,
        'GRAD' 100;

      transform: translateY(1.2rem);
      user-select: none;
      cursor: pointer;
    }
  }

  .buttons {
    display: flex;
    align-items: center;

    width: fit-content;
    z-index: 1;

    gap: $xl;

    .material-symbols-rounded {
      font-size: 3rem;
      color: $primary-400;
      font-variation-settings:
        'opsz' 48,
        'wght' 600,
        'FILL' 0,
        'GRAD' 100;
      cursor: pointer;
    }
  }
}
</style>

<style>
body {
  position: relative;
}

#matter {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
</style>
