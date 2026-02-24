package com.vic.response;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AuthResponse {

	private String jwt;
	private boolean status;
	private String message;
	private boolean isTwoFactorEnabled;
	private String session;

	
	
	
}
