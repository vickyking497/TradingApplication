package com.vic.repositry;

import org.springframework.data.jpa.repository.JpaRepository;

import com.vic.model.TwoFactOtp;

public interface TwoFactorOtpRepositry extends JpaRepository<TwoFactOtp, String>{
	TwoFactOtp findByUserId(Long userId);

}
