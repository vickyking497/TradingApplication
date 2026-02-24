package com.vic.request;

import com.vic.domain.VerificationType;

import lombok.Data;

@Data
public class ForgotPasswordTokenRequest {
	
	private String sendTo;
	private VerificationType verificationType;

}
