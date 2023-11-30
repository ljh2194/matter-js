import { Bodies, Body, Engine, Events, Render, Runner, World, MouseConstraint, Mouse, Composite,Detector } from "matter-js";
import {FRUITS_BASE} from "./fruits"

// 엔진 시작
const engine = Engine.create();
const render = Render.create({
  engine,
  element: document.body,
  options: {
    wireframes: false,
    background: "#F7F4C8",
    width: 620,
    height: 850,
  }
});

const world = engine.world;

const leftWall = Bodies.rectangle(15,395,30,790,{
  isStatic : true,
  render:{fillStyle:"#E6B143"}
});

const rightWall = Bodies.rectangle(605,395,30,790,{
  isStatic : true,
  render:{fillStyle:"#E6B143"}
});

const ground = Bodies.rectangle(310,820,640,60,{
  isStatic : true,
  render:{fillStyle:"#E6B143"}
});

const topLine = Bodies.rectangle(310,100,640,2,{
  isStatic : true,
  isSensor : true,
  render:{fillStyle:"#E6B143"}
});


var mouse = Mouse.create(render.canvas),
mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        stiffness: 0.2,
        render: {
            visible: false
        }
    }
});


// 충돌감지
// const collisions = Detector.collisions(world)

Composite.add(world, [leftWall,rightWall,ground,topLine, mouseConstraint])
render.mouse = mouse;

console.log(render.mouse)
Render.run(render);
Runner.run(engine);

let currentBody = null;
let currentFruit = null;
let mouseMove = false;

function addFruit(){

  const index = Math.floor(Math.random() * 4);
  const fruit = FRUITS_BASE[index];
  const body = Bodies.circle(300, 50, fruit.radius, {
    index : index,
    // density :1,
    // slop:1,
    isSleeping:true,
    render: {
      // sprite : {texture : `${fruit.name}.png`}
    },    
    restitution : 0.2 // 탄성
  })

  currentBody = body;
  currentFruit = fruit;

  World.add(world, body);

}



// document.body.onmousedown = (e) =>{
//   mouseMove = true;
//   currentBody.position = {x:e.offsetX, y:50}
//   console.log(currentBody)
// }

// document.body.onmouseup = (e) =>{

//   currentBody.isSleeping = false;
//   currentBody.positionImpulse = {x:0, y:0}
//   console.log(currentBody)

//   // setTimeout(()=>{
//     addFruit();
//   // }, 500)
//   mouseMove = false;

// }

// document.body.onmousemove = (e) =>{
  
//   if(mouseMove){
//     var x = e.offsetX > 600 ? 600 : e.offsetX;
//     currentBody.position = {x:x, y:50}
//   }
// }

addFruit();

