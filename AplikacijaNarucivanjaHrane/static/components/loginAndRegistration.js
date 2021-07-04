Vue.component("loginAndRegistration", {
	data: function () {
		    return {
			  logInUser: {username: '', password: ''}, 
			  regUser: {username: '', password: '', name : '', surname: '', gender : '', dateOfBirth : ''}
		    }
	},
	template: ` 
<div class='parent flex-parent'>
		<div class='child flex-child left-child'>
			<p><strong>Registrovani korisnik</strong></p>
			<form @submit='login'>
				<table>
					<tr><td>Korisničko ime</td><td><input type="text" v-model="logInUser.username"></td></tr>
					<tr><td>Lozinka</td><td><input type="password" v-model="logInUser.password"></td></tr>
					<tr><td><input type="submit" value="Uloguj se"></td></tr>
					<tr><td id="logInText"></td></tr>
				</table>
			</form>
		</div>

		<div class='child flex-child right-child'>
			<p><strong>Napravite profil</strong></p>
			<form @submit='register'>
				<table>
					<tr><td>Korisničko ime*</td><td><input type="text" v-model="regUser.username"></td></tr>
					<tr><td>Lozinka*</td><td><input type="password" v-model="regUser.password"></td></tr>
					<tr><td>Ime*</td><td><input type="text" v-model="regUser.name"></td></tr>
					<tr><td>Prezime*</td><td><input type="text" v-model="regUser.surname"></td></tr>
					<tr>
						<td>Pol*</td>
						<td><select v-model="regUser.gender">
								<option value="muski">Muski</option>
								<option value="zenski">Ženski</option>
							</select>
						</td></tr>
					<tr><td>Datum rođenja*</td><td><vuejs-datepicker v-model="regUser.dateOfBirth" format="dd.MM.yyyy."></vuejs-datepicker></td></tr>
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
			if (!this.isValidToLogIn()) {
				alert('Niste popunili sva polja za prijavu');
				return;
			}
			var user = JSON.stringify(this.logInUser);
			axios
			.post("rest/login", user)
			.then(response => {
				app.getLoggedUser();
				router.push('/');
			})
			.catch(function(error){
				alert('Neuspešno logovanje')
			})
		},
		register : function(event) {
			event.preventDefault();
			if (!this.isValidToRegister()){
				alert('Nisu popunjena sva neophodna polja ili ste koristili pogrešne karaktere(",")');
				return;
			}
			if (this.regUser.username == '-1'){
				alert('Nemoguće odabrati navedeno korisničko ime');
				return;
			}

			this.regUser.dateOfBirth = this.regUser.dateOfBirth.getTime();
			var user = JSON.stringify(this.regUser);
			// vracanje datuma rodjenja u tip Date
			this.regUser.dateOfBirth = new Date(parseInt(this.regUser.dateOfBirth));
			axios.post("rest/customers", user)
			.then(response => {
				if (response.data.username == '-1'){
					alert('Korisničko ime je već zauzeto');
				}
				else {
					this.logInUser.username = this.regUser.username;
					this.logInUser.password = this.regUser.password;
					this.login();
				}
			})
			.catch(function(error){
				alert('Neuspesno registrovanje')
			})
		},
		isValidToRegister : function() {
			let reg = /[,]+/;

			if (this.regUser.username == '' || this.regUser.username.match(reg)) {
				return false;
			}
			if (this.regUser.password == '' || this.regUser.password.match(reg)) {
				return false;
			}
			if (this.regUser.name == '' || this.regUser.name.match(reg)) {
				return false;
			}
			if (this.regUser.surname == '' || this.regUser.surname.match(reg)) {
				return false;
			}
			if (this.regUser.gender == '') {
				return false;
			}
			if (this.regUser.dateOfBirth == '') {
				return false;
			}

			return true;
		},
		isValidToLogIn : function() {
			if (this.logInUser.username == '') {
				return false;
			}
			if (this.logInUser.password == '') {
				return false;
			}

			return true;
		}
	},
	components: {
		vuejsDatepicker
	}
});