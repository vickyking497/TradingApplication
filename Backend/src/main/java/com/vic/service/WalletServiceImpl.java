package com.vic.service;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vic.domain.OrderType;
import com.vic.domain.WalletTransactionType;
import com.vic.model.Order;
import com.vic.model.User;
import com.vic.model.Wallet;
import com.vic.repositry.WalletRepositry;

@Service
public class WalletServiceImpl implements WalletService {

	
	@Autowired
	private	WalletRepositry walletRepositry;
	
	@Autowired
	 private TransactionService transactionService;

	
	@Override
	public Wallet getUserWallet(User user) {
		Wallet wallet = walletRepositry.findByUserId(user.getId());
		if(wallet == null) {
			wallet = new Wallet();
			wallet.setUser(user);
		
			walletRepositry.save(wallet);
		}
		return wallet;
	}

	@Override
	public Wallet addBalance(Wallet wallet, Long money) {
		BigDecimal balance = wallet.getBalance() == null ? BigDecimal.ZERO : wallet.getBalance();

		BigDecimal newBalance = balance.add(BigDecimal.valueOf(money));
		wallet.setBalance(newBalance);
		
		 transactionService.createTransaction(
	                wallet,
	                WalletTransactionType.ADD_MONEY,
	                UUID.randomUUID().toString(),
	                "Wallet Deposit",
	                money.longValue()
	        );

		
		
		return walletRepositry.save(wallet);
	}

	@Override
	public Wallet findWalletById(Long id) throws Exception {
		Optional<Wallet> wallet = walletRepositry.findById(id);
		if(wallet.isPresent()) {
			return wallet.get();
		}
		throw new Exception("Wallet not found");
	}

	@Override
	public Wallet walletToWalletTransfer(User sender, Wallet receiverWallet, Long amount) throws Exception {

	    Wallet senderWallet = getUserWallet(sender);

	    BigDecimal senderBalance = senderWallet.getBalance() == null
	            ? BigDecimal.ZERO
	            : senderWallet.getBalance();

	    BigDecimal receiverBalance = receiverWallet.getBalance() == null
	            ? BigDecimal.ZERO
	            : receiverWallet.getBalance();

	    BigDecimal transferAmount = BigDecimal.valueOf(amount);

	    if (senderBalance.compareTo(transferAmount) < 0) {
	        throw new Exception("Insufficient Balance");
	    }

	    senderWallet.setBalance(senderBalance.subtract(transferAmount));
	    receiverWallet.setBalance(receiverBalance.add(transferAmount));

	    transactionService.createTransaction(
	            senderWallet,
	            WalletTransactionType.WALLET_TRANSFER,
	            receiverWallet.getId().toString(),
	            "Wallet Transfer",
	            amount
	    );

	    walletRepositry.save(receiverWallet);
	    return walletRepositry.save(senderWallet);
	}

	@Override
	public Wallet payOrderPayment(Order order, User user) throws Exception {
		Wallet wallet = getUserWallet(user);
		
		if(order.getOrderType().equals(OrderType.BUY)) {
			BigDecimal newBalance = wallet.getBalance().subtract(order.getPrice());
			
			if(newBalance.compareTo(order.getPrice())<0) {
				throw new Exception("Unsufficient funds for this transaction");
			}
			
			wallet.setBalance(newBalance);
			
		}
		else {
			BigDecimal newBalance =wallet.getBalance().add(order.getPrice());
			wallet.setBalance(newBalance);
		}
		
		transactionService.createTransaction(
                wallet,  
                order.getOrderType() == OrderType.BUY
                        ? WalletTransactionType.WITHDRAWAL
                        : WalletTransactionType.ADD_MONEY,
                order.getId().toString(),
                "Order payment",
                order.getPrice().longValue()
        );
		
		walletRepositry.save(wallet);
		return wallet;
	}
	

}
