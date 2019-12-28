import React, { Component } from 'react';
import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import './App.css';

const style = {
  height: 600 // we can control scene size by setting container dimensions
};

class App extends Component {

  componentDidMount() {
      this.sceneSetup();
      this.addCustomSceneObjects();
      this.startAnimationLoop();

      window.addEventListener('resize', this.handleWindowResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize);
    window.cancelAnimationFrame(this.requestID);
    this.controls.dispose();
  }
  
  sceneSetup = () => {
    // get container dimensions and use them for scene sizing
    const width = this.el.clientWidth;
    const height = this.el.clientHeight;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
        75, // fov = field of view
        width / height, // aspect ratio
        0.1, // near plane
        1000 // far plane
    );
    this.controls = new OrbitControls( this.camera, this.el );

    // set some distance from a cube that is located at z = 0
    this.camera.position.z = 5;

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize( width, height );
    this.el.appendChild( this.renderer.domElement ); // mount using React ref
  };

  createCube = (x, color) => {
    //this.cubes = [];
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const texture = new THREE.TextureLoader().load('textures/galvanized_blue.jpg');
    const material = new THREE.MeshPhongMaterial( {
        color: color,
        emissive: 0x072534,
        side: THREE.DoubleSide,
        flatShading: true,
        map: texture
    } );
    let cube = new THREE.Mesh( geometry, material );
    cube.position.x = x;
    
    return cube;
  };

  addCustomSceneObjects  = () => {
    /*
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshPhongMaterial( {
        color: 0xff00ff,
        emissive: 0x072534,
        side: THREE.DoubleSide,
        flatShading: true
    } );
    this.cube = new THREE.Mesh( geometry, material );
    */
    const cubeProps = [
      { x: -2, color: 0x156289 },
      { x: 0, color: 0x158962 },
      { x: 2, color: 0x621589 }
    ];
    this.cubes = [];
    cubeProps.forEach((cubeProp) => {
      this.cubes.push(this.createCube(cubeProp.x, cubeProp.color));
     });

     this.cubes.forEach((cube) => {
      this.scene.add( cube );
     });
  
    const lights = [];
    lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
    lights[ 1 ] = new THREE.PointLight( 0xffffff, 1, 0 );
    lights[ 2 ] = new THREE.PointLight( 0xffffff, 1, 0 );

    lights[ 0 ].position.set( 0, 200, 0 );
    lights[ 1 ].position.set( 100, 200, 100 );
    lights[ 2 ].position.set( - 100, - 200, - 100 );

    this.scene.add( lights[ 0 ] );
    this.scene.add( lights[ 1 ] );
    this.scene.add( lights[ 2 ] );
  };

  startAnimationLoop = () => {
    this.cubes.forEach((cube) => {
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
    });

    this.renderer.render( this.scene, this.camera );
    this.requestID = window.requestAnimationFrame(this.startAnimationLoop);
  };

  handleWindowResize = () => {
    const width = this.el.clientWidth;
    const height = this.el.clientHeight;

    this.renderer.setSize( width, height );
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  };
  
  render() {
      return (
      <>
      <div>Demo of Rotating Cube</div>
      <div style={style} ref={ref => (this.el = ref)} />
      <div>Scroll to zoom, drag to rotate</div>
      </>
      );
  }
}

export default App;
