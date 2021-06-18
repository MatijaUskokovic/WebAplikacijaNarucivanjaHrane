Vue.component("loginAndRegistration", {
	data: function () {
		    return {
		      polje: ". Primer polja"
		    }
	},
	template: ` 
<div>
		<div>
			<p>Registrovani korisnik</p>
			<table>
				<tr><td>Korisničko ime</td><td><input type="text" name="username"></td></tr>
				<tr><td>Lozinka</td><td><input type="password" name="password"></td></tr>
				<tr><td><input type="submit" value="Ulogujte se"></td></tr>
			</table>
		</div>
		<br/>
		<div>
			<p>Napravite profil</p>
			<table>
				<tr><td>Korisničko ime</td><td><input type="text" name="username"></td></tr>
				<tr><td>Lozinka</td><td><input type="password" name="password"></td></tr>
				<tr><td>Ime</td><td><input type="text" name="name"></td></tr>
				<tr><td>Prezime</td><td><input type="text" name="surname"></td></tr>
				<tr>
					<td>Pol</td>
					<td><select name="pol">
							<option value="muski">Muski</option>
							<option value="zenski">Ženski</option>
						</select>
					</td></tr>
				<tr><td>Datum rođenja</td><td><input type="datetime" name="dateOfBirth"></td></tr>
				<tr><td><input type="submit" value="Registrujte se"></td></tr>
			</table>
		</div>
	</div>  
`
	, 
	mounted () {
		
    }
});