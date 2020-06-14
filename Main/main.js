const mqtt = require('mqtt')  
const client = mqtt.connect('mqtt://192.168.15.212')
// const client = mqtt.connect('mqtt://iot.eclipse.org')
//const client = mqtt.connect('mqtt://10.215.56.158')
//const client = mqtt.connect('mqtt://192.168.1.130')

var tipo= 0 //0-espeak   1-festival  
var sys = require('sys')
var exec = require('child_process').exec;
var ban = 0

function puts(error, stdout, stderr) { console.log(stdout) }

function espeak(phrase) {
  var sleep = require('sleep')
  exec("echo " + phrase + " | espeak -ves -w audio.wav", puts);
  sleep.msleep(500);
  exec("aplay audio.wav", puts);  
}
function talk(phrase,languaje,voz){
  var idioma=""
  var idioma2=""
  if(languaje==0){
   idioma="ves"
   idioma2="voice_JuntaDeAndalucia_es_pa_diphone"
  }
  else if(languaje==1){
   idioma="ven"
   idioma2="voice_kal_diphone)"
  }
  else if(languaje==2){
   idioma="vde"
  }
  else{
   idioma="ves"
   idioma2="voice_JuntaDeAndalucia_es_pa_diphone"
  }

    if(voz==0){
     exec("echo " + phrase + " | espeak -"+idioma+" -w audio.wav", puts);
     exec("aplay audio.wav", puts);  
    } else if(voz==1){
        var comando = "echo '" + phrase + "' | text2wave -eval '("+idioma2+")' > /tmp/audio.wav && aplay /tmp/audio.wav"
        exec(comando)
    }
}

function changevoice(command){
    if(command=='espeak'){
        exec("echo Espeak | espeak -ves -w audio.wav", puts);
    	exec("aplay audio.wav", puts);
	tipo=0;
	}else if(command=='festival'){
         exec("echo festival | espeak -ves -w audio.wav", puts);
	 exec("aplay audio.wav", puts);
        tipo=1;}
  return tipo;
}


var state = 'closed'

client.on('connect', function () {  
  client.subscribe('amikoo/open')
  client.subscribe('amikoo/close')
  
  client.subscribe('amikoo/sound/speechsynthetizer/say')
  client.subscribe('amikoo/sound/speechsynthetizer/decir')
  client.subscribe('amikoo/sound/speechsynthetizer/sagen')
  client.subscribe('amikoo/sound/speechsynthetizer/voice')
 
  client.subscribe('amikoo/tradition/sound')
  client.subscribe('amikoo/tradition/image')
  client.subscribe('amikoo/tradition/video')

  client.subscribe('amikoo/camera/picture')

  client.subscribe('amikoo/inicial')
  client.subscribe('amikoo/emocion')
  client.subscribe('amikoo/porsupuesto')
  client.subscribe('amikoo/cerebro')
  client.subscribe('amikoo/inteledison')
  
  client.publish('amikoo/connected', 'true')
  sendStateUpdate()
})

client.on('message', function (topic, message) {  
  console.log('Received message %s %s', topic, message)
 
  if(ban==0){
  process.chdir("../")}
  ban=1;
  //var directorio = process.cwd()+"/Script"
  var directorio = "/home/Amikoo"
  switch (topic) {
    case 'amikoo/open':
      return handleRequestOpen(message)
    case 'amikoo/close':
      return handleRequestClose(message)
   
    case 'amikoo/sound/speechsynthetizer/say':
      return handleRequestSay(message,1,tipo)
    case 'amikoo/sound/speechsynthetizer/decir':
      return handleRequestSay(message,0,tipo)
    case 'amikoo/sound/speechsynthetizer/sagen':
      return handleRequestSay(message,2,tipo)
    case 'amikoo/sound/speechsynthetizer/voice':
      return changevoice(message)
    
    case 'amikoo/tradition/sound':
      var directorio1=directorio+"/tradition/media.py"
      var comando = "python3 "+directorio1+" Sound "+message
      return exec(comando)
    case 'amikoo/tradition/image':
      var directorio1=directorio+"/tradition/media.py"
      var comando = "python3 "+directorio1+" Image "+message
      return exec(comando)
    case 'amikoo/tradition/video':
      var directorio1=directorio+"/tradition/media.py"
      var comando = "python3 "+directorio1+" Video "+message
      return exec(comando)
    
    case 'amikoo/camera/picture':
      var comando = directorio+"/camera/picture.py"
      console.log('python '+comando)
      return exec('python '+comando)
 
    case 'amikoo/inicial':
      return handleSpeakAmikoo('Hola a todos!')
    case 'amikoo/emocion':
      return handleSpeakAmikoo('Perdon! Lo se!, Es que me emociono!')
    case 'amikoo/porsupuesto':
      return handleSpeakAmikoo('Por supuesto')
    case 'amikoo/cerebro':
      return handleSpeakAmikoo('En mi caso, mi cerebro esta aqui, en la caja azul!')
    case 'amikoo/inteledison':
      return handleSpeakAmikoo('Yo funciono con la plataforma Intel Edison')
  }
})

function sendStateUpdate () {  
  console.log('Sending state %s', state)
  client.publish('amikoo/state', state)
}

function handleRequestOpen (message) {  
  if (state !== 'open' && state !== 'opening') {
    console.log('Opening Amikoo')
    state = 'opening'
    espeak('Opening')
    sendStateUpdate()

    setTimeout(function (){
      state = 'open'
      sendStateUpdate()
    }, 5000)
  }
}

function handleRequestClose (message) {  
  if (state !== 'closed' && state !== 'closing') {
    state = 'closing'

    espeak('Closing')
    sendStateUpdate()

    setTimeout(function () {
      state = 'closed'
      sendStateUpdate()
    }, 5000)
  }
}

function handleRequestSay (message,languaje) {
    talk(message,languaje,tipo)
}

function handleAmikoo (message) {
  console.log('Action %s', message)
}

function handleSpeakAmikoo (message) {
  espeak(message)
}

function handleAppExit (options, err) {
  if (err) {
    console.log(err.stack)
  }

  if (options.cleanup) {
    client.publish('amikoo/connected', 'false')
  }

  if (options.exit) {
    process.exit()
  }
}

process.on('exit', handleAppExit.bind(null, {  
  cleanup: true
}))
process.on('SIGINT', handleAppExit.bind(null, {  
  exit: true
}))
process.on('uncaughtException', handleAppExit.bind(null, {  
  exit: true
}))