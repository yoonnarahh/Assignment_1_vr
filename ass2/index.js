/*========== Global Variables & Helper State ==========*/
const state = {
  t: 0,
  paused: false,
  ortho: false,
  fovDeg: 45,
  azimuth: 0, // Поворот камеры стрелками <- / ->
  fps: 0
};

// Параметры твоей фигуры (ID: 22)
const VARIANT = {
  id: "22",
  orbitPeriod: 8.0,    // T = 6 + 2 = 8s
  cubeAxis: [1, 1, 1],  // Вращение куба по нормализованной оси (1,1,1)
  camEye: [0, 2.5, 7],
  camTarget: [0, 0, 0],
  camUp: [0, 1, 0]
};

// Нормализация оси вращения куба
vec3.normalize(VARIANT.cubeAxis, VARIANT.cubeAxis);

main();

function main() {
  const canvas = document.querySelector("#c");
  const gl = canvas.getContext("webgl");
  if (!gl) { alert("WebGL 1.0 unavailable"); return; }

  /*========== Task A: Geometry Setup (One-Time) ==========*/
  const cubePositions = getCenteredCubeVertices();
  const wedgePositions = getWedgeVertices();
  const positions = [...cubePositions, ...wedgePositions];
  const colors = getColors();

  // Task D: Проверка соответствия длин массивов позиций и цветов
  const totalVertices = positions.length / 3;
  console.assert(
    colors.length === totalVertices * 4,
    `Color array size mismatch: expected ${totalVertices * 4}, got ${colors.length}`
  );

  const buffers = initBuffers(gl, positions, colors);

  /*========== Task C: Shaders with P x V x M ==========*/
  const vsSource = `
    attribute vec4 aPosition;
    attribute vec4 aVertexColor;
    uniform mat4 uModelMatrix;
    uniform mat4 uViewMatrix;
    uniform mat4 uProjectionMatrix;
    varying lowp vec4 vColor;
    void main() {
      gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * aPosition;
      vColor = aVertexColor;
    }
  `;

  const fsSource = `
    varying lowp vec4 vColor;
    void main() {
      gl_FragColor = vColor;
    }
  `;

  const program = createProgram(gl, createShader(gl, gl.VERTEX_SHADER, vsSource), createShader(gl, gl.FRAGMENT_SHADER, fsSource));
  gl.useProgram(program);

  const aPosLoc = gl.getAttribLocation(program, "aPosition");
  const aColLoc = gl.getAttribLocation(program, "aVertexColor");

  const uModelLoc = gl.getUniformLocation(program, "uModelMatrix");
  const uViewLoc = gl.getUniformLocation(program, "uViewMatrix");
  const uProjLoc = gl.getUniformLocation(program, "uProjectionMatrix");

  // Привязка атрибутов (выполняется 1 раз вне рендер-цикла)
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
  gl.vertexAttribPointer(aPosLoc, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(aPosLoc);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
  gl.vertexAttribPointer(aColLoc, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(aColLoc);

  /*========== Canvas Resize Handling ==========*/
  let aspect = 1.0;
  function resize() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    gl.viewport(0, 0, canvas.width, canvas.height);
    aspect = canvas.clientWidth / canvas.clientHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  /*========== Task E: Keyboard Controls ==========*/
  document.addEventListener("keydown", (e) => {
    if (e.key === "p" || e.key === "P") state.paused = !state.paused;
    if (e.key === "o" || e.key === "O") state.ortho = !state.ortho;
    if (e.key === "+" || e.key === "=") state.fovDeg = Math.min(100, state.fovDeg + 5);
    if (e.key === "-") state.fovDeg = Math.max(20, state.fovDeg - 5);
    if (e.key === "ArrowLeft") state.azimuth -= 5 * (Math.PI / 180);
    if (e.key === "ArrowRight") state.azimuth += 5 * (Math.PI / 180);
    if (e.key === "r" || e.key === "R") {
      state.t = 0; state.azimuth = 0; state.fovDeg = 45; state.paused = false; state.ortho = false;
    }
  });

  /*========== Task D: Animation & Render Loop ==========*/
  let then = 0;
  let frameCount = 0;
  let lastFpsUpdate = 0;

  function render(now) {
    now *= 0.001; // Перевод миллисекунд в секунды
    const dt = Math.min(now - then, 0.1); // Clamp dt to max 0.1s
    then = now;

    if (!state.paused) {
      state.t += dt;
    }

    // Подсчет FPS
    frameCount++;
    if (now - lastFpsUpdate >= 1.0) {
      state.fps = frameCount;
      frameCount = 0;
      lastFpsUpdate = now;
    }

    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.12, 0.12, 0.12, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // --- 1. Projection Matrix ---
    const projMatrix = mat4.create();
    if (state.ortho) {
      const halfH = 3.5;
      mat4.ortho(projMatrix, -halfH * aspect, halfH * aspect, -halfH, halfH, 0.1, 100.0);
    } else {
      mat4.perspective(projMatrix, state.fovDeg * (Math.PI / 180), aspect, 0.1, 100.0);
    }
    gl.uniformMatrix4fv(uProjLoc, false, projMatrix);

    // --- 2. View Matrix (Camera + Arrow Azimuth) ---
    const viewMatrix = mat4.create();
    const rotatedEye = vec3.create();
    vec3.rotateY(rotatedEye, VARIANT.camEye, VARIANT.camTarget, state.azimuth);
    mat4.lookAt(viewMatrix, rotatedEye, VARIANT.camTarget, VARIANT.camUp);
    gl.uniformMatrix4fv(uViewLoc, false, viewMatrix);

    const cubeCount = cubePositions.length / 3;
    const wedgeCount = wedgePositions.length / 3;

    // --- 3. Draw Cube ---
    const mCube = cubeModelMatrix(state.t);
    gl.uniformMatrix4fv(uModelLoc, false, mCube);
    gl.drawArrays(gl.TRIANGLES, 0, cubeCount);

    // --- 4. Draw Solid (Wedge) ---
    const mSolid = solidModelMatrix(state.t);
    gl.uniformMatrix4fv(uModelLoc, false, mSolid);
    gl.drawArrays(gl.TRIANGLES, cubeCount, wedgeCount);

    // --- Status Label Update ---
    document.querySelector("#status").textContent =
      `ID: ${VARIANT.id} | Proj: ${state.ortho ? "Ortho" : "Persp"} | FOV: ${state.fovDeg}° | t: ${state.t.toFixed(1)}s | FPS: ${state.fps}`;

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

/*========== Task B: Model Matrix Transformations ==========*/

// Куб вращается на месте со скоростью 1.2 rad/s вокруг своей оси
function cubeModelMatrix(t) {
  const m = mat4.create();
  mat4.rotate(m, m, 1.2 * t, VARIANT.cubeAxis);
  return m;
}

// Solid (Wedge): Orbit + Self-spin + Pulse
function solidModelMatrix(t) {
  const m = mat4.create();

  // 1. Орбита вокруг куба (Радиус 2.5, период T=8s)
  const orbitAngle = (2 * Math.PI * t) / VARIANT.orbitPeriod;
  mat4.rotateY(m, m, orbitAngle);
  mat4.translate(m, m, [2.5, 0, 0]);

  // 2. Вращение вокруг собственной оси Y (2.0 rad/s)
  mat4.rotateY(m, m, 2.0 * t);

  // 3. Пульсация размера: s(t) = 0.65 + 0.15 * sin(2*pi*t / 3)
  const scale = 0.65 + 0.15 * Math.sin((2 * Math.PI * t) / 3.0);
  mat4.scale(m, m, [scale, scale, scale]);

  return m;
}

/*========== Geometry Data ==========*/
function getCenteredCubeVertices() {
  // Куб от -0.5 до +0.5 по всем осям
  return [
    // Front face
    -0.5,-0.5, 0.5,   0.5,-0.5, 0.5,   0.5, 0.5, 0.5,
    -0.5,-0.5, 0.5,   0.5, 0.5, 0.5,  -0.5, 0.5, 0.5,
    // Back face
    -0.5,-0.5,-0.5,  -0.5, 0.5,-0.5,   0.5, 0.5,-0.5,
    -0.5,-0.5,-0.5,   0.5, 0.5,-0.5,   0.5,-0.5,-0.5,
    // Top face
    -0.5, 0.5,-0.5,  -0.5, 0.5, 0.5,   0.5, 0.5, 0.5,
    -0.5, 0.5,-0.5,   0.5, 0.5, 0.5,   0.5, 0.5,-0.5,
    // Bottom face
    -0.5,-0.5,-0.5,   0.5,-0.5,-0.5,   0.5,-0.5, 0.5,
    -0.5,-0.5,-0.5,   0.5,-0.5, 0.5,  -0.5,-0.5, 0.5,
    // Right face
     0.5,-0.5,-0.5,   0.5, 0.5,-0.5,   0.5, 0.5, 0.5,
     0.5,-0.5,-0.5,   0.5, 0.5, 0.5,   0.5,-0.5, 0.5,
    // Left face
    -0.5,-0.5,-0.5,  -0.5,-0.5, 0.5,  -0.5, 0.5, 0.5,
    -0.5,-0.5,-0.5,  -0.5, 0.5, 0.5,  -0.5, 0.5,-0.5
  ];
}

function getWedgeVertices() {
  // Клиновидная рампа (Wedge), центрированная в своем 1x1x1 боксе
  return [
    // 1. Bottom face (6 вершин)
    -0.25, -0.25, -0.5,   0.25, -0.25, -0.5,   0.25, -0.25,  0.5,
    -0.25, -0.25, -0.5,   0.25, -0.25,  0.5,  -0.25, -0.25,  0.5,

    // 2. Back vertical face (6 вершин)
    -0.25, -0.25,  0.5,   0.25, -0.25,  0.5,   0.25,  0.25,  0.5,
    -0.25, -0.25,  0.5,   0.25,  0.25,  0.5,  -0.25,  0.25,  0.5,

    // 3. Slope face (6 вершин)
    -0.25, -0.25, -0.5,  -0.25,  0.25,  0.5,   0.25,  0.25,  0.5,
    -0.25, -0.25, -0.5,   0.25,  0.25,  0.5,   0.25, -0.25, -0.5,

    // 4. Left triangle (3 вершины)
    -0.25, -0.25, -0.5,  -0.25, -0.25,  0.5,  -0.25,  0.25,  0.5,

    // 5. Right triangle (3 вершины)
     0.25, -0.25, -0.5,   0.25,  0.25,  0.5,   0.25, -0.25,  0.5
  ];
}

/*========== Твои цвета из PA1 ==========*/
function getColors() {
  const colors = [];

  // 1. Градиентная передняя грань куба (6 вершин)
  colors.push(
    1,0,0,1,  0,1,0,1,  0,0,1,1,
    1,0,0,1,  0,0,1,1,  1,1,0,1
  );

  // 2. Остальные 5 граней куба (разные цвета для каждой грани)
  const cubeFlats = [
    [0.1, 0.8, 0.8, 1.0], // Back
    [0.8, 0.1, 0.8, 1.0], // Top
    [0.9, 0.5, 0.1, 1.0], // Bottom
    [0.2, 0.7, 0.2, 1.0], // Right
    [0.5, 0.5, 0.5, 1.0]  // Left
  ];
  cubeFlats.forEach(c => {
    for (let i = 0; i < 6; i++) colors.push(...c);
  });

  // 3. Цвета для твоей фигуры Wedge (24 вершины)
  for (let i = 0; i < 6; i++) colors.push(0.9, 0.9, 0.1, 1.0); // Bottom
  for (let i = 0; i < 6; i++) colors.push(0.6, 0.2, 0.8, 1.0); // Back
  
  // Градиент на наклонной рампе Wedge
  colors.push(
    1,0.2,0.2,1,  0.2,1,0.2,1,  0.2,0.2,1,1,
    1,0.2,0.2,1,  0.2,0.2,1,1,  1,1,0.2,1
  );

  // Боковые треугольники
  for (let i = 0; i < 3; i++) colors.push(0.1, 0.6, 0.9, 1.0); // Left
  for (let i = 0; i < 3; i++) colors.push(0.9, 0.3, 0.6, 1.0); // Right

  return colors;
}

/*========== Boilerplate Functions ==========*/
function initBuffers(gl, positions, colors) {
  const posBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  const colBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  return { position: posBuffer, color: colBuffer };
}

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(shader));
  }
  return shader;
}

function createProgram(gl, vs, fs) {
  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Program link error:", gl.getProgramInfoLog(program));
  }
  return program;
}