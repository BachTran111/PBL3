package com.homestay.homestayweb.config;

import com.homestay.homestayweb.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final UserDetailsService userDe;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth

                        // PUBLIC
                        .requestMatchers("/api/payment/vnpay-return").permitAll()
                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/homestays", "/api/homestays/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/rooms/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/reviews/**").permitAll()

                        .requestMatchers(HttpMethod.POST, "/api/reviews/**").hasAuthority("LEAVE_REVIEW")

                        // ADMIN permissions
                        .requestMatchers("/admin/**").hasAuthority("ADMIN_ACCESS")
                        .requestMatchers(HttpMethod.POST, "/api/homestays").hasAuthority("CREATE_HOMESTAY")

                        // HOST permissions
                        .requestMatchers("/host/**").hasAuthority("HOST_ACCESS")
                        .requestMatchers(HttpMethod.POST, "/api/homestays/{id}/rooms").hasAuthority("CREATE_ROOM")
                        .requestMatchers(HttpMethod.GET, "api/payment/stats/**").hasAuthority("GET_REVENUE")
                        .requestMatchers(HttpMethod.GET, "/api/rooms/**").permitAll()

                        // USER permissions
                        .requestMatchers("/user/**").hasAuthority("USER_ACCESS")

                        .requestMatchers(HttpMethod.POST,"/api/bookings/**").hasAuthority("USER_ACCESS")

                        .requestMatchers(HttpMethod.GET,"/api/payment/**").hasAuthority("USER_ACCESS")

                        // All other endpoints require authentication
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }


    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://127.0.0.1:5500/")); // Chỉ cho phép domain frontend của bạn
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")); // Cũng phải cho phép OPTIONS (Preflight request)
        config.setAllowedHeaders(List.of("*")); // Có thể chấp nhận mọi header
        config.setAllowCredentials(true); // Cho phép gửi cookies/token

        // Cấu hình preflight requests (OPTIONS) cho tất cả các endpoint
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }


    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDe);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}