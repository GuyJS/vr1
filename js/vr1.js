var pi = 3.14159265359;
		var groundSize = 200;
		var groundColour = 0xaa6611;
		var skyColour = 0x446688;//0x88bbdd;
		var cubeColour = 0x00ff00;

		//setup
		var scene = new THREE.Scene();
		scene.fog = new THREE.FogExp2( 0x446688, .1);
		// scene.fog = new THREE.Fog(0x8888aa, 0.5, 10);
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

		camera.position.z = 2;

		//ground
		var groundGeometry = new THREE.PlaneGeometry( groundSize, groundSize, groundSize/10, groundSize/10 );
		var groundMaterial = new THREE.MeshLambertMaterial( { color: groundColour, side: THREE.DoubleSide, wireframe:false } );
		var ground = new THREE.Mesh( groundGeometry, groundMaterial );
		ground.rotation.x = -pi/2;
		ground.position.y = -1;
		everything.add( ground );

		//trees
		var treeNumber = 100;
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

			var xPos = Math.random()*50-25;
			while (Math.abs(xPos) < 3){
				xPos = Math.random()*50-25;
			}

			var zPos = Math.random()*50-25;
			while (Math.abs(zPos) < 3){
				zPos = Math.random()*50-25;
			}
			tree[i].position.x = xPos;
			tree[i].position.z = zPos;
			everything.add(tree[i]);
		}

		function Bird(wingLength, wingDepth, xOffset){
		
			this.obj3d = new THREE.Object3D();
			this.obj3d.position.x += xOffset;
			this.bird = [];
			this.bird[0] = new THREE.Object3D();
			var birdBodyGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.8);
			var birdBodyMaterial = new THREE.MeshLambertMaterial( {color: 0xff8800} );
			var birdBody = new THREE.Mesh(birdBodyGeometry, birdBodyMaterial);
			birdBody.position.y = 2;
			birdBody.rotation.x = -pi/2;
			this.bird[0].add(birdBody);

			var wingShape = new THREE.Shape();
			this.wingLength = wingLength;
			this.wingDepth = wingDepth;

			
			wingShape.moveTo( 0,0 );
			wingShape.lineTo( 0, this.wingLength );
			wingShape.lineTo( wingDepth, this.wingLength/2 );
			wingShape.lineTo( 0, 0 );

			var wingGeom = new THREE.ShapeGeometry( wingShape );
			var wingMesh1 = new THREE.Mesh( wingGeom, new THREE.MeshBasicMaterial( { color: 0xff8800, side: THREE.DoubleSide, wireframe:false } ) ) ;
			var wingMesh2 = new THREE.Mesh( wingGeom, new THREE.MeshBasicMaterial( { color: 0xff8800, side: THREE.DoubleSide, wireframe:false } ) ) ;

			wingMesh1.position.y = 2;
			wingMesh1.rotation.z = pi/2;
			wingMesh1.rotation.x = pi/2;
			this.bird[1] = wingMesh1;
			wingMesh2.position.y = 2;
			wingMesh2.rotation.z = -pi/2;
			wingMesh2.rotation.x = -pi/2;
			this.bird[2] = wingMesh2;
			this.wingPosition = 1;
			this.obj3d.add(this.bird[0]);
			this.obj3d.add(this.bird[1]);
			this.obj3d.add(this.bird[2]);

			this.flightSpeed = Math.random()*0.5+0.3;

			this.animate = function(wingSpeed, zOffset){

				//flaps wings
				this.wingSpeed = wingSpeed;
				this.zOffset = zOffset;
				if (this.wingPosition == 0){
					this.bird[1].rotation.y = -pi/6;
					this.bird[2].rotation.y = -pi/6;
					this.wingPosition++;
				} else if (this.wingPosition == wingSpeed){
					this.bird[1].rotation.y = 0;
					this.bird[2].rotation.y = 0;
					this.wingPosition++;
				} else if (this.wingPosition == 2*wingSpeed){
					this.bird[1].rotation.y = pi/6;
					this.bird[2].rotation.y = pi/6;
					this.wingPosition++;
				} else if (this.wingPosition >= 3*wingSpeed){
					this.wingPosition = 0;
				}else {
					this.wingPosition++;
				}

				//moves the bird
				this.obj3d.position.z -= this.flightSpeed;
				if (this.obj3d.position.z < 0-this.zOffset ) {
					this.obj3d.position.z = this.zOffset;
					this.obj3d.position.x = Math.random()*100-50;
				}
			}
		}		

		//bird
		//(wingLength, wingDepth, flightSpeed (0.5 is good), xOffset )
		var bird = [];
		for (var k = 0 ; k < 20 ; k++ ){
			bird[k] = new Bird(2, 0.4, Math.random()*100-50);
			bird[k].obj3d.position.z += Math.random()*100-50;
			everything.add(bird[k].obj3d);
		}

		//light
		var light1 = new THREE.PointLight( 0xffffff, 0.8, 200);
		light1.position.set( -10, 25, -2 );
		light1.castShadow = true;
		everything.add( light1 );

		var moonGeometry = new THREE.IcosahedronGeometry(1, 3);
		var moonMaterial = new THREE.MeshLambertMaterial( {color:0xeeeeff } );
		var moon = new THREE.Mesh(moonGeometry, moonMaterial);

		moon.position.set(2, 15, 5);
		everything.add(moon);

		var moonLight = new THREE.PointLight(0xffffff, 50, 5);
		moonLight.position.set(3, 12.5, 6.5);
		everything.add(moonLight);
		// var light2 = new THREE.PointLight( 0xffffff, 0.8, 200);
		// light2.position.set( 100, 25, -20 );
		// light2.castShadow = true;

		// var light3 = new THREE.PointLight( 0xffffff, 0.8, 200);
		// light3.position.set( 0, 25, 200 );
		// light3.castShadow = true;

		
		// everything.add( light2 );
		// everything.add( light3 );

		scene.add(everything);
		//animation loop
		function render(){
			requestAnimationFrame( render );

			for (var a = 0 ; a < 20 ; a++ ){
				bird[a].animate(3, 50);
			}

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
