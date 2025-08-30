package com.example.payment.controller;

import com.example.payment.entity.PhonePeOrderData;
import com.example.payment.service.PhonePeOrderDataService;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.stereotype.Controller;

@Controller
public class PhonePeOrderDataController {
    private final PhonePeOrderDataService phonePeOrderDataService;

    public PhonePeOrderDataController(PhonePeOrderDataService phonePeOrderDataService) {
        this.phonePeOrderDataService = phonePeOrderDataService;
    }

    @QueryMapping
    public PhonePeOrderData PhonePePaymentRequest(@Argument String input) {
        return this.phonePeOrderDataService.OrderDataService(input);
    }
}