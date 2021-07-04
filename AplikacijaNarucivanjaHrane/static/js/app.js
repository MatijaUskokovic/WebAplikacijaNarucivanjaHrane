const Restaurants = { template: '<restaurants></restaurants>'}
const LoginAndRegistration = { template: '<loginAndRegistration></loginAndRegistration>'}
const Profile = { template: '<profile></profile>'}
const CreateStaff = { template: '<createStaff></createStaff>'}
const AllUsers = {template: '<allUsers></allUsers>'}
const RestaurantPage = {template: '<restaurantPage></restaurantPage>'}
const CreateRestaurant = {template: '<createRestaurant></createRestaurant>'}
const ShoppingCart = {template: '<shoppingCart></shoppingCart>'}
const Orders = {template: '<orders></orders>'}
const DeliverRequests = {template: '<deliverRequests></deliverRequests>'}
const CustomersOfRestaurant = {template: '<customersOfRestaurant></customersOfRestaurant>'}
const ManagerRestaurant = {template: '<managerRestaurant></managerRestaurant>'}
const CommentsRequests = {template:'<commentsRequests></commentsRequests>'}
const ChangeRestaurant = {template: '<changeRestaurant></changeRestaurant>'}

const router = new VueRouter({
	mode: 'hash',
	  routes: [
		{ path: '/', name: 'Početna', component: Restaurants},
		{ path: '/login', name:'login', component: LoginAndRegistration},
		{ path: '/profile', name:'profil', component: Profile},
		{ path: '/createStaff', name:'noviZaposleni', component: CreateStaff},
		{ path: '/allUsers', name:'sviKorisnici', component: AllUsers},
		{ path: '/restaurantPage', name:'stranicaRestorana', component: RestaurantPage},
		{ path: '/createRestaurant', name:'noviRestoran', component: CreateRestaurant},
		{ path: '/shoppingCart', name:'korpa', component: ShoppingCart},
		{ path: '/orders', name: 'porudzbine', component: Orders},
		{ path: '/deliverRequests', name: 'zahteviDostave', component: DeliverRequests},
		{ path: '/customersOfRestaurant', name: 'musterije', component: CustomersOfRestaurant},
		{ path: '/managerRestaurant', name: 'restoranMenadzera', component: ManagerRestaurant},
		{ path: '/commentsRequests', name: 'zahteviZaKomentare', component: CommentsRequests},
		{ path: '/changeRestaurant', name: 'izmenaRestorana', component: ChangeRestaurant}
	  ]
});

var app = new Vue({
	router,
	el: '#mainView',
	data: {
        loggedUser: {restaurant: {}},
        userRole: "Neulogovan",
		location: { longitude: '', latitude: ''},
		selectedRestaurant: {}
    },
	mounted() {
        this.getLoggedUser();
    },
    methods: {
		getLoggedUser: function() {
			axios
			.get('rest/getLoggedUser')
			.then(response => {
				//DODATO ZA BLOKIRANJE
				let user = response.data;
				if(!user.blocked){
					this.loggedUser = response.data;
					this.userRole = this.loggedUser.role;
				}else{
					alert('Nije Vam dozvoljena prijava jer je Vaš nalog blokiran')
				}
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