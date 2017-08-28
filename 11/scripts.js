/*  Get Our Elements  */


const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const slider = player.querySelectorAll('.player__slider');
const skipButtons = player.querySelectorAll('[data-skip]');

/*  Build out functions  */

function togglePlayer(){
  // if(video.paused){
  //   video.play();
  // }else(
  //   video.pause();
  //   )

  const method = video.paused ? 'play' : 'pause';
  video[method]();

}

function updateToggle(){
  const icon = this.paused ? '▶︎' : '▍▍';
  toggle.textContent = icon;
}

function skip(){
  video.currentTime += parseFloat(this.dataset.skip)
}

function handleRangeUpdate(){
  video[this.name] = this.value;
}

function handleProgress(){
  const percent =(video.currentTime / video.duration) * 100;
  progressBar.style.flexBasis = `${percent}%`;
}

function scrub(e){
  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
  video.currentTime = scrubTime;
}



/*  Hook up the event listeners  */
video.addEventListener('click',togglePlayer);
toggle.addEventListener('click',togglePlayer);

video.addEventListener('play',updateToggle);
video.addEventListener('pause',updateToggle);


skipButtons.forEach(button => button.addEventListener('click',skip));

slider.forEach(range => range.addEventListener('change',handleRangeUpdate));
slider.forEach(range => range.addEventListener('mousemove',handleRangeUpdate));

video.addEventListener('timeupdate',handleProgress);

let mousedown = false;
progress.addEventListener('click',scrub);
progress.addEventListener('mousemove',(e)=>mousedown && scrub(e));
progress.addEventListener('mousedown',()=> mousedown = true);
progress.addEventListener('mouseup',()=> mousedown = false);

