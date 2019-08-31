import Vue from 'vue';

Vue.directive('class', (el, binding) => {
  const clsName = binding.arg!;
  el.classList.toggle(clsName, binding.value);
});
