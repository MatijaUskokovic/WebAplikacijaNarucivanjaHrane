Vue.component("loginAndRegistration", {
	data: function () {
		    return {
			  logInUser: {username: '', password: ''}, 
			  regUser: {username: '', password: '', name : '', surname: '', gender : '', dateOfBirth : ''}
		    }
	},
	template: ` 
<div class='parent flex-parent'>
		<div class='child flex-child'>
			<p>Registrovani korisnik</p>
			<form @submit='login'>
				<table>
					<tr><td>Korisničko ime</td><td><input type="text" v-model="logInUser.username"></td></tr>
					<tr><td>Lozinka</td><td><input type="password" v-model="logInUser.password"></td></tr>
					<tr><td><input type="submit" value="Uloguj se"></td></tr>
					<tr><td id="logInText"></td></tr>
				</table>
			</form>
		</div>

		<div class='child flex-child'>
			<p>Napravite profil</p>
			<form @submit='register'>
				<table>
					<tr><td>Korisničko ime</td><td><input type="text" v-model="regUser.username"></td></tr>
					<tr><td>Lozinka</td><td><input type="password" v-model="regUser.password"></td></tr>
					<tr><td>Ime</td><td><input type="text" v-model="regUser.name"></td></tr>
					<tr><td>Prezime</td><td><input type="text" v-model="regUser.surname"></td></tr>
					<tr>
						<td>Pol</td>
						<td><select v-model="regUser.gender">
								<option value="muski">Muski</option>
								<option value="zenski">Ženski</option>
							</select>
						</td></tr>
					<tr><td>Datum rođenja</td><td><vuejs-datepicker v-model="regUser.dateOfBirth" format="dd.MM.yyyy."></vuejs-datepicker></td></tr>
					<tr><td><input type="submit" value="Registruj se"></td></tr>
				</table>
			</form>
		</div>
	</div>  
`
	, 
	mounted () {
		
    },
	methods: {
		login : function(event) {
			// bice undefined kad se pozove iz metode za registrovanje
			if (event != undefined){
				event.preventDefault();
			}
			var user = JSON.stringify(this.logInUser);
			axios
			.post("rest/login", user)
			.then(response => {
				app.getLoggedUser();
			})
			.catch(function(error){
				alert('Neuspešno logovanje')
			})
		},
		register : function(event) {
			event.preventDefault();
			this.regUser.dateOfBirth = this.regUser.dateOfBirth.getTime();
			var user = JSON.stringify(this.regUser);
			axios.post("rest/customers", user)
			.then(response => {
				this.logInUser.username = this.regUser.username;
				this.logInUser.password = this.regUser.password;
				this.login();
			})
			.catch(function(error){
				alert('Neuspesno registrovanje')
			})
		}
	},
	components: {
		vuejsDatepicker
	}
});