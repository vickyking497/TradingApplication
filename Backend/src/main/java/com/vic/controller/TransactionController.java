package com.vic.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import com.vic.model.User;
import com.vic.model.Wallet;
import com.vic.model.WalletTransaction;
import com.vic.service.TransactionService;
import com.vic.service.UserService;
import com.vic.service.WalletService;


@RestController
public class TransactionController {
	
	@Autowired
	private WalletService walletService;
	
	@Autowired
	private UserService userService;
	
	@Autowired
	private TransactionService transactionService;
	
	@GetMapping("/api/transactions")
	public ResponseEntity<List<WalletTransaction>> getUserWallet(@RequestHeader("Authorization") String jwt) throws Exception{
		User user = userService.findUserProfileByJwt(jwt);
		
		Wallet wallet = walletService.getUserWallet(user);
		
		List<WalletTransaction> transactionsList = transactionService.getTransactionsByWallet(wallet);
		
		return new ResponseEntity<>(transactionsList,HttpStatus.ACCEPTED);
		
	}
	
	
}
