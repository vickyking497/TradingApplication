package com.vic.service;

import com.vic.domain.VerificationType;
import com.vic.model.User;

public interface UserService {

	public User findUserProfileByJwt(String jwt) throws Exception;
	public User findUserByEmail(String email) throws Exception;
	public User findUserById(Long userId) throws Exception;
	
	public User enableTwoFactorAuthentication(VerificationType verificationType,String snedTo,User user);
	
	User updatePassword(User user,String newPassword);

}
