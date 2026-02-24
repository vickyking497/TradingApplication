package com.vic.service;

import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vic.model.TwoFactOtp;
import com.vic.model.User;
import com.vic.repositry.TwoFactorOtpRepositry;

@Service
public class TwoFactorOtpServiceimpl implements TwoFactorOtpService {

   
	
	@Autowired
	private TwoFactorOtpRepositry twoFactorOtpRepositry;

    
	@Override
	public TwoFactOtp createTwoFactOtp(User user, String otp, String jwt) {
		UUID uuid = UUID.randomUUID();
		String id = uuid.toString();
		TwoFactOtp twoFactOtp = new TwoFactOtp();
		twoFactOtp.setOtp(otp);
		twoFactOtp.setJwt(jwt);
		twoFactOtp.setId(id);
		twoFactOtp.setUser(user);
		return twoFactorOtpRepositry.save(twoFactOtp);
		
	}

	@Override
	public TwoFactOtp findByuser(Long userId) {
		return twoFactorOtpRepositry.findByUserId(userId);
	}

	@Override
	public TwoFactOtp findById(String id) {
		Optional<TwoFactOtp> otp = twoFactorOtpRepositry.findById(id);
		return otp.orElse(null);
	}

	@Override
	public boolean verifyTwoFactorOtp(TwoFactOtp twofactOtp, String otp) {
	
		return twofactOtp.getOtp().equals(otp);
	}

	@Override
	public void deleteTwofactorotp(TwoFactOtp twoFactOtp) {
		twoFactorOtpRepositry.delete(twoFactOtp);
		
	}

}
