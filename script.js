class Task {
  constructor(texto, timestamp, estado = "To do") {
    this.texto = texto;
    this.timestamp = timestamp;
    this.estado = estado;
  }

  createTaskElement() {
    const fondo = document.createElement("div");
    fondo.className = "fondo";
    fondo.dataset.timestamp = this.timestamp;

    const primero = document.createElement("div");
    primero.className = "primero";

    const cerrar = document.createElement("div");
    cerrar.className = "cerrar";
    cerrar.addEventListener('click', () => {
      removeTask(fondo);
    });

    const equis = document.createElement("p");
    equis.innerHTML = "x";

    cerrar.appendChild(equis);

    const segundo = document.createElement("div");
    segundo.className = "segundo";
    segundo.textContent = this.texto;

    const tercero = document.createElement("div");
    tercero.className = "tercero";

    const azul = document.createElement("div");
    azul.className = "azul";
    azul.addEventListener('click', () => {
      moveTask(fondo, Doing);
    });

    const rojo = document.createElement("div");
    rojo.className = "rojo";
    rojo.addEventListener('click', () => {
      moveTask(fondo, Done);
    });

    primero.appendChild(cerrar);
    tercero.appendChild(azul);
    tercero.appendChild(rojo);
    fondo.appendChild(primero);
    fondo.appendChild(segundo);
    fondo.appendChild(tercero);

    fondo.dataset.estado = this.estado;

    return fondo;
  }
}

const inputElement = document.getElementById('textoInput');
const guardarBoton = document.getElementById('guardarBoton');
const To = document.querySelector('.Do');
const Doing = document.querySelector('.Doing');
const Done = document.querySelector('.Done');

guardarBoton.addEventListener('click', function () {
  const textoIngresado = inputElement.value;
  if (textoIngresado) {
    const timestamp = Date.now();
    const estado = "To do";
    const newTask = new Task(textoIngresado, timestamp, estado);
    const taskElement = newTask.createTaskElement();
    To.appendChild(taskElement);

    localStorage.setItem(`tarea_${timestamp}`, JSON.stringify({ texto: textoIngresado, estado }));

    inputElement.value = '';
    alert('Tarea guardada en localStorage.');
  } else {
    alert('Por favor, ingresa un texto antes de guardar.');
  }
});

function moveTask(taskElement, newContainer) {
  const timestamp = taskElement.dataset.timestamp;
  const tarea = JSON.parse(localStorage.getItem(`tarea_${timestamp}`));
  tarea.estado = newContainer.className;
  localStorage.setItem(`tarea_${timestamp}`, JSON.stringify(tarea));
  taskElement.dataset.estado = tarea.estado;
  newContainer.appendChild(taskElement);
}

function removeTask(taskElement) {
  const timestamp = taskElement.dataset.timestamp;
  localStorage.removeItem(`tarea_${timestamp}`);
  taskElement.remove();
}

for (let i = 0; i < localStorage.length; i++) {
  const clave = localStorage.key(i);
  if (clave.startsWith("tarea_")) {
    const tarea = JSON.parse(localStorage.getItem(clave));
    const taskElement = new Task(tarea.texto, tarea.timestamp, tarea.estado).createTaskElement();
    if (tarea.estado === "Doing") {
      Doing.appendChild(taskElement);
    } else if (tarea.estado === "Done") {
      Done.appendChild(taskElement);
    } else {
      To.appendChild(taskElement);
    }
  }
}

document.addEventListener('click', function (event) {
  if (event.target.classList.contains('rojo')) {
    const fondo = event.target.closest('.fondo');
    if (fondo) {
      const doing = document.querySelector('.Doing');
      const done = document.querySelector('.Done');
      const doContainer = document.querySelector('.Do');

      if (doing.contains(fondo)) {
        doing.removeChild(fondo);
        done.appendChild(fondo);
      } else if (doContainer.contains(fondo)) {
        doContainer.removeChild(fondo);
        doing.appendChild(fondo);
      }
    }
    return;
  }
  if (event.target.classList.contains('azul')) {
    const fondo = event.target.closest('.fondo');
    if (fondo) {
      const doing = document.querySelector('.Doing');
      const doContainer = document.querySelector('.Do');
      if (Doing.contains(fondo)) {
        Doing.removeChild(fondo);
        doing.appendChild(fondo);
      } else if (doing.contains(fondo)) {
        doing.removeChild(fondo);
        doContainer.appendChild(fondo);
      }
    }
  }
});
