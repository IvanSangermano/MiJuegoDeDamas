// VARIABLES GLOBALES

var quitarEvento = false
var contadorClicks = 0
var turno = 1
var DamasRojas = document.getElementsByClassName('DamasRojas')
var DamasVerdes = document.getElementsByClassName('DamasVerdes')
var jugador1 = document.getElementById('contenedor1');
var jugador2 = document.getElementById('contenedor2');

var fichaSeleccionada = {
  idFila: null,
  idColumna: null,
  esRey: false,
  movIzq: false,
  movDer: false,
  movComerIzq: false,
  movComerDer: false,
  movPintarIzq: null,
  movPintarDer: null,
  movComerDerPintado: null,
  movComerIzqPintado: null,
  movFilaPintar: null,
  movFilaComerPintado: null,
}

// TABLERO

var tableroArray = [
  [null, 1, null, 1, null, 1, null, 1],
  [1, null, 1, null, 1, null, 1, null],
  [null, 1, null, 1, null, 1, null, 1],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [2, null, 2, null, 2, null, 2, null],
  [null, 2, null, 2, null, 2, null, 2],
  [2, null, 2, null, 2, null, 2, null],
]



function crearTablero() {
  var tablero = document.getElementById('TableroDamas')

  var contador = 0

  for (let i = 0; i < tableroArray.length; i++) {
    var newDivFila = document.createElement('div')
    newDivFila.className = 'fila fila-' + i
    tablero.appendChild(newDivFila)

    contador = i % 2

    for (let j = 0; j < tableroArray[i].length; j++) {
      var newDivCell = document.createElement('div')

      if (contador === 0) {
        newDivCell.className = 'CasillasBlancas'
        contador++
      } else {
        newDivCell.className = 'CasillasNegras'
        contador--
      }

      newDivCell.id = 'fila-' + i + '-col-' + j
      newDivFila.appendChild(newDivCell)
    }
  }
}
crearTablero()

function crearDamas() {
  for (let i = 0; i < tableroArray.length; i++) {
    for (let k = 0; k < tableroArray[i].length; k++) {
      var DivCelda = document.getElementById('fila-' + i + '-col-' + k)

      if (tableroArray[i][k] === 1) {
        var NewDama = document.createElement('div')
        NewDama.className = 'DamasRojas'
        DivCelda.appendChild(NewDama)
      } else {
        if (tableroArray[i][k] === 2) {
          var NewDama = document.createElement('div')
          NewDama.className = 'DamasVerdes'
          DivCelda.appendChild(NewDama)
        }
      }
    }
  }
}
crearDamas()

function agregarEvento() {
  if (turno === 1) {
    for (var i = 0; i < DamasRojas.length; i++) {
      DamasRojas[i].addEventListener('click', obtenerFichaSeleccionada)
    }
  } else {
    for (var i = 0; i < DamasVerdes.length; i++) {
      DamasVerdes[i].addEventListener('click', obtenerFichaSeleccionada)
    }
  }
}

function obtenerFichaSeleccionada(ev) {
  fichaSeleccionada.idFila = parseInt(ev.path[1].id.substring(5, 6))
  fichaSeleccionada.idColumna =  parseInt(ev.path[1].id.substring(11, 12))

  buscarEspaciosDisponibles(fichaSeleccionada.idFila, fichaSeleccionada.idColumna)

  if (ev.target.classList.contains('rey')) {
    fichaSeleccionada.esRey = true;
  }
}

// logica para es rey

// hacer un for para recorrer el tablero y en el mismo for incrementar en 1 con el i del for el idFila y el idColumna
// luego verificar que las posiciones del tablero esten en nulas para pintarlas y agregarle el evento onclick
// luego si se encuentra con una ficha enemiga, validar posible comer 
// hacer variables booleanas que sea una para mover y otra comerMover para cortar el for

