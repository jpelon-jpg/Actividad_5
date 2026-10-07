function _parsearFecha(fecha) {
  if (fecha instanceof Date) {
    return isNaN(fecha.getTime())
      ? null
      : new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
  }
  if (typeof fecha !== "string") return null;

  var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(fecha.trim());
  if (!m) return null;

  var anio = Number(m[1]);
  var mes = Number(m[2]) - 1;
  var dia = Number(m[3]);
  var d = new Date(anio, mes, dia);

  // Rechaza fechas imposibles como 2024-02-31
  if (d.getFullYear() !== anio || d.getMonth() !== mes || d.getDate() !== dia) {
    return null;
  }
  return d;
}


function validarCorreo(correo) {
  if (typeof correo !== "string") return false;
  var regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
  return regex.test(correo.trim());
}


function soloLetras(texto) {
  if (typeof texto !== "string") return false;
  return /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+$/.test(texto);
}


function validarLongitud(numero, maxLongitud) {
  if (!Number.isInteger(maxLongitud) || maxLongitud < 1) return false;
  if (typeof numero !== "number" && typeof numero !== "string") return false;

  var texto = String(numero).trim();
  if (!/^-?\d+$/.test(texto)) return false;

  var digitos = texto.replace("-", "").length;
  return digitos <= maxLongitud;
}


function calcularEdad(fechaNacimiento) {
  var nacimiento = _parsearFecha(fechaNacimiento);
  if (!nacimiento) return -1;

  var hoy = new Date();
  hoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  if (nacimiento > hoy) return -1;

  var edad = hoy.getFullYear() - nacimiento.getFullYear();
  var yaCumplio =
    hoy.getMonth() > nacimiento.getMonth() ||
    (hoy.getMonth() === nacimiento.getMonth() && hoy.getDate() >= nacimiento.getDate());
  if (!yaCumplio) edad--;

  return edad;
}

function esMayorDeEdad(fechaNacimiento) {
  return calcularEdad(fechaNacimiento) >= 18;
}

function validarPassword(password) {
  if (typeof password !== "string") return false;
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9\s]/.test(password)
  );
}

function capitalizarNombre(texto) {
  if (typeof texto !== "string") return "";
  var particulas = ["de", "del", "la", "las", "los", "y"];

  return texto
    .trim()
    .split(/\s+/)
    .filter(function (p) { return p.length > 0; })
    .map(function (palabra, i) {
      var minus = palabra.toLowerCase();
      if (i > 0 && particulas.indexOf(minus) !== -1) return minus;
      return minus.charAt(0).toUpperCase() + minus.slice(1);
    })
    .join(" ");
}

function diasParaCumple(fechaNacimiento) {
  var nacimiento = _parsearFecha(fechaNacimiento);
  if (!nacimiento) return -1;

  var hoy = new Date();
  hoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  if (nacimiento > hoy) return -1;

  var proximo = new Date(hoy.getFullYear(), nacimiento.getMonth(), nacimiento.getDate());
  if (proximo < hoy) {
    proximo = new Date(hoy.getFullYear() + 1, nacimiento.getMonth(), nacimiento.getDate());
  }

  return Math.round((proximo - hoy) / 86400000);
}

/* Permite probar la librería con Node.js (no afecta al navegador) */
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    validarCorreo: validarCorreo,
    soloLetras: soloLetras,
    validarLongitud: validarLongitud,
    calcularEdad: calcularEdad,
    esMayorDeEdad: esMayorDeEdad,
    validarPassword: validarPassword,
    capitalizarNombre: capitalizarNombre,
    diasParaCumple: diasParaCumple
  };
}
