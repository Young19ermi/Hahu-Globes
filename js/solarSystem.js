// Import
import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.127.0/examples/jsm/controls/OrbitControls.js";

// Renderer setup
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Texture Loader
const textureLoader = new THREE.TextureLoader();
const starTexture = textureLoader.load("./image/stars.jpg");
const sunTexture = textureLoader.load("./image/sun.jpg");
const mercuryTexture = textureLoader.load("./image/mercury.jpg");
const venusTexture = textureLoader.load("./image/venus.jpg");
const earthTexture = textureLoader.load("./image/earth.jpg");
const marsTexture = textureLoader.load("./image/mars.jpg");
const jupiterTexture = textureLoader.load("./image/jupiter.jpg");
const saturnTexture = textureLoader.load("./image/saturn.jpg");
const uranusTexture = textureLoader.load("./image/uranus.jpg");
const neptuneTexture = textureLoader.load("./image/neptune.jpg");
const plutoTexture = textureLoader.load("./image/pluto.jpg");
const saturnRingTexture = textureLoader.load("./image/saturn_ring.png");
const uranusRingTexture = textureLoader.load("./image/uranus_ring.png");

// Scene and Camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(-50, 90, 150);

// Background (stars)
const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([starTexture, starTexture, starTexture, starTexture, starTexture, starTexture]);

// Orbit controls
const orbit = new OrbitControls(camera, renderer.domElement);
orbit.enableZoom = true;
orbit.enableRotate = true;
orbit.enablePan = true;

// Sun setup
const sunGeo = new THREE.SphereGeometry(15, 50, 50);
const sunMat = new THREE.MeshBasicMaterial({ map: sunTexture });
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);

// Sun light
const sunLight = new THREE.PointLight(0xffffff, 4, 300);
scene.add(sunLight);

// Planet path helper
const path_of_planets = [];
function createLineLoopWithMesh(radius, color, width) {
  const material = new THREE.LineBasicMaterial({ color: color, linewidth: width });
  const geometry = new THREE.BufferGeometry();
  const lineLoopPoints = [];

  const numSegments = 100;
  for (let i = 0; i <= numSegments; i++) {
    const angle = (i / numSegments) * Math.PI * 2;
    const x = radius * Math.cos(angle);
    const z = radius * Math.sin(angle);
    lineLoopPoints.push(x, 0, z);
  }

  geometry.setAttribute("position", new THREE.Float32BufferAttribute(lineLoopPoints, 3));
  const lineLoop = new THREE.LineLoop(geometry, material);
  scene.add(lineLoop);
  path_of_planets.push(lineLoop);
}

// Generate planet function
const genratePlanet = (size, texture, x, ring) => {
  const planetGeo = new THREE.SphereGeometry(size, 50, 50);
  const planetMat = new THREE.MeshStandardMaterial({ map: texture });
  const planet = new THREE.Mesh(planetGeo, planetMat);
  const planetObj = new THREE.Object3D();
  planet.position.set(x, 0, 0);
  if (ring) {
    const ringGeo = new THREE.RingGeometry(ring.innerRadius, ring.outerRadius, 32);
    const ringMat = new THREE.MeshBasicMaterial({ map: ring.ringmat, side: THREE.DoubleSide });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    planetObj.add(ringMesh);
    ringMesh.position.set(x, 0, 0);
    ringMesh.rotation.x = -0.5 * Math.PI;
  }
  scene.add(planetObj);
  planetObj.add(planet);
  createLineLoopWithMesh(x, 0xffffff, 3);
  return { planetObj: planetObj, planet: planet };
};

