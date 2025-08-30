package com.example.payment.utils.helperFunctions;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Base64;

public class GenerateRandomId {
    public static String GenerateCustomerOrderId(String input) {
        byte[] encodedBytes = Base64.getEncoder().encode(input.getBytes());
        String encodedString = new String(encodedBytes);
        LocalDateTime now = LocalDateTime.now();
        String dateTimeString = now.format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        return encodedString + input + dateTimeString;
    }
}
