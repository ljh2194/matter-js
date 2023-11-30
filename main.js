import { Bodies, Body, Engine, Events, Render, Runner, World, MouseConstraint, Mouse, Composite,Detector } from "matter-js";
import {FRUITS} from "./fruits"

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

    // add mouse control
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
    // keep the mouse in sync with rendering
    render.mouse = mouse

World.add(world, [leftWall,rightWall,ground,topLine,mouseConstraint])
Render.run(render);
Runner.run(engine);

let currentBody = null;
let currentFruit = null;
let mouseMove = false;

function  addFruit(){

  const index = Math.floor(Math.random() * 4);
  const fruit = FRUITS[index];
  const body = Bodies.circle(300, 50, fruit.radius, {
    index : index,
    isSleeping:true,
    render: {
      sprite : {texture : `${fruit.name}.png`}
    },    
    restitution : 0.1 // 탄성
  })

  currentBody = body;
  currentFruit = fruit;

  World.add(world, body);
}

Events.on(mouseConstraint, "mousedown", (event) => {
  
  mouseMove = true;
  currentBody.isSleeping = false;
  currentBody.isStatic = true;

  setPosition();
})

Events.on(mouseConstraint, "mouseup", (event) => {

  mouseMove = false;
  currentBody.isStatic = false;

  addFruit();

})

Events.on(mouseConstraint, "mousemove", (event) => {
  if(mouseMove) setPosition()
});

function setPosition(){

  // 30 끝 590 시작
  let {x , y} = render.mouse.position
  var radius = currentBody.circleRadius;
  if( x > 590 - radius) x = 590 - radius;
  if(x < 30 + radius) x = 30+radius;

  Body.setPosition(currentBody, {x:x, y:50}, false)
}



// 충돌 이벤트
Events.on(engine,'collisionStart', (event) => {
  event.pairs.forEach((collision) => { 

    // console.log(collision)
    
    if(collision.bodyA.index === collision.bodyB.index){
      const index = collision.bodyA.index;

      if (index === FRUITS.length - 1) {
        return;
      }
     
      setTimeout(()=>{
       World.remove(world, [collision.bodyA, collision.bodyB]);
      },10)

      const newFruit = FRUITS[index + 1];

      const newBody = Bodies.circle(
        collision.collision.supports[0].x,
        collision.collision.supports[0].y,
        newFruit.radius,
        {
          render: {
            sprite: { texture: `${newFruit.name}.png` }
          },
          index: index + 1,
        }
      );
      World.add(world, newBody);
    }
  })
})


addFruit();