function buscarEspaciosDisponibles(fila, columna) {

  if (contadorClicks > 0) {
    EliminarEspaciosPosibles()
  }
  contadorClicks++

  fichaSeleccionada.movPintarIzq = columna - 1
  fichaSeleccionada.movPintarDer = columna + 1

  if (turno === 1) {
    fichaSeleccionada.movFilaPintar = fila + 1

  } else {
    fichaSeleccionada.movFilaPintar = fila - 1
    
  }

  if (fichaSeleccionada.movPintarDer <= 7 && fichaSeleccionada.movFilaPintar <= 7 && fichaSeleccionada.movFilaPintar >= 0) {
    
    if (tableroArray[fichaSeleccionada.movFilaPintar][fichaSeleccionada.movPintarDer] === null) {
      fichaSeleccionada.movDer = true
  
      var divPintar = document.getElementById('fila-' +fichaSeleccionada.movFilaPintar +'-col-' +fichaSeleccionada.movPintarDer)
      divPintar.style.backgroundColor = 'red'
    }
  }

  if (fichaSeleccionada.movPintarIzq >= 0 && fichaSeleccionada.movFilaPintar >= 0  && fichaSeleccionada.movFilaPintar <= 7) {
    
    if (tableroArray[fichaSeleccionada.movFilaPintar][fichaSeleccionada.movPintarIzq] === null) {
      fichaSeleccionada.movIzq = true
      
      var divPintar = document.getElementById('fila-' +fichaSeleccionada.movFilaPintar +'-col-' +fichaSeleccionada.movPintarIzq)
      divPintar.style.backgroundColor = 'red'
    }

  }

  comprobarComer()
}

function comprobarComer() {
  fichaSeleccionada.movComerDerPintado = fichaSeleccionada.movPintarDer + 1
  fichaSeleccionada.movComerIzqPintado = fichaSeleccionada.movPintarIzq - 1
 
    if (turno === 1) {
      
      fichaSeleccionada.movFilaComerPintado = fichaSeleccionada.movFilaPintar + 1

      if (fichaSeleccionada.movComerDerPintado <= 7 && fichaSeleccionada.movFilaComerPintado <= 7) {
        
        if (tableroArray[fichaSeleccionada.movFilaPintar][fichaSeleccionada.movPintarDer] === 2 && tableroArray[fichaSeleccionada.movFilaComerPintado][fichaSeleccionada.movComerDerPintado] === null) {

          fichaSeleccionada.movComerDer = true
          
          var divPintar = document.getElementById('fila-' + fichaSeleccionada.movFilaComerPintado +'-col-' +fichaSeleccionada.movComerDerPintado)
          divPintar.style.backgroundColor = 'red'
        }
      }
      if (fichaSeleccionada.movComerIzqPintado >= 0 && fichaSeleccionada.movFilaComerPintado <= 7) {
        
        if (tableroArray[fichaSeleccionada.movFilaPintar][fichaSeleccionada.movPintarIzq] === 2 && tableroArray[fichaSeleccionada.movFilaComerPintado][fichaSeleccionada.movComerIzqPintado] === null) {

          fichaSeleccionada.movComerIzq = true
          
          var divPintar = document.getElementById('fila-' +  fichaSeleccionada.movFilaComerPintado +'-col-' +fichaSeleccionada.movComerIzqPintado)
          divPintar.style.backgroundColor = 'red'
        }
      }
      
    
    } else {
    
        fichaSeleccionada.movFilaComerPintado = fichaSeleccionada.movFilaPintar - 1
        if (fichaSeleccionada.movComerDerPintado <= 7 && fichaSeleccionada.movFilaComerPintado >= 0) {
          
          if (tableroArray[fichaSeleccionada.movFilaPintar][fichaSeleccionada.movPintarDer] === 1 && tableroArray[fichaSeleccionada.movFilaComerPintado][fichaSeleccionada.movComerDerPintado] === null) {

            fichaSeleccionada.movComerDer = true
            
            var divPintar = document.getElementById('fila-' + fichaSeleccionada.movFilaComerPintado +'-col-' +fichaSeleccionada.movComerDerPintado)
            divPintar.style.backgroundColor = 'red'
          }
        }
        if (fichaSeleccionada.movComerIzqPintado >= 0  && fichaSeleccionada.movFilaComerPintado >= 0) {
          
          if (tableroArray[fichaSeleccionada.movFilaPintar][fichaSeleccionada.movPintarIzq] === 1 && tableroArray[fichaSeleccionada.movFilaComerPintado][fichaSeleccionada.movComerIzqPintado] === null) {

            fichaSeleccionada.movComerIzq = true
            
            var divPintar = document.getElementById('fila-' + fichaSeleccionada.movFilaComerPintado +'-col-' + fichaSeleccionada.movComerIzqPintado)
            divPintar.style.backgroundColor = 'red'
          }
        }
      }
  
    agregarClickPosiblesMov()
}


  function agregarClickPosiblesMov() {
    
    if (fichaSeleccionada.movIzq) {
      var divMover = document.getElementById('fila-' +fichaSeleccionada.movFilaPintar +'-col-' + fichaSeleccionada.movPintarIzq)
      divMover.setAttribute('onClick', 'moverFicha(fichaSeleccionada.movFilaPintar, fichaSeleccionada.movPintarIzq, "")')
    }
    if (fichaSeleccionada.movDer) {
      var divMover = document.getElementById('fila-' +fichaSeleccionada.movFilaPintar +'-col-' + fichaSeleccionada.movPintarDer)
      divMover.setAttribute('onClick', 'moverFicha(fichaSeleccionada.movFilaPintar, fichaSeleccionada.movPintarDer, "")')
    }
    if (fichaSeleccionada.movComerDer) {
      var divMover = document.getElementById('fila-' + fichaSeleccionada.movFilaComerPintado +'-col-' + fichaSeleccionada.movComerDerPintado)
      divMover.setAttribute('onClick', 'moverFicha(fichaSeleccionada.movFilaComerPintado, fichaSeleccionada.movComerDerPintado, "derecha")')
    }
    if (fichaSeleccionada.movComerIzq) {
      var divMover = document.getElementById('fila-' + fichaSeleccionada.movFilaComerPintado +'-col-' + fichaSeleccionada.movComerIzqPintado)
      divMover.setAttribute('onClick', 'moverFicha(fichaSeleccionada.movFilaComerPintado, fichaSeleccionada.movComerIzqPintado, "izquierda")')
    }
  } 
  
