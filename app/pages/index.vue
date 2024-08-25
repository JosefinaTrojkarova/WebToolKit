<template>
  <main>
    <h1>Hello, welcome to WebToolKit!</h1>
    <NuxtLink to="/explore">Explore the catalogue</NuxtLink>
    <p>Unsure what to use? Use our state-of-the-art system to find the best tools for your project.</p>
    <NuxtLink to="/form">Find the best tools for my project</NuxtLink>
    <Teleport to="body">
      <div ref="matterContainer" id="matter"></div>
    </Teleport>
  </main>
</template>

<script setup lang="ts">
import { render, h } from 'vue';
import Matter from 'matter-js'
import ToolCard from '~/components/ToolCard.vue'

const matterContainer = ref<HTMLElement | null>(null)
const { filteredTools } = useExplore()

const initMatter = () => {
  if (!matterContainer.value) return
  const containerWidth = matterContainer.value.clientWidth;
  const containerHeight = matterContainer.value.clientHeight;

  const Engine = Matter.Engine
  const Render = Matter.Render
  const Runner = Matter.Runner
  const Bodies = Matter.Bodies
  const Composite = Matter.Composite

  const engine = Engine.create({
    positionIterations: 20,
    velocityIterations: 20,
    gravity: {
      x: 0,
      y: 0
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
      frictionAir: 0.001,
      friction: 1,
      restitution: 1.25,
      render: { visible: false },
      chamfer: { radius: 10 },
    });

    Matter.Events.on(engine, 'afterUpdate', () => {
      container.style.left = `${body.position.x}px`;
      container.style.top = `${body.position.y}px`;
      container.style.transform = `translate(-50%, -50%) rotate(${body.angle}rad)`;
    });

    return body;
  });

  Composite.add(engine.world, toolCards);

  const wallOptions = { isStatic: true, render: { visible: false }, friction: 1 }

  const ground = Bodies.rectangle(containerWidth / 2, containerHeight + 30, containerWidth + 100, 60, wallOptions)
  const leftWall = Bodies.rectangle(-30, containerHeight / 2, 60, containerHeight * 5, wallOptions)
  const rightWall = Bodies.rectangle(containerWidth + 30, containerHeight / 2, 60, containerHeight * 500, wallOptions)
  const ceiling = Bodies.rectangle(containerWidth / 2, -30, containerWidth + 100, 60, wallOptions)

  /* for (let i = 0; i < 5; i++) {
      const circle = Bodies.circle(Math.random() * containerWidth, Math.random() * containerHeight / 2, 60, { friction: 1, restitution: 0.8 })
      const triangle = Bodies.polygon(Math.random() * containerWidth, Math.random() * containerHeight / 2, 5, 60, { friction: 1, restitution: 0.8 })
  
      Composite.add(engine.world, [circle, triangle])
    } */

  Composite.add(engine.world, [ground, leftWall, rightWall, ceiling])

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
  Runner.run(Runner.create(), engine)

  const handleResize = () => {
    if (!matterContainer.value) return
    matterRender.canvas.width = matterContainer.value.clientWidth
    matterRender.canvas.height = matterContainer.value.clientHeight

    const newWidth = matterContainer.value.clientWidth;
    const newHeight = matterContainer.value.clientHeight;

    Matter.Body.setPosition(ground, Matter.Vector.create(newWidth / 2, newHeight + 30))
    Matter.Body.setPosition(leftWall, Matter.Vector.create(-30, newHeight / 2))
    Matter.Body.setPosition(rightWall, Matter.Vector.create(newWidth + 30, newHeight / 2))
  }

  window.addEventListener('resize', handleResize)
}

onMounted(() => {
  initMatter()
})
</script>

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