// Planet facts
const planetFacts = {
  Mercury: "The smallest planet in our solar system and nearest to the Sun, Mercury is only slightly larger than Earth's Moon. From the surface of Mercury, the Sun would appear more than three times as large as it does when viewed from Earth, and the sunlight would be as much as seven times brighter.",
  Venus: "Venus is similar in structure and size to Earth, and is sometimes called Earth's evil twin. Its thick atmosphere traps heat in a runaway greenhouse effect, making it the hottest planet in our solar system with surface temperatures hot enough to melt lead. ",
  Earth: "Earth is the only planet in the solar system whose English name does not come from Greek or Roman mythology. The name was taken from Old English and Germanic. It simply means the ground. There are, of course, many names for our planet in the thousands of languages spoken by the people of the third planet from the Sun",
  Mars: "Mars is one of the most explored bodies in our solar system, and it's the only planet where we've sent rovers to roam the alien landscape. NASA missions have found lots of evidence that Mars was much wetter and warmer, with a thicker atmosphere, billions of years ago.",
  Jupiter: "Jupiter is a world of extremes. It's the largest planet in our solar system – if it were a hollow shell, 1,000 Earths could fit inside. It's also the oldest planet, forming from the dust and gases left over from the Sun's formation 4.6 billion years ago. ",
  Saturn: "Like fellow gas giant Jupiter, Saturn is a massive ball made mostly of hydrogen and helium. Saturn is not the only planet to have rings, but none are as spectacular or as complex as Saturn's. Saturn also has dozens of moons.",
  Uranus: "Uranus is a very cold and windy world. The ice giant is surrounded by 13 faint rings and 28 small moons. Uranus rotates at a nearly 90-degree angle from the plane of its orbit. This unique tilt makes Uranus appear to spin sideways, orbiting the Sun like a rolling ball.",
  Neptune: "Dark, cold, and whipped by supersonic winds, ice giant Neptune is more than 30 times as far from the Sun as Earth. Neptune is the only planet in our solar system not visible to the naked eye. In 2011 Neptune completed its first 165-year orbit since its discovery in 1846.",
  Pluto: "Pluto, reclassified as a dwarf planet in 2006, takes about 248 Earth years to orbit the Sun and has a highly elliptical orbit that sometimes brings it closer to Neptune. Its thin atmosphere is primarily nitrogen, with traces of methane and carbon monoxide, and it can expand and contract with its distance from the Sun."
};

// Planets setup
const planets = [
  { ...genratePlanet(3.2, mercuryTexture, 28), name: 'Mercury', orbitSpeed: 0.004, rotationSpeed: 0.004 },
  { ...genratePlanet(5.8, venusTexture, 44), name: 'Venus', orbitSpeed: 0.015, rotationSpeed: 0.002 },
  { ...genratePlanet(6, earthTexture, 62), name: 'Earth', orbitSpeed: 0.01, rotationSpeed: 0.02 },
  { ...genratePlanet(4, marsTexture, 78), name: 'Mars', orbitSpeed: 0.008, rotationSpeed: 0.018 },
  { ...genratePlanet(12, jupiterTexture, 100), name: 'Jupiter', orbitSpeed: 0.002, rotationSpeed: 0.04 },
  { ...genratePlanet(10, saturnTexture, 138, { innerRadius: 10, outerRadius: 20, ringmat: saturnRingTexture }), name: 'Saturn', orbitSpeed: 0.0009, rotationSpeed: 0.038 },
  { ...genratePlanet(7, uranusTexture, 176, { innerRadius: 7, outerRadius: 12, ringmat: uranusRingTexture }), name: 'Uranus', orbitSpeed: 0.0004, rotationSpeed: 0.03 },
  { ...genratePlanet(7, neptuneTexture, 200), name: 'Neptune', orbitSpeed: 0.0001, rotationSpeed: 0.032 },
  { ...genratePlanet(2.8, plutoTexture, 216), name: 'Pluto', orbitSpeed: 0.0007, rotationSpeed: 0.008 }
];

// Ambient Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // You can adjust the intensity as needed
scene.add(ambientLight);

