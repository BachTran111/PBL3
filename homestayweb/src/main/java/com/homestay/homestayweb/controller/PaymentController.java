package com.homestay.homestayweb.controller;

import com.homestay.homestayweb.dto.response.DailyRevenueResponse;
import com.homestay.homestayweb.dto.response.HomestayRevenueResponse;
import com.homestay.homestayweb.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    // Tạo URL thanh toán VNPay cho một booking
    @PostMapping("/vnpay/create-url/{bookingId}")
    public ResponseEntity<?> createPayment(@PathVariable Long bookingId,
                                           HttpServletRequest request) throws Exception {
        String paymentUrl = paymentService.createVNPayPaymentUrl(bookingId, request);

        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Redirect to VNPay");
        response.put("url", paymentUrl);

        return ResponseEntity.ok(response);
    }

    // VNPay gọi callback URL sau thanh toán
    @GetMapping("/vnpay-return")
    public ResponseEntity<?> vnPayReturn(HttpServletRequest request) {
        Map<String, String> vnpParams = new HashMap<>();

        // Lấy toàn bộ query param từ request
        request.getParameterMap().forEach((key, value) -> {
            if (value != null && value.length > 0) {
                vnpParams.put(key, value[0]);
            }
        });

        String result = paymentService.handleVNPayReturn(vnpParams);

        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", result);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/stats/daily")
    @PreAuthorize("hasAuthority('HOST_ACCESS')")
    public ResponseEntity<List<DailyRevenueResponse>> getDailyRevenueByHost() {
        List<DailyRevenueResponse> result = paymentService.getDailyRevenueByHost();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/stats/homestay")
    @PreAuthorize("hasAuthority('HOST_ACCESS')")
    public ResponseEntity<List<HomestayRevenueResponse>> getRevenueByHomestayByHost() {
        List<HomestayRevenueResponse> result = paymentService.getRevenueByHomestayByHost();
        return ResponseEntity.ok(result);
    }
}
