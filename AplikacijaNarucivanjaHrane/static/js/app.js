const Restaurants = { template: '<restaurants></restaurants>'}
const LoginAndRegistration = { template: '<loginAndRegistration></loginAndRegistration>'}

const router = new VueRouter({
	mode: 'hash',
	  routes: [
		{ path: '/', name: 'Početna', component: Restaurants},
		{ path: '/login', name:'login', component:LoginAndRegistration}
	  ]
});

var app = new Vue({
	router,
	el: '#mainView'
});