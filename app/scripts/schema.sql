CREATE TABLE users (
	id            SERIAL PRIMARY KEY,
	email         VARCHAR(200) NOT NULL,
	password      VARCHAR(200) NOT NULL,
  token         VARCHAR(100) DEFAULT NULL,
  name          VARCHAR(300) DEFAULT NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	UNIQUE (email)
);

CREATE TABLE challenges (
	id            SERIAL PRIMARY KEY,
  title         VARCHAR(200) NOT NULL,
  level         VARCHAR(100) NOT NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tests (
  id            SERIAL PRIMARY KEY,
  challenge_id  INT NOT NULL,
  title         VARCHAR(200) NOT NULL,
  body          TEXT NOT NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT    fk_challenge FOREIGN KEY(challenge_id) REFERENCES challenges(id)
);

CREATE TABLE runs (
  id            BIGSERIAL PRIMARY KEY,
  challenge_id  INT NOT NULL,
  user_id       INT NOT NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  time_taken    INT NOT NULL DEFAULT 0,
  success       BOOLEAN NOT NULL DEFAULT FALSE,
  CONSTRAINT    fk_challenge FOREIGN KEY(challenge_id) REFERENCES challenges(id),
  CONSTRAINT    fk_author FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE test_runs (
  id            BIGSERIAL PRIMARY KEY,
  challenge_id  INT NOT NULL,
  run_id        BIGINT NOT NULL,
  user_id       INT NOT NULL,
  test_id       INT NOT NULL,
  success       BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  time_taken    INT NOT NULL DEFAULT 0,
  CONSTRAINT    fk_challenges FOREIGN KEY(challenge_id) REFERENCES challenges(id),
  CONSTRAINT    fk_runs FOREIGN KEY(run_id) REFERENCES runs(id),
  CONSTRAINT    fk_users FOREIGN KEY(user_id) REFERENCES users(id),
  CONSTRAINT    fk_tests FOREIGN KEY(test_id) REFERENCES tests(id)
);

