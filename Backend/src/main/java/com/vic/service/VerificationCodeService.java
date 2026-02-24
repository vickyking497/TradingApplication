package com.vic.service;

import com.vic.domain.VerificationType;
import com.vic.model.User;
import com.vic.model.VerificationCode;

public interface VerificationCodeService {

	VerificationCode sendVerificationCode(User user , VerificationType verificationType);
	
	VerificationCode getVerificationCodeById(Long id) throws Exception;
	
	VerificationCode getVerificationCodeByUser(Long userId);
	
	void deleteVerificationCodeById(VerificationCode verificationCode);
	
}
