const el=e=>document.getElementById(e);
const previousTickArray = [0,0];
const load=function load(){
    if(localStorage.getItem("beaconTuningSave")==null){
        completions=0;
        flux=0;
        u1=0;
        u2=false;
        u2e=0;
    } else {
        var saves = localStorage.getItem("beaconTuningSave"),decoded = JSON.parse(atob(saves));
        completions = decoded.completions;
        flux = decoded.flux;
        u1 = decoded.u1;
        u2 = decoded.u2;
        u2e = decoded.u2e;
    }
}
const getSave=function getSave(){
    var XR={
        flux:flux,
        completions:completions,
        u1:u1,
        u2:u2,
        u2e:u2e
    },XT=btoa(JSON.stringify(XR));
    return XT;
}
const save=function save(){
    localStorage.setItem("beaconTuningSave",getSave());
}

var beaconSpeed, beaconFreq, userSpeed, userFreq,completions,flux,u1,u2,u2e;
function randomize0(){
    beaconSpeed=1+parseInt(Math.random()*5);
    beaconFreq=200+(20*parseInt(Math.random()*20));
    userSpeed=3;
    userFreq=440;
}
function randomize(){
    randomize0();
    if(u2)u2e=10;
    el("F").style="display:none";
    completions+=u1+1;
    el("T").textContent=completions;
}
randomize0();
const audioctx=new AudioContext();
// SAVE LOADING PROCEDURE
load();
//
      function playAudio(ctx,freq){
        var audio=ctx.createOscillator();
        audio.frequency=""+freq;
        audio.frequency.exponentialRampToValueAtTime(freq*1.05, ctx.currentTime+0.05);
        var gain = ctx.createGain();
        gain.gain.exponentialRampToValueAtTime(freq*0.95, ctx.currentTime+0.1);
        audio.connect(gain).connect(ctx.destination);
        audio.start();
        audio.stop(ctx.currentTime + 0.1);
      }
// main game loop
      window.setInterval(()=>{
        flux+=completions*(u2e > 0 ? 0.15 : 0.05);
        u2e = u2e <= 0 ? 0 : u2e - 0.05;
        el("beacon-flux").textContent=Math.floor(flux);
        el("C").textContent=userFreq;
        el("D").textContent=`${userSpeed} (${(1.5/userSpeed).toFixed(3)}s intervals)`;
        let xw=previousTickArray[1]-previousTickArray[0],vi=parseInt(1000*Math.min(Math.abs(xw),Math.abs((1500.0/beaconSpeed)-xw)));
        el("E").textContent=vi;
        if(vi < 75 && userFreq==beaconFreq && userSpeed==beaconSpeed){
            el("F").style="";
        }
      },50);
// instantize event listeners
el("A1").addEventListener("click",e=>{userFreq=userFreq>=600?600:userFreq+20;});
el("A2").addEventListener("click",e=>{userFreq=userFreq<=200?200:userFreq-20;});
el("B").addEventListener("click",e=>{userSpeed=userSpeed>=5?1:userSpeed+1;});
el("G").addEventListener("click",e=>{randomize();});
el("U1").addEventListener("click",e=>{
    if(flux>=100*Math.pow(3,u1)){
        flux-=100*Math.pow(3,u1)
        u1++
        el("U1").textContent=`Cost: ${100*Math.pow(3,u1)} Beacon Flux (+${u1} extra shards upon tuning)`;
    }
});
el("U2").addEventListener("click",e=>{
    if(flux>=1000){
        flux-=1000
        u2=true
        el("U2").textContent="Purchased"
    }
});
el("save").addEventListener("click",e=>{
    save();
});
el("wipe").addEventListener("click",e=>{
    localStorage.removeItem("beaconTuningSave");
    window.setTimeout(()=>{location.reload()},250);
})

// set up beacon timings
const recursiveBeacon=function recursiveBeacon(){
  previousTickArray[0]=audioctx.currentTime;
  playAudio(audioctx, beaconFreq);
  window.setTimeout(()=>{recursiveBeacon();},1500.0/beaconSpeed);
}
const recursiveUser=function recursiveUser(){
  previousTickArray[1]=audioctx.currentTime;
  playAudio(audioctx, userFreq);
  window.setTimeout(()=>{recursiveUser();},1500.0/userSpeed);
}
recursiveUser();
window.setTimeout(()=>{recursiveBeacon();},50*parseInt(Math.random()*55));

