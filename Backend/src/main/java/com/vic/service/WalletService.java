package com.vic.service;

import com.vic.model.Order;
import com.vic.model.User;
import com.vic.model.Wallet;

public interface WalletService {
	
	Wallet getUserWallet(User user);
	
	Wallet addBalance(Wallet wallet,Long Money);
	Wallet findWalletById(Long id) throws Exception;
	Wallet walletToWalletTransfer(User sender, Wallet receiverWallet,Long amount) throws Exception;
	Wallet payOrderPayment(Order order,User user) throws Exception;
	

}
