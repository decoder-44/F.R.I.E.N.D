package com.example.payment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.payment.entity.PhonePeOrderData;
import org.springframework.stereotype.Repository;

@Repository
public interface PhonePeOrderDataRepo extends JpaRepository<PhonePeOrderData, String> {
}