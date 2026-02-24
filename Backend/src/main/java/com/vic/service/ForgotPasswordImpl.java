package com.vic.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vic.domain.VerificationType;
import com.vic.model.ForgotPasswordToken;
import com.vic.model.User;
import com.vic.repositry.ForgotPasswordRepositry;

@Service
public class ForgotPasswordImpl implements ForgotPasswordService {

	@Autowired
	private ForgotPasswordRepositry forgotPasswordRepositry;
	
	@Override
	public ForgotPasswordToken createToken(User user, String id, String otp, VerificationType verificationType,
			String sendTo) {
		ForgotPasswordToken token = new ForgotPasswordToken();
		token.setUser(user);
		token.setSendTo(sendTo);
		token.setVerificationType(verificationType);
		token.setOtp(otp);
		token.setId(id);
		return forgotPasswordRepositry.save(token);
	}

	@Override
	public ForgotPasswordToken findByid(String id) {
		Optional<ForgotPasswordToken> token = forgotPasswordRepositry.findById(id);
		
		return token.orElse(null);
	}

	@Override
	public ForgotPasswordToken findByUser(Long userId) {
		// TODO Auto-generated method stub
		return forgotPasswordRepositry.findByUserId(userId);
	}

	@Override
	public void deleteToken(ForgotPasswordToken token) {
		// TODO Auto-generated method stub
		forgotPasswordRepositry.delete(token);
	}

}
