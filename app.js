// VARIABLES GLOBALES

var quitarEvento = false
var contadorClicks = 0
var turno = 1
var fichasAmarillas = document.getElementsByClassName('damasAmarillas')
var fichasVerdes = document.getElementsByClassName('damasVerdes')
var jugador1 = document.getElementById('jugador1');
var jugador2 = document.getElementById('jugador2');

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

// PASAR DATOS AL SERVIDOR

var data = {
  jugador: null,
  idFila: null,
  idColumna: null
}
var url = 'https://jsonplaceholder.typicode.com/posts'

// TABLERO

// var tableroArray = [
//   [null, 1, null, 1, null, 1, null, 1],
//   [1, null, 1, null, 1, null, 1, null],
//   [null, 1, null, 1, null, 1, null, 1],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [2, null, 2, null, 2, null, 2, null],
//   [null, 2, null, 2, null, 2, null, 2],
//   [2, null, 2, null, 2, null, 2, null],
// ]

var tableroArray = [
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, 1, null, null, null, 2, null, null],
  [null, null, null, null, null, null, null, null],
  [null, 1, null, null, null, null, null, 2],
  [null, null, null, null, null, null, null, null],
]

function crearTablero() {
  var tablero = document.getElementById('tablero')

  var contador = 0

  for (let i = 0; i < tableroArray.length; i++) {
    var newDivFila = document.createElement('div')
    newDivFila.className = 'fila fila-' + i
    tablero.appendChild(newDivFila)

    contador = i % 2

    for (let j = 0; j < tableroArray[i].length; j++) {
      var newDivCell = document.createElement('div')

      if (contador === 0) {
        newDivCell.className = 'casillasBlancas'
        contador++
      } else {
        newDivCell.className = 'casillasNegras'
        contador--
      }

      newDivCell.id = 'fila-' + i + '-col-' + j
      newDivFila.appendChild(newDivCell)
    }
  }
  crearDamas()
}
crearTablero()

function crearDamas() {
  for (let i = 0; i < tableroArray.length; i++) {
    for (let k = 0; k < tableroArray[i].length; k++) {
      var DivCelda = document.getElementById('fila-' + i + '-col-' + k)

      if (tableroArray[i][k] === 1) {
        var NewDama = document.createElement('div')
        NewDama.className = 'damasAmarillas'
        DivCelda.appendChild(NewDama)
      }  
      if (tableroArray[i][k] === 2) {
        var NewDama = document.createElement('div')
        NewDama.className = 'damasVerdes'
        DivCelda.appendChild(NewDama)
      }
      if (tableroArray[i][k] === 11) {
        var NewDama = document.createElement('div')
        NewDama.className = 'damasAmarillas rey'
        DivCelda.appendChild(NewDama)
      }  
      if (tableroArray[i][k] === 22) {
        var NewDama = document.createElement('div')
        NewDama.className = 'damasVerdes rey'
        DivCelda.appendChild(NewDama)
      }
      
    }
  }
}


function agregarEvento() {
  if (turno === 1) {
    for (var i = 0; i < fichasAmarillas.length; i++) {
      fichasAmarillas[i].addEventListener('click', obtenerFichaSeleccionada)
    }
  } else {
    for (var i = 0; i < fichasVerdes.length; i++) {
      fichasVerdes[i].addEventListener('click', obtenerFichaSeleccionada)
    }
  }
}

function obtenerFichaSeleccionada(ev) {
  fichaSeleccionada.idFila = parseInt(ev.path[1].id.substring(5, 6))
  fichaSeleccionada.idColumna =  parseInt(ev.path[1].id.substring(11, 12))

  if (ev.target.classList.contains('rey')) {
    fichaSeleccionada.esRey = true;
  }
 
  if (fichaSeleccionada.esRey === false) {
    buscarEspaciosDisponibles(fichaSeleccionada.idFila, fichaSeleccionada.idColumna, 1, 1)
  }
  else{
    var busquedaInversa = 0
    for (let a = 1; a < 8; a++) {
      busquedaInversa = -a;
      buscarEspaciosDisponibles(fichaSeleccionada.idFila, fichaSeleccionada.idColumna, a, busquedaInversa)
      contadorClicks = 0;
      buscarEspaciosDisponibles(fichaSeleccionada.idFila, fichaSeleccionada.idColumna, a, a)
      contadorClicks = 0;
    }
  }

}

