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
import { render } from 'vue';
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
    gravity: {
      x: 0,
      y: 3
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

  const toolCards = filteredTools.value.slice(0, 5).map((data) => {
    const x = Math.random() * containerWidth;
    const y = Math.random() * containerHeight; // Ensure they start within the top half of the screen
    const width = 500;
    const height = 256;

    const body = Bodies.rectangle(x, y, width, height, {
      frictionAir: 0.001,
      friction: 0.3,
      restitution: 0.5,
      render: { visible: false },
      chamfer: { radius: 10 },
    })

    const vNode = h(ToolCard, {
      data,
      alt: 'homepage',
      style: {
        position: 'absolute',
        width: `${width}px`,
        height: `${height}px`,
        transform: `translate(-50%, -50%)`,
      }
    })

    const container = document.createElement('div')
    render(vNode, container)
    matterContainer.value!.appendChild(container)

    Matter.Events.on(engine, 'afterUpdate', () => {
      container.style.position = 'absolute'
      container.style.pointerEvents = 'none';
      container.style.left = `${body.position.x}px`
      container.style.top = `${body.position.y}px`
      container.style.transform = `translate(-50%, -50%) rotate(${body.angle}rad)`
    })

    return body
  })

  Composite.add(engine.world, toolCards)

  // Adjust walls dynamically
  const wallOptions = { isStatic: true, render: { visible: false }, friction: 0.3 }
  const ground = Bodies.rectangle(containerWidth / 2, containerHeight + 30, containerWidth + 100, 60, wallOptions)
  const leftWall = Bodies.rectangle(-30, containerHeight / 2, 60, containerHeight * 5, wallOptions)
  const rightWall = Bodies.rectangle(containerWidth + 30, containerHeight / 2, 60, containerHeight * 500, wallOptions)
  const circle = Bodies.circle(Math.random() * containerWidth, Math.random() * containerHeight / 2, 60, { friction: 0.3, restitution: 0.8 })
  const triangle = Bodies.polygon(Math.random() * containerWidth, Math.random() * containerHeight / 2, 3, 60, { friction: 0.3, restitution: 0.8 })

  Composite.add(engine.world, [ground, leftWall, rightWall, circle, triangle])

  const mouse = Matter.Mouse.create(matterRender.canvas)
  const mouseConstraint = Matter.MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
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
  z-index: 1;
  overflow: hidden;
}
</style>