package com.vic.controller;

import java.net.Authenticator.RequestorType;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.vic.domain.VerificationType;
import com.vic.model.ForgotPasswordToken;
import com.vic.model.User;
import com.vic.model.VerificationCode;
import com.vic.request.ForgotPasswordTokenRequest;
import com.vic.request.ResetPasswordRequest;
import com.vic.response.ApiResponse;
import com.vic.response.AuthResponse;
import com.vic.service.*;
import com.vic.utils.OTPUtils;

@RestController
public class UserController {

	
	@Autowired
	private UserService userService;
	
	@Autowired
	private EmailService emailService;
	
	@Autowired
	private VerificationCodeService verificationCodeService;
	
	@Autowired
	private ForgotPasswordService forgotPasswordService;

    
	
	@GetMapping("/api/users/profile")
	public ResponseEntity<User> getUserProfile(@RequestHeader("Authorization") String jwt) throws Exception{
		
		User user = userService.findUserProfileByJwt(jwt);
		
		return new ResponseEntity<User>(user, HttpStatus.OK);
		
	}
	
	@PostMapping("/api/user/verification/{verificationType}/send-otp")
	public ResponseEntity<String> snedVerificationOtp(@RequestHeader("Authorization") String jwt , @PathVariable VerificationType verificationType) throws Exception{
		
		
		User user = userService.findUserProfileByJwt(jwt);
		
		VerificationCode verificationCode  = verificationCodeService.getVerificationCodeByUser(user.getId());
		
		if(verificationCode == null) {
			verificationCode = verificationCodeService.sendVerificationCode(user, verificationType);
			
		}
		
		if(verificationType.equals(verificationType.Email)) {
			emailService.sendVerficationOtpEmail(user.getEmail(),verificationCode.getOtp() );
		}
		
		return new ResponseEntity<>("Verification OTP sent successfully ", HttpStatus.OK); 
		
	}

	
	@PatchMapping("/api/user/enable-two-factor/verify-otp/{otp}")
	public ResponseEntity<User> enableTwoFactorAuthenticataion(@PathVariable String otp,@RequestHeader("Authorization") String jwt) throws Exception{
		
		User user = userService.findUserProfileByJwt(jwt);
		
		VerificationCode verificationCode = verificationCodeService.getVerificationCodeByUser(user.getId());
		
		String sendTo = verificationCode.getVerificationType().equals(VerificationType.Email) ? verificationCode.getEmail() : verificationCode.getMobile();
		
		boolean isVerified = verificationCode.getOtp().equals(otp);
		
		if(isVerified) {
			User updatedUser = userService.enableTwoFactorAuthentication(verificationCode.getVerificationType(), sendTo, user);
			
			verificationCodeService.deleteVerificationCodeById(verificationCode);
			
			return new ResponseEntity<User>(user, HttpStatus.OK);
		}
		
		throw new Exception("Wrong Otp");
		
	}
	
	@PostMapping("/auth/user/reset-password/send-otp")
	public ResponseEntity<AuthResponse> snedForgotPasswordOtp( @RequestBody ForgotPasswordTokenRequest req ) throws Exception{
		
		User user = userService.findUserProfileByJwt(req.getSendTo());
		String otp = OTPUtils.generateOtp();
		UUID uuid = UUID.randomUUID();
		String id = uuid.toString();
		
		ForgotPasswordToken forgotPasswordToken = forgotPasswordService.findByUser(user.getId());
		
		if(forgotPasswordToken == null) {
			forgotPasswordToken = forgotPasswordService.createToken(user, id,otp,req.getVerificationType(),req.getSendTo());
		}
		
		if(req.getVerificationType().equals(VerificationType.Email)) {
			emailService.sendVerficationOtpEmail(user.getEmail(), forgotPasswordToken.getOtp());
		}
		
		AuthResponse response = new AuthResponse();
		response.setSession(forgotPasswordToken.getId());
		response.setMessage("Password reset otp sent successfully");
		
		
		return new ResponseEntity<>(response, HttpStatus.OK); 
		
	}
	

	@PatchMapping("/auth/user/reset-password/verify-otp/")
	public ResponseEntity<ApiResponse> restPassword ( @RequestParam String id , @RequestBody ResetPasswordRequest req, @RequestHeader("Authorization") String jwt) throws Exception{
		
		User user = userService.findUserProfileByJwt(jwt);
		
		ForgotPasswordToken forgotPasswordToken = forgotPasswordService.findByid(id);
		
		boolean isVerified = forgotPasswordToken.getOtp().equals(req.getOtp());
		
	 if(isVerified ) {
		 userService.updatePassword(forgotPasswordToken.getUser(),req.getPassword());
		 ApiResponse res = new ApiResponse();
		 res.setMessage("Password Updated successfully");
		 
		 return new ResponseEntity<>(res,HttpStatus.ACCEPTED);
	 }
	 
	 throw new Exception("Wrong Otp");
		
	}
	
	

}
