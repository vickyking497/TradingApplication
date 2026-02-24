package com.vic.repositry;

import org.springframework.data.jpa.repository.JpaRepository;

import com.vic.model.ForgotPasswordToken;

public interface ForgotPasswordRepositry extends JpaRepository<ForgotPasswordToken, String> {

	ForgotPasswordToken findByUserId(Long userId);
}
