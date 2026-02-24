package com.vic.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vic.domain.VerificationType;
import com.vic.model.User;
import com.vic.model.VerificationCode;
import com.vic.repositry.VerificationCodeRepositry;
import com.vic.utils.OTPUtils;

@Service
public class VerificationCodeServiceImpl implements VerificationCodeService {

	@Autowired
	private VerificationCodeRepositry verificationCodeRepositry;
	
	@Override
	public VerificationCode sendVerificationCode(User user, VerificationType verificationType) {
		VerificationCode verificationCode1 = new VerificationCode();
		verificationCode1.setOtp(OTPUtils.generateOtp());
		verificationCode1.setVerificationType(verificationType);
		verificationCode1.setUser(user);
		return verificationCodeRepositry.save(verificationCode1);
	}
	
	@Override
	public VerificationCode getVerificationCodeById(Long id) throws Exception {
		Optional<VerificationCode> verificationCode = verificationCodeRepositry.findById(id);
		if(verificationCode.isPresent()) {
			return verificationCode.get();
		}
		throw new Exception("Verification Code Not Found");
		
	}

	@Override
	public VerificationCode getVerificationCodeByUser(Long userId) {
	
		return verificationCodeRepositry.findByUserId(userId);
	}

	@Override
	public void deleteVerificationCodeById(VerificationCode verificationCode) {
		// TODO Auto-generated method stub
		verificationCodeRepositry.delete(verificationCode);
	}

	

}
