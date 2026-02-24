package com.vic.service;

import com.vic.model.PaymentDetails;
import com.vic.model.User;

public interface PaymentDetailsService {
	
	public PaymentDetails addPaymentDetails(String accountNumber,String accountHolderName,String ifsc,String bankName,User user);
	
	public PaymentDetails  getUsersPaymentDetails(User user);
}
