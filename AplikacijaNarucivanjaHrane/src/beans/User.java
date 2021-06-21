package beans;

import java.util.Date;
import java.util.UUID;

public class User {
	private String id;
	private boolean deleted;
	private String username;
	private String password;
	private String name;
	private String surname;
	private Gender gender;
	private Date dateOfBirth;
	private UserRole role;
	
	public User() {
		this.id = UUID.randomUUID().toString();
		this.deleted = false;
	}
	
	public User(String username, String password, String name, String surname, Gender gender, Date dateOfBirth,
			UserRole role) {
		super();
		this.id = UUID.randomUUID().toString();
		this.deleted = false;
		this.username = username;
		this.password = password;
		this.name = name;
		this.surname = surname;
		this.gender = gender;
		this.dateOfBirth = dateOfBirth;
		this.role = role;
	}

	public User(String id, boolean deleted, String username, String password, String name, String surname,
			Gender gender, Date dateOfBirth, UserRole role) {
		super();
		this.id = id;
		this.deleted = deleted;
		this.username = username;
		this.password = password;
		this.name = name;
		this.surname = surname;
		this.gender = gender;
		this.dateOfBirth = dateOfBirth;
		this.role = role;
	}
	
	public User(User user) {
		super();
		this.id = user.getId();
		this.deleted = user.isDeleted();
		this.username = user.getUsername();
		this.password = user.getPassword();
		this.name = user.getName();
		this.surname = user.getSurname();
		this.gender = user.getGender();
		this.dateOfBirth = user.getDateOfBirth();
		this.role = user.getRole();
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public boolean isDeleted() {
		return deleted;
	}

	public void setDeleted(boolean deleted) {
		this.deleted = deleted;
	}

	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getSurname() {
		return surname;
	}
	public void setSurname(String surname) {
		this.surname = surname;
	}
	public Gender getGender() {
		return gender;
	}
	public void setGender(Gender gender) {
		this.gender = gender;
	}
	public Date getDateOfBirth() {
		return dateOfBirth;
	}
	public void setDateOfBirth(Date dateOfBirth) {
		this.dateOfBirth = dateOfBirth;
	}
	public UserRole getRole() {
		return role;
	}
	public void setRole(UserRole role) {
		this.role = role;
	}
}
