 const socket = io(); 


const myFace = document.getElementById("myFace"); 

const mutebutton = document.getElementById("mute"); 
const camerabutton = document.getElementById("camera"); 
const camerasSelect = document.getElementById("cameras");

let myStream; 
let muted = false;  

let cameraOff = false;   


async function getCameras(){
    try{ 
        const devices = await navigator.mediaDevices.enumerateDevices(); 
        const cameras = devices.filter((device) => device.kind === "videoinput"); 
        const currentCamera = myStream.getVideoTracks()[0];
       console.log("Video track is :" +  myStream.getVideoTracks());
        cameras.forEach((camera) => {
            const option = document.createElement("option"); 
            option.value = camera.deviceId;
            option.innerText = camera.label;  
            camerasSelect.appendChild(option); 
        })
    } catch(e) { 
        console.log(e); 
    }
}





async function getMedia(deviceId) {
    const initialConstrains =  {
        audio: true,
        video: { facingMode: "user" },
        
    };
    const  cameraConstraints = {
        audio: true,  
        video: { deviceId: { exact: deviceId}},
    };
   try { 
    myStream = await navigator.mediaDevices.getUserMedia(
        deviceId ? cameraConstraints : initialConstrains
    );   
    
    myFace.srcObject = myStream;   
        if(!deviceId) {
            await getCameras(); 
        }
    console.log("My stream: " + myStream); 
   } catch (e){
     console.log(e);
   }
   
}

getMedia(); 


function handlingMute() {  
    console.log(myStream.getAudioTracks());
    myStream
    .getAudioTracks()
    .forEach((track => track.enabled = !track.enabled)); 
    if(!muted) {
        mutebutton.innerText = " Voice off"  
        muted = true; 
 } else {
    mutebutton.innerText = " Voice on"; 
    muted = false; 

}
}
function handlingCamera() { 
    console.log(myStream.getVideoTracks()); 
    myStream
    .getVideoTracks()
    .forEach((track)=> (track.enabled = !track.enabled)); 

  if(cameraOff) {
    camerabutton.innerText = "Camera off"
    cameraOff = false; 
  }else {
    camerabutton.innerText = "Camera On"
    cameraOff =  true; 
}
}

async function handlingCameraChange() {
    console.log( "선택된 카메라 값 : "+  camerasSelect.value);
     await getMedia(camerasSelect.value);
}



camerasSelect.addEventListener("input", handlingCameraChange);
mutebutton.addEventListener("click", handlingMute); 
camerabutton.addEventListener("click", handlingCamera); 
