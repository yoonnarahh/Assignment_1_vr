/*========== Helper: Depth Illusion Rule ==========*/
// 22: ox = +0.15, oy = -0.15
function applyOffset(x, y, z) {
  const ox = 0.15;
  const oy = -0.15;
  const xDraw = x + ox * (z + 0.5);
  const yDraw = y + oy * (z + 0.5);
  return [xDraw, yDraw, z];
}

/*========== Geometry Data ==========*/
function getCubeVertices() {
  //  (x < 0), размер 0.5x0.5, z в [-0.5, 0.5]
  const raw = [
    // Front face (z = -0.5)
    -0.8, -0.25, -0.5,   -0.3, -0.25, -0.5,   -0.3,  0.25, -0.5,
    -0.8, -0.25, -0.5,   -0.3,  0.25, -0.5,   -0.8,  0.25, -0.5,

    // Back face (z = +0.5)
    -0.8, -0.25,  0.5,   -0.8,  0.25,  0.5,   -0.3,  0.25,  0.5,
    -0.8, -0.25,  0.5,   -0.3,  0.25,  0.5,   -0.3, -0.25,  0.5,

    // Top face (y = +0.25)
    -0.8,  0.25, -0.5,   -0.3,  0.25, -0.5,   -0.3,  0.25,  0.5,
    -0.8,  0.25, -0.5,   -0.3,  0.25,  0.5,   -0.8,  0.25,  0.5,

    // Bottom face (y = -0.25) - Видимая грань!
    -0.8, -0.25, -0.5,   -0.8, -0.25,  0.5,   -0.3, -0.25,  0.5,
    -0.8, -0.25, -0.5,   -0.3, -0.25,  0.5,   -0.3, -0.25, -0.5,

    // Right face (x = -0.3) - Видимая грань!
    -0.3, -0.25, -0.5,   -0.3, -0.25,  0.5,   -0.3,  0.25,  0.5,
    -0.3, -0.25, -0.5,   -0.3,  0.25,  0.5,   -0.3,  0.25, -0.5,

    // Left face (x = -0.8)
    -0.8, -0.25, -0.5,   -0.8,  0.25, -0.5,   -0.8,  0.25,  0.5,
    -0.8, -0.25, -0.5,   -0.8,  0.25,  0.5,   -0.8, -0.25,  0.5
  ];

  const pos = [];
  for (let i = 0; i < raw.length; i += 3) {
    pos.push(...applyOffset(raw[i], raw[i + 1], raw[i + 2]));
  }
  return pos;
}

function getWedgeVertices() {
  //  (Wedge/Ramp) в правой половине (x > 0), 24 вершины
  const raw = [
    // 1. Bottom face (y = -0.25) - 6 вершин
    0.3, -0.25, -0.5,    0.8, -0.25, -0.5,    0.8, -0.25,  0.5,
    0.3, -0.25, -0.5,    0.8, -0.25,  0.5,    0.3, -0.25,  0.5,

    // 2. Back vertical face (z = +0.5) - 6 вершин
    0.3, -0.25,  0.5,    0.8, -0.25,  0.5,    0.8,  0.25,  0.5,
    0.3, -0.25,  0.5,    0.8,  0.25,  0.5,    0.3,  0.25,  0.5,

    // 3. Slope face (наклонная рампа) - 6 вершин
    0.3, -0.25, -0.5,    0.3,  0.25,  0.5,    0.8,  0.25,  0.5,
    0.3, -0.25, -0.5,    0.8,  0.25,  0.5,    0.8, -0.25, -0.5,

    // 4. Left triangle (x = 0.3) - 3 вершины
    0.3, -0.25, -0.5,    0.3, -0.25,  0.5,    0.3,  0.25,  0.5,

    // 5. Right triangle (x = 0.8) - 3 вершины
    0.8, -0.25, -0.5,    0.8,  0.25,  0.5,    0.8, -0.25,  0.5
  ];

  const pos = [];
  for (let i = 0; i < raw.length; i += 3) {
    pos.push(...applyOffset(raw[i], raw[i + 1], raw[i + 2]));
  }
  return pos;
}

