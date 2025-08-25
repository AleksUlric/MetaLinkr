package com.aleks.linkrmix.admin.common.config;

/*
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Spring Security配置类
 * 
 * @author Aleks
 * @version 1.0.0
 */
/*
@Configuration
@EnableWebSecurity
@ConditionalOnProperty(name = "security.enabled", havingValue = "true", matchIfMissing = false)
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .authorizeRequests()
                // 允许所有actuator端点
                .antMatchers("/actuator/**").permitAll()
                // 允许健康检查端点
                .antMatchers("/health/**").permitAll()
                // 允许测试端点
                .antMatchers("/test/**").permitAll()
                // 允许认证相关端点
                .antMatchers("/api/auth/**").permitAll()
                // 允许nacos相关端点（如果有的话）
                .antMatchers("/nacos/**").permitAll()
                // 允许错误页面
                .antMatchers("/error").permitAll()
                // 允许根路径
                .antMatchers("/").permitAll()
                // 其他请求需要认证
                .anyRequest().authenticated()
            .and()
            .formLogin().disable()
            .httpBasic().disable()
            .headers().frameOptions().disable();
        
        return http.build();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
*/

/**
 * Spring Security配置类 - 暂时禁用
 * 
 * @author Aleks
 * @version 1.0.0
 */
public class SecurityConfig {
    // 暂时禁用Spring Security
}
