const el=e=>document.getElementById(e);
const previousTickArray = [0,0];
var beaconSpeed, beaconFreq, userSpeed, userFreq;
      function randomize(){
            beaconSpeed=1+parseInt(Math.random()*5);
            beaconFreq=200+(20*parseInt(Math.random()*20));
            userSpeed=3;
            userFreq=440;
            el("F").style="display:none";
      }
      randomize();
      const audioctx=new AudioContext();
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
      
      window.setInterval(()=>{
        el("C").textContent=userFreq;
        el("D").textContent=`${userSpeed} (${(1.5/userSpeed).toFixed(3)}s intervals)`;
        let xw=previousTickArray[1]-previousTickArray[0],vi=parseInt(1000*Math.min(Math.abs(xw),Math.abs((1500.0/beaconSpeed)-xw)));
        el("E").textContent=vi;
        if(vi < 75 && userFreq==beaconFreq && userSpeed==beaconSpeed)el("F").style="";
      },50);
      el("A1").addEventListener("click",e=>{userFreq=userFreq>=600?600:userFreq+20;});
      el("A2").addEventListener("click",e=>{userFreq=userFreq<=200?200:userFreq-20;});
      el("B").addEventListener("click",e=>{userSpeed=userSpeed>=5?1:userSpeed+1;});
      el("G").addEventListener("click",e=>{randomize();});
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