function getColors() {
  const colors = [];

  
  colors.push(
    1,0,0,1,  0,1,0,1,  0,0,1,1,
    1,0,0,1,  0,0,1,1,  1,1,0,1
  );


  const cubeFlats = [
    [0.1, 0.8, 0.8, 1.0], // Back
    [0.8, 0.1, 0.8, 1.0], // Top
    [0.9, 0.5, 0.1, 1.0], // Bottom (видимая)
    [0.2, 0.7, 0.2, 1.0], // Right (видимая)
    [0.5, 0.5, 0.5, 1.0]  // Left
  ];
  cubeFlats.forEach(c => {
    for (let i = 0; i < 6; i++) colors.push(...c);
  });


  for (let i = 0; i < 6; i++) colors.push(0.9, 0.9, 0.1, 1.0);
  
  for (let i = 0; i < 6; i++) colors.push(0.6, 0.2, 0.8, 1.0);

 
  colors.push(
    1,0.2,0.2,1,  0.2,1,0.2,1,  0.2,0.2,1,1,
    1,0.2,0.2,1,  0.2,0.2,1,1,  1,1,0.2,1
  );

  // Left triangle (3 вершины) - плоский синий
  for (let i = 0; i < 3; i++) colors.push(0.1, 0.6, 0.9, 1.0);
  // Right triangle (3 вершины) - плоский розовый
  for (let i = 0; i < 3; i++) colors.push(0.9, 0.3, 0.6, 1.0);

  return colors;
}

/*========== Main App ==========*/
main();

function main() {
  /*========== Create a WebGL Context ==========*/
  const canvas = document.querySelector("#c");
  const gl = canvas.getContext("webgl");
  if (!gl) {
    console.error("WebGL 1.0 unavailable");
    return;
  }

  /*========== Define and Store the Geometry ==========*/
  const cubePositions = getCubeVertices();
  const wedgePositions = getWedgeVertices();
  const positions = [...cubePositions, ...wedgePositions];
  const colors = getColors();

  // Task D: Требуемая проверка длины массива цветов
  const totalVertices = positions.length / 3;
  console.assert(
    colors.length === totalVertices * 4,
    `Color array size mismatch: expected ${totalVertices * 4}, got ${colors.length}`
  );

  const buffers = initBuffers(gl, positions, colors);

  /*========== Shaders ==========*/
  const vsSource = `
    attribute vec3 aPosition;
    attribute vec4 aVertexColor;
    varying lowp vec4 vColor;
    void main() {
      gl_Position = vec4(aPosition, 1.0);
      vColor = aVertexColor;
      gl_PointSize = 6.0;
    }
  `;

  const fsSource = `
    varying lowp vec4 vColor;
    void main() {
      gl_FragColor = vColor;
    }
  `;

  const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
  const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
  const program = createProgram(gl, vs, fs);
  gl.useProgram(program);

  const aPositionLoc = gl.getAttribLocation(program, "aPosition");
  const aColorLoc = gl.getAttribLocation(program, "aVertexColor");

  /*========== State & Controls (Task E) ==========*/
  const state = {
    mode: gl.TRIANGLES,
    modeName: "gl.TRIANGLES",
    depth: true,
    cubeFirst: true
  };

  const statusEl = document.querySelector("#status");

  /*========== Drawing ==========*/
  function render() {
    if (state.depth) {
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);
    } else {
      gl.disable(gl.DEPTH_TEST);
    }

    gl.clearColor(0.12, 0.12, 0.12, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(aPositionLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPositionLoc);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
    gl.vertexAttribPointer(aColorLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aColorLoc);

    const cubeCount = cubePositions.length / 3;
    const wedgeCount = wedgePositions.length / 3;

    const drawCube = () => gl.drawArrays(state.mode, 0, cubeCount);
    const drawWedge = () => gl.drawArrays(state.mode, cubeCount, wedgeCount);

    if (state.cubeFirst) {
      drawCube();
      drawWedge();
    } else {
      drawWedge();
      drawCube();
    }

    // Обновление лейбла статуса
    statusEl.textContent =
      `ID: 22 | Mode: ${state.modeName} | Depth: ${state.depth ? "ON" : "OFF"} | Order: ${state.cubeFirst ? "Cube First" : "Wedge First"}`;
  }

  
  document.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "1": state.mode = gl.TRIANGLES; state.modeName = "gl.TRIANGLES"; break;
      case "2": state.mode = gl.LINE_LOOP; state.modeName = "gl.LINE_LOOP"; break;
      case "3": state.mode = gl.LINES; state.modeName = "gl.LINES"; break;
      case "4": state.mode = gl.LINE_STRIP; state.modeName = "gl.LINE_STRIP"; break;
      case "5": state.mode = gl.POINTS; state.modeName = "gl.POINTS"; break;
      case "6": state.mode = gl.TRIANGLE_STRIP; state.modeName = "gl.TRIANGLE_STRIP"; break;
      case "d": case "D": state.depth = !state.depth; break;
      case "s": case "S": state.cubeFirst = !state.cubeFirst; break;
    }
    render();
  });

  render();
}

/*========== Boilerplate Functions ==========*/
function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
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
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

function initBuffers(gl, positions, colors) {
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  return { position: positionBuffer, color: colorBuffer };
}