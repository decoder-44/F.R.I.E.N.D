package com.example.payment.service;

import com.example.payment.entity.PhonePeOrderData;
import com.example.payment.repository.PhonePeOrderDataRepo;
import com.example.payment.utils.helperFunctions.GenerateRandomId;
import org.springframework.stereotype.Service;

@Service
public class PhonePeOrderDataService {
    private final PhonePeOrderDataRepo phonePeOrderDataRepo;

    public PhonePeOrderDataService(PhonePeOrderDataRepo phonePeOrderDataRepo) {
        this.phonePeOrderDataRepo = phonePeOrderDataRepo;
    }

    public PhonePeOrderData OrderDataService(String input) {
        PhonePeOrderData orderData = new PhonePeOrderData();
        String orderId = GenerateRandomId.GenerateCustomerOrderId(input);
        orderData.setOrderId(orderId);
        this.phonePeOrderDataRepo.save(orderData);
        return orderData;
    }
}