package com.vic.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;

import org.springframework.web.bind.annotation.RestController;

import com.vic.domain.WalletTransactionType;
import com.vic.model.User;
import com.vic.model.Wallet;
import com.vic.model.WalletTransaction;
import com.vic.model.Withdrawal;
import com.vic.service.TransactionService;
import com.vic.service.UserService;
import com.vic.service.WalletService;
import com.vic.service.WithdrawalService;

@RestController

public class WithdrawalController {
	
	@Autowired
	private WithdrawalService withdrawalService;
	
	@Autowired
	private WalletService walletService;

	@Autowired
	private UserService userService;
	
	@Autowired
	private TransactionService transactionService;
	
	@PostMapping("/api/withdrawal/{amount}")
	public ResponseEntity<?> withdrawalRequest(@PathVariable Long amount,@RequestHeader("Authorization")String jwt)throws Exception{
		User user = userService.findUserProfileByJwt(jwt);
		
		Wallet userWallet = walletService.getUserWallet(user);
		
		Withdrawal withdrawal = withdrawalService.requestWithdrawal(amount, user);
		
		
		
		WalletTransaction walletTransaction = transactionService.createTransaction
				(userWallet,
				WalletTransactionType.WITHDRAWAL,null,
				"bank account withdrawal",withdrawal.getAmount());
		
		
		
		return new ResponseEntity<>(withdrawal,HttpStatus.OK);
		
	}
	
	@PatchMapping("/api/admin/withdrawal/{id}/proceed/{accept}")
	public ResponseEntity<?> proceedWithdrawal(@PathVariable Long id,@PathVariable boolean accept,@RequestHeader("Authorization") String jwt) throws Exception{
		
		User user= userService.findUserProfileByJwt(jwt);
		
		Withdrawal withdrawal = withdrawalService.proceedWithdrawal(id, accept);
		
		Wallet userWallet = walletService.getUserWallet(user);
		
		if(!accept) {
			walletService.addBalance(userWallet, withdrawal.getAmount());
		}
		
		return new ResponseEntity<>(withdrawal,HttpStatus.OK);
	}
	
	@GetMapping("/api/withdrawal")
	public ResponseEntity<List<Withdrawal>> getWithdrawalHistory(@RequestHeader("Authorization") String jwt) throws Exception{
		User user = userService.findUserProfileByJwt(jwt);
		
		List<Withdrawal> withdrawal= withdrawalService.getUsersWithdrawalHistory(user);
		
		return new ResponseEntity<>(withdrawal,HttpStatus.OK);
	}
	
	@GetMapping("/api/admin/withdrawal")
	public ResponseEntity<List<Withdrawal>> getAllWithdrawalHistory(@RequestHeader("Authorization") String jwt ) throws Exception{
		
		User user = userService.findUserProfileByJwt(jwt);
		
		List<Withdrawal> withdrawal = withdrawalService.getAllWithdrawalRequest();
		
		return new ResponseEntity<>(withdrawal,HttpStatus.OK);
	} 
}
