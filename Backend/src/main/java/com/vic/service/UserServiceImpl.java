
package com.vic.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import com.vic.config.JwtProvider;
import com.vic.domain.VerificationType;
import com.vic.model.TwofactorAuth;
import com.vic.model.User;
import com.vic.repositry.UserRepositry;

@RestController
public class UserServiceImpl implements UserService {
	
	@Autowired
	private UserRepositry userRepositry;

	@Override
	public User findUserProfileByJwt(String jwt) throws Exception {
		String email = JwtProvider.getEmailFromToken(jwt);
		User user = userRepositry.findByEmail(email);
		
		if(user == null) {
			throw new Exception("User Not found");
		}
		return user;
	}

	@Override
	public User findUserByEmail(String email) throws Exception {
User user = userRepositry.findByEmail(email);
		
		if(user == null) {
			throw new Exception("User Not found");
		}
		return user;
		}

	@Override
	public User findUserById(Long userId) throws Exception {
		Optional<User> user = userRepositry.findById(userId);
		if(user.isEmpty()) {
			throw new Exception("User Not found");
		}
		return user.get();
	}

	@Override
	public User enableTwoFactorAuthentication(VerificationType verificationType, String sendTo, User user) {
		TwofactorAuth twofactorAuth = new TwofactorAuth();
		twofactorAuth.setEnabled(true);
		twofactorAuth.setSendto(verificationType);
		
		user.setTwoFactorAuth(twofactorAuth);
		return userRepositry.save(user);
	}

	@Override
	public User updatePassword(User user, String newPassword) {
		user.setPassword(newPassword);
		return userRepositry.save(user);
	}

	

	

}