function EliminarEspaciosPosibles() {
  if (fichaSeleccionada.movDer) {
    var divPintar = document.getElementById('fila-' +fichaSeleccionada.movFilaPintar +'-col-' +fichaSeleccionada.movPintarDer)
    divPintar.style.backgroundColor = 'rgba(29, 28, 28, 0.699)'
  }
   
  if (fichaSeleccionada.movIzq) {
    divPintar = document.getElementById('fila-' +fichaSeleccionada.movFilaPintar +'-col-' +fichaSeleccionada.movPintarIzq)
    divPintar.style.backgroundColor = 'rgba(29, 28, 28, 0.699)' 
  }
  
  if (turno === 1) {
      fichaSeleccionada.movFilaComerPintado = fichaSeleccionada.movFilaPintar + 1

    if (fichaSeleccionada.movComerDer) {
      divPintar = document.getElementById('fila-' + fichaSeleccionada.movFilaComerPintado +'-col-' +fichaSeleccionada.movComerDerPintado)
      divPintar.style.backgroundColor = 'rgba(29, 28, 28, 0.699)'
    }
    if (fichaSeleccionada.movComerIzq) {
          divPintar = document.getElementById('fila-' +  fichaSeleccionada.movFilaComerPintado +'-col-' +fichaSeleccionada.movComerIzqPintado)
          divPintar.style.backgroundColor = 'rgba(29, 28, 28, 0.699)'
    }

  } else {
      fichaSeleccionada.movFilaComerPintado = fichaSeleccionada.movFilaPintar - 1
    if (fichaSeleccionada.movComerDer) {
      divPintar = document.getElementById('fila-' + fichaSeleccionada.movFilaComerPintado +'-col-' +fichaSeleccionada.movComerDerPintado)
      divPintar.style.backgroundColor = 'rgba(29, 28, 28, 0.699)'
    }
    if (fichaSeleccionada.movComerIzq) {
      divPintar = document.getElementById('fila-' + fichaSeleccionada.movFilaComerPintado +'-col-' + fichaSeleccionada.movComerIzqPintado)
      divPintar.style.backgroundColor = 'rgba(29, 28, 28, 0.699)'
    }
    
}
  quitarEvento = true
  quitarEventosClickPosibles()
  resetearObjeto()
}


