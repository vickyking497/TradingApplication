package com.vic.repositry;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.vic.model.Wallet;
import com.vic.model.WalletTransaction;

public interface TransactionRepositry
        extends JpaRepository<WalletTransaction, Long> {

    List<WalletTransaction> findByWalletOrderByDateDesc(Wallet wallet);
}
