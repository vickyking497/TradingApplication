package com.vic.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vic.model.PaymentDetails;
import com.vic.model.User;
import com.vic.repositry.PaymentDetailsRepositry;

@Service
public class PaymentDetailsServiceImpl implements PaymentDetailsService {

	@Autowired
	PaymentDetailsRepositry paymentDetailsRepositry ;
	
	@Override
	public PaymentDetails addPaymentDetails(String accountNumber, String accountHolderName, String ifsc,
			String bankName, User user) {
	
		PaymentDetails paymentDetails = new PaymentDetails();
		
		paymentDetails.setAccountNumber(accountNumber);
		paymentDetails.setAccounHolderName(accountHolderName);
		paymentDetails.setIfsc(ifsc);
		paymentDetails.setBankName(bankName);
		paymentDetails.setUser(user);
		
		return paymentDetailsRepositry.save(paymentDetails);
	}

	@Override
	public PaymentDetails getUsersPaymentDetails(User user) {
		// TODO Auto-generated method stub
		return paymentDetailsRepositry.findByuserId(user.getId());
	}

}
