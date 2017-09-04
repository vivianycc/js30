const video = document.querySelector('.player');
const canvas =document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo(){
	navigator.mediaDevices.getUserMedia({ video : true, audio : false })
		.then(localMediaStream => {
			video.src = window.URL.createObjectURL(localMediaStream);
			video.play();
		})
		.catch(err =>{
			console.error(`OH NO!!!` ,err);
		})

}

function paintToCanvas(){
	const width = video.videoWidth;
	const height = video.videoHeight;
	canvas.width = width;
	canvas.height = height;
	//setting the width and height of the canvas the same sizes with video

	return setInterval(()=>{
		ctx.drawImage(video, 0, 0, width, height);
		//take the pixels out
		let pixels = ctx.getImageData(0,0,width,height);
		//mess with them
		// pixels = redEffect(pixels);
		// pixels = rgbSpit(pixels);
		// ctx.globalAlpha = 0.1;
		pixels = greenScreen(pixels);
		//put them back
		ctx.putImageData(pixels, 0 ,0 )

	}, 16)
	//every 16ms draw video onto canvas from top 0 and left 0 with size of 'width' and 'height'
	tracker.on('track', function(event) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        event.data.forEach(function(rect) {
          img.width = rect.y;
          img.height = rect.x;
          ctx.drawImage(img, rect.x, rect.y);

          ctx.strokeStyle = '#a64ceb';
          ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
          ctx.font = '11px Helvetica';
          ctx.fillStyle = "#fff";
          ctx.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
          ctx.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);
        });
      });
}

function tracking(){
	var tracker = new tracking.ObjectTracker('face');
    var img = new Image();
      img.src = 'https://static1.squarespace.com/static/55ad38b1e4b0185f0285195f/t/55b54792e4b0c6db1fb20676/1438113942409/profiling.png';
      tracker.setStepSize(2);
      tracker.setEdgesDensity(0.1);
      tracking.track('#canvas', tracker, { camera: true });
      
}

function takePhoto(){
	//played the sound
	snap.currentTime = 0;
	snap.play();

	//take the data out of the canvas
	const data = canvas.toDataURL('image/jpeg');
	const link = document.createElement('a');
	link.href = data;
	link.setAttribute('download', 'handsome');
	link.innerHTML = `<img src=${data} alt='cute' />`;
	strip.insertBefore(link, strip.firsChild);

}



function redEffect(pixels){

	for(let i = 0; i < pixels.data.length; i += 4){
		pixels.data[i + 0] = pixels.data[i + 0] + 80; //r
		pixels.data[i + 1] = pixels.data[i + 1] - 30; //g
		pixels.data[i + 2] = pixels.data[i + 2] * 0.8; //b
	}
	return pixels;
}


function rgbSpit(pixels){

	for(let i = 0; i < pixels.data.length; i += 4){
		pixels.data[i - 150] = pixels.data[i + 0] + 80; //r
		pixels.data[i + 100] = pixels.data[i + 1] - 30; //g
		pixels.data[i - 150] = pixels.data[i + 2] * 0.8; //b
	}
	return pixels;

}


function greenScreen(pixels){

	const levels = {};

	document.querySelectorAll('.rgb input').forEach((input)=>{
		levels[input.name] = input.value;
	});
	
	for(i = 0; i < pixels.data.length; i = i + 4){
		red = pixels.data[i + 0];
		green = pixels.data[i + 1];
		blue = pixels.data[i + 2];
		alpha = pixels.data[i + 3];

		if(	   red 	 >= levels.rmin
			&& green >= levels.gmin
			&& blue  >= levels.bmin
			&& red 	 <= levels.rmax
			&& green <= levels.gmax
			&& blue  <= levels.bmax){
			//take it out
			pixels.data[i + 3] = 0;
		}
	}
	return pixels;
}
getVideo()
video.addEventListener('canplay', paintToCanvas);
canvas.addEventListener('canplay', tracking);




      

 