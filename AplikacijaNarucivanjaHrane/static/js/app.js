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
	el: '#mainView',
	data: {
        loggedUser: {},
        userRole: "Neulogovan"
    },
	mounted() {
        
    },
    methods: {
		getLoggedUser: function() {
			axios
			.get('rest/getLoggedUser')
			.then(response => {
				this.loggedUser = response.data;
				this.userRole = this.loggedUser.role;
				router.push('/');
			})
		},
        logout: function() {
            this.userRole = "Neulogovan";
            axios
            .get('rest/logout')
            .then(response => (router.push('/')));
        }
    }
});