package com.vic.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.razorpay.RazorpayException;
import com.stripe.exception.StripeException;
import com.vic.domain.PaymentMethod;
import com.vic.model.PaymentOrder;
import com.vic.model.User;
import com.vic.response.PaymentResponse;
import com.vic.service.PaymentService;
import com.vic.service.UserService;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {
	
	@Autowired
	private UserService userService;
	
	@Autowired
	private PaymentService paymentService;
	
	@PostMapping("/{paymentMethod}/amount/{amount}")
	public ResponseEntity<PaymentResponse> paymentHandler(@PathVariable PaymentMethod paymentMethod ,@PathVariable Long amount,@RequestHeader("Authorization") String jwt) throws Exception,StripeException,RazorpayException{

		User user  = userService.findUserProfileByJwt(jwt);
		
		PaymentResponse paymentResponse;
		
		PaymentOrder order = paymentService.createOrder(user, amount, paymentMethod);
		
		if(paymentMethod.equals(PaymentMethod.RAZORPAY)) {
			paymentResponse = paymentService.createRazorpayPaymentLink(user, amount,order.getId());
		}
		
		else {
			paymentResponse = paymentService.createStripePaymentLink(user, amount, order.getId());
		}
		
		return new ResponseEntity<>(paymentResponse,HttpStatus.CREATED);
	}
	

}
