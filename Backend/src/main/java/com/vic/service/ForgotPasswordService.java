package com.vic.service;

import com.vic.domain.VerificationType;
import com.vic.model.ForgotPasswordToken;
import com.vic.model.User;

public interface ForgotPasswordService {

	ForgotPasswordToken createToken(User user,String id,String otp,VerificationType verificationType, String sendTo);
	
	ForgotPasswordToken findByid(String id);
	
	ForgotPasswordToken findByUser(Long userId);
	
	void deleteToken(ForgotPasswordToken token);
	

}