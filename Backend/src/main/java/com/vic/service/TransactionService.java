package com.vic.service;

import java.util.List;

import com.vic.domain.WalletTransactionType;
import com.vic.model.Wallet;
import com.vic.model.WalletTransaction;

public interface TransactionService {

    List<WalletTransaction> getTransactionsByWallet(Wallet wallet);

    WalletTransaction createTransaction(
            Wallet wallet,
            WalletTransactionType type,
            String transferId,
            String purpose,
            Long amount
    );
}