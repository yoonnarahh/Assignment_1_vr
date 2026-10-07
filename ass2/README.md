# PA2 — Matrix Transformations and Perspective

* **Student ID:** 22
* **Course:** AR/VR/XR Applications
* **Live Demo:** https://yoonnarahh.github.io/Assignment_1_vr/ass2/

## Personal Variant Parameters (ID: 22)
* **Assigned Solid:** Wedge (Ramp)
* **Orbit Period (T):** 8.0 seconds
* **Cube Spin Axis:** Normalized (1, 1, 1)
* **Orbit Plane:** Horizontal around Y-axis
* **Camera Configuration:** Eye (0, 2.5, 7), Field of View (FOV) 45°

## Project Overview
This assignment extends PA1 into an animated 3D WebGL scene driven by a real camera setup and transformation matrices using `glMatrix 2.8.1`:
* **Cube:** Centered at origin, spinning at 1.2 rad/s around the normalized (1,1,1) axis.
* **Wedge (Solid):** Orbits the cube at radius 2.5 units in a horizontal plane (T = 8s), spins around its own y-axis at 2.0 rad/s, and continuously pulses in scale according to $s(t) = 0.65 + 0.15 \cdot \sin(2\pi t / 3)$.
* **Camera & Projections:** Features configurable perspective and orthographic projections, calculated using separate Model, View, and Projection matrices ($P \times V \times M$).

## Interactive Controls
| Key | Action |
|---|---|
| `P` | Pause / Resume animation time $t$ |
| `O` | Toggle Projection (Perspective ↔ Orthographic) |
| `+` / `=` | Zoom In (Decrease FOV by 5°, min 20°) |
| `-` | Zoom Out (Increase FOV by 5°, max 100°) |
| `←` / `→` | Orbit camera eye horizontally around origin by ±5° |
| `R` | Reset camera, FOV, and animation time to default parameters |

## How to Run
1. Serve the workspace root directory using a local web server.
2. Open `ass2/index.html` in Chrome or Firefox.