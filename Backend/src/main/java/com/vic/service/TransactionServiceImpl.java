package com.vic.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vic.domain.WalletTransactionType;
import com.vic.model.Wallet;
import com.vic.model.WalletTransaction;
import com.vic.repositry.TransactionRepositry;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepositry transactionRepositry;

    @Override
    @Transactional(readOnly = true)
    public List<WalletTransaction> getTransactionsByWallet(Wallet wallet) {
        return transactionRepositry.findByWalletOrderByDateDesc(wallet);
    }

    @Override
    @Transactional
    public WalletTransaction createTransaction(
            Wallet wallet,
            WalletTransactionType type,
            String transferId,
            String purpose,
            Long amount) {

        WalletTransaction tx = new WalletTransaction();

        tx.setWallet(wallet);              
        tx.setDate(LocalDate.now());
        tx.setType(type);
        tx.setTransferId(transferId);
        tx.setPurpose(purpose);
        tx.setAmount(amount);

        return transactionRepositry.save(tx);
    }
}