package com.vic.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.vic.domain.OrderType;
import com.vic.domain.WalletTransactionType;
import com.vic.model.Coin;
import com.vic.model.Order;
import com.vic.model.User;
import com.vic.request.CreateOrderRequest;
import com.vic.service.CoinService;
import com.vic.service.OrderService;
import com.vic.service.TransactionService;
import com.vic.service.UserService;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
	
	@Autowired
	private OrderService orderService;
	
	@Autowired
	private UserService userService;

	@Autowired
	private CoinService coinService;
	
	@Autowired
	private TransactionService transactionService;
	
	@PostMapping("/pay")
	public ResponseEntity<Order> payOrderPayment(@RequestHeader("Authorization") String jwt,@RequestBody CreateOrderRequest req) throws Exception{
		
		User user = userService.findUserProfileByJwt(jwt);
		
		Coin coin = coinService.findById(req.getCoinId());
		
		Order order = orderService.processOrder(coin, req.getQuantity(),req.getOrderType(), user);
		
		/*
		 * transactionService.createTransaction( user, req.getOrderType() ==
		 * OrderType.BUY ? WalletTransactionType.WITHDRAWAL :
		 * WalletTransactionType.ADD_MONEY, order.getId().toString(), // transferId
		 * "Order payment for " + coin.getSymbol(), order.getPrice() // BigDecimal );
		 */
		
				return  ResponseEntity.ok(order);
	}
	
	@GetMapping("/{orderId}")
	public ResponseEntity<Order> getOrderById(@RequestHeader("Authorization") String jwt,@PathVariable Long orderId)throws Exception{
		 User user = userService.findUserProfileByJwt(jwt);
		 
		 Order order = orderService.getOrderById(orderId);
		 if(order.getUser().getId().equals(user.getId())) {
			 return ResponseEntity.ok(order);
		 }
		 else {
			 throw new Exception("You don't have access");
		 }
		 
	}
	
	@GetMapping
	public ResponseEntity<List<Order>> getAllOrdersOfUsers(@RequestHeader("Authorization") String jwt,@RequestParam(required = false) OrderType order_type,@RequestParam(required = false) String asset_Symbol)throws Exception{
		
		Long userId = userService.findUserProfileByJwt(jwt).getId();
		
		List<Order> userOrders = orderService.getAllOrdersOfUsers(userId,order_type, asset_Symbol);
		
		return ResponseEntity.ok(userOrders);
	}
	
}
