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
		camera.position.z = 2;

		//ground
		var groundGeometry = new THREE.PlaneGeometry( groundSize, groundSize, groundSize/10, groundSize/10 );
		var groundMaterial = new THREE.MeshLambertMaterial( { color: groundColour, side: THREE.DoubleSide, wireframe:false } );
		var ground = new THREE.Mesh( groundGeometry, groundMaterial );
		ground.rotation.x = -pi/2;
		ground.position.y = -1;
		everything.add( ground );

		//trees
		var treeNumber = 50;
		var tree = [];
		for (var i = 0 ; i < treeNumber; i++ ){

			//create trunk
			tree[i] = new THREE.Object3D();
			var trunkGeometry = new THREE.CylinderGeometry(0.12, 0.12, 1);
			var trunkMaterial = new THREE.MeshLambertMaterial( {color: groundColour} );
			var trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
			trunk.position.y -= 0.5;
			tree[i].add(trunk);

			//add branches like a pine tree
			var branchLayerNumber = 4;
			for(var j = 0 ; j < branchLayerNumber ; j++){
				var branchLayerGeometry = new THREE.CylinderGeometry(0.0, 0.5, 0.8);
				var branchLayerMaterial = new THREE.MeshLambertMaterial( {color: cubeColour} );
				var branchLayer = new THREE.Mesh(branchLayerGeometry, branchLayerMaterial);
				branchLayer.scale.set(Math.pow(0.85, j), Math.pow(0.85, j), Math.pow(0.85, j));
				branchLayer.position.y = (j*0.4);
				tree[i].add(branchLayer);
			}

			tree[i].position.x = Math.random()*50-25;
			tree[i].position.z = Math.random()*50-25;
			everything.add(tree[i]);
		}

		

		//bird
		var bird = [];
		bird[0] = new THREE.Object3D();
		var birdBodyGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.8);
		var birdBodyMaterial = new THREE.MeshLambertMaterial( {color: 0xff8800} );
		var birdBody = new THREE.Mesh(birdBodyGeometry, birdBodyMaterial);
		birdBody.position.y = 2;
		birdBody.rotation.x = -pi/2;
		bird[0].add(birdBody);

		var wingShape = new THREE.Shape();
		var wingLength = 0.8, wingWidth = 2;

		
		wingShape.moveTo( 0,0 );
		wingShape.lineTo( 0, wingWidth );
		wingShape.lineTo( wingLength/2, wingWidth/2 );
		wingShape.lineTo( 0, 0 );

		var wingGeom = new THREE.ShapeGeometry( wingShape );
		var wingMesh1 = new THREE.Mesh( wingGeom, new THREE.MeshBasicMaterial( { color: 0xff8800, side: THREE.DoubleSide, wireframe:false } ) ) ;
		var wingMesh2 = new THREE.Mesh( wingGeom, new THREE.MeshBasicMaterial( { color: 0xff8800, side: THREE.DoubleSide, wireframe:false } ) ) ;

		wingMesh1.position.y = 2;
		wingMesh1.rotation.z = pi/2;
		wingMesh1.rotation.x = pi/2;
		bird[1] = wingMesh1;
		wingMesh2.position.y = 2;
		wingMesh2.rotation.z = -pi/2;
		wingMesh2.rotation.x = -pi/2;
		bird[2] = wingMesh2;
		var wingPosition = 1;

		 everything.add( bird[0] );
		 everything.add( bird[1] );
		 everything.add( bird[2] );

		//light
		var light1 = new THREE.PointLight( 0xffffff, 0.8, 200);
		light1.position.set( -10, 25, -2 );
		light1.castShadow = true;

		// var light2 = new THREE.PointLight( 0xffffff, 0.8, 200);
		// light2.position.set( 100, 25, -20 );
		// light2.castShadow = true;

		// var light3 = new THREE.PointLight( 0xffffff, 0.8, 200);
		// light3.position.set( 0, 25, 200 );
		// light3.castShadow = true;

		everything.add( light1 );
		// everything.add( light2 );
		// everything.add( light3 );

		scene.add(everything);
		//animation loop
		function render(){
			requestAnimationFrame( render );

			//wing animation
			//higher is slower
			var wingSpeed = 3;
			if (wingPosition == 0){
				bird[1].rotation.y = -pi/6;
				bird[2].rotation.y = -pi/6;
				wingPosition++;
			} else if (wingPosition == wingSpeed){
				bird[1].rotation.y = 0;
				bird[2].rotation.y = 0;
				wingPosition++;
			} else if (wingPosition == 2*wingSpeed){
				bird[1].rotation.y = pi/6;
				bird[2].rotation.y = pi/6;
				wingPosition++;
			} else if (wingPosition == 3*wingSpeed){
				wingPosition = 0;
			}else {
				wingPosition++;
			}

			for (var i = 0 ; i <= 2 ; i++){
				bird[i].position.z -= 0.5;
				if (bird[i].position.z < -30) {
					bird[i].position.z = 30;
				}
			}

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

// document.body.addEventListener( 'click', function(){
//   effect.setFullScreen( true );
// })


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
