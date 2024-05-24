// let inactivityTimer;

// function startInactivityTimer(el, inactivityThreshold, store) {
//   function resetTimer() {
//     clearTimeout(inactivityTimer);
//     inactivityTimer = setTimeout(() => {
//       store.dispatch('userLogout');
//     }, inactivityThreshold * 1000); // Convert threshold to seconds
//   }

//   function handleUserActivity() {
//     resetTimer();
//   }

//   ['mousemove', 'keydown', 'mousedown', 'touchstart'].forEach((event) => {
//     window.addEventListener(event, handleUserActivity);
//   });

//   resetTimer();
// }

// export default {
//   inserted(el, binding, vnode) {
//     const inactivityThreshold = binding.value;
//     const store = vnode.context.$store;
//     startInactivityTimer(el, inactivityThreshold, store);
//   },
//   unbind() {
//     ['mousemove', 'keydown', 'mousedown', 'touchstart'].forEach((event) => {
//       window.removeEventListener(event, handleUserActivity);
//     });
//   },
// };

let inactivityTimer;

function resetTimer(inactivityThreshold, store) {
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(() => {
    store.dispatch('userLogout');
  }, inactivityThreshold * 1000); // Convert threshold to seconds
}

function handleUserActivity(inactivityThreshold, store) {
  resetTimer(inactivityThreshold, store);
}

function startInactivityTimer(el, inactivityThreshold, store) {
  ['mousemove', 'keydown', 'mousedown', 'touchstart'].forEach((event) => {
    window.addEventListener(event, () => handleUserActivity(inactivityThreshold, store));
  });

  resetTimer(inactivityThreshold, store);
}

export default {
  inserted(el, binding, vnode) {
    const inactivityThreshold = binding.value;
    const store = vnode.context.$store;
    startInactivityTimer(el, inactivityThreshold, store);
  },
  unbind() {
    ['mousemove', 'keydown', 'mousedown', 'touchstart'].forEach((event) => {
      window.removeEventListener(event, handleUserActivity);
    });
  },
};
