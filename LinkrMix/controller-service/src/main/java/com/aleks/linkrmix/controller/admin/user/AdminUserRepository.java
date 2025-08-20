package com.aleks.linkrmix.controller.admin.user;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

@Repository
public class AdminUserRepository {

	private final JdbcTemplate jdbcTemplate;

	public AdminUserRepository(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	private static final RowMapper<AdminUser> ROW_MAPPER = new RowMapper<AdminUser>() {
		@Override
		public AdminUser mapRow(ResultSet rs, int rowNum) throws SQLException {
			AdminUser u = new AdminUser();
			u.setId(rs.getLong("id"));
			u.setUsername(rs.getString("username"));
			u.setPasswordHash(rs.getString("password_hash"));
			u.setDisplayName(rs.getString("display_name"));
			return u;
		}
	};

	public void initSchema() {
		jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS admin_user (\n" +
				"id BIGINT PRIMARY KEY AUTO_INCREMENT,\n" +
				"username VARCHAR(64) NOT NULL UNIQUE,\n" +
				"password_hash VARCHAR(128) NOT NULL,\n" +
				"display_name VARCHAR(128) NOT NULL\n" +
				") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
	}

	public List<AdminUser> findAll() {
		return jdbcTemplate.query("SELECT id, username, password_hash, display_name FROM admin_user ORDER BY id DESC", ROW_MAPPER);
	}

	public Optional<AdminUser> findByUsername(String username) {
		List<AdminUser> list = jdbcTemplate.query("SELECT id, username, password_hash, display_name FROM admin_user WHERE username=?", ROW_MAPPER, username);
		return list.isEmpty() ? Optional.empty() : Optional.of(list.get(0));
	}

	public long insert(AdminUser user) {
		return jdbcTemplate.queryForObject("INSERT INTO admin_user (username, password_hash, display_name) VALUES (?, ?, ?) RETURNING id",
				Long.class, user.getUsername(), user.getPasswordHash(), user.getDisplayName());
	}

	public void update(AdminUser user) {
		jdbcTemplate.update("UPDATE admin_user SET display_name=? WHERE id=?", user.getDisplayName(), user.getId());
	}

	public void deleteById(long id) {
		jdbcTemplate.update("DELETE FROM admin_user WHERE id=?", id);
	}
}
