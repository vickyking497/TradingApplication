package com.vic.service;

import java.util.List;

import com.vic.model.User;
import com.vic.model.Withdrawal;

public interface WithdrawalService {

	Withdrawal requestWithdrawal(Long amount,User user);
	
	Withdrawal proceedWithdrawal(Long withdrawalId,boolean accept) throws Exception;
	
	List<Withdrawal>  getUsersWithdrawalHistory(User user);
	
	List<Withdrawal> getAllWithdrawalRequest();
	
	
}
