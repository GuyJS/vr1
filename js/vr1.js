var pi = 3.14159265359;
		var groundSize = 200;
		var groundColour = 0xaa6611;
		var skyColour = 0x88bbdd;
		var cubeColour = 0x00ff00;

		//setup
		var scene = new THREE.Scene();
		var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 100 );
		var renderer = new THREE.WebGLRenderer();
		renderer.setClearColor( skyColour, 1 ); // sky
		renderer.setSize( window.innerWidth, window.innerHeight);
		document.body.appendChild( renderer.domElement);

		//Apply VR headset positional data to camera.
		var controls = new THREE.VRControls( camera );

		//Apply VR stereo rendering to renderer
		var effect = new THREE.VREffect( renderer );
		effect.setSize( window.innerWidth, window.innerHeight );

		var everything = new THREE.Object3D();

		//add a cube
		var geometry = new THREE.BoxGeometry( 1, 1, 1 );
		var material = new THREE.MeshLambertMaterial( {color: cubeColour } );
		var cube = new THREE.Mesh( geometry, material );
		everything.add( cube );
		camera.position.z = 5;

		//ground
		var groundGeometry = new THREE.PlaneGeometry( groundSize, groundSize, groundSize/10, groundSize/10 );
		var groundMaterial = new THREE.MeshLambertMaterial( { color: groundColour, side: THREE.DoubleSide, wireframe:false } );
		var ground = new THREE.Mesh( groundGeometry, groundMaterial );
		ground.rotation.x = -pi/2;
		ground.position.y = -2;
		everything.add( ground );

		//trees
		var treeNumber = 50;
		var tree = [];
		for (var i = 0 ; i < treeNumber; i++ ){

			//create trunk
			tree[i] = new THREE.Object3D();
			var trunkGeometry = new THREE.CylinderGeometry(0.2, 0.2, 2);
			var trunkMaterial = new THREE.MeshLambertMaterial( {color: groundColour} );
			var trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
			tree[i].add(trunk);

			//add branches like a pine tree
			var branchLayerNumber = 4;
			for(var j = 0 ; j < branchLayerNumber ; j++){
				var branchLayerGeometry = new THREE.CylinderGeometry(0.0, 0.5, 0.8);
				var branchLayerMaterial = new THREE.MeshLambertMaterial( {color: cubeColour} );
				var branchLayer = new THREE.Mesh(branchLayerGeometry, branchLayerMaterial);
				branchLayer.position.y = (j*0.5);
				tree[i].add(branchLayer);
			}

			tree[i].position.x = Math.random()*50-25;
			tree[i].position.z = Math.random()*50-25;
			everything.add(tree[i]);
		}

		//light
		var light = new THREE.PointLight( 0xffffff, 0.8, 200);
		light.position.set( -10, 25, -2 );
		light.castShadow = true;
		everything.add( light );

		scene.add(everything);
		//animation loop
		function render(){
			requestAnimationFrame( render );
			cube.rotation.x += 0.05;
			cube.rotation.y += 0.05;
			//renderer.render( scene, camera );

			 //Update VR headset position and apply to camera.
			 controls.update();

			 // Render the scene through the VREffect.
			 effect.render( scene, camera );
		}

		render();



/**********************************  Boring Stuff  **************************************/

document.body.addEventListener( 'click', function(){
  effect.setFullScreen( true );
})


//Listen for keyboard events
function onkey(event) {
  event.preventDefault();

  if (event.keyCode == 90) { // z
    controls.resetSensor(); //zero rotation
  } else if (event.keyCode == 70 || event.keyCode == 13) { //f or enter
    effect.setFullScreen(true) //fullscreen
  }
};
window.addEventListener("keydown", onkey, true);


//Handle window resizes
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  effect.setSize( window.innerWidth, window.innerHeight );
}
window.addEventListener( 'resize', onWindowResize, false );
