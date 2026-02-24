package com.vic.service;


import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vic.domain.OrderStatus;
import com.vic.domain.OrderType;
import com.vic.model.Asset;
import com.vic.model.Coin;
import com.vic.model.Order;
import com.vic.model.OrderItem;
import com.vic.model.User;
import com.vic.repositry.OrderItemRepositry;
import com.vic.repositry.OrderRepositry;

import jakarta.transaction.Transactional;

@Service
public class OrderServiceImpl implements OrderService{


    @Autowired
	private OrderRepositry orderRepositry;
	
	@Autowired
	private WalletService walletService;
	
	@Autowired
	private OrderItemRepositry orderItemRepositry;

	@Autowired
	private AssetService assetService;
	
	@Override
	public Order createOrder(User user, OrderItem orderItem, OrderType orderType) {
		double price = orderItem.getCoin().getCurrentPrice()*orderItem.getQuantity();
		
		Order order = new Order();
		
		order.setUser(user);
		order.setOrderItem(orderItem);
		order.setOrderType(orderType);
		order.setPrice(BigDecimal.valueOf(price));
		order.setTimeStamp(LocalDateTime.now());
		order.setStatus(OrderStatus.PENDING);
		
		
		return orderRepositry.save(order);
	}

	@Override
	public Order getOrderById(Long orderId) throws Exception {

		return orderRepositry.findById(orderId).orElseThrow(() -> new Exception("order not found "));
	}

	@Override
	public List<Order> getAllOrdersOfUsers(Long userId, OrderType orderType, String assetSymbol) {
		// TODO Auto-generated method stub
		return orderRepositry.findByUserId(userId);
	}
	
	private OrderItem createOrderItem(Coin coin,double quantity,double buyPrice,double sellPrice) {
		OrderItem orderItem = new OrderItem();
		orderItem.setCoin(coin);
		orderItem.setQuantity(quantity);
		orderItem.setBuyPrice(buyPrice);
		orderItem.setSellPrice(sellPrice);
		return orderItemRepositry.save(orderItem); 
		
	}
	
	@Transactional
	public Order buyAsset(Coin coin,double quantity,User user) throws Exception {
		if(quantity<0) {
			throw new Exception("quantity should be greaterthan 0");
		}
		
		double buyPrice = coin.getCurrentPrice();
		
		OrderItem orderItem =  createOrderItem(coin, quantity, buyPrice, 0);
		
		Order order = createOrder(user, orderItem, OrderType.BUY);
		
		orderItem.setOrder(order);
		
		walletService.payOrderPayment(order, user);
		
		order.setStatus(OrderStatus.SUCCESS);
		
		order.setOrderType(OrderType.BUY);
		Order savedOrder = orderRepositry.save(order);
		
		Asset oldAsset = assetService.findAssetByUserIdAndCoinId(order.getUser().getId(),order.getOrderItem().getCoin().getId());
		
		if (oldAsset == null) {
		    assetService.createAsset(user, orderItem.getCoin(), orderItem.getQuantity());
		} else {
		    double newQty = oldAsset.getQuantity() + quantity;
		    assetService.updateAsset(oldAsset.getId(), newQty);
		}

		
		return savedOrder;
		
	}
	
	@Transactional
	public Order sellAsset(Coin coin,double quantity,User user) throws Exception {
		if(quantity<0) {
			throw new Exception("quantity should be greaterthan 0");
		}
		
		double sellPrice = coin.getCurrentPrice();
		
		Asset assetToSell = assetService.findAssetByUserIdAndCoinId(user.getId(),coin.getId());
		
		if(assetToSell != null) {
			
			double buyPrice = assetToSell.getBuyPrice();
		OrderItem orderItem =  createOrderItem(coin, quantity, buyPrice, sellPrice);
		
		
		
		
		
		Order order = createOrder(user, orderItem, OrderType.SELL);
		
		orderItem.setOrder(order);
		
		if(assetToSell.getQuantity()>=quantity) {
			order.setStatus(OrderStatus.SUCCESS);
			order.setOrderType(OrderType.SELL);
			Order savedOrder = orderRepositry.save(order);
		walletService.payOrderPayment(order, user);
		
		double remainingQty = assetToSell.getQuantity() - quantity;
		Asset updatedAsset = assetService.updateAsset(assetToSell.getId(), remainingQty);

		if (updatedAsset.getQuantity() <= 0) {
		    assetService.deleteAsset(updatedAsset.getId());
		}

			
			return savedOrder;
		}

		
		throw new Exception("Insufficient quantity to sell");
		}
		throw new Exception("asset not found");
	}

	@Override
	@Transactional
	public Order processOrder(Coin coin, double quantity, OrderType orderType, User user) throws Exception {
		if(orderType == OrderType.BUY) {
			return buyAsset(coin, quantity, user);
		}
		else if(orderType==OrderType.SELL) {
			return sellAsset(coin, quantity, user);
		}
		throw new Exception("invalid exception");
	}

}