// GUI for interaction
var GUI = dat.gui.GUI;
const gui = new GUI();
const options = { "Real view": true, "Show path": true, speed: 1 };
gui.add(options, "Real view").onChange((e) => {
  ambientLight.intensity = e ? 0 : 0.5; // Change the ambient light intensity
});
gui.add(options, "Show path").onChange((e) => {
  path_of_planets.forEach((dpath) => { dpath.visible = e; });
});
gui.add(options, "speed", 0, 20);


// Raycaster for click detection
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Modal setup
const modal = document.createElement('div');
modal.style.position = 'fixed';
modal.style.top = '50%';
modal.style.left = '50%';
modal.style.transform = 'translate(-50%, -50%) scale(0.95)';
modal.style.background = 'rgba(255, 255, 255, 0.8)';
modal.style.backdropFilter = 'blur(10px)';
modal.style.borderRadius = '20px';
modal.style.padding = '25px';
modal.style.display = 'none';
modal.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1), 0 1px 8px rgba(0, 0, 0, 0.2)';
modal.style.width = '320px';
modal.style.textAlign = 'center';
modal.style.fontFamily = "'Arial', sans-serif";
modal.style.color = '#333';
modal.style.transition = 'all 0.3s ease-out';

modal.innerHTML = `
  <style>
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .modal-control {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      display: inline-block;
      margin-right: 6px;
      transition: all 0.3s ease;
    }
    .modal-control:hover {
      transform: scale(1.2);
    }
    .button {
      background: none;
      border: none;
      color: #007AFF;
      text-decoration: none;
      cursor: pointer;
      font-size: 16px;
      margin-top: 15px;
      padding: 8px 15px;
      border-radius: 20px;
      transition: all 0.3s ease;
    }
    .button:hover {
      background-color: rgba(0, 122, 255, 0.1);
    }
  </style>
  <div style="position: relative; margin-bottom: 20px;">
    <div style="position: absolute; top: -15px; left: -15px;">
      <div class="modal-control" style="background-color: #FF5F57;"></div>
      <div class="modal-control" style="background-color: #FFBD2E;"></div>
      <div class="modal-control" style="background-color: #28C940;"></div>
    </div>
  </div>
  <h2 id="planetName" style="font-size: 24px; margin-bottom: 15px;"></h2>
  <p id="planetFactText" style="font-size: 18px; line-height: 1.6; margin-bottom: 20px;"></p>
  <button id="closeModal" class="button">Close</button>
  <button id="seeMore" class="button">See More</button>
`;

document.body.appendChild(modal);

// Function to show the modal with animation
function showModal(planetName) {
  document.getElementById('planetName').textContent = planetName;
  document.getElementById('planetFactText').textContent = planetFacts[planetName];
  modal.style.display = 'block';
  setTimeout(() => {
    modal.style.opacity = '1';
    modal.style.transform = 'translate(-50%, -50%) scale(1)';
  }, 10);
}

// Function to hide the modal with animation
function hideModal() {
  modal.style.opacity = '0';
  modal.style.transform = 'translate(-50%, -50%) scale(0.95)';
  setTimeout(() => {
    modal.style.display = 'none';
  }, 300);
}

// Event listeners for buttons
document.getElementById('closeModal').addEventListener('click', hideModal);
document.getElementById('seeMore').addEventListener('click', () => {
  const planetName = document.getElementById('planetName').textContent;
  // come here and from the above json data extract name and use it below
  window.open(`https://science.nasa.gov/solar-system/planets/`, '_blank');
});

// Mouse click event
window.addEventListener('click', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(planets.map(p => p.planet));
  
  if (intersects.length > 0) {
    const planet = planets.find(p => p.planet === intersects[0].object);
    if (planet) {
      showModal(planet.name);
    }
  }
});

// Animation loop
function animate() {
  sun.rotateY(options.speed * 0.004);
  planets.forEach(p => {
    p.planetObj.rotateY(options.speed * p.orbitSpeed);
    p.planet.rotateY(options.speed * p.rotationSpeed);
  });
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();

// Resize event
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});