function moverFicha(filaMover, columnaMover, tipoComer) {

  //CREACION DE LA NUEVA FICHA
  var divPadre = document.getElementById('fila-' + filaMover +'-col-' + columnaMover)

  var newDama = document.createElement('div')

  if (turno === 1) {
    newDama.className = 'DamasRojas'
    tableroArray[filaMover][columnaMover] = 1;
  } else {
    newDama.className = 'DamasVerdes'
    tableroArray[filaMover][columnaMover] = 2;
  }

  //CREACION DE FICHA SI ES REY
  if (filaMover == 0 || filaMover == 7) {
    if (fichaSeleccionada.esRey === false) {
      newDama.classList.add('rey')
	  fichaSeleccionada.esRey = true;
    }
  }
  if(fichaSeleccionada.esRey == true){
	  newDama.innerHTML = '<img src="imagenes/corona.png">'
  }
  divPadre.appendChild(newDama)
 

  //ELIMINACION DE LA FICHA ANTIGUA
  var divViejo = document.getElementById('fila-' + fichaSeleccionada.idFila +'-col-' +  fichaSeleccionada.idColumna)
  divViejo.innerHTML = ''
  tableroArray[fichaSeleccionada.idFila][fichaSeleccionada.idColumna] = null;

  //ELIMINACION DE LA FICHA DEL USUARIO CONTRARIO SI LO COME
  if (tipoComer == 'izquierda') {
    if (turno === 1) {
      var divEnemigoElimanado = document.getElementById('fila-' + (fichaSeleccionada.idFila + 1)  +'-col-' +  (fichaSeleccionada.idColumna -1))
      divEnemigoElimanado.innerHTML = ''
      tableroArray[fichaSeleccionada.idFila + 1][fichaSeleccionada.idColumna - 1] = null
    }else{
      var divEnemigoElimanado = document.getElementById('fila-' + (fichaSeleccionada.idFila - 1)  +'-col-' +  (fichaSeleccionada.idColumna -1))
      divEnemigoElimanado.innerHTML = ''
      tableroArray[fichaSeleccionada.idFila - 1][fichaSeleccionada.idColumna - 1] = null
    }
  }
  if (tipoComer == 'derecha') {
    if (turno === 1) {
      var divEnemigoElimanado = document.getElementById('fila-' + (fichaSeleccionada.idFila + 1)  +'-col-' +  (fichaSeleccionada.idColumna +1))
      divEnemigoElimanado.innerHTML = ''
      tableroArray[fichaSeleccionada.idFila + 1][fichaSeleccionada.idColumna + 1] = null
    }else{
      var divEnemigoElimanado = document.getElementById('fila-' + (fichaSeleccionada.idFila - 1)  +'-col-' +  (fichaSeleccionada.idColumna +1))
      divEnemigoElimanado.innerHTML = ''
      tableroArray[fichaSeleccionada.idFila - 1][fichaSeleccionada.idColumna + 1] = null
    }
  }

  //VUELTA A SU COLOR ORIGINAL DE LAS CASILLAS
  var filaTurno = 0
  if (turno == 1) {
    filaTurno = 1
  } else{
    filaTurno = -1
  }

  if (fichaSeleccionada.movIzq) {
    var divPintar = document.getElementById('fila-' +fichaSeleccionada.movFilaPintar +'-col-' +fichaSeleccionada.movPintarIzq)
    divPintar.style.backgroundColor = 'rgba(29, 28, 28, 0.699)'
  }
  if (fichaSeleccionada.movDer) {
    var divPintar = document.getElementById('fila-' +fichaSeleccionada.movFilaPintar +'-col-' +fichaSeleccionada.movPintarDer)
    divPintar.style.backgroundColor = 'rgba(29, 28, 28, 0.699)'
  }
  if (fichaSeleccionada.movComerDer) {
    var divPintar = document.getElementById('fila-' + (fichaSeleccionada.movFilaPintar + filaTurno ) + '-col-' +fichaSeleccionada.movComerDerPintado)
    divPintar.style.backgroundColor = 'rgba(29, 28, 28, 0.699)'
  }
  if (fichaSeleccionada.movComerIzq) {
    var divPintar = document.getElementById('fila-' + (fichaSeleccionada.movFilaPintar + filaTurno) + '-col-' +fichaSeleccionada.movComerIzqPintado)
    divPintar.style.backgroundColor = 'rgba(29, 28, 28, 0.699)'
  }

  quitarEventosClickPosibles()
}

