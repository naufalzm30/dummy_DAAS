import Vue from 'vue'
import Vuex from 'vuex'
import { getAPI } from './axios-api'
import router from './router'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        accessToken: localStorage.getItem("access") || "",
        status: "",
        isLoggedIn: false,
        loginTime: null,
        lastActivityTime: null,
        inactivityTimer: null,
        inactivityThreshold: 3600 * 1, // in seconds
    },
    mutations: {
        updateStorage(state, { access }) {
            state.accessToken = access
        },
        destroyToken(state) {
            state.accessToken = null
        }
    },
    getters: {
        isAuthenticated: state => !!state.accessToken,
        authStatus: state => state.status,
        loggedIn(state) {
            return state.accessToken != null
        }
    },
    actions: {
        startInactivityTimer(context) {
            // console.log('Starting inactivity timer...');
            const inactivityThreshold = context.state.inactivityThreshold;
            let inactivityTimer;

            function resetTimer() {
                clearTimeout(inactivityTimer);
                inactivityTimer = setTimeout(() => {
                    context.dispatch('userLogout');
                }, inactivityThreshold * 1000); // Convert threshold to seconds
            }

            function handleUserActivity() {
                resetTimer();
            }

            ['mousemove', 'keydown', 'mousedown', 'touchstart'].forEach((event) => {
                window.addEventListener(event, handleUserActivity);
            });

            resetTimer();

            // Save the inactivityTimer in the state for clearing later
            context.state.inactivityTimer = inactivityTimer;
        },
        clearInactivityTimer(context) {
            clearTimeout(context.state.inactivityTimer);
        },
        resetInactivityTimer(context) {
            // console.log('Resetting inactivity timer...');
            clearTimeout(context.state.inactivityTimer);
            // context.dispatch('startInactivityTimer');
        },
        userLogin(context, usercredentials) {
            return new Promise((resolve, reject) => {
                // getAPI.post('/login/', {
                getAPI.post('login/', {

                    username: usercredentials.username,
                    password: usercredentials.password,
                    // balai: usercredentials.balai

                })
                    .then(response => {
                        localStorage.setItem("access", response.data.token);
                        localStorage.setItem("user-info", JSON.stringify(response.data));
                        context.commit('updateStorage', { access: response.data.token })

                        // Record the login time
                        context.state.loginTime = new Date().getTime();
                        context.state.isLoggedIn = true;

                        // Start the inactivity timer after login
                        context.dispatch('startInactivityTimer');
                        resolve()

                    })
                    .catch(err => {
                        localStorage.removeItem("access");
                        reject(err)
                    })


            })
        },
        userLogout(context) {
            // console.log('User logged out after ' + Math.floor((new Date().getTime() - context.state.loginTime) / 1000) + ' seconds.');
            context.state.isLoggedIn = false;
            clearTimeout(context.state.inactivityTimer);
            context.commit('destroyToken');
            localStorage.removeItem('access');
            localStorage.removeItem('user-info');

            // console.log('User logged out.');
            router.push({ name: 'Home' })
        },
    }
})