Vue.component("createStaff", {
	data: function () {
		    return {
			  regUser: {}
		    }
	},
	template: ` 
<div>
        <h3>Napravite profil novog radnika</h3>
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
                <tr>
                    <td>Tip radnika</td>
                    <td><select v-model="regUser.role">
                            <option value="Dostavljac">Dostavljač</option>
                            <option value="Menadzer">Menadžer</option>
                        </select>
                    </td>
                </tr>
                <tr><td><input type="submit" value="Registruj radnika"></td></tr>
            </table>
        </form>
</div>
`
	, 
	mounted () {
		this.getLoggedUser();
    },
	methods: {
		register : function(event) {
			event.preventDefault();
			this.regUser.dateOfBirth = this.regUser.dateOfBirth.getTime();
			let user = JSON.stringify(this.regUser);
            let path = '';
            if (this.regUser.role == 'Dostavljac'){
                path = 'rest/deliverers';
            }
            if (this.regUser.role == 'Menadzer'){
                path = 'rest/managers';
            }
			axios.post(path, user)
			.then(response => {
				this.regUser = {};
                alert('Uspešno ste registrovali novog zaposlenog')
			})
			.catch(function(error){
				alert('Neuspesno registrovanje')
			})
		},
        getLoggedUser : function() {
			axios
			.get('rest/getLoggedUser')
			.then(response => {
				let user = response.data;
                if (user != null){
                    if (user.role != 'Administrator'){
                        router.push('/');
                    }
                }
			})
            .catch(function(error){
                router.push('/');
            })
		}
	},
	components: {
		vuejsDatepicker
	}
});