function quitarEventosClickPosibles(){
  if (fichaSeleccionada.movIzq) {
     var divMover = document.getElementById('fila-' +fichaSeleccionada.movFilaPintar +'-col-' + fichaSeleccionada.movPintarIzq)
     divMover.removeAttribute('onclick')
  }
  if (fichaSeleccionada.movDer) {
    var divMover = document.getElementById('fila-' +fichaSeleccionada.movFilaPintar +'-col-' + fichaSeleccionada.movPintarDer)
    divMover.removeAttribute('onclick')
  }
  if (fichaSeleccionada.movComerDer) {
     var divMover = document.getElementById('fila-' + fichaSeleccionada.movFilaComerPintado  +'-col-' + fichaSeleccionada.movComerDerPintado)
     divMover.removeAttribute('onclick')
  }
  if (fichaSeleccionada.movComerIzq) {
    var divMover = document.getElementById('fila-' +fichaSeleccionada.movFilaComerPintado +'-col-' + fichaSeleccionada.movComerIzqPintado)
    divMover.removeAttribute('onclick')
  }

  if (quitarEvento == false) {
  quitarEventosClicks()
  }
}

function quitarEventosClicks() {
 if (turno === 1) {
    for (var i = 0; i < DamasRojas.length; i++) {
      DamasRojas[i].removeEventListener('click', obtenerFichaSeleccionada)
    }
  } else {
    for (var i = 0; i < DamasVerdes.length; i++) {
      DamasVerdes[i].removeEventListener('click', obtenerFichaSeleccionada)
    }
  }
  actualizarPuntos()
}

function actualizarPuntos() {
	var parrafoPuntosJugador = null

	if (turno === 1) {
		parrafoPuntosJugador = document.getElementById('PuntosJugador1')
		parrafoPuntosJugador.innerHTML = 12 - DamasVerdes.length
	} else{
		parrafoPuntosJugador = document.getElementById('PuntosJugador2')
		parrafoPuntosJugador.innerHTML = 12 - DamasRojas.length
	}
	
	if (DamasVerdes.length == 0) {
		alert('¡¡Felicitaciones jugador ROJO has ganado la partida!!')
	}
	if (DamasRojas.length == 0) {
		alert('¡¡Felicitaciones jugador VERDE has ganado la partida!!')
	}
	
  cambiarTurno()
}

function cambiarTurno(){
  if (turno === 1) {
    turno++
    jugador1.style.boxShadow = 'none'
    jugador2.style.boxShadow = '0 0 80px #558564'
    resetearObjeto()
  } else{
    turno--
    jugador1.style.boxShadow = '0 0 80px #B2945B'
    jugador2.style.boxShadow = 'none'
    resetearObjeto()
  }
}

function resetearObjeto() {
    fichaSeleccionada.id = null,
    fichaSeleccionada.esRey = false,
    fichaSeleccionada.movIzq = false,
    fichaSeleccionada.movDer = false,
    fichaSeleccionada.movComerIzq = false,
    fichaSeleccionada.movComerDer = false,
    fichaSeleccionada.movPintarIzq = null,
    fichaSeleccionada.movPintarDer = null,
    fichaSeleccionada.movComerDerPintado = null,
    fichaSeleccionada.movComerIzqPintado = null,
    agregarEvento()
    quitarEvento = false
    contadorClicks = 0
}

agregarEvento()