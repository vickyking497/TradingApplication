package com.vic.service;

import com.vic.model.TwoFactOtp;
import com.vic.model.User;

public interface TwoFactorOtpService {
	
	TwoFactOtp createTwoFactOtp(User user,String otp,String jwt);
	
	TwoFactOtp findByuser(Long userId);
	
	TwoFactOtp findById(String id);
	
	boolean verifyTwoFactorOtp(TwoFactOtp twofactOtp,String otp);
	
	void deleteTwofactorotp(TwoFactOtp twoFactOtp);

}
