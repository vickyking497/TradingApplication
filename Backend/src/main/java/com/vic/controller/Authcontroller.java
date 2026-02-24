package com.vic.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.vic.config.JwtProvider;
import com.vic.model.TwoFactOtp;
import com.vic.model.User;
import com.vic.repositry.UserRepositry;
import com.vic.response.AuthResponse;
import com.vic.service.CustomUserDetailService;
import com.vic.service.EmailService;
import com.vic.service.TwoFactorOtpService;
import com.vic.service.WatchlistService;
import com.vic.utils.OTPUtils;


@RestController
@RequestMapping("/auth")
public class Authcontroller {
	
	@Autowired
	private UserRepositry userRepositry;
	
	@Autowired
	private CustomUserDetailService customUserDetailService;
	
	@Autowired
	private TwoFactorOtpService twoFactorOtpService;
	
	@Autowired
	private EmailService emailService;
	
	@Autowired
	private WatchlistService watchlistService;
	 
	@PostMapping("/signup")
	public ResponseEntity<AuthResponse > resgiter(@RequestBody User user) throws Exception{
		
		
		
		  User isEmailExist= userRepositry.findByEmail(user.getEmail());
		  if(isEmailExist != null) {
			  throw new Exception("Email is already exists"); 
			  
		  }
		  
		  User newUser = new User();
		  
		 newUser.setEmail(user.getEmail());
		 newUser.setPassword(user.getPassword());
		 newUser.setFullname(user.getFullname());
		 
		  User savedUser = userRepositry.save(newUser);
		  
		  watchlistService.createWatchList(savedUser);
		  
		  Authentication auth = new UsernamePasswordAuthenticationToken(user.getEmail(),user.getPassword());
		  
		 
		 SecurityContextHolder.getContext().setAuthentication(auth);
		  
		  String jwt = JwtProvider.genrationToken(auth);
		 
		  
		  AuthResponse res = new AuthResponse(); res.setJwt(jwt); res.setStatus(true);
		  res.setMessage("register successfull");
		  
		  
		  return new ResponseEntity<>(res,HttpStatus.CREATED);
		 
	}
	
	 
		@PostMapping("/signin")
		public ResponseEntity<AuthResponse > login(@RequestBody User user) throws Exception{
			
			String userName=user.getEmail();
			String password = user.getPassword();
			
			  Authentication auth = authenticate(userName,password);
			  
			 
			 SecurityContextHolder.getContext().setAuthentication(auth);
			  
			  String jwt = JwtProvider.genrationToken(auth);
			  
			  User authUser = userRepositry.findByEmail(userName);
			  
			  if(user.getTwoFactorAuth().isEnabled()) { 
				  AuthResponse res = new AuthResponse();
				  res.setMessage("TwoFactor is Enabled");
				  res.setTwoFactorEnabled(true);
				  String otp = OTPUtils.generateOtp();
				  
				  TwoFactOtp oldTwoFactOtp = twoFactorOtpService.findByuser(authUser.getId());
				  if(oldTwoFactOtp!= null) {
					  twoFactorOtpService.deleteTwofactorotp(oldTwoFactOtp);
				  }
				  
				  TwoFactOtp newTwoFactOtp = twoFactorOtpService.createTwoFactOtp(authUser, otp, jwt);
				  
				  emailService.sendVerficationOtpEmail(userName, otp);
				  
				  res.setSession(newTwoFactOtp.getId());
				  return new ResponseEntity<>(res,HttpStatus.ACCEPTED);
			  }
			  
			  AuthResponse res = new AuthResponse(); 
			  res.setJwt(jwt);
			  res.setStatus(true);
			  res.setMessage("login successfull");
			  
			  
			  return new ResponseEntity<>(res,HttpStatus.CREATED);
			 
		}


		private Authentication authenticate(String userName, String password) {
			
			UserDetails userDetails = customUserDetailService.loadUserByUsername(userName);
			
			if(userDetails == null) {
				throw new BadCredentialsException("invalid username");
			}
			if(!password.equals(userDetails.getPassword()) ) {
				throw new BadCredentialsException("invalid password");
			}
			
			return new UsernamePasswordAuthenticationToken( userDetails,password,userDetails.getAuthorities());
		}
		
		
		@PostMapping("/two-factor/otp/{otp}")
		public ResponseEntity<AuthResponse> verifySigninOtp(@PathVariable String otp,@RequestParam String id 	) throws Exception{
			
			TwoFactOtp twoFactOtp = twoFactorOtpService.findById(id);
			
			if(twoFactorOtpService.verifyTwoFactorOtp(twoFactOtp, otp)){
				
				AuthResponse res = new AuthResponse();
				res.setMessage("Two factor authentication verified");
				res.setTwoFactorEnabled(true);
				res.setJwt(twoFactOtp.getJwt());
				return new ResponseEntity<>(res,HttpStatus.OK);
			}
			
			throw new Exception("Invalid OTP");
			
			
			 
		}
}
