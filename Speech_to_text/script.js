const magic_word = ['yes', 'no', 'stop', 'start'];

function searchStringInArray (str, strArray) {
    for (var j=0; j<strArray.length; j++) {
        if (strArray[j].localeCompare(str.trim()) == 0){
			return 1;
		}
    }
	return 0;
}



function speech(magic_word){
	let learn = 0;
	let counter = 0;
	let detection;
	var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
	let recognition = new SpeechRecognition();
	recognition.lang = 'en-US';
	recognition.interimResults = false;
	recognition.maxAlternatives = 1;
	recognition.continuous = true;

	recognition.onresult = e => {
		
		for (var i = event.resultIndex; i < event.results.length; ++i) {
			if (event.results[i].isFinal) {
				var transcripts = event.results[i][0].transcript;
				console.log(transcripts);
			  
				learn = searchStringInArray (transcripts, magic_word)
				if (learn){
					log(transcripts + " "+ typeof(transcripts) + " Magic word is spoken");
				}	
				else{
					counter = counter + 1;
					log(transcripts);
					if(counter == 3){
						learn = 1;
					}
				}
			}
		}
	}

	function stopSpeech(){
		recognition.stop();
	  status_.className = 'inactive';
	}

	function startSpeech(){
		
		try{ 
		  recognition.start();
		
	  }
	  catch(e){}
	  status_.className = 'active';
	  console.log(status_.className);
	}

	navigator.mediaDevices.getUserMedia({audio:true})

	.then(stream => detectSilence(stream, stopSpeech, startSpeech))
	.catch(e => log(e.message));	

	function detectSilence(
	  stream,
	  onSoundEnd = _=>{},
	  onSoundStart = _=>{},
	  silence_delay = 0,
	  min_decibels = -100
	  ) {
	  const ctx = new AudioContext();
	  const analyser = ctx.createAnalyser();
	  const streamNode = ctx.createMediaStreamSource(stream);
	  streamNode.connect(analyser);
	  analyser.minDecibels = min_decibels;
	  const data = new Uint8Array(analyser.frequencyBinCount);
	  let silence_start = performance.now();

	  let triggered = true;
	  function loop(time) {

		if(learn == 0){
			requestAnimationFrame(loop);
			analyser.getByteFrequencyData(data);
			
			if (data.some(v => v)){
			  if(triggered){
				  
				triggered = false;
				onSoundStart();
				}
			 
			  silence_start = time; 

			}
			console.log(time - silence_start);
			if (!triggered && time - silence_start > silence_delay) {
				
			  onSoundEnd();
			  triggered = true;
			}
		}
		else if (learn ==1){
			console.log("Micphone stop taking input");
			if(counter == 3){
				log('Fail to detect magic word.');
			}
			else{
				log('Magic word is detected');
			}
			onSoundEnd();
			
		}
	  }	
	  
	  loop();  	  
	}
	function log(txt){
		log_.textContent += txt + '\n';
	}
}

speech(magic_word);