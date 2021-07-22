var datosEnviar = {
  nombre: null,
  apellido: null,
  email: null,
  comentario: null,
}

var url = 'https://jsonplaceholder.typicode.com/posts'

var nombre = document.getElementById('nombre')
var apellido = document.getElementById('apellido')
var email = document.getElementById('correo')
var comentario = document.getElementById('comentario')
var botonEnviar = document.getElementById('boton-registro')

botonEnviar.addEventListener('click', function () {
  datosEnviar.nombre = nombre.value.toString()
  datosEnviar.apellido = apellido.value.toString()
  datosEnviar.email = email.value.toString()
  datosEnviar.comentario = comentario.value.toString()

  enviarDatosServidor(url, datosEnviar)
})

function enviarDatosServidor(url, datosEnviar) {
  fetch(url, {
    method: 'POST',
    body: JSON.stringify(datosEnviar),
  })
    .then((res) => res.json())
    .then((datosEnviar) => {
      console.log(datosEnviar)
    })
    .catch((err) => console.log(err))
  console.log(obj)
}
