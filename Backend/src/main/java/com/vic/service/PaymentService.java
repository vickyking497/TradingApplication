package com.vic.service;

import com.razorpay.RazorpayException;
import com.stripe.exception.StripeException;
import com.vic.domain.PaymentMethod;
import com.vic.model.PaymentOrder;
import com.vic.model.User;
import com.vic.response.PaymentResponse;

public interface PaymentService {
	
	PaymentOrder createOrder(User user,Long amount,PaymentMethod paymentMethod);
	
	PaymentOrder getPaymentOrderById(Long id) throws Exception;
	
	Boolean proceedPaymentOrder(PaymentOrder paymentOrder,String paymentId) throws RazorpayException;
	
	PaymentResponse  createRazorpayPaymentLink(User user,Long amount,Long orderId) throws RazorpayException;
	
	PaymentResponse  createStripePaymentLink(User user,Long amount,Long orderId) throws StripeException;

	
}
