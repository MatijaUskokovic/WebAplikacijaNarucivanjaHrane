const Restaurants = { template: '<restaurants></restaurants>'}
const LoginAndRegistration = { template: '<loginAndRegistration></loginAndRegistration>'}
const Profile = { template: '<profile></profile>'}
const CreateStaff = { template: '<createStaff></createStaff>'}
const AllUsers = {template: '<allUsers></allUsers>'}

const router = new VueRouter({
	mode: 'hash',
	  routes: [
		{ path: '/', name: 'Početna', component: Restaurants},
		{ path: '/login', name:'login', component: LoginAndRegistration},
		{ path: '/profile', name:'profil', component: Profile},
		{ path: '/createStaff', name:'noviZaposleni', component: CreateStaff},
		{ path: '/allUsers', name:'sviKorisnici', component: AllUsers}
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

function fixDate(users) {
	for (var u of users) {
		u.dateOfBirth = new Date(parseInt(u.dateOfBirth));
	}
	return users;
}