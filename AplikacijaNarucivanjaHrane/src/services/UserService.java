package services;

import beans.User;
import fileRepository.UserFileRepository;

public class UserService {

	private UserFileRepository userRepository = new UserFileRepository();
	
	public UserService() {
		
	}
	
	public User findUser(String username, String password) {
		User user = userRepository.getUser(username);
		if (user == null || !user.getPassword().equals(password)) {
			return null;
		}
		return user;
	}
}