// logica para es rey

// hacer un for para recorrer el tablero y en el mismo for incrementar en 1 con el i del for el idFila y el idColumna
// luego verificar que las posiciones del tablero esten en nulas para pintarlas y agregarle el evento onclick
// luego si se encuentra con una ficha enemiga, validar posible comer 
// hacer variables booleanas que sea una para mover y otra comerMover para cortar el for

function buscarEspaciosDisponibles(fila, columna, aMoverColumna, aMoverFila) {

  if (contadorClicks > 0) {
    resetearTablero()
  }
  contadorClicks++

  fichaSeleccionada.movPintarIzq = columna - aMoverColumna
  fichaSeleccionada.movPintarDer = columna + aMoverColumna

  if (turno === 1) {
    fichaSeleccionada.movFilaPintar = fila + aMoverFila
  } else {
    fichaSeleccionada.movFilaPintar = fila - aMoverFila
  }

  if (fichaSeleccionada.movPintarDer <= 7 && fichaSeleccionada.movFilaPintar <= 7 && fichaSeleccionada.movFilaPintar >= 0) {
    if (tableroArray[fichaSeleccionada.movFilaPintar][fichaSeleccionada.movPintarDer] === null) {
      fichaSeleccionada.movDer = true
  
      var divPintar = document.getElementById('fila-' +fichaSeleccionada.movFilaPintar +'-col-' +fichaSeleccionada.movPintarDer)
      divPintar.style.backgroundColor = 'red'
    }
  }
  else{
      fichaSeleccionada.movDer = false
  }

  if (fichaSeleccionada.movPintarIzq >= 0 && fichaSeleccionada.movFilaPintar >= 0  && fichaSeleccionada.movFilaPintar <= 7) {
    if (tableroArray[fichaSeleccionada.movFilaPintar][fichaSeleccionada.movPintarIzq] === null) {
      fichaSeleccionada.movIzq = true
      var divPintar = document.getElementById('fila-' +fichaSeleccionada.movFilaPintar +'-col-' +fichaSeleccionada.movPintarIzq)
      divPintar.style.backgroundColor = 'red'
    }
  }
  else{
      fichaSeleccionada.movIzq = false
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
      else{
        fichaSeleccionada.movComerDer = false
      }

      if (fichaSeleccionada.movComerIzqPintado >= 0 && fichaSeleccionada.movFilaComerPintado <= 7) {
        
        if (tableroArray[fichaSeleccionada.movFilaPintar][fichaSeleccionada.movPintarIzq] === 2 && tableroArray[fichaSeleccionada.movFilaComerPintado][fichaSeleccionada.movComerIzqPintado] === null) {

          fichaSeleccionada.movComerIzq = true
          
          var divPintar = document.getElementById('fila-' +  fichaSeleccionada.movFilaComerPintado +'-col-' +fichaSeleccionada.movComerIzqPintado)
          divPintar.style.backgroundColor = 'red'
        }
      }
       else{
        fichaSeleccionada.movComerIzq = false
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
        else{
        fichaSeleccionada.movComerDer = false
        }

        if (fichaSeleccionada.movComerIzqPintado >= 0  && fichaSeleccionada.movFilaComerPintado >= 0) {
          
          if (tableroArray[fichaSeleccionada.movFilaPintar][fichaSeleccionada.movPintarIzq] === 1 && tableroArray[fichaSeleccionada.movFilaComerPintado][fichaSeleccionada.movComerIzqPintado] === null) {

            fichaSeleccionada.movComerIzq = true
            
            var divPintar = document.getElementById('fila-' + fichaSeleccionada.movFilaComerPintado +'-col-' + fichaSeleccionada.movComerIzqPintado)
            divPintar.style.backgroundColor = 'red'
          }
        }
        else{
        fichaSeleccionada.movComerIzq = false
        }
      }
  
    agregarClickPosiblesMov()
}


  function agregarClickPosiblesMov() {
    
    if (fichaSeleccionada.movIzq) {
      var divMover = document.getElementById('fila-' +fichaSeleccionada.movFilaPintar +'-col-' + fichaSeleccionada.movPintarIzq)
      divMover.setAttribute('onClick', 'moverFicha(' + fichaSeleccionada.movFilaPintar + ',' + fichaSeleccionada.movPintarIzq +', "")')
    }
    if (fichaSeleccionada.movDer) {
      var divMover = document.getElementById('fila-' + fichaSeleccionada.movFilaPintar +'-col-' + fichaSeleccionada.movPintarDer)
      divMover.setAttribute('onClick', 'moverFicha(' + fichaSeleccionada.movFilaPintar + ',' + fichaSeleccionada.movPintarDer + ', "")')
    }
    if (fichaSeleccionada.movComerDer) {
      var divMover = document.getElementById('fila-' + fichaSeleccionada.movFilaComerPintado +'-col-' + fichaSeleccionada.movComerDerPintado)
      divMover.setAttribute('onClick', 'moverFicha(' + fichaSeleccionada.movFilaComerPintado + ',' + fichaSeleccionada.movComerDerPintado + ', "derecha")')
    }
    if (fichaSeleccionada.movComerIzq) {
      var divMover = document.getElementById('fila-' + fichaSeleccionada.movFilaComerPintado +'-col-' + fichaSeleccionada.movComerIzqPintado)
      divMover.setAttribute('onClick', 'moverFicha(' + fichaSeleccionada.movFilaComerPintado + ',' + fichaSeleccionada.movComerIzqPintado +', "izquierda")')
    }
  } 
  
function resetearTablero() {
 
  var tablero = document.getElementById('tablero')

  tablero.innerHTML = ''
  quitarEvento = true

  crearTablero()
  resetearObjeto()
}



function moverFicha(filaMover, columnaMover, tipoComer) {

  //CREACION DE LA NUEVA FICHA
  var divPadre = document.getElementById('fila-' + filaMover +'-col-' + columnaMover)
  
  var newDama = document.createElement('div')
  
  if (turno === 1) {
    newDama.className = 'damasAmarillas'
    if (tableroArray[fichaSeleccionada.idFila][fichaSeleccionada.idColumna] === 11) {
      tableroArray[filaMover][columnaMover] = 11;
    }else{
      tableroArray[filaMover][columnaMover] = 1;
    }
  } else {
    newDama.className = 'damasVerdes'
     if (tableroArray[fichaSeleccionada.idFila][fichaSeleccionada.idColumna] === 22) {
      tableroArray[filaMover][columnaMover] = 22;
    }else{
      tableroArray[filaMover][columnaMover] = 2;
    }
  }

  if (filaMover === 0 || filaMover === 7) {

    if (fichaSeleccionada.esRey === false) {
      newDama.classList.add('rey')
      if (turno === 1) {
        tableroArray[filaMover][columnaMover] = 11;
      }
      else{
      tableroArray[filaMover][columnaMover] = 22;
      }
    }
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


  
  
  resetearTablero()
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
    for (var i = 0; i < fichasAmarillas.length; i++) {
      fichasAmarillas[i].removeEventListener('click', obtenerFichaSeleccionada)
    }
  } else {
    for (var i = 0; i < fichasVerdes.length; i++) {
      fichasVerdes[i].removeEventListener('click', obtenerFichaSeleccionada)
    }
  }
  actualizarPuntos()
}

function actualizarPuntos() {
  var parrafoPuntosJugador = null

  if (turno === 1) {
    parrafoPuntosJugador = document.getElementById('puntos-jugador1')
    parrafoPuntosJugador.innerHTML = 13 - fichasVerdes.length
  } else{
    parrafoPuntosJugador = document.getElementById('puntos-jugador2')
    parrafoPuntosJugador.innerHTML = 13 - fichasAmarillas.length
  }
  
  if (fichasAmarillas.length == 1) {
    alert('¡¡Felicitaciones jugador verde has ganado la partida!!')
  }
 if (fichasVerdes.length == 1) {
    alert('¡¡Felicitaciones jugador amarillo has ganado la partida!!')
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

// localStorage

var botonGuardarPartida = document.getElementById('guardar')
var botonCargarPartida = document.getElementById('cargar')

botonGuardarPartida.addEventListener('click', guardarPartida)
botonCargarPartida.addEventListener('click', cargarPartida)

function guardarPartida() {
    localStorage.setItem('tablero', JSON.stringify(tableroArray))
    localStorage.setItem('turno', turno)
}

function cargarPartida() {
  
  tableroArray = JSON.parse(localStorage.getItem('tablero'))
  turno = localStorage.getItem(turno)
  resetearTablero()
}



