# BRADEngine

BRADEngine is a lightweight JavaScript canvas game engine I built years ago as a teaching tool for my kids.

The goal was not to make a commercial engine. It was to give us a playground where we could build games, physics demos, 3D experiments, networking projects, and machine-learning toys while learning how programming systems fit together. The repo includes the engine code, shared media, example projects, and lesson material from that period.

I recently cleaned up the repository so it can run from a fresh clone with portable paths and a single `src/` engine folder. Some examples are historical and still a little rough around the edges, but that is part of the story: this was a real learning workspace, not a polished template app.

## Running It

From the repository root:

```bat
serveLocal.bat
```

or:

```bash
node serveLocal.js
```

Then open:

```text
http://localhost:8000/
```

Most demos can also be opened directly by path under `examples/` or `learning/`.

The repository root includes an AI-generated arcade-style demo launcher:
[BradEngine Arcade](https://squareparticle.github.io/BradEngine_Public/). It is
a quick visual index for browsing and opening all of the demo pages in this repo
from one place.

## Features

- Custom canvas game loop with level lifecycle hooks such as `loadResources()`, `setup()`, and `update(delta)`.
- Project media discovery through `findResources()` and a portable `src/js/dirlist.js` manifest.
- Shared image, sound, and font loading from `src/sharedMedia`.
- Homemade 3D rendering pipeline with meshes, cameras, lighting, terrain, height maps, morphing meshes, and voxel chunks.
- Web Worker based voxel terrain generation for the voxel terrain demo.
- Networking demos using WebRTC/PeerJS patterns for host/join multiplayer experiments.
- Artificial neural network and machine-learning examples, including pong and graph/training experiments.
- Homemade 2D physics and collision experiments.
- Off-the-shelf physics experiments using libraries such as Box2D, Cannon.js, and Three.js.
- Event-driven examples, drawing tools, cellular automata, ray casting, and classic arcade-style projects.
- Per-page configuration through each demo's `index.html`, including display sizing, debug flags, network flags, and engine script loading.

## Repository Shape

- `src/` - shared engine code, libraries, styles, and common media.
- `examples/` - standalone demos that show engine capabilities.
- `learning/` - lesson projects and assignments from teaching sessions.
- `docs/` - older documentation and portfolio pages.
- `serveLocal.js` - small local static server for running the demos.

## Top 10 Projects To Try

1. Asteroids 3D  
   [Run](https://squareparticle.github.io/BradEngine_Public/examples/3d/asteroids3D/index.html) | [Source](examples/3d/asteroids3D/index.html)  
   A larger 3D game experiment with meshes, HUD images, camera controls, and space-themed gameplay.

2. Space Boss  
   [Run](https://squareparticle.github.io/BradEngine_Public/examples/eventDriven/spaceBoss/index.html) | [Source](examples/eventDriven/spaceBoss/index.html)  
   An event-driven action game with layered images, bullets, enemy parts, and boss-style interactions.

3. Voxel Engine  
   [Run](https://squareparticle.github.io/BradEngine_Public/examples/3d/3dGraphicsEngine/voxelEngine.html) | [Source](examples/3d/3dGraphicsEngine/voxelEngine.html)  
   A blocky voxel world with generated chunks, localStorage-backed terrain, a player model, and a homemade 3D pipeline.

4. Texture Raycasting Demo  
   [Run](https://squareparticle.github.io/BradEngine_Public/examples/3d/raycasting/texturedRaycasting.html) | [Source](examples/3d/raycasting/texturedRaycasting.html)  
   A ray-casting experiment with texture sampling for an early first-person 3D rendering effect.

5. Cloth Flag Physics  
   [Run](https://squareparticle.github.io/BradEngine_Public/examples/3d/cloth/flag.html) | [Source](examples/3d/cloth/flag.html)  
   A cloth simulation experiment shaped into a flag-like mesh using physics and 3D rendering.

6. Fire Finger  
   [Run](https://squareparticle.github.io/BradEngine_Public/examples/drawing/cellularAutomaton/firefinger.html) | [Source](examples/drawing/cellularAutomaton/firefinger.html)  
   An interactive cellular automata fire demo that responds to pointer-style input.

7. Solar System  
   [Run](https://squareparticle.github.io/BradEngine_Public/examples/3d/solarsystem/index.html) | [Source](examples/3d/solarsystem/index.html)  
   A 3D orbital demo with shared planet images and camera-driven rendering.

8. Cellular Automaton Sand Sim  
    [Run](https://squareparticle.github.io/BradEngine_Public/examples/drawing/cellularAutomaton/sandsim.html) | [Source](examples/drawing/cellularAutomaton/sandsim.html)  
    A drawing/simulation experiment with image data and cellular-style state changes.

9. Starfield  
   [Run](https://squareparticle.github.io/BradEngine_Public/examples/3d/starfield/index.html) | [Source](examples/3d/starfield/index.html)  
   A compact 3D movement and rendering experiment.

10. ANN XOR  
    [Run](https://squareparticle.github.io/BradEngine_Public/examples/machineLearning/ann/index.html) | [Source](examples/machineLearning/ann/index.html)  
    A neural-network visualization that trains against XOR-style inputs and displays the learned output field.

## License

The original BRADEngine code and documentation in this repository are licensed
under the PolyForm Noncommercial License 1.0.0.

Required Notice: Copyright 2019 squareparticle

This means the project is available for personal, educational, research, hobby,
and other noncommercial uses. Commercial use, including selling the code or
commercially repackaging it, is not granted by this license.

Bundled third-party libraries and assets remain under their own licenses and
notices. In particular, files under `src/js/lib/` and `docs/vendor/` may include
their own copyright and license terms.

## Notes

This project is intentionally preserved as a historical teaching codebase. I am cleaning up portability, copyrighted assets, and presentation, but the core structure and examples reflect the original work and the way it was used for learning.

The cellular automata examples include original JavaScript implementations of
well-known rule systems, including Conway's Game of Life and elementary
cellular automata rule-number experiments.

The machine-learning examples were created while working through a mix of Udemy
course material and The Coding Train tutorials, then adapted into this teaching
codebase.
