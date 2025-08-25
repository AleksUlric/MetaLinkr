package com.aleks.linkrmix.admin.common.util;

import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Component;

@Component
public class PasswordUtil {
    
    public String encrypt(String password) {
        return BCrypt.hashpw(password, BCrypt.gensalt());
    }
    
    public boolean check(String password, String hashedPassword) {
        return BCrypt.checkpw(password, hashedPassword);
    }
}
