package com.vic.repositry;

import org.springframework.data.jpa.repository.JpaRepository;

import com.vic.model.VerificationCode;

public interface VerificationCodeRepositry extends JpaRepository<VerificationCode, Long> {
	
	public VerificationCode findByUserId(Long userId) ;
}
