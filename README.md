# PA2 — Matrix Transformations and Perspective

* **Student ID:** 22
* **Course:** AR/VR/XR Applications
* **Live Demo:** https://yoonnarahh.github.io/assignement_1_VR/

## Personal Variant Parameters (ID: 22)
* **Assigned Solid:** Wedge (Ramp)
* **Orbit Period (T):** 8.0 seconds ($6 + (2 \bmod 10)$)
* **Cube Spin Axis:** Normalized $(1, 1, 1)$ ($2 \bmod 3 = 2$)
* **Orbit Plane:** Horizontal around Y-axis ($0 \bmod 3 = 0$)
* **Camera Configuration:** Eye $(0, 2.5, 7)$, Field of View (FOV) $45^\circ$ ($0 \bmod 2 = 0$)

## Project Overview
This assignment extends PA1 into an animated 3D WebGL scene driven by a real camera setup and transformation matrices using `glMatrix 2.8.1`:
* **Cube:** Centered at origin, spinning at 1.2 rad/s around the normalized $(1,1,1)$ axis.
* **Wedge (Solid):** Orbits the cube at radius 2.5 units in a horizontal plane ($T = 8\text{s}$), spins around its own y-axis at 2.0 rad/s, and continuously pulses in scale according to $s(t) = 0.65 + 0.15 \cdot \sin(2\pi t / 3)$.
* **Camera & Projections:** Features configurable perspective and orthographic projections, calculated using separate Model, View, and Projection matrices ($P \times V \times M$).

## Interactive Controls
| Key | Action |
|---|---|
| `P` | Pause / Resume animation time $t$ |
| `O` | Toggle Projection (Perspective $\leftrightarrow$ Orthographic) |
| `+` / `=` | Zoom In (Decrease FOV by $5^\circ$, min $20^\circ$) |
| `-` | Zoom Out (Increase FOV by $5^\circ$, max $100^\circ$) |
| `←` / `→` | Orbit camera eye horizontally around origin by $\pm 5^\circ$ |
| `R` | Reset camera, FOV, and animation time to default parameters |

## How to Run
1. Serve the workspace root directory using a local web server (e.g., VS Code *Live Server* or `npx serve .`).
2. Open `index.html` in Chrome or Firefox