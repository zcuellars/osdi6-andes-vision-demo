/* Las respuestas permanecen en memoria: no se guardan ni se transmiten. */
'use strict';
const questions = [
  'Durante un día habitual del último mes, ¿qué frecuencia tuvo la sensibilidad ocular a la luz?',
  'Durante un día habitual del último mes, con sus lentes habituales, ¿con qué frecuencia se nubló la visión entre un parpadeo y otro?',
  'Durante un día habitual del último mes, ¿con qué frecuencia las molestias oculares dificultaron viajar en automóvil por la noche, como conductor o pasajero?',
  'Durante un día habitual del último mes, ¿Con qué frecuencia las molestias oculares dificultaron mirar dispositivos de pantalla como televisión, computador, celular u otra actividad equivalente?',
  'Durante un día habitual del último mes, ¿con qué frecuencia sintió molestias oculares al exponerse al viento?',
  'Durante un día habitual del último mes, ¿con qué frecuencia sintió molestias oculares en ambientes de poca humedad?'
];
const options = ['Nunca', 'Ocasionalmente', 'A menudo', 'Muy frecuentemente', 'Todo el tiempo'];
const formFields = ['r3470ad2cf2bc4e1f8ede626e3ef74109','r361ea950352c49019e514e3a422f34ab','re5e41d3d19674343b8ee02ef11ea3e1d','r7d80bdfa529a49fea25d79c7cd53d750','r0435fb93ead641208579a8e76a7616b1','r3f7567b9fa6e4c1e96a48e9c623353ac'];
const institutionUrl = 'https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=ozvjWikVcUCvhdY8aQytYMvzMGXfZwBLljmxpE1JF6lUN0pBSzBFTUtBSkxPU0JQUVVWVVI4OE1ZWC4u';
const form = document.getElementById('test');
const result = document.getElementById('resultado');
const inputs = document.getElementById('preguntas');
questions.forEach((text, index) => {
  const fieldset = document.createElement('fieldset');
  const legend = document.createElement('legend');
  legend.textContent = (index + 1) + '. ' + text;
  fieldset.append(legend);
  options.forEach((label, value) => {
    const choice = document.createElement('label');
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'p' + (index + 1);
    radio.value = String(value);
    radio.required = true;
    choice.append(radio, document.createTextNode(value + ' · ' + label));
    fieldset.append(choice);
  });
  inputs.append(fieldset);
});
form.addEventListener('submit', event => {
  event.preventDefault();
  const values = questions.map((_, index) => form.elements['p' + (index + 1)].value);
  if (values.some(value => !/^[0-4]$/.test(value))) return;
  const total = values.reduce((sum, value) => sum + Number(value), 0);
  const category = total <= 3 ? 'Rango normal de síntomas' : total <= 8 ? 'Síntomas de intensidad leve a moderada' : 'Síntomas de intensidad severa';
  document.getElementById('valor').textContent = total + ' / 24 puntos';
  document.getElementById('severidad').textContent = category;
  result.dataset.level = total <= 3 ? 'normal' : total <= 8 ? 'moderado' : 'severo';
  document.getElementById('resumen').textContent = values.map((value, index) => 'P' + (index + 1) + ': ' + value).join(' · ');
  const destination = new URL(institutionUrl);
  values.forEach((value, index) => destination.searchParams.set(formFields[index], JSON.stringify(value + ' · ' + options[Number(value)])));
  document.getElementById('registro').href = destination.href;
  result.hidden = false;
  result.focus();
  result.scrollIntoView({behavior: 'smooth', block: 'start'});
});
form.addEventListener('change', () => { result.hidden = true; });
form.addEventListener('reset', () => { result.hidden = true; });
document.getElementById('calc-card').hidden = false;
