package com.aleks.linkrmix.controller.admin;

import com.aleks.linkrmix.controller.admin.user.AdminUser;
import com.aleks.linkrmix.controller.admin.user.AdminUserRepository;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.annotation.PostConstruct;
import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Validated
@RestController
@RequestMapping(value = "/api/admin", produces = MediaType.APPLICATION_JSON_VALUE)
public class AdminUserController {

	private final AdminUserRepository repository;

	public AdminUserController(AdminUserRepository repository) {
		this.repository = repository;
	}

	@PostConstruct
	public void init() {
		repository.initSchema();
		if (repository.findAll().isEmpty()) {
			AdminUser admin = new AdminUser();
			admin.setUsername("admin");
			admin.setDisplayName("系统管理员");
			admin.setPasswordHash(BCrypt.hashpw("admin123", BCrypt.gensalt()));
			repository.insert(admin);
		}
	}

	@GetMapping("/users")
	public List<AdminUser> list() {
		return repository.findAll();
	}

	@PostMapping("/users")
	public Map<String, Object> create(@Valid @RequestBody CreateUserRequest req) {
		AdminUser user = new AdminUser();
		user.setUsername(req.getUsername());
		user.setDisplayName(req.getDisplayName());
		user.setPasswordHash(BCrypt.hashpw(req.getPassword(), BCrypt.gensalt()));
		long id = repository.insert(user);
		Map<String, Object> resp = new HashMap<>();
		resp.put("id", id);
		return resp;
	}

	@PutMapping("/users/{id}")
	public void update(@PathVariable("id") long id, @RequestBody UpdateUserRequest req) {
		AdminUser user = new AdminUser();
		user.setId(id);
		user.setDisplayName(req.getDisplayName());
		repository.update(user);
	}

	@DeleteMapping("/users/{id}")
	public void delete(@PathVariable("id") long id) {
		repository.deleteById(id);
	}

	@PostMapping("/login")
	public Map<String, Object> login(@RequestBody LoginRequest req) {
		return repository.findByUsername(req.getUsername())
				.filter(u -> BCrypt.checkpw(req.getPassword(), u.getPasswordHash()))
				.map(u -> {
					Map<String, Object> m = new HashMap<>();
					m.put("token", "fake-" + u.getUsername());
					return m;
				})
				.orElseThrow(() -> new RuntimeException("用户名或密码错误"));
	}

	public static class CreateUserRequest {
		@NotBlank
		private String username;
		@NotBlank
		private String password;
		@NotBlank
		private String displayName;

		public String getUsername() { return username; }
		public void setUsername(String username) { this.username = username; }
		public String getPassword() { return password; }
		public void setPassword(String password) { this.password = password; }
		public String getDisplayName() { return displayName; }
		public void setDisplayName(String displayName) { this.displayName = displayName; }
	}

	public static class UpdateUserRequest {
		private String displayName;
		public String getDisplayName() { return displayName; }
		public void setDisplayName(String displayName) { this.displayName = displayName; }
	}

	public static class LoginRequest {
		private String username;
		private String password;
		public String getUsername() { return username; }
		public void setUsername(String username) { this.username = username; }
		public String getPassword() { return password; }
		public void setPassword(String password) { this.password = password; }
	}
